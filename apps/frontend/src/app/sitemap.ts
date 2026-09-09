import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getArticlesServer, getCasesServer } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // SSR: sitemap строится в рантайме из свежих данных бэкенда
  // (server-api сам откатывается на локальные моки при ошибке).
  const [articles, cases] = await Promise.all([
    getArticlesServer(),
    getCasesServer(),
  ]);

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter((a) => Boolean(a.slug))
    .map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const caseEntries: MetadataRoute.Sitemap = cases
    .filter((c) => Boolean(c.slug))
    .map((c) => ({
      url: `${SITE_URL}/cases/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/cases`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...caseEntries,
    ...articleEntries,
  ];
}
