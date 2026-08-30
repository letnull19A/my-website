import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { DataSources } from '@my-website/schemas';

export interface Context {
  dataSources: DataSources;
}

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
