import type { DatabaseDef } from './types';

export const systemDesign: DatabaseDef = {
  key: 'system-design',
  name: 'System Design',
  icon: '🏗️',
  properties: {
    Topic: { type: 'title' },
    Type: {
      type: 'select',
      options: [
        { name: 'Concept', color: 'blue' },
        { name: 'Case Study', color: 'purple' },
      ],
    },
    Status: {
      type: 'select',
      options: [
        { name: 'Todo', color: 'gray' },
        { name: 'Studied', color: 'yellow' },
        { name: 'Can Explain', color: 'green' },
      ],
    },
    Notes: { type: 'rich_text' },
  },
};
