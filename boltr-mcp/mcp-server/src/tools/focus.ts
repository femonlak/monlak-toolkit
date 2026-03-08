/**
 * Focus session and Sprint tools
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { success, error } from '../helpers.js';

export function registerFocusTools(server: McpServer, supabase: SupabaseClient) {
  // ─── boltr_focus_session ────────────────────────────────────────────
  server.tool(
    'boltr_focus_session',
    'Start or stop a focus session for a task. Focus sessions track time spent on individual tasks. Cannot run simultaneously with a sprint timer.',
    {
      action: z.enum(['start', 'stop']).describe('Start or stop a focus session'),
      task_id: z.string().uuid().describe('Task ID to focus on'),
    },
    async ({ action, task_id }) => {
      try {
        if (action === 'start') {
          // Check for active sprint session (mutual exclusion)
          const { data: activeSprint } = await supabase
            .from('focus_sprint_sessions')
            .select('id, sprint_id')
            .eq('is_active', true)
            .limit(1);

          if (activeSprint && activeSprint.length > 0) {
            return error('Cannot start focus session: a sprint timer is currently running. Pause the sprint first.');
          }

          // Use RPC to start session
          const { data, error: rpcError } = await supabase.rpc('start_focus_session', {
            p_task_id: task_id,
          });

          if (rpcError) return error(rpcError.message);

          // Mark task as doing
          await supabase.from('tasks').update({ is_doing: true }).eq('id', task_id);

          return success({
            message: 'Focus session started',
            session: data,
            task_id,
          });
        } else {
          // Stop: find active session for this task
          const { data: activeSession } = await supabase
            .from('focus_sessions')
            .select('id')
            .eq('task_id', task_id)
            .eq('is_active', true)
            .limit(1)
            .single();

          if (!activeSession) return error('No active focus session found for this task');

          const { data, error: rpcError } = await supabase.rpc('stop_focus_session', {
            p_session_id: activeSession.id,
          });

          if (rpcError) return error(rpcError.message);

          return success({
            message: 'Focus session stopped',
            session: data,
            task_id,
          });
        }
      } catch (e) {
        return error(`Failed to ${action} focus session: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_manage_sprint ────────────────────────────────────────────
  server.tool(
    'boltr_manage_sprint',
    'Manage focus sprints: create, list, pause, resume, complete, delete, or manage tasks within a sprint.',
    {
      action: z.enum(['create', 'list', 'pause', 'resume', 'complete', 'delete', 'add_task', 'remove_task']).describe('Sprint action'),
      sprint_id: z.string().uuid().optional().describe('Sprint ID (required for most actions except create/list)'),
      name: z.string().min(1).max(50).optional().describe('Sprint name (for create)'),
      task_ids: z.array(z.string().uuid()).optional().describe('Task IDs to include (for create/add_task)'),
    },
    async ({ action, sprint_id, name, task_ids }) => {
      try {
        switch (action) {
          case 'create': {
            if (!name) return error('Name is required for creating a sprint');
            if (!task_ids || task_ids.length === 0) return error('At least one task_id is required');

            const { data: sprint, error: sprintError } = await supabase
              .from('focus_sprints')
              .insert({
                name: name.trim(),
                status: 'active',
                started_at: new Date().toISOString(),
                total_elapsed_time: '00:00:00',
              })
              .select('*')
              .single();

            if (sprintError) return error(sprintError.message);

            // Add tasks to sprint
            const sprintTasks = task_ids.map((tid, idx) => ({
              sprint_id: sprint.id,
              task_id: tid,
              display_order: idx,
            }));

            const { error: taskError } = await supabase
              .from('focus_sprint_tasks')
              .insert(sprintTasks);

            if (taskError) return error(taskError.message);

            return success({
              message: 'Sprint created',
              sprint,
              task_count: task_ids.length,
            });
          }

          case 'list': {
            const { data: sprints, error: listError } = await supabase
              .from('focus_sprints')
              .select('*')
              .in('status', ['active', 'paused'])
              .order('created_at', { ascending: false });

            if (listError) return error(listError.message);

            return success({
              count: (sprints || []).length,
              sprints: (sprints || []).map((s: any) => ({
                id: s.id,
                name: s.name,
                status: s.status,
                total_elapsed_time: s.total_elapsed_time,
                started_at: s.started_at,
              })),
            });
          }

          case 'pause': {
            if (!sprint_id) return error('sprint_id is required');

            const { data: current, error: fetchError } = await supabase
              .from('focus_sprints')
              .select('version')
              .eq('id', sprint_id)
              .single();

            if (fetchError) return error(fetchError.message);

            const { data, error: updateError } = await supabase
              .from('focus_sprints')
              .update({ status: 'paused' })
              .eq('id', sprint_id)
              .eq('version', current.version)
              .select('*')
              .single();

            if (updateError) return error(updateError.message);

            // Stop active sprint session if any
            const { data: activeSession } = await supabase
              .from('focus_sprint_sessions')
              .select('id, started_at')
              .eq('sprint_id', sprint_id)
              .eq('is_active', true)
              .limit(1)
              .single();

            if (activeSession) {
              const elapsed = Date.now() - new Date(activeSession.started_at).getTime();
              const hours = Math.floor(elapsed / 3600000);
              const minutes = Math.floor((elapsed % 3600000) / 60000);
              const seconds = Math.floor((elapsed % 60000) / 1000);
              const elapsedStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

              await supabase
                .from('focus_sprint_sessions')
                .update({
                  is_active: false,
                  ended_at: new Date().toISOString(),
                  elapsed_time: elapsedStr,
                })
                .eq('id', activeSession.id);
            }

            return success({ message: 'Sprint paused', sprint: data });
          }

          case 'resume': {
            if (!sprint_id) return error('sprint_id is required');

            const { data: current, error: fetchError } = await supabase
              .from('focus_sprints')
              .select('version')
              .eq('id', sprint_id)
              .single();

            if (fetchError) return error(fetchError.message);

            const { data, error: updateError } = await supabase
              .from('focus_sprints')
              .update({ status: 'active' })
              .eq('id', sprint_id)
              .eq('version', current.version)
              .select('*')
              .single();

            if (updateError) return error(updateError.message);

            return success({ message: 'Sprint resumed', sprint: data });
          }

          case 'complete': {
            if (!sprint_id) return error('sprint_id is required');

            const { data: current, error: fetchError } = await supabase
              .from('focus_sprints')
              .select('version')
              .eq('id', sprint_id)
              .single();

            if (fetchError) return error(fetchError.message);

            // Stop any active session
            await supabase
              .from('focus_sprint_sessions')
              .update({
                is_active: false,
                ended_at: new Date().toISOString(),
              })
              .eq('sprint_id', sprint_id)
              .eq('is_active', true);

            const { data, error: updateError } = await supabase
              .from('focus_sprints')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
              })
              .eq('id', sprint_id)
              .eq('version', current.version)
              .select('*')
              .single();

            if (updateError) return error(updateError.message);

            return success({ message: 'Sprint completed', sprint: data });
          }

          case 'delete': {
            if (!sprint_id) return error('sprint_id is required');

            // Delete sprint tasks first
            await supabase.from('focus_sprint_tasks').delete().eq('sprint_id', sprint_id);
            await supabase.from('focus_sprint_sessions').delete().eq('sprint_id', sprint_id);

            const { error: deleteError } = await supabase
              .from('focus_sprints')
              .delete()
              .eq('id', sprint_id);

            if (deleteError) return error(deleteError.message);

            return success({ message: 'Sprint deleted', sprint_id });
          }

          case 'add_task': {
            if (!sprint_id) return error('sprint_id is required');
            if (!task_ids || task_ids.length === 0) return error('task_ids required');

            // Get max display_order
            const { data: existing } = await supabase
              .from('focus_sprint_tasks')
              .select('display_order')
              .eq('sprint_id', sprint_id)
              .order('display_order', { ascending: false })
              .limit(1);

            const startOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

            const items = task_ids.map((tid, idx) => ({
              sprint_id,
              task_id: tid,
              display_order: startOrder + idx,
            }));

            const { error: insertError } = await supabase
              .from('focus_sprint_tasks')
              .insert(items);

            if (insertError) return error(insertError.message);

            return success({ message: `${task_ids.length} task(s) added to sprint` });
          }

          case 'remove_task': {
            if (!sprint_id) return error('sprint_id is required');
            if (!task_ids || task_ids.length === 0) return error('task_ids required');

            const { error: deleteError } = await supabase
              .from('focus_sprint_tasks')
              .delete()
              .eq('sprint_id', sprint_id)
              .in('task_id', task_ids);

            if (deleteError) return error(deleteError.message);

            return success({ message: `Task(s) removed from sprint` });
          }

          default:
            return error(`Unknown action: ${action}`);
        }
      } catch (e) {
        return error(`Failed sprint operation: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_sprint_timer ─────────────────────────────────────────────
  server.tool(
    'boltr_sprint_timer',
    'Start or pause the sprint timer. Cannot run simultaneously with individual focus sessions.',
    {
      action: z.enum(['start', 'pause']).describe('Start or pause the timer'),
      sprint_id: z.string().uuid().describe('Sprint ID'),
    },
    async ({ action, sprint_id }) => {
      try {
        if (action === 'start') {
          // Check for active individual focus sessions (mutual exclusion)
          const { data: activeFocus } = await supabase
            .from('focus_sessions')
            .select('id, task_id')
            .eq('is_active', true)
            .limit(1);

          if (activeFocus && activeFocus.length > 0) {
            return error('Cannot start sprint timer: an individual focus session is running. Stop it first.');
          }

          // Create new session
          const { data, error: insertError } = await supabase
            .from('focus_sprint_sessions')
            .insert({
              sprint_id,
              started_at: new Date().toISOString(),
              is_active: true,
              elapsed_time: '00:00:00',
            })
            .select('*')
            .single();

          if (insertError) return error(insertError.message);

          return success({ message: 'Sprint timer started', session: data });
        } else {
          // Pause: find and close active session
          const { data: activeSession } = await supabase
            .from('focus_sprint_sessions')
            .select('id, started_at')
            .eq('sprint_id', sprint_id)
            .eq('is_active', true)
            .limit(1)
            .single();

          if (!activeSession) return error('No active timer session for this sprint');

          const elapsed = Date.now() - new Date(activeSession.started_at).getTime();
          const hours = Math.floor(elapsed / 3600000);
          const minutes = Math.floor((elapsed % 3600000) / 60000);
          const seconds = Math.floor((elapsed % 60000) / 1000);
          const elapsedStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

          const { data, error: updateError } = await supabase
            .from('focus_sprint_sessions')
            .update({
              is_active: false,
              ended_at: new Date().toISOString(),
              elapsed_time: elapsedStr,
            })
            .eq('id', activeSession.id)
            .select('*')
            .single();

          if (updateError) return error(updateError.message);

          return success({ message: 'Sprint timer paused', session: data });
        }
      } catch (e) {
        return error(`Failed sprint timer: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );
}
