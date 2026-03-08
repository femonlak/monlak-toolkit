/**
 * Recurrence rule tools
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { success, error, getTodayLocal } from '../helpers.js';

export function registerRecurrenceTools(server: McpServer, supabase: SupabaseClient) {
  // ─── boltr_create_recurrence ────────────────────────────────────────
  server.tool(
    'boltr_create_recurrence',
    'Create a recurrence rule and link it to a task. Daily: repeats every N days (optional skip weekends). Weekly: repeats on a specific weekday. Monthly: repeats on a specific day of month.',
    {
      task_id: z.string().uuid().describe('Task to make recurring'),
      frequency: z.enum(['daily', 'weekly', 'monthly']).describe('Recurrence frequency'),
      interval_value: z.number().min(1).max(99).describe('Every N days/weeks/months'),
      skip_weekends: z.boolean().optional().describe('Skip weekends (daily only, default: false)'),
      weekday: z.number().min(0).max(6).optional().describe('Target weekday 0=Sun..6=Sat (weekly only)'),
      month_day: z.number().min(1).max(31).optional().describe('Target day of month 1-31 (monthly only)'),
    },
    async ({ task_id, frequency, interval_value, skip_weekends, weekday, month_day }) => {
      try {
        // Validate frequency-specific fields
        if (frequency === 'weekly' && weekday === undefined) {
          return error('weekday is required for weekly recurrence (0=Sun, 1=Mon, ..., 6=Sat)');
        }
        if (frequency === 'monthly' && month_day === undefined) {
          return error('month_day is required for monthly recurrence (1-31)');
        }

        // Get task's execution_date as base_execution_date
        const { data: task, error: taskError } = await supabase
          .from('tasks')
          .select('execution_date')
          .eq('id', task_id)
          .single();

        if (taskError) return error(taskError.message);

        const baseDate = task.execution_date || getTodayLocal();

        // Create recurrence rule
        const { data: rule, error: ruleError } = await supabase
          .from('task_recurrence_rules')
          .insert({
            frequency,
            interval_value,
            skip_weekends: skip_weekends || false,
            weekday: frequency === 'weekly' ? weekday! : null,
            month_day: frequency === 'monthly' ? month_day! : null,
            base_execution_date: baseDate,
          })
          .select('*')
          .single();

        if (ruleError) return error(ruleError.message);

        // Link rule to task
        const { error: linkError } = await supabase
          .from('tasks')
          .update({ recurrence_rule_id: rule.id })
          .eq('id', task_id);

        if (linkError) return error(linkError.message);

        return success({
          message: 'Recurrence rule created and linked to task',
          rule,
          task_id,
        });
      } catch (e) {
        return error(`Failed to create recurrence: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_delete_recurrence ────────────────────────────────────────
  server.tool(
    'boltr_delete_recurrence',
    'Remove recurrence from a task. The task remains but stops repeating.',
    {
      task_id: z.string().uuid().describe('Task to remove recurrence from'),
    },
    async ({ task_id }) => {
      try {
        // Get recurrence rule ID
        const { data: task, error: taskError } = await supabase
          .from('tasks')
          .select('recurrence_rule_id')
          .eq('id', task_id)
          .single();

        if (taskError) return error(taskError.message);
        if (!task.recurrence_rule_id) return error('Task has no recurrence rule');

        const ruleId = task.recurrence_rule_id;

        // Unlink from task
        await supabase
          .from('tasks')
          .update({ recurrence_rule_id: null })
          .eq('id', task_id);

        // Delete the rule
        await supabase
          .from('task_recurrence_rules')
          .delete()
          .eq('id', ruleId);

        return success({
          message: 'Recurrence removed from task',
          task_id,
        });
      } catch (e) {
        return error(`Failed to delete recurrence: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );
}
