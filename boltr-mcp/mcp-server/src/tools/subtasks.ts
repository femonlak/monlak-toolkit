/**
 * Subtask management tools
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getTodayLocal, success, error } from '../helpers.js';

export function registerSubtaskTools(server: McpServer, supabase: SupabaseClient) {
  // ─── boltr_list_subtasks ────────────────────────────────────────────
  server.tool(
    'boltr_list_subtasks',
    'List all subtasks for a given task, ordered by display_order.',
    {
      task_id: z.string().uuid().describe('Parent task ID'),
    },
    async ({ task_id }) => {
      try {
        const { data, error: dbError } = await supabase
          .from('subtasks')
          .select('*')
          .eq('parent_task_id', task_id)
          .order('display_order', { ascending: true });

        if (dbError) return error(dbError.message);

        return success({
          task_id,
          count: (data || []).length,
          subtasks: (data || []).map((s: any) => ({
            id: s.id,
            title: s.title,
            is_completed: s.is_completed,
            display_order: s.display_order,
          })),
        });
      } catch (e) {
        return error(`Failed to list subtasks: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_create_subtask ───────────────────────────────────────────
  server.tool(
    'boltr_create_subtask',
    'Create a new subtask for a task. Auto-assigns display_order.',
    {
      task_id: z.string().uuid().describe('Parent task ID'),
      title: z.string().min(1).max(50).describe('Subtask title (max 50 chars)'),
    },
    async ({ task_id, title }) => {
      try {
        // Get max display_order for this task
        const { data: existing } = await supabase
          .from('subtasks')
          .select('display_order')
          .eq('parent_task_id', task_id)
          .order('display_order', { ascending: false })
          .limit(1);

        const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

        const { data, error: dbError } = await supabase
          .from('subtasks')
          .insert({
            parent_task_id: task_id,
            title: title.trim(),
            is_completed: false,
            display_order: nextOrder,
          })
          .select('*')
          .single();

        if (dbError) return error(dbError.message);

        return success({
          message: 'Subtask created',
          subtask: data,
        });
      } catch (e) {
        return error(`Failed to create subtask: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_update_subtask ───────────────────────────────────────────
  server.tool(
    'boltr_update_subtask',
    'Update a subtask title or toggle its completion status. Uses RPC for completion scoring.',
    {
      subtask_id: z.string().uuid().describe('Subtask ID'),
      title: z.string().min(1).max(50).optional().describe('New title'),
      is_completed: z.boolean().optional().describe('Toggle completion'),
    },
    async ({ subtask_id, title, is_completed }) => {
      try {
        // Handle completion via RPC (for scoring)
        if (is_completed !== undefined) {
          const localDate = getTodayLocal();
          const { error: rpcError } = await supabase.rpc('complete_subtask_with_local_date', {
            p_subtask_id: subtask_id,
            p_completed: is_completed,
            p_local_score_date: localDate,
          });
          if (rpcError) return error(rpcError.message);
        }

        // Handle title update separately
        if (title !== undefined) {
          const { error: updateError } = await supabase
            .from('subtasks')
            .update({ title: title.trim() })
            .eq('id', subtask_id);
          if (updateError) return error(updateError.message);
        }

        // Fetch updated subtask
        const { data, error: fetchError } = await supabase
          .from('subtasks')
          .select('*')
          .eq('id', subtask_id)
          .single();

        if (fetchError) return error(fetchError.message);

        return success({
          message: 'Subtask updated',
          subtask: data,
        });
      } catch (e) {
        return error(`Failed to update subtask: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_delete_subtask ───────────────────────────────────────────
  server.tool(
    'boltr_delete_subtask',
    'Delete a subtask.',
    {
      subtask_id: z.string().uuid().describe('Subtask ID to delete'),
    },
    async ({ subtask_id }) => {
      try {
        const { error: dbError } = await supabase
          .from('subtasks')
          .delete()
          .eq('id', subtask_id);

        if (dbError) return error(dbError.message);

        return success({ message: 'Subtask deleted', subtask_id });
      } catch (e) {
        return error(`Failed to delete subtask: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );
}
