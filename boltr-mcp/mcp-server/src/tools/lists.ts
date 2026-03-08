/**
 * List management tools
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { success, error } from '../helpers.js';

export function registerListTools(server: McpServer, supabase: SupabaseClient) {
  // ─── boltr_list_lists ───────────────────────────────────────────────
  server.tool(
    'boltr_list_lists',
    'List all task lists grouped by area (Work/Personal). Includes task count per list.',
    {
      include_completed: z.boolean().optional().describe('Include completed/archived lists (default: false)'),
    },
    async ({ include_completed }) => {
      try {
        let query = supabase
          .from('lists')
          .select('*')
          .order('position', { ascending: true });

        if (!include_completed) {
          query = query.eq('is_completed', false);
        }

        const { data: lists, error: listError } = await query;
        if (listError) return error(listError.message);

        // Get task counts per list
        const listIds = (lists || []).map((l: any) => l.id);
        let taskCounts: Record<string, number> = {};

        if (listIds.length > 0) {
          const { data: counts } = await supabase
            .from('tasks')
            .select('list_id')
            .in('list_id', listIds)
            .eq('completed', false);

          if (counts) {
            for (const t of counts) {
              taskCounts[t.list_id] = (taskCounts[t.list_id] || 0) + 1;
            }
          }
        }

        const work = (lists || [])
          .filter((l: any) => l.area === 'Work')
          .map((l: any) => ({
            id: l.id,
            name: l.name,
            goal: l.goal,
            deadline: l.deadline,
            is_completed: l.is_completed,
            position: l.position,
            task_count: taskCounts[l.id] || 0,
          }));

        const personal = (lists || [])
          .filter((l: any) => l.area === 'Personal')
          .map((l: any) => ({
            id: l.id,
            name: l.name,
            goal: l.goal,
            deadline: l.deadline,
            is_completed: l.is_completed,
            position: l.position,
            task_count: taskCounts[l.id] || 0,
          }));

        return success({
          total: (lists || []).length,
          work: { count: work.length, lists: work },
          personal: { count: personal.length, lists: personal },
        });
      } catch (e) {
        return error(`Failed to list lists: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_create_list ──────────────────────────────────────────────
  server.tool(
    'boltr_create_list',
    'Create a new task list in a specific area (Work or Personal).',
    {
      name: z.string().min(1).max(30).describe('List name (max 30 chars)'),
      area: z.enum(['Work', 'Personal']).describe('Life area'),
      goal: z.string().max(50).optional().describe('List goal/description (max 50 chars)'),
      deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Deadline (YYYY-MM-DD)'),
    },
    async ({ name, area, goal, deadline }) => {
      try {
        // Get max position for this area
        const { data: existing } = await supabase
          .from('lists')
          .select('position')
          .eq('area', area)
          .eq('is_completed', false)
          .order('position', { ascending: false })
          .limit(1);

        const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

        const { data, error: dbError } = await supabase
          .from('lists')
          .insert({
            name: name.trim(),
            area,
            goal: goal?.trim() || null,
            deadline: deadline || null,
            is_completed: false,
            position: nextPosition,
          })
          .select('*')
          .single();

        if (dbError) return error(dbError.message);

        return success({
          message: 'List created',
          list: data,
        });
      } catch (e) {
        return error(`Failed to create list: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_update_list ──────────────────────────────────────────────
  server.tool(
    'boltr_update_list',
    'Update list properties. Uses version locking.',
    {
      list_id: z.string().uuid().describe('List ID'),
      name: z.string().min(1).max(30).optional().describe('New name'),
      goal: z.string().max(50).nullable().optional().describe('New goal'),
      notes: z.string().nullable().optional().describe('New notes (HTML)'),
      deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional().describe('New deadline'),
      is_completed: z.boolean().optional().describe('Mark as completed/archived'),
    },
    async ({ list_id, name, goal, notes, deadline, is_completed }) => {
      try {
        // Fetch current version
        const { data: current, error: fetchError } = await supabase
          .from('lists')
          .select('version')
          .eq('id', list_id)
          .single();

        if (fetchError) return error(fetchError.message);

        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name.trim();
        if (goal !== undefined) updateData.goal = goal?.trim() || null;
        if (notes !== undefined) updateData.notes = notes;
        if (deadline !== undefined) updateData.deadline = deadline;
        if (is_completed !== undefined) updateData.is_completed = is_completed;

        if (Object.keys(updateData).length === 0) {
          return error('No fields to update');
        }

        const { data, error: dbError } = await supabase
          .from('lists')
          .update(updateData)
          .eq('id', list_id)
          .eq('version', current.version)
          .select('*')
          .single();

        if (dbError) return error(dbError.message);

        return success({
          message: 'List updated',
          list: data,
        });
      } catch (e) {
        return error(`Failed to update list: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_delete_list ──────────────────────────────────────────────
  server.tool(
    'boltr_delete_list',
    'Delete a list and all its tasks (cascade). This cannot be undone.',
    {
      list_id: z.string().uuid().describe('List ID to delete'),
    },
    async ({ list_id }) => {
      try {
        // Delete tasks in this list first
        await supabase.from('tasks').delete().eq('list_id', list_id);

        // Delete the list
        const { error: dbError } = await supabase
          .from('lists')
          .delete()
          .eq('id', list_id);

        if (dbError) return error(dbError.message);

        return success({ message: 'List and its tasks deleted', list_id });
      } catch (e) {
        return error(`Failed to delete list: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );
}
