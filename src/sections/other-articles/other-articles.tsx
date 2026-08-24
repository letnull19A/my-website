'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { buttonVariants } from '@/components/button';
import { cn, vibrateOnTap } from '@/lib/utils';
import { ArticleCard, ArticleCardProps } from '@/components/article-card';
import { articles as siteArticles } from '@/config/articles';

export interface OtherArticlesProps {
  title?: string;
  backHref?: string;
  principlesImageSrc?: string | StaticImageData;
  articles?: ArticleCardProps[];
  className?: string;
}

export const OtherArticles: React.FC<OtherArticlesProps> = ({
  title = 'ALL ARTICLES.',
  backHref = '/',
  principlesImageSrc = '/images/principles-widget.webp',
  articles = siteArticles,
  className = '',
}) => {
  return (
    <section
      id="articles"
      className={`w-full bg-background text-foreground font-mono px-4 py-8 sm:px-6 md:px-8 border-b border-border select-none ${className}`}
    >
      <div className="w-full mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <a
                href={backHref}
                onPointerDown={vibrateOnTap}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-9 px-4 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-none'
                )}
              >
                &lt;&lt; BACK
              </a>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
              {title}
            </h1>
          </div>

          <div className="relative w-full max-w-[320px] sm:max-w-105 shrink-0 overflow-hidden hidden sm:block">
            <Image
              src={principlesImageSrc}
              alt="Clarity over assumptions principles"
              width={420}
              height={140}
              draggable={false}
              className="w-full h-auto object-contain pointer-events-none block"
            />
          </div>
        </div>

        {/* Сетка: 1 колонка на мобилках, 2 в ряд на десктопе */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {articles.map((article, idx) => (
            <ArticleCard
              key={`${article.title}-${idx}`}
              title={article.title}
              description={article.description}
              coverImage={article.coverImage}
              linkedinHref={article.linkedinHref}
              telegramHref={article.telegramHref}
              readHref={article.readHref}
              linkedinIconSrc={article.linkedinIconSrc}
              telegramIconSrc={article.telegramIconSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};