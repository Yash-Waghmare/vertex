import type { DatabaseDef } from './types';

export const jobApplications: DatabaseDef = {
  key: 'job-applications',
  name: 'Job Applications',
  icon: '💼',
  properties: {
    Company: { type: 'title' },
    Role: { type: 'rich_text' },
    Status: {
      type: 'select',
      options: [
        { name: 'To Apply', color: 'gray' },
        { name: 'Applied', color: 'blue' },
        { name: 'OA', color: 'yellow' },
        { name: 'Interview', color: 'orange' },
        { name: 'Offer', color: 'green' },
        { name: 'Rejected', color: 'red' },
      ],
    },
    'Applied Date': { type: 'date' },
    Link: { type: 'url' },
    Notes: { type: 'rich_text' },
  },
};
