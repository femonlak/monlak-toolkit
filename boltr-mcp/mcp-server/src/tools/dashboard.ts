/**
 * Dashboard tool - comprehensive overview of BOLTR state
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getTodayLocal, getCurrentWeekRange, success, error } from '../helpers.js';

export function registerDashboardTools(server: McpServer, supabase: SupabaseClient) {
  server.tool(
    'boltr_get_dashboard',
    'Get a comprehensive dashboard snapshot: task counts by view, active sessions, active sprints, goal summary, and today\'s score. Use this to understand the current state before taking actions.',
    {},
    async () => {
      try {
        const today = getTodayLocal();
        const week = getCurrentWeekRange();

        // Parallel queries for performance
        const [
          inboxResult,
          todayResult,
          weekResult,
          nextResult,
          activeSessionsResult,
          activeSprintsResult,
          goalsResult,
          mitResult,
          doingResult,
        ] = await Promise.all([
          // Inbox count
          supabase
            .from('tasks')
            .select('id', { count: 'exact', head: true })
            .is('list_id', null)
            .is('execution_date', null)
            .eq('completed', false),
          // Today count
          supabase
            .from('tasks')
            .select('id', { count: 'exact', head: true })
            .lte('execution_date', today)
            .eq('completed', false),
          // Week count
          supabase
            .from('tasks')
            .select('id', { count: 'exact', head: true })
            .gte('execution_date', week.start)
            .lte('execution_date', week.end)
            .eq('completed', false),
          // Next count
          supabase
            .from('tasks')
            .select('id', { count: 'exact', head: true })
            .gt('execution_date', week.end)
            .eq('completed', false),
          // Active focus sessions
          supabase
            .from('focus_sessions')
            .select('id, task_id')
            .eq('is_active', true),
          // Active sprints
          supabase
            .from('focus_sprints')
            .select('id, name, status, total_elapsed_time')
            .in('status', ['active', 'paused']),
          // Goals summary (current year)
          supabase
            .from('goals')
            .select('id, completed')
            .eq('year', new Date().getFullYear()),
          // MIT tasks today
          supabase
            .from('tasks')
            .select('id, title')
            .eq('is_mit', true)
            .eq('completed', false),
          // Doing tasks
          supabase
            .from('tasks')
            .select('id, title')
            .eq('is_doing', true)
            .eq('completed', false),
        ]);

        const goalsData = goalsResult.data || [];
        const totalGoals = goalsData.length;
        const completedGoals = goalsData.filter((g: any) => g.completed).length;

        return success({
          date: today,
          task_counts: {
            inbox: inboxResult.count || 0,
            today: todayResult.count || 0,
            week: weekResult.count || 0,
            next: nextResult.count || 0,
          },
          current_state: {
            mit_tasks: (mitResult.data || []).map((t: any) => ({ id: t.id, title: t.title })),
            doing_tasks: (doingResult.data || []).map((t: any) => ({ id: t.id, title: t.title })),
            active_focus_sessions: (activeSessionsResult.data || []).length,
            active_sprints: (activeSprintsResult.data || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              status: s.status,
              total_elapsed_time: s.total_elapsed_time,
            })),
          },
          goals_summary: {
            total: totalGoals,
            completed: completedGoals,
            in_progress: totalGoals - completedGoals,
          },
        });
      } catch (e) {
        return error(`Failed to get dashboard: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
  );
}
