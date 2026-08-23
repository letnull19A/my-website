'use client';

import React from 'react';
import { ArticleCard, ArticleCardProps } from '@/components/article-card';
import { Button } from '@/components/button';

export interface ArticlesSectionProps {
  title?: string;
  readMoreHref?: string;
  articles?: ArticleCardProps[];
  className?: string;
}

const defaultArticles: ArticleCardProps[] = [
  {
    title: 'NESTJS REQUEST LIFECYCLE: WHO DOES WHAT?',
    description:
      'NestJS is a structured Node.js framework where each request passes through components with different responsibilities.',
    coverImage: undefined,
    linkedinHref: 'https://linkedin.com',
    telegramHref: 'https://t.me',
    readHref: '#article-1',
  },
  {
    title: 'NESTJS REQUEST LIFECYCLE: WHO DOES WHAT?',
    description:
      'NestJS is a structured Node.js framework where each request passes through components with different responsibilities.',
    coverImage: undefined,
    linkedinHref: 'https://linkedin.com',
    telegramHref: 'https://t.me',
    readHref: '#article-2',
  },
  {
    title: 'NESTJS REQUEST LIFECYCLE: WHO DOES WHAT?',
    description:
      'NestJS is a structured Node.js framework where each request passes through components with different responsibilities.',
    coverImage: undefined,
    linkedinHref: 'https://linkedin.com',
    telegramHref: 'https://t.me',
    readHref: '#article-3',
  },
];

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  title = 'ARTICLES.',
  readMoreHref = '#articles',
  articles = defaultArticles,
  className = '',
}) => {
  return (
    <section
      id="articles"
      className={`w-full bg-background text-foreground font-mono mt-20 px-4 py-8 sm:px-6 md:px-8 border-b border-t border-border select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-6">
        {/* Шапка: Заголовок + Кнопка READ MORE */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
            {title}
          </h2>

          <Button
            variant="lime-light"
            className="h-14 sm:h-16 px-4 sm:px-6 text-lg sm:text-xl font-bold uppercase rounded-none tracking-wider"
            onClick={() => {
              window.location.href = readMoreHref;
            }}
          >
            READ MORE
          </Button>
        </div>

        {/* Сетка из 3-х статей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {articles.map((article, idx) => (
            <ArticleCard
              key={`${article.title}-${idx}`}
              title={article.title}
              description={article.description}
              coverImage={article.coverImage}
              linkedinHref={article.linkedinHref}
              telegramHref={article.telegramHref}
              readHref={article.readHref}
            />
          ))}
        </div>
      </div>
    </section>
  );
};