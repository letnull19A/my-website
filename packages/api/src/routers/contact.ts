import { ContactInputSchema } from '@my-website/schemas';
import { publicProcedure, router } from '../trpc';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const contactRouter = router({
  send: publicProcedure
    .input(ContactInputSchema)
    .mutation(async ({ input }) => {
      console.log('[contact.send]', JSON.stringify(input, null, 2));
      await sleep(600);
      return { ok: true as const };
    }),
});