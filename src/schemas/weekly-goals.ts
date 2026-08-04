import type { DatabaseDef } from './types';

export const weeklyGoals: DatabaseDef = {
  key: 'weekly-goals',
  name: 'Weekly Goals',
  icon: '🎯',
  properties: {
    Goal: { type: 'title' },
    // Week 1–9 for a 60-day plan; the CLI derives date ranges from config.startDate.
    Week: { type: 'number' },
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
  },
};
