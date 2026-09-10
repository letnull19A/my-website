import { z } from 'zod';

export const ContactInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  description: z.string().min(1),
  agreed: z.literal(true),
});

export type ContactInput = z.infer<typeof ContactInputSchema>;

export const ContactResultSchema = z.object({
  ok: z.literal(true),
});

export type ContactResult = z.infer<typeof ContactResultSchema>;