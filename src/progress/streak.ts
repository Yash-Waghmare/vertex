import type { DailyTask } from '../notion/daily-tracker';
import { previousDay } from './dates';

export const DONE_STATUS = 'Done';

export function isDone(task: DailyTask): boolean {
  return task.status === DONE_STATUS;
}

/**
 * Streak = number of consecutive fully-completed days, walking backwards.
 *
 * Rules:
 * - A day counts only if it had at least one task and ALL of them are Done.
 * - An unfinished today never breaks the streak (the day isn't over yet);
 *   a fully completed today extends it.
 * - A past day with no planned tasks breaks the streak.
 */
export function computeStreak(tasks: DailyTask[], today: string): number {
  const byDate = new Map<string, DailyTask[]>();
  for (const task of tasks) {
    if (!task.date) continue;
    const list = byDate.get(task.date) ?? [];
    list.push(task);
    byDate.set(task.date, list);
  }

  const dayComplete = (date: string): boolean => {
    const list = byDate.get(date);
    return list !== undefined && list.length > 0 && list.every(isDone);
  };

  let streak = 0;
  let cursor = dayComplete(today) ? today : previousDay(today);
  while (dayComplete(cursor)) {
    streak++;
    cursor = previousDay(cursor);
  }
  return streak;
}
