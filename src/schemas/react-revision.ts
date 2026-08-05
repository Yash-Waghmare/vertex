import type { DatabaseDef } from './types';

export const reactRevision: DatabaseDef = {
  key: 'react-revision',
  name: 'React Revision',
  icon: '⚛️',
  properties: {
    Topic: { type: 'title' },
    Area: {
      type: 'select',
      options: [
        { name: 'Core', color: 'blue' },
        { name: 'Hooks', color: 'purple' },
        { name: 'State Management', color: 'orange' },
        { name: 'Performance', color: 'red' },
        { name: 'Patterns', color: 'green' },
      ],
    },
    Status: {
      type: 'select',
      options: [
        { name: 'Todo', color: 'gray' },
        { name: 'Revised', color: 'yellow' },
        { name: 'Confident', color: 'green' },
      ],
    },
    Link: { type: 'url' },
    Notes: { type: 'rich_text' },
  },
};
