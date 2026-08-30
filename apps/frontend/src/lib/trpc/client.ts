import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@my-website/api';

function getTrpcUrl() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const base = raw || 'http://localhost:4000';
  return `${base.replace(/\/$/, '')}/api/v1/trpc`;
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
      transformer: superjson,
    }),
  ],
});

export function getTrpcUrlForDebug() {
  return getTrpcUrl();
}
