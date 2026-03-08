/**
 * Shared helper utilities for MCP tools
 */

/**
 * Get today's date in local timezone as YYYY-MM-DD
 */
export function getTodayLocal(): string {
  const now = new Date();
  return formatDate(now);
}

/**
 * Format a Date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the start (Monday) and end (Sunday) of the current week
 */
export function getCurrentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Calculate Monday (start of week)
  const monday = new Date(now);
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(now.getDate() + diffToMonday);

  // Calculate Sunday (end of week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
}

/**
 * Format Supabase/Postgres error for user display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const e = error as Record<string, unknown>;
    if (e.message) return String(e.message);
    if (e.code) return `Database error: ${e.code}`;
  }
  return 'Unknown error occurred';
}

/**
 * Build a successful MCP tool response
 */
export function success(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Build an error MCP tool response
 */
export function error(message: string): { content: Array<{ type: 'text'; text: string }>; isError: true } {
  return {
    content: [{ type: 'text' as const, text: `Error: ${message}` }],
    isError: true as const,
  };
}

/**
 * Recurrence calculator - replicates src/utils/recurrenceCalculator.ts
 */
interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval_value: number;
  skip_weekends: boolean;
  weekday: number | null;
  month_day: number | null;
}

export function calculateNextOccurrence(rule: RecurrenceRule, baseDate: string): string {
  const { frequency, interval_value, skip_weekends, weekday, month_day } = rule;
  const base = new Date(baseDate + 'T00:00:00');

  if (isNaN(base.getTime())) {
    throw new Error('Invalid base date');
  }

  switch (frequency) {
    case 'daily': {
      const next = new Date(base);
      next.setDate(next.getDate() + interval_value);
      if (skip_weekends) {
        while (next.getDay() === 0 || next.getDay() === 6) {
          next.setDate(next.getDate() + 1);
        }
      }
      return formatDate(next);
    }
    case 'weekly': {
      if (weekday === null) throw new Error('Weekday required for weekly recurrence');
      const next = new Date(base);
      next.setDate(next.getDate() + interval_value * 7);
      const currentDay = next.getDay();
      const daysToAdd = (weekday - currentDay + 7) % 7;
      if (daysToAdd !== 0) {
        next.setDate(next.getDate() + daysToAdd);
      }
      return formatDate(next);
    }
    case 'monthly': {
      if (month_day === null) throw new Error('Month day required for monthly recurrence');
      const next = new Date(base);
      next.setMonth(next.getMonth() + interval_value);
      const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      next.setDate(Math.min(month_day, lastDay));
      return formatDate(next);
    }
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
}

export function calculateNextFutureOccurrence(rule: RecurrenceRule, baseDate: string): string {
  const today = getTodayLocal();
  let nextDate = calculateNextOccurrence(rule, baseDate);
  while (nextDate < today) {
    nextDate = calculateNextOccurrence(rule, nextDate);
  }
  return nextDate;
}
