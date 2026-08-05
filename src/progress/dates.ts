const MS_PER_DAY = 86_400_000;

/** Current date as YYYY-MM-DD in the given IANA timezone (en-CA locale formats ISO-style). */
export function todayInTimezone(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date());
}

/** Current hour (0-23) in the given timezone, for the greeting. */
export function hourInTimezone(timezone: string): number {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  }).format(new Date());
  return Number.parseInt(hour, 10) % 24;
}

function toUtcMs(dateIso: string): number {
  return new Date(`${dateIso}T00:00:00Z`).getTime();
}

/** Day 1 = startDate itself. */
export function dayNumber(dateIso: string, startDate: string): number {
  return Math.floor((toUtcMs(dateIso) - toUtcMs(startDate)) / MS_PER_DAY) + 1;
}

export function previousDay(dateIso: string): string {
  return new Date(toUtcMs(dateIso) - MS_PER_DAY).toISOString().slice(0, 10);
}
