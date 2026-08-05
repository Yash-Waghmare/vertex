import type { DatabaseDef, PropertyDef, SelectOption } from '../schemas/types';

export interface LiveSelectOption {
  id: string;
  name: string;
}

export interface LiveProperty {
  type: string;
  selectOptions?: LiveSelectOption[];
}

/** Property name → current config in the live Notion workspace. */
export type LiveProperties = Record<string, LiveProperty>;

export type SyncAction =
  | { kind: 'create-database'; db: DatabaseDef }
  | { kind: 'add-property'; db: DatabaseDef; property: string; def: PropertyDef }
  | {
      kind: 'add-select-options';
      db: DatabaseDef;
      property: string;
      newOptions: SelectOption[];
      /** Existing options referenced by id (so they are preserved) plus the new ones. */
      mergedOptions: Array<{ id: string } | SelectOption>;
    }
  | { kind: 'type-mismatch'; db: DatabaseDef; property: string; expected: string; actual: string };

/**
 * Pure diff: compares one schema definition against the live workspace and
 * returns the additive actions needed. Never produces deletions — properties
 * or options that exist in Notion but not in the schema are left untouched.
 */
export function diffDatabase(db: DatabaseDef, live: LiveProperties): SyncAction[] {
  const actions: SyncAction[] = [];

  for (const [property, def] of Object.entries(db.properties)) {
    const liveProp = live[property];

    if (!liveProp) {
      actions.push({ kind: 'add-property', db, property, def });
      continue;
    }

    if (liveProp.type !== def.type) {
      // Safety rule: type changes require manual migration, never done in place.
      actions.push({
        kind: 'type-mismatch',
        db,
        property,
        expected: def.type,
        actual: liveProp.type,
      });
      continue;
    }

    if (def.type === 'select') {
      const liveNames = new Set((liveProp.selectOptions ?? []).map((o) => o.name));
      const newOptions = def.options.filter((o) => !liveNames.has(o.name));
      if (newOptions.length > 0) {
        actions.push({
          kind: 'add-select-options',
          db,
          property,
          newOptions,
          mergedOptions: [
            ...(liveProp.selectOptions ?? []).map((o) => ({ id: o.id })),
            ...newOptions,
          ],
        });
      }
    }
  }

  return actions;
}
