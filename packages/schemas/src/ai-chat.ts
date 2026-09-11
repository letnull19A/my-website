import { z } from 'zod';

export const AiChatInputSchema = z.object({
  message: z.string().min(1).max(4000),
});

export type AiChatInput = z.infer<typeof AiChatInputSchema>;

export const AiChatPostResponseSchema = z.object({
  id: z.string(),
  role: z.literal('assistant'),
  content: z.string(),
  echo: z.string(),
});

export type AiChatPostResponse = z.infer<typeof AiChatPostResponseSchema>;

// SSE chunk — token stream, final chunk has done: true
export const AiChatChunkSchema = z.object({
  token: z.string(),
  done: z.boolean().optional(),
});

export type AiChatChunk = z.infer<typeof AiChatChunkSchema>;
