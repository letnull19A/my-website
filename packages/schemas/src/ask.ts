import { z } from 'zod';

export const AskInputSchema = z.object({
  query: z.string().min(1),
});

export type AskInput = z.infer<typeof AskInputSchema>;

export const AskResultSchema = z.object({
  answer: z.string().min(1),
});

export type AskResult = z.infer<typeof AskResultSchema>;