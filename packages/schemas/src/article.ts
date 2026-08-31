import { z } from 'zod';
import { SlugSchema } from './slug';

export const ArticleSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  subtitle: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  readTime: z.string().min(1),
  category: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().nullish(),
  linkedinHref: z.string().nullish(),
  telegramHref: z.string().nullish(),
});

export type Article = z.infer<typeof ArticleSchema>;
