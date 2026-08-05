import type { PropertyDef } from '../schemas/types';

// No explicit return type: the SDK uses different (incompatible) property-config
// unions for database creation vs. data source updates. The inferred literal
// union of the shapes below is narrow enough to satisfy both.
export function toNotionProperty(def: PropertyDef) {
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
