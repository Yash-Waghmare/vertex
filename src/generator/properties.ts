import type { CreateDatabaseParameters } from '@notionhq/client';
import type { PropertyDef } from '../schemas/types';

// The SDK doesn't export the property config type directly, so we derive it
// from CreateDatabaseParameters via indexed access.
export type NotionPropertyConfig = NonNullable<
  NonNullable<CreateDatabaseParameters['initial_data_source']>['properties']
>[string];

export function toNotionProperty(def: PropertyDef): NotionPropertyConfig {
  switch (def.type) {
    case 'title':
      return { title: {} };
    case 'rich_text':
      return { rich_text: {} };
    case 'number':
      return { number: {} };
    case 'date':
      return { date: {} };
    case 'url':
      return { url: {} };
    case 'select':
      return { select: { options: def.options } };
    case 'status':
      // Options intentionally omitted: Notion applies its defaults
      // (Not started / In progress / Done), which is what we want.
      return { status: {} };
  }
}
