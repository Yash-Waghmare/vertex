import { databaseDefSchema, type DatabaseDef } from './types';
import { dailyTracker } from './daily-tracker';
import { dsaTracker } from './dsa-tracker';
import { reactRevision } from './react-revision';
import { systemDesign } from './system-design';
import { weeklyGoals } from './weekly-goals';
import { jobApplications } from './job-applications';

export const databases: DatabaseDef[] = [
  dailyTracker,
  dsaTracker,
  reactRevision,
  systemDesign,
  weeklyGoals,
  jobApplications,
];

// Validate at import time: TypeScript checks the shape, but invariants like
// "exactly one title property" can only be enforced at runtime by Zod.
for (const db of databases) {
  databaseDefSchema.parse(db);
}

export { dailyTracker, dsaTracker, reactRevision, systemDesign, weeklyGoals, jobApplications };
export type { DatabaseDef, PropertyDef, SelectOption } from './types';
