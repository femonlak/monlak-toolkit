/**
 * Task management tools
 * Handles CRUD, completion, and flag toggling for tasks
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  getTodayLocal,
  getCurrentWeekRange,
  success,
  error,
  calculateNextOccurrence,
} from '../helpers.js';

export function registerTaskTools(server: McpServer, supabase: SupabaseClient) {
  // ─── boltr_list_tasks ───────────────────────────────────────────────
  server.tool(
    'boltr_list_tasks',
    'List tasks by view (inbox, today, week, next, logbook) or by list_id. Returns tasks with their list names.',
    {
      view: z.enum(['inbox', 'today', 'week', 'next', 'logbook']).optional().describe('Task view to filter by'),
      list_id: z.string().uuid().optional().describe('Filter by list ID (overrides view)'),
      search: z.string().optional().describe('Search term to filter tasks by title'),
    },
    async ({ view, list_id, search }) => {
      try {
        let query = supabase
          .from('tasks')
          .select('*, lists(name)')
          .order('created_at', { ascending: false });

        if (list_id) {
          // Filter by specific list
          query = query.eq('list_id', list_id).eq('completed', false);
        } else if (view) {
          const today = getTodayLocal();
          const week = getCurrentWeekRange();

          switch (view) {
            case 'inbox':
              query = query.is('list_id', null).is('execution_date', null).eq('completed', false);
              break;
            case 'today':
              query = query.lte('execution_date', today).eq('completed', false);
              break;
            case 'week':
              query = query
                .gte('execution_date', week.start)
                .lte('execution_date', week.end)
                .eq('completed', false);
              break;
            case 'next':
              query = query.gt('execution_date', getCurrentWeekRange().end).eq('completed', false);
              break;
            case 'logbook':
              query = query.eq('completed', true).order('updated_at', { ascending: false }).limit(50);
              break;
          }
        } else {
          // Default: all incomplete tasks
          query = query.eq('completed', false);
        }

        if (search) {
          query = query.ilike('title', `%${search}%`);
        }

        const { data, error: dbError } = await query;
        if (dbError) return error(dbError.message);

        const tasks = (data || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          list_id: t.list_id,
          list_name: t.lists?.name || null,
          execution_date: t.execution_date,
          completed: t.completed,
          is_mit: t.is_mit || false,
          is_delayed: t.is_delayed || false,
          is_doing: t.is_doing || false,
          total_focus_time: t.total_focus_time || null,
          recurrence_rule_id: t.recurrence_rule_id || null,
          notes: t.notes ? '(has notes)' : null,
          created_at: t.created_at,
        }));

        return success({
          view: list_id ? `list:${list_id}` : view || 'all',
          count: tasks.length,
          tasks,
        });
      } catch (e) {
        return error(`Failed to list tasks: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_get_task ─────────────────────────────────────────────────
  server.tool(
    'boltr_get_task',
    'Get detailed information about a single task including its subtasks and recurrence rule.',
    {
      task_id: z.string().uuid().describe('Task ID'),
    },
    async ({ task_id }) => {
      try {
        const { data: task, error: taskError } = await supabase
          .from('tasks')
          .select('*, lists(name)')
          .eq('id', task_id)
          .single();

        if (taskError) return error(taskError.message);

        // Fetch subtasks
        const { data: subtasks } = await supabase
          .from('subtasks')
          .select('*')
          .eq('parent_task_id', task_id)
          .order('display_order', { ascending: true });

        // Fetch recurrence rule if exists
        let recurrenceRule = null;
        if (task.recurrence_rule_id) {
          const { data: rule } = await supabase
            .from('task_recurrence_rules')
            .select('*')
            .eq('id', task.recurrence_rule_id)
            .single();
          recurrenceRule = rule;
        }

        return success({
          ...task,
          list_name: (task as any).lists?.name || null,
          subtasks: subtasks || [],
          recurrence_rule: recurrenceRule,
        });
      } catch (e) {
        return error(`Failed to get task: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_create_task ──────────────────────────────────────────────
  server.tool(
    'boltr_create_task',
    'Create a new task. Without list_id or execution_date, it goes to Inbox.',
    {
      title: z.string().min(1).max(50).describe('Task title (max 50 chars)'),
      list_id: z.string().uuid().optional().describe('Assign to a list'),
      execution_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Execution date (YYYY-MM-DD)'),
      notes: z.string().optional().describe('Task notes (supports HTML)'),
      is_mit: z.boolean().optional().describe('Mark as Most Important Task'),
    },
    async ({ title, list_id, execution_date, notes, is_mit }) => {
      try {
        const insertData: Record<string, unknown> = {
          title: title.trim(),
          list_id: list_id || null,
          execution_date: execution_date || null,
          notes: notes || null,
          completed: false,
          is_mit: is_mit || false,
          is_delayed: false,
          is_doing: false,
        };

        const { data, error: dbError } = await supabase
          .from('tasks')
          .insert(insertData)
          .select('*, lists(name)')
          .single();

        if (dbError) return error(dbError.message);

        return success({
          message: 'Task created successfully',
          task: {
            ...data,
            list_name: (data as any).lists?.name || null,
          },
        });
      } catch (e) {
        return error(`Failed to create task: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_update_task ──────────────────────────────────────────────
  server.tool(
    'boltr_update_task',
    'Update task fields (title, list, date, notes). Uses version locking internally.',
    {
      task_id: z.string().uuid().describe('Task ID to update'),
      title: z.string().min(1).max(50).optional().describe('New title'),
      list_id: z.string().uuid().nullable().optional().describe('New list ID (null to remove from list)'),
      execution_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional().describe('New execution date (null to clear)'),
      notes: z.string().nullable().optional().describe('New notes (null to clear)'),
    },
    async ({ task_id, title, list_id, execution_date, notes }) => {
      try {
        // Fetch current version for locking
        const { data: current, error: fetchError } = await supabase
          .from('tasks')
          .select('version')
          .eq('id', task_id)
          .single();

        if (fetchError) return error(fetchError.message);

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title.trim();
        if (list_id !== undefined) updateData.list_id = list_id;
        if (execution_date !== undefined) updateData.execution_date = execution_date;
        if (notes !== undefined) updateData.notes = notes;

        if (Object.keys(updateData).length === 0) {
          return error('No fields to update');
        }

        const { data, error: dbError } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', task_id)
          .eq('version', current.version)
          .select('*, lists(name)')
          .single();

        if (dbError) {
          if (dbError.code === 'PGRST116') {
            return error('Version conflict: task was modified. Please retry.');
          }
          return error(dbError.message);
        }

        return success({
          message: 'Task updated successfully',
          task: {
            ...data,
            list_name: (data as any).lists?.name || null,
          },
        });
      } catch (e) {
        return error(`Failed to update task: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_complete_task ────────────────────────────────────────────
  server.tool(
    'boltr_complete_task',
    'Complete or uncomplete a task. Handles scoring, auto-clearing MIT/Doing flags, and generating next occurrence for recurring tasks.',
    {
      task_id: z.string().uuid().describe('Task ID'),
      completed: z.boolean().describe('true to complete, false to uncomplete'),
    },
    async ({ task_id, completed }) => {
      try {
        const localDate = getTodayLocal();

        // Use RPC for completion (handles scoring)
        const { error: rpcError } = await supabase.rpc('complete_task_with_local_date', {
          p_task_id: task_id,
          p_completed: completed,
          p_local_score_date: localDate,
        });

        if (rpcError) return error(rpcError.message);

        // If completing, handle recurrence
        if (completed) {
          const { data: task } = await supabase
            .from('tasks')
            .select('*, task_recurrence_rules(*)')
            .eq('id', task_id)
            .single();

          if (task?.recurrence_rule_id && task.task_recurrence_rules) {
            const rule = task.task_recurrence_rules;
            const nextDate = calculateNextOccurrence(rule, rule.base_execution_date);

            // Create next occurrence
            const { error: insertError } = await supabase
              .from('tasks')
              .insert({
                user_id: task.user_id,
                title: task.title,
                list_id: task.list_id,
                execution_date: nextDate,
                notes: task.notes,
                completed: false,
                is_mit: false,
                is_delayed: false,
                delayed_until: null,
                recurrence_rule_id: rule.id,
              });

            if (insertError) {
              console.error('Failed to generate next occurrence:', insertError);
            }

            // Update base_execution_date
            await supabase
              .from('task_recurrence_rules')
              .update({ base_execution_date: nextDate })
              .eq('id', rule.id)
              .eq('version', rule.version);
          }
        }

        return success({
          message: completed ? 'Task completed' : 'Task uncompleted',
          task_id,
        });
      } catch (e) {
        return error(`Failed to complete task: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_delete_task ──────────────────────────────────────────────
  server.tool(
    'boltr_delete_task',
    'Delete a task. For recurring tasks, can optionally delete the recurrence rule entirely.',
    {
      task_id: z.string().uuid().describe('Task ID to delete'),
      delete_recurrence: z.boolean().optional().describe('Also delete the recurrence rule (stops future occurrences)'),
    },
    async ({ task_id, delete_recurrence }) => {
      try {
        // Get task info before deletion
        const { data: task } = await supabase
          .from('tasks')
          .select('recurrence_rule_id')
          .eq('id', task_id)
          .single();

        const { error: dbError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', task_id);

        if (dbError) return error(dbError.message);

        // Handle recurrence cleanup
        if (task?.recurrence_rule_id && delete_recurrence) {
          await supabase
            .from('task_recurrence_rules')
            .delete()
            .eq('id', task.recurrence_rule_id);
        }

        return success({ message: 'Task deleted', task_id });
      } catch (e) {
        return error(`Failed to delete task: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_toggle_task_flags ────────────────────────────────────────
  server.tool(
    'boltr_toggle_task_flags',
    'Toggle task flags: MIT (Most Important Task), Delayed (hide until 6 PM), or Doing (currently working on). Only one task should be "doing" at a time.',
    {
      task_id: z.string().uuid().describe('Task ID'),
      flag: z.enum(['mit', 'delayed', 'doing']).describe('Flag to toggle'),
      value: z.boolean().describe('true to enable, false to disable'),
    },
    async ({ task_id, flag, value }) => {
      try {
        // Fetch current version
        const { data: current, error: fetchError } = await supabase
          .from('tasks')
          .select('version')
          .eq('id', task_id)
          .single();

        if (fetchError) return error(fetchError.message);

        const updateData: Record<string, unknown> = {};

        switch (flag) {
          case 'mit':
            updateData.is_mit = value;
            break;
          case 'delayed':
            updateData.is_delayed = value;
            if (value) {
              // Set delayed_until to today at 18:00 local time
              const now = new Date();
              now.setHours(18, 0, 0, 0);
              updateData.delayed_until = now.toISOString();
            } else {
              updateData.delayed_until = null;
            }
            break;
          case 'doing':
            updateData.is_doing = value;
            break;
        }

        const { data, error: dbError } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', task_id)
          .eq('version', current.version)
          .select('id, title, is_mit, is_delayed, delayed_until, is_doing')
          .single();

        if (dbError) return error(dbError.message);

        const flagLabels = { mit: 'MIT', delayed: 'Delayed', doing: 'Doing' };
        return success({
          message: `${flagLabels[flag]} ${value ? 'enabled' : 'disabled'}`,
          task: data,
        });
      } catch (e) {
        return error(`Failed to toggle flag: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );
}
