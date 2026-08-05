export interface BriefingTask {
  name: string;
  done: boolean;
  durationMinutes: number | null;
}

export interface TodayBriefing {
  name: string;
  hour: number;
  dayNumber: number;
  totalDays: number;
  streak: number;
  tasks: BriefingTask[];
}

function greeting(hour: number): string {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function renderToday(b: TodayBriefing): string {
  const lines: string[] = [];

  lines.push(`# ${greeting(b.hour)} ${b.name} 👋`, '');
  lines.push(`**Today is Day ${b.dayNumber} of ${b.totalDays}**`, '');
  lines.push(`🔥 **Streak:** ${b.streak}`, '');
  lines.push(`## Today's Focus`, '');

  if (b.tasks.length === 0) {
    lines.push('_No tasks planned for today — add some in the Daily Tracker._');
    return lines.join('\n');
  }

  // Numbered so tasks can be marked done by position: npm run done -- 2
  b.tasks.forEach((task, i) => {
    lines.push(`- [${task.done ? 'x' : ' '}] ${i + 1}. ${task.name}`);
  });

  const doneCount = b.tasks.filter((t) => t.done).length;
  if (doneCount > 0) {
    lines.push('', `✅ **Completed:** ${doneCount}/${b.tasks.length}`);
  }

  const totalMinutes = b.tasks.reduce((sum, t) => sum + (t.durationMinutes ?? 0), 0);
  lines.push('', `**Estimated Time:** ${formatMinutes(totalMinutes)}`);

  return lines.join('\n');
}
