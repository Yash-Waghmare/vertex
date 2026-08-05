import { notion } from '../notion/client';
import { loadConfig } from '../config';
import { fetchAllDailyTasks, type DailyTask } from '../notion/daily-tracker';
import { todayInTimezone } from '../progress/dates';
import { computeStreak, isDone, DONE_STATUS } from '../progress/streak';

export async function runDone(taskArg: string): Promise<void> {
  const config = await loadConfig();
  const today = todayInTimezone(config.timezone);

  const allTasks = await fetchAllDailyTasks();
  const todaysTasks = allTasks.filter((t) => t.date === today);

  if (todaysTasks.length === 0) {
    console.log('No tasks planned for today — nothing to mark done.');
    return;
  }

  const task = resolveTask(todaysTasks, taskArg);
  if (!task) {
    console.log(`Could not match "${taskArg}" to a task. Today's tasks:\n`);
    todaysTasks.forEach((t, i) => {
      console.log(`  ${i + 1}. [${isDone(t) ? 'x' : ' '}] ${t.name}`);
    });
    process.exitCode = 1;
    return;
  }

  if (isDone(task)) {
    console.log(`"${task.name}" is already done.`);
    return;
  }

  await notion.pages.update({
    page_id: task.pageId,
    properties: { Status: { status: { name: DONE_STATUS } } },
  });
  task.status = DONE_STATUS;

  const doneCount = todaysTasks.filter(isDone).length;
  console.log(`✅ Done: ${task.name} (${doneCount}/${todaysTasks.length} today)`);

  if (doneCount === todaysTasks.length) {
    const streak = computeStreak(allTasks, today);
    console.log(`🔥 All tasks complete — streak is now ${streak}!`);
  }
}

/** Resolve by list number ("2") or by name (exact match first, then substring). */
function resolveTask(tasks: DailyTask[], arg: string): DailyTask | null {
  const trimmed = arg.trim();

  if (/^\d+$/.test(trimmed)) {
    const index = Number.parseInt(trimmed, 10) - 1;
    return tasks[index] ?? null;
  }

  const query = trimmed.toLowerCase();
  const exact = tasks.filter((t) => t.name.toLowerCase() === query);
  if (exact.length === 1) return exact[0];

  const partial = tasks.filter((t) => t.name.toLowerCase().includes(query));
  if (partial.length === 1) return partial[0];

  return null;
}
