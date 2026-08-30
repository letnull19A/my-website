import { z } from 'zod';

export const CaseActionVariantSchema = z.enum([
  'default',
  'lime-light',
  'outline',
  'secondary',
  'ghost',
]);

export const CaseActionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  variant: CaseActionVariantSchema.optional(),
});

export type CaseAction = z.infer<typeof CaseActionSchema>;

export const CaseMetaSchema = z.object({
  role: z.string().min(1),
  duration: z.string().min(1),
  status: z.string().min(1),
  stack: z.string().min(1),
});

export type CaseMeta = z.infer<typeof CaseMetaSchema>;

export const CaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(1),
  fullTitle: z.string().min(1),
  subtitle: z.string().min(1),
  actions: z.array(CaseActionSchema),
  meta: CaseMetaSchema,
  problem: z.string().min(1),
  solution: z.string().min(1),
  results: z.string().min(1),
  logo: z.string().min(1),
  previewImageSrc: z.string().nullable().optional(),
  previewCaption: z.string().nullable().optional(),
});

export type Case = z.infer<typeof CaseSchema>;

export const CaseListResponseSchema = z.object({
  items: z.array(CaseSchema),
});

export const CaseItemResponseSchema = z.object({
  item: CaseSchema,
});
