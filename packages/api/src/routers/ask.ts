import { AskInputSchema } from '@my-website/schemas';
import { publicProcedure, router } from '../trpc';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const askRouter = router({
  answer: publicProcedure
    .input(AskInputSchema)
    .mutation(async ({ input }) => {
      await sleep(600);
      return {
        answer: `[STUB] Query received: "${input.query}". Answer will be available after AI integration.`,
      };
    }),
});