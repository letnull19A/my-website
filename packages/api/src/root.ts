import { router } from './trpc';
import { articlesRouter } from './routers/articles';
import { casesRouter } from './routers/cases';
import { contactRouter } from './routers/contact';
import { askRouter } from './routers/ask';
import { healthRouter } from './routers/health';

export const appRouter = router({
  articles: articlesRouter,
  cases: casesRouter,
  contact: contactRouter,
  ask: askRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
