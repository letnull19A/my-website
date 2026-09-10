/**
 * Server-only слой данных для SSR.
 *
 * Импортировать только из Server Components / Route Handlers / generateMetadata.
 * Каждый запрос к бэкенду выполняется в рантайме (request time). При ошибке
 * возвращается пустой список / null — страница показывает фолбэк «данные
 * недоступны», а не подменяет реальные данные локальными моками.
 */
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@my-website/api';
import type { Article, Case } from '@my-website/schemas';
import type { ArticleCardProps } from '@/components/article-card';
import type { CaseCardProps } from '@/components/case-card';

const FETCH_TIMEOUT_MS = 5000;

/** Базовый URL бэкенда для серверного рендера (читается в рантайме). */
export function getServerApiBaseUrl(): string {
  const raw = (
    process.env.API_URL ??
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    ''
  ).trim();
  const base = raw || 'http://localhost:4000';
  return base.replace(/\/$/, '');
}

function fetchNoStore(input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, cache: 'no-store', signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

function createServerTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getServerApiBaseUrl()}/trpc`,
        transformer: superjson,
        fetch: fetchNoStore,
      }),
    ],
  });
}

export function mapArticleToCard(a: Article): ArticleCardProps {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    subtitle: a.subtitle,
    date: a.date,
    readTime: a.readTime,
    category: a.category,
    content: a.content,
    coverImage: a.coverImage ?? undefined,
    readHref: `/articles/${a.slug}`,
  };
}

export function mapCaseToCard(c: Case): CaseCardProps {
  return {
    slug: c.slug,
    title: c.title,
    role: c.role,
    description: c.description,
    fullTitle: c.fullTitle,
    subtitle: c.subtitle,
    logo: c.logo,
    actions: c.actions.map((a) => ({
      id: a.id,
      label: a.label,
      href: a.href,
      emphasis: a.emphasis ?? undefined,
    })),
    meta: c.meta,
    problem: c.problem,
    solution: c.solution,
    results: c.results,
    previewImageSrc: c.previewImageSrc ?? undefined,
    previewCaption: c.previewCaption ?? undefined,
  };
}

export async function getArticlesServer(): Promise<ArticleCardProps[]> {
  try {
    const data = await createServerTrpcClient().articles.list.query();
    return data.map(mapArticleToCard);
  } catch (error) {
    console.error('[ssr] articles.list failed:', error);
    return [];
  }
}

export async function getCasesServer(): Promise<CaseCardProps[]> {
  try {
    const data = await createServerTrpcClient().cases.list.query();
    return data.map(mapCaseToCard);
  } catch (error) {
    console.error('[ssr] cases.list failed:', error);
    return [];
  }
}

export async function getArticleBySlugServer(slug: string): Promise<ArticleCardProps | null> {
  try {
    const data = await createServerTrpcClient().articles.bySlug.query({ slug });
    return data ? mapArticleToCard(data) : null;
  } catch (error) {
    console.error(`[ssr] articles.bySlug(${slug}) failed:`, error);
    return null;
  }
}

export async function getCaseBySlugServer(slug: string): Promise<CaseCardProps | null> {
  try {
    const data = await createServerTrpcClient().cases.bySlug.query({ slug });
    return data ? mapCaseToCard(data) : null;
  } catch (error) {
    console.error(`[ssr] cases.bySlug(${slug}) failed:`, error);
    return null;
  }
}
