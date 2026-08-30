'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArticleCard, ArticleCardProps } from '@/components/article-card';
import { buttonVariants } from '@/components/button';
import { cn, vibrateOnTap } from '@/lib/utils';
import { articles as fallbackArticles } from '@/config/articles';
import { trpcClient } from '@/lib/trpc/client';
import type { Article } from '@my-website/schemas';

function mapArticleToCard(a: Article): ArticleCardProps {
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
    linkedinHref: a.linkedinHref ?? undefined,
    telegramHref: a.telegramHref ?? undefined,
    readHref: `/articles/${a.slug}`,
  };
}

export interface ArticlesSectionProps {
  title?: string;
  readMoreHref?: string;
  articles?: ArticleCardProps[];
  className?: string;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  title = 'ARTICLES.',
  readMoreHref = '/articles',
  articles: propArticles,
  className = '',
}) => {
  const { data } = useQuery({
    queryKey: ['trpc', 'articles', 'list'],
    queryFn: () => trpcClient.articles.list.query(),
    staleTime: 30_000,
  });

  const articles =
    propArticles ??
    (data?.items ? data.items.map(mapArticleToCard) : fallbackArticles);

  return (
    <section
      id="articles"
      className={`w-full bg-background text-foreground font-mono mt-20 px-4 py-8 sm:px-6 md:px-8 border-b border-t border-border select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-6">
        {/* Шапка: Заголовок + Кнопка READ MORE (кнопка только на десктопе) */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
            {title}
          </h2>

          <Link
            href={readMoreHref}
            onClick={vibrateOnTap}
            className={cn(
              buttonVariants({ variant: 'lime-light' }),
              'hidden md:inline-flex h-15 sm:h-16 px-4 sm:px-6 text-base sm:text-lg font-bold uppercase rounded-none tracking-wider transition-transform hover:brightness-105 active:scale-[0.99]'
            )}
          >
            READ ALL ARTICLES
          </Link>
        </div>

        {/* Сетка из 3-х статей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {articles.map((article, idx) => (
            <ArticleCard
              key={`${article.slug ?? article.title}-${idx}`}
              title={article.title}
              description={article.description}
              coverImage={article.coverImage}
              linkedinHref={article.linkedinHref}
              telegramHref={article.telegramHref}
              readHref={article.readHref}
            />
          ))}
        </div>

        {/* Кнопка READ MORE на мобилке — внизу секции */}
        <Link
          href={readMoreHref}
          onClick={vibrateOnTap}
          className={cn(
            buttonVariants({ variant: 'lime-light' }),
            'md:hidden h-14 px-4 text-base font-bold uppercase rounded-none tracking-wider w-full justify-center'
          )}
        >
          READ ALL ARTICLES
        </Link>
      </div>
    </section>
  );
};
