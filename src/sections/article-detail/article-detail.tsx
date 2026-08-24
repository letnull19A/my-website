'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { Button, buttonVariants } from '@/components/button';
import { ArticleCard, ArticleCardProps } from '@/components/article-card';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';

export interface ArticleDetailProps {
  title: string;
  subtitle?: string;
  date?: string;
  readTime?: string;
  category?: string;
  backHref?: string;
  coverImage?: string | StaticImageData;
  principlesImageSrc?: string | StaticImageData;
  content: string;
  linkedinHref?: string;
  telegramHref?: string;
  linkedinIconSrc?: string;
  telegramIconSrc?: string;
  otherArticles?: ArticleCardProps[];
  className?: string;
}

const isImageSource = (item: unknown): item is string | StaticImageData => {
  return typeof item === 'string' || (typeof item === 'object' && item !== null && 'src' in item);
};

export const ArticleDetailSection: React.FC<ArticleDetailProps> = ({
  title,
  subtitle,
  date = '2026-08',
  readTime = '4 MIN READ',
  category = 'DESIGN SYSTEM // SPEC',
  backHref = '/articles',
  coverImage,
  principlesImageSrc = '/images/principles-widget-small.png',
  content,
  linkedinHref = '#',
  telegramHref = '#',
  linkedinIconSrc = '/icons/linkedin.svg',
  telegramIconSrc = '/icons/telegram.svg',
  otherArticles = [],
  className = '',
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      className={`w-full min-h-screen bg-background text-foreground font-mono py-6 sm:py-8 select-none flex flex-col ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
        {/* 1. Header статьи */}
        <div className="flex flex-col gap-6 border-border border-b pb-8 px-4 sm:px-6 md:px-8">
          {/* Верхняя панель: Кнопка назад + Принципы */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = backHref;
                }}
                className="h-10 sm:h-12 px-4 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-none"
              >
                &lt;&lt; BACK
              </Button>
            </div>

            <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-105 shrink-0 overflow-hidden self-start sm:self-auto">
              <Image
                src={principlesImageSrc}
                alt="Principles"
                width={420}
                height={140}
                unoptimized
                draggable={false}
                className="w-full h-auto object-contain pointer-events-none block"
              />
            </div>
          </div>

          {/* Сетка заголовка и обложки: Десктоп = 2 колонки (текст + превью справа), Мобилка = текст -> превью снизу */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_440px] gap-6 lg:gap-8 items-start">
            {/* Текстовый блок */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div
                id="article"
                className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-lime uppercase tracking-widest"
              >
                <span>{date}</span>
                <span>//</span>
                <span>{readTime}</span>
                <span>//</span>
                <span>{category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-lime-light leading-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-lime-light/80 leading-relaxed max-w-3xl">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Блок превью: на десктопе справа, на мобилках снизу под текстом */}
            <div className="w-full aspect-16/10 border border-lime-light bg-card flex items-center justify-center overflow-hidden">
              {coverImage ? (
                isImageSource(coverImage) ? (
                  <Image
                    src={coverImage}
                    alt={title}
                    width={440}
                    height={275}
                    unoptimized
                    draggable={false}
                    className="object-cover w-full h-full pointer-events-none"
                  />
                ) : (
                  (coverImage as React.ReactNode)
                )
              ) : (
                <div className="w-full h-full bg-background/40 flex items-center justify-center text-lime/40 text-xs tracking-widest uppercase">
                  [ ARTICLE_COVER_SIGNAL ]
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Тело статьи */}
        <article className="w-full max-w-5xl px-4 sm:px-6 md:px-8">
          <MarkdownRenderer content={content} />
        </article>

        {/* 3. Конец статьи: Подвал с шарингом и копированием */}
        <div className="border-t border-b border-border py-6 mx-4 sm:mx-6 md:mx-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-lime">
              END OF SIGNAL
            </span>
            <span className="text-xs sm:text-sm font-bold text-lime-light uppercase">
              SHARE OR SAVE THIS KNOWLEDGE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
            {/* Linkedin */}
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'h-10 sm:h-11 px-3 text-xs font-bold rounded-none flex items-center justify-center gap-1.5 w-full sm:w-auto'
              )}
            >
              <span
                style={{
                  mask: `url(${linkedinIconSrc}) no-repeat center / contain`,
                  WebkitMask: `url(${linkedinIconSrc}) no-repeat center / contain`,
                }}
                className="w-3.5 h-3.5 bg-lime pointer-events-none shrink-0"
              />
              <span>LINKEDIN</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'h-10 sm:h-11 px-3 text-xs font-bold rounded-none flex items-center justify-center gap-1.5 w-full sm:w-auto'
              )}
            >
              <span
                style={{
                  mask: `url(${telegramIconSrc}) no-repeat center / contain`,
                  WebkitMask: `url(${telegramIconSrc}) no-repeat center / contain`,
                }}
                className="w-3.5 h-3.5 bg-lime pointer-events-none shrink-0"
              />
              <span>TELEGRAM</span>
            </a>

            {/* Copy Link */}
            <Button
              variant="default"
              onClick={handleCopyLink}
              className="h-10 sm:h-11 px-3 text-xs font-bold uppercase rounded-none flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{copiedLink ? 'COPIED' : 'COPY LINK'}</span>
            </Button>
          </div>
        </div>

        {/* 4. Блок MORE ARTICLES */}
        {otherArticles.length > 0 && (
          <section className="flex flex-col gap-6 pt-4 border-border border-b pb-8 px-4 sm:px-6 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-lime-light uppercase">
                MORE ARTICLES
              </h2>
              <Button
                variant="lime-light"
                onClick={() => {
                  window.location.href = '/articles';
                }}
                className="h-10 sm:h-12 md:h-14 px-4 text-xs sm:text-sm md:text-base font-bold uppercase rounded-none w-full sm:w-auto"
              >
                VIEW ALL ARTICLES
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              {otherArticles.map((art, idx) => (
                <ArticleCard
                  key={`${art.title}-${idx}`}
                  title={art.title}
                  description={art.description}
                  coverImage={art.coverImage}
                  readHref={art.readHref}
                  linkedinHref={art.linkedinHref}
                  telegramHref={art.telegramHref}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};