import { loadConfig } from '../config';
import { fetchAllDailyTasks, updateTaskDay } from '../notion/daily-tracker';
import { dayNumber, hourInTimezone, todayInTimezone } from '../progress/dates';
import { computeStreak, isDone } from '../progress/streak';
import { renderToday } from '../render/today';

export async function runToday(): Promise<void> {
  const config = await loadConfig();
  const today = todayInTimezone(config.timezone);
  const day = dayNumber(today, config.startDate);

  const allTasks = await fetchAllDailyTasks();
  const todaysTasks = allTasks.filter((t) => t.date === today);

  // Backfill the derived Day property so Notion matches the CLI.
  await Promise.all(
    todaysTasks.filter((t) => t.day !== day).map((t) => updateTaskDay(t.pageId, day))
  );

  const briefing = renderToday({
    name: config.name,
    hour: hourInTimezone(config.timezone),
    dayNumber: day,
    totalDays: config.totalDays,
    streak: computeStreak(allTasks, today),
    tasks: todaysTasks.map((t) => ({
      name: t.name,
      done: isDone(t),
      durationMinutes: t.durationMinutes,
    })),
  });

  console.log('\n' + briefing + '\n');
}
