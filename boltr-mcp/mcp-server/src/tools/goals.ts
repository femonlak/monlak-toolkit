/**
 * Goal management tools (includes milestone management)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { success, error } from '../helpers.js';

interface GoalProgress {
  percentage: number;
  displayText: string;
}

function calculateGoalProgress(
  goal: any,
  milestones?: any[]
): GoalProgress {
  switch (goal.type) {
    case 'binary':
      return {
        percentage: goal.completed ? 100 : 0,
        displayText: goal.completed ? 'Completed' : 'Not completed',
      };
    case 'milestone': {
      const total = milestones?.length || 0;
      const completed = milestones?.filter((m: any) => m.is_completed).length || 0;
      return {
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        displayText: `${completed}/${total} milestones`,
      };
    }
    case 'numeric': {
      const start = goal.start_value ?? 0;
      const current = goal.current_value ?? start;
      const target = goal.target_value ?? start;
      const range = target - start;
      if (range === 0) return { percentage: 100, displayText: `${current}${goal.unit ? ' ' + goal.unit : ''}` };
      const progress = Math.round(((current - start) / range) * 100);
      return {
        percentage: Math.max(0, Math.min(100, progress)),
        displayText: `${current}/${target}${goal.unit ? ' ' + goal.unit : ''}`,
      };
    }
    default:
      return { percentage: 0, displayText: 'Unknown type' };
  }
}

export function registerGoalTools(server: McpServer, supabase: SupabaseClient) {
  // ─── boltr_list_goals ───────────────────────────────────────────────
  server.tool(
    'boltr_list_goals',
    'List all goals for a year, grouped by area (Work/Personal), with calculated progress.',
    {
      year: z.number().optional().describe('Year to filter (default: current year)'),
      include_completed: z.boolean().optional().describe('Include completed goals (default: true)'),
    },
    async ({ year, include_completed }) => {
      try {
        const targetYear = year || new Date().getFullYear();

        let query = supabase
          .from('goals')
          .select('*')
          .eq('year', targetYear)
          .order('position', { ascending: true });

        if (include_completed === false) {
          query = query.eq('completed', false);
        }

        const { data: goals, error: goalError } = await query;
        if (goalError) return error(goalError.message);

        // Fetch milestones for milestone-type goals
        const milestoneGoalIds = (goals || [])
          .filter((g: any) => g.type === 'milestone')
          .map((g: any) => g.id);

        let milestonesMap: Record<string, any[]> = {};
        if (milestoneGoalIds.length > 0) {
          const { data: milestones } = await supabase
            .from('goal_milestones')
            .select('*')
            .in('goal_id', milestoneGoalIds)
            .order('display_order', { ascending: true });

          if (milestones) {
            for (const m of milestones) {
              if (!milestonesMap[m.goal_id]) milestonesMap[m.goal_id] = [];
              milestonesMap[m.goal_id].push(m);
            }
          }
        }

        const enriched = (goals || []).map((g: any) => {
          const milestones = milestonesMap[g.id] || [];
          const progress = calculateGoalProgress(g, milestones);
          return {
            id: g.id,
            title: g.title,
            area: g.area,
            type: g.type,
            completed: g.completed,
            progress,
            ...(g.type === 'numeric' && {
              start_value: g.start_value,
              current_value: g.current_value,
              target_value: g.target_value,
              unit: g.unit,
            }),
            ...(g.type === 'milestone' && {
              milestones: milestones.map((m: any) => ({
                id: m.id,
                title: m.title,
                is_completed: m.is_completed,
              })),
            }),
          };
        });

        const work = enriched.filter((g: any) => g.area === 'Work');
        const personal = enriched.filter((g: any) => g.area === 'Personal');

        return success({
          year: targetYear,
          total: enriched.length,
          work: { count: work.length, goals: work },
          personal: { count: personal.length, goals: personal },
        });
      } catch (e) {
        return error(`Failed to list goals: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_create_goal ──────────────────────────────────────────────
  server.tool(
    'boltr_create_goal',
    'Create a new goal. Types: binary (yes/no), milestone (sub-goals), numeric (progress tracking).',
    {
      title: z.string().min(1).max(150).describe('Goal title (max 150 chars)'),
      area: z.enum(['Work', 'Personal']).describe('Life area'),
      type: z.enum(['binary', 'milestone', 'numeric']).describe('Goal type'),
      notes: z.string().optional().describe('Additional notes'),
      start_value: z.number().optional().describe('Starting value (numeric type only)'),
      target_value: z.number().optional().describe('Target value (numeric type only)'),
      unit: z.string().max(20).optional().describe('Unit label (numeric type only, e.g. "books", "km")'),
    },
    async ({ title, area, type, notes, start_value, target_value, unit }) => {
      try {
        const year = new Date().getFullYear();

        // Get max position
        const { data: existing } = await supabase
          .from('goals')
          .select('position')
          .eq('year', year)
          .order('position', { ascending: false })
          .limit(1);

        const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

        const insertData: Record<string, unknown> = {
          title: title.trim(),
          area,
          type,
          year,
          position: nextPosition,
          completed: false,
          notes: notes?.trim() || null,
        };

        if (type === 'numeric') {
          insertData.start_value = start_value ?? 0;
          insertData.current_value = start_value ?? 0;
          insertData.target_value = target_value ?? 0;
          insertData.unit = unit?.trim() || null;
        }

        const { data, error: dbError } = await supabase
          .from('goals')
          .insert(insertData)
          .select('*')
          .single();

        if (dbError) return error(dbError.message);

        return success({
          message: 'Goal created',
          goal: data,
        });
      } catch (e) {
        return error(`Failed to create goal: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_update_goal ──────────────────────────────────────────────
  server.tool(
    'boltr_update_goal',
    'Update a goal (title, notes, completion, or numeric progress).',
    {
      goal_id: z.string().uuid().describe('Goal ID'),
      title: z.string().min(1).max(150).optional().describe('New title'),
      notes: z.string().nullable().optional().describe('New notes'),
      completed: z.boolean().optional().describe('Mark as completed/uncompleted'),
      current_value: z.number().optional().describe('Update current value (numeric goals only)'),
    },
    async ({ goal_id, title, notes, completed, current_value }) => {
      try {
        const { data: current, error: fetchError } = await supabase
          .from('goals')
          .select('version, type, target_value')
          .eq('id', goal_id)
          .single();

        if (fetchError) return error(fetchError.message);

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title.trim();
        if (notes !== undefined) updateData.notes = notes;
        if (completed !== undefined) {
          updateData.completed = completed;
          updateData.completed_at = completed ? new Date().toISOString() : null;
        }
        if (current_value !== undefined) {
          updateData.current_value = current_value;
          // Auto-complete numeric goal if target reached
          if (current.type === 'numeric' && current.target_value !== null) {
            if (current_value >= current.target_value) {
              updateData.completed = true;
              updateData.completed_at = new Date().toISOString();
            }
          }
        }

        if (Object.keys(updateData).length === 0) {
          return error('No fields to update');
        }

        const { data, error: dbError } = await supabase
          .from('goals')
          .update(updateData)
          .eq('id', goal_id)
          .eq('version', current.version)
          .select('*')
          .single();

        if (dbError) return error(dbError.message);

        return success({
          message: 'Goal updated',
          goal: data,
        });
      } catch (e) {
        return error(`Failed to update goal: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );

  // ─── boltr_manage_milestones ────────────────────────────────────────
  server.tool(
    'boltr_manage_milestones',
    'Create, update, delete, or toggle completion of milestones for a milestone-type goal.',
    {
      goal_id: z.string().uuid().describe('Goal ID (must be milestone type)'),
      action: z.enum(['create', 'update', 'delete', 'toggle']).describe('Action to perform'),
      milestone_id: z.string().uuid().optional().describe('Milestone ID (required for update/delete/toggle)'),
      title: z.string().min(1).max(50).optional().describe('Milestone title (for create/update)'),
      is_completed: z.boolean().optional().describe('Completion status (for toggle)'),
    },
    async ({ goal_id, action, milestone_id, title, is_completed }) => {
      try {
        switch (action) {
          case 'create': {
            if (!title) return error('Title is required for creating a milestone');

            const { data: existing } = await supabase
              .from('goal_milestones')
              .select('display_order')
              .eq('goal_id', goal_id)
              .order('display_order', { ascending: false })
              .limit(1);

            const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

            const { data, error: dbError } = await supabase
              .from('goal_milestones')
              .insert({
                goal_id,
                title: title.trim(),
                is_completed: false,
                display_order: nextOrder,
              })
              .select('*')
              .single();

            if (dbError) return error(dbError.message);
            return success({ message: 'Milestone created', milestone: data });
          }

          case 'update': {
            if (!milestone_id) return error('milestone_id is required');
            if (!title) return error('Title is required for updating');

            const { data, error: dbError } = await supabase
              .from('goal_milestones')
              .update({ title: title.trim() })
              .eq('id', milestone_id)
              .select('*')
              .single();

            if (dbError) return error(dbError.message);
            return success({ message: 'Milestone updated', milestone: data });
          }

          case 'delete': {
            if (!milestone_id) return error('milestone_id is required');

            const { error: dbError } = await supabase
              .from('goal_milestones')
              .delete()
              .eq('id', milestone_id);

            if (dbError) return error(dbError.message);
            return success({ message: 'Milestone deleted', milestone_id });
          }

          case 'toggle': {
            if (!milestone_id) return error('milestone_id is required');
            if (is_completed === undefined) return error('is_completed is required for toggle');

            const { data, error: dbError } = await supabase
              .from('goal_milestones')
              .update({ is_completed })
              .eq('id', milestone_id)
              .select('*')
              .single();

            if (dbError) return error(dbError.message);

            // Check if all milestones are completed → auto-complete goal
            const { data: allMilestones } = await supabase
              .from('goal_milestones')
              .select('is_completed')
              .eq('goal_id', goal_id);

            if (allMilestones && allMilestones.length > 0) {
              const allCompleted = allMilestones.every((m: any) => m.is_completed);
              if (allCompleted) {
                await supabase
                  .from('goals')
                  .update({ completed: true, completed_at: new Date().toISOString() })
                  .eq('id', goal_id);
              } else {
                await supabase
                  .from('goals')
                  .update({ completed: false, completed_at: null })
                  .eq('id', goal_id);
              }
            }

            return success({
              message: `Milestone ${is_completed ? 'completed' : 'uncompleted'}`,
              milestone: data,
            });
          }

          default:
            return error(`Unknown action: ${action}`);
        }
      } catch (e) {
        return error(`Failed to manage milestone: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );
}
