import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import superjson from 'superjson';
import type { AppRouter } from '@my-website/api';
import { getQueryClient } from './query-client';

function getTrpcUrl() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const base = raw || 'http://localhost:4000';
  return `${base.replace(/\/$/, '')}/trpc`;
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
      transformer: superjson,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: getQueryClient,
});

export function getTrpcUrlForDebug() {
  return getTrpcUrl();
}
