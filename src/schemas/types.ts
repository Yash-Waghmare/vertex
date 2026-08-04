import { z } from 'zod';

export const selectColorSchema = z.enum([
  'default',
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
]);

export const selectOptionSchema = z.object({
  name: z.string().min(1),
  color: selectColorSchema.optional(),
});

export const propertyDefSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('title') }),
  z.object({ type: z.literal('rich_text') }),
  z.object({ type: z.literal('number') }),
  z.object({ type: z.literal('date') }),
  z.object({ type: z.literal('url') }),
  z.object({ type: z.literal('select'), options: z.array(selectOptionSchema).min(1) }),
  // Notion API limitation: status options cannot be customized programmatically.
  // A status property always gets Notion's defaults: Not started / In progress / Done.
  z.object({ type: z.literal('status') }),
]);

export const databaseDefSchema = z.object({
  key: z.string().regex(/^[a-z][a-z-]*$/, 'key must be lowercase with hyphens'),
  name: z.string().min(1),
  icon: z.string().optional(),
  properties: z
    .record(z.string().min(1), propertyDefSchema)
    .refine((props) => Object.values(props).filter((p) => p.type === 'title').length === 1, {
      message: 'Each database must have exactly one title property',
    }),
});

export type SelectOption = z.infer<typeof selectOptionSchema>;
export type PropertyDef = z.infer<typeof propertyDefSchema>;
export type DatabaseDef = z.infer<typeof databaseDefSchema>;
