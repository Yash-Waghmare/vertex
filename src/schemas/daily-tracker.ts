import type { DatabaseDef } from './types';

export const dailyTracker: DatabaseDef = {
  key: 'daily-tracker',
  name: 'Daily Tracker',
  icon: '📅',
  properties: {
    Task: { type: 'title' },
    // Source of truth for "which day a task belongs to".
    Date: { type: 'date' },
    // Derived from Date + config.startDate; filled by the CLI, never typed manually.
    Day: { type: 'number' },
    Duration: {
      type: 'select',
      options: [
        { name: '15', color: 'gray' },
        { name: '30', color: 'blue' },
        { name: '60', color: 'green' },
        { name: '90', color: 'yellow' },
        { name: '120', color: 'red' },
      ],
    },
    Status: { type: 'status' },
    Category: {
      type: 'select',
      options: [
        { name: 'DSA', color: 'purple' },
        { name: 'React', color: 'blue' },
        { name: 'System Design', color: 'orange' },
        { name: 'Applications', color: 'green' },
        { name: 'Other', color: 'gray' },
      ],
    },
    Notes: { type: 'rich_text' },
  },
};
