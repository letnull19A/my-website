import { z } from 'zod';

export const ArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must match ^[a-z0-9-]+$'),
  title: z.string().min(1),
  description: z.string().min(1),
  subtitle: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  readTime: z.string().min(1),
  category: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().nullable(),
  linkedinHref: z.string().nullable().optional(),
  telegramHref: z.string().nullable().optional(),
});

export type Article = z.infer<typeof ArticleSchema>;

export const ArticleListResponseSchema = z.object({
  items: z.array(ArticleSchema),
});

export const ArticleItemResponseSchema = z.object({
  item: ArticleSchema,
});
