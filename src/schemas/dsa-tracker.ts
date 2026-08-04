import type { DatabaseDef } from './types';

export const dsaTracker: DatabaseDef = {
  key: 'dsa-tracker',
  name: 'DSA Tracker',
  icon: '🧩',
  properties: {
    Problem: { type: 'title' },
    Topic: {
      type: 'select',
      options: [
        { name: 'Arrays', color: 'blue' },
        { name: 'Strings', color: 'green' },
        { name: 'Linked List', color: 'yellow' },
        { name: 'Stack & Queue', color: 'orange' },
        { name: 'Trees', color: 'purple' },
        { name: 'Graphs', color: 'pink' },
        { name: 'Dynamic Programming', color: 'red' },
        { name: 'Binary Search', color: 'brown' },
        { name: 'Heaps', color: 'gray' },
        { name: 'Other', color: 'default' },
      ],
    },
    Difficulty: {
      type: 'select',
      options: [
        { name: 'Easy', color: 'green' },
        { name: 'Medium', color: 'yellow' },
        { name: 'Hard', color: 'red' },
      ],
    },
    Status: {
      type: 'select',
      options: [
        { name: 'Todo', color: 'gray' },
        { name: 'Solved', color: 'green' },
        { name: 'Revisit', color: 'orange' },
      ],
    },
    Link: { type: 'url' },
    Notes: { type: 'rich_text' },
  },
};
