import { router } from './trpc';
import { articlesRouter } from './routers/articles';
import { casesRouter } from './routers/cases';
import { healthRouter } from './routers/health';

export const appRouter = router({
  articles: articlesRouter,
  cases: casesRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
