import { TRPCError } from '@trpc/server';
import { BySlugInputSchema } from '@my-website/schemas';
import { publicProcedure, router } from '../trpc';

export const casesRouter = router({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.dataSources.cases.findAll();
  }),

  bySlug: publicProcedure.input(BySlugInputSchema).query(({ ctx, input }) => {
    const item = ctx.dataSources.cases.findOne(input.slug);
    if (!item) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Case with slug "${input.slug}" not found`,
      });
    }
    return item;
  }),
});
