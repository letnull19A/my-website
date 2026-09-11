import { z } from 'zod';

export const AiChatInputSchema = z.object({
  message: z.string().min(1).max(4000),
});

export type AiChatInput = z.infer<typeof AiChatInputSchema>;

export const AiChatAttachmentArticleSchema = z.object({
  kind: z.literal('article'),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  href: z.string(),
});

export type AiChatAttachmentArticle = z.infer<typeof AiChatAttachmentArticleSchema>;

export const AiChatAttachmentCaseSchema = z.object({
  kind: z.literal('case'),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  role: z.string().optional(),
  href: z.string(),
  logo: z.string().optional(),
});

export type AiChatAttachmentCase = z.infer<typeof AiChatAttachmentCaseSchema>;

export const AiChatAttachmentSchema = z.discriminatedUnion('kind', [
  AiChatAttachmentArticleSchema,
  AiChatAttachmentCaseSchema,
]);

export type AiChatAttachment = z.infer<typeof AiChatAttachmentSchema>;

export const AiChatPostResponseSchema = z.object({
  id: z.string(),
  role: z.literal('assistant'),
  content: z.string(),
  echo: z.string(),
  attachment: AiChatAttachmentSchema.nullable().optional(),
});

export type AiChatPostResponse = z.infer<typeof AiChatPostResponseSchema>;

// SSE chunk — token stream, final chunk has done: true
// attachment — опциональное вложение (статья/кейс) которое может прийти вместе с текстом или отдельным чанком
export const AiChatChunkSchema = z.object({
  token: z.string().optional(),
  attachment: AiChatAttachmentSchema.optional(),
  done: z.boolean().optional(),
});

export type AiChatChunk = z.infer<typeof AiChatChunkSchema>;
