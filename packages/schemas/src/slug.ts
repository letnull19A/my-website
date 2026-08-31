import { z } from 'zod';

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'slug must match ^[a-z0-9-]+$');

export const BySlugInputSchema = z.object({ slug: SlugSchema });

export type BySlugInput = z.infer<typeof BySlugInputSchema>;
