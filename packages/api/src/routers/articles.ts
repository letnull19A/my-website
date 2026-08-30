import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';

export const articlesRouter = router({
  list: publicProcedure.query(({ ctx }) => {
    return { items: ctx.dataSources.articles.findAll() };
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/) }))
    .query(({ ctx, input }) => {
      const item = ctx.dataSources.articles.findOne(input.slug);
      if (!item) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Article with slug "${input.slug}" not found`,
        });
      }
      return { item };
    }),
});
