'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Button } from '@/components/button';
import { MarkdownRenderer } from '@/components/markdown-renderer';

export interface ArticleDetailProps {
  title: string;
  subtitle?: string;
  date?: string;
  readTime?: string;
  category?: string;
  backHref?: string;
  principlesImageSrc?: string | StaticImageData;
  content: string;
  className?: string;
}

export const ArticleDetailSection: React.FC<ArticleDetailProps> = ({
  title,
  subtitle,
  date = '2026-08',
  readTime = '5 MIN READ',
  category = 'ARCHITECTURE // DEV',
  backHref = '/articles',
  principlesImageSrc = '/images/principles-widget-small.png',
  content,
  className = '',
}) => {
  return (
    <div

      className={`w-full min-h-screen bg-background text-foreground font-mono py-6 sm:py-8 select-none flex flex-col ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 sm:gap-14">
        {/* 1. Header статьи */}
        <div className="flex flex-col gap-4 sm:gap-6 border-border border-b pb-6 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = backHref;
                }}
                className="h-10 sm:h-14 md:h-16 px-4 text-xs sm:text-base md:text-lg font-bold tracking-wider uppercase rounded-none border-lime-light text-lime-light hover:bg-hatch-dark"
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

          {/* Мета-информация статьи */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-lime uppercase tracking-widest pt-2">
            <span>{date}</span>
            <span>//</span>
            <span>{readTime}</span>
            <span>//</span>
            <span>{category}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-lime-light max-w-5xl leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-lime-light/80 max-w-4xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* 2. Рендер тела статьи */}
        <article className="px-4 sm:px-6 md:px-8 max-w-4xl">
          <MarkdownRenderer content={content} />
        </article>
      </div>
    </div>
  );
};