import { z } from 'zod';

export const HealthSchema = z.object({
  status: z.string(),
  uptime: z.number().optional(),
});

export type Health = z.infer<typeof HealthSchema>;
