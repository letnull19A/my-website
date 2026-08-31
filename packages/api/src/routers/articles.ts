import { TRPCError } from '@trpc/server';
import { BySlugInputSchema } from '@my-website/schemas';
import { publicProcedure, router } from '../trpc';

export const articlesRouter = router({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.dataSources.articles.findAll();
  }),

  bySlug: publicProcedure.input(BySlugInputSchema).query(({ ctx, input }) => {
    const item = ctx.dataSources.articles.findOne(input.slug);
    if (!item) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Article with slug "${input.slug}" not found`,
      });
    }
    return item;
  }),
});
