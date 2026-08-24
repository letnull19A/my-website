'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/button';
import { cn, vibrateOnTap } from '@/lib/utils';

export interface ArticleCardProps {
  title: string;
  description: string;
  coverImage?: string | StaticImageData;
  linkedinHref?: string;
  telegramHref?: string;
  readHref?: string;
  linkedinIconSrc?: string;
  telegramIconSrc?: string;
  className?: string;

  // Опциональные поля для детальной страницы статьи
  slug?: string;
  subtitle?: string;
  date?: string;
  readTime?: string;
  category?: string;
  content?: string;
}

const isImageSource = (item: unknown): item is string | StaticImageData => {
  return typeof item === 'string' || (typeof item === 'object' && item !== null && 'src' in item);
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  coverImage,
  linkedinHref = '#',
  telegramHref = '#',
  readHref = '#',
  linkedinIconSrc = '/icons/linkedin.svg',
  telegramIconSrc = '/icons/telegram.svg',
  className = '',
}) => {
  const isExternalRead = /^https?:\/\//.test(readHref);

  return (
    <article
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.045) 2px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 2px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }}
      className={`relative border border-border bg-card p-4 sm:p-5 flex flex-col justify-between font-mono select-none h-full ${className}`}
    >
      {/* Превью статьи */}
      <div className="relative w-full aspect-16/8 sm:aspect-16/7.5 border border-lime-light bg-card flex items-center justify-center overflow-hidden">
        {coverImage ? (
          isImageSource(coverImage) ? (
            <Image
              src={coverImage}
              alt={title}
              width={400}
              height={250}
              draggable={false}
              className="object-cover w-full h-full pointer-events-none"
            />
          ) : (
            (coverImage as React.ReactNode)
          )
        ) : (
          <div className="w-full h-full bg-background/30" />
        )}
      </div>

      {/* Контент */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-lime-light uppercase tracking-tight leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-lime-light/80 leading-relaxed min-h-12">
            {description}
          </p>
        </div>

        {/* Кнопки действий: адаптивная сетка (1 колонка на мобилках, 3 на десктопе) */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Linkedin */}
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={vibrateOnTap}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'h-11 sm:h-12 px-2 text-xs sm:text-sm md:text-base font-bold rounded-none flex items-center justify-center gap-1.5'
            )}
          >
            <span
              style={{
                mask: `url(${linkedinIconSrc}) no-repeat center / contain`,
                WebkitMask: `url(${linkedinIconSrc}) no-repeat center / contain`,
              }}
              className="w-4 h-4 mr-1 shrink-0 bg-lime transition-colors pointer-events-none"
              aria-hidden="true"
            />
            <span className="truncate">linkedin</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={vibrateOnTap}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'h-11 sm:h-12 px-2 text-xs sm:text-sm md:text-base font-bold rounded-none flex items-center justify-center gap-1.5'
            )}
          >
            <span
              style={{
                mask: `url(${telegramIconSrc}) no-repeat center / contain`,
                WebkitMask: `url(${telegramIconSrc}) no-repeat center / contain`,
              }}
              className="w-4 h-4 mr-1 shrink-0 bg-lime transition-colors pointer-events-none"
              aria-hidden="true"
            />
            <span className="truncate">telegram</span>
          </a>

          {/* Read here */}
          {isExternalRead ? (
            <a
              href={readHref}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={vibrateOnTap}
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'h-11 sm:h-12 px-2 text-xs sm:text-sm md:text-base font-bold uppercase rounded-none truncate flex items-center justify-center'
              )}
            >
              Read here
            </a>
          ) : (
            <Link
              href={readHref}
              onPointerDown={vibrateOnTap}
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'h-11 sm:h-12 px-2 text-xs sm:text-sm md:text-base font-bold uppercase rounded-none truncate flex items-center justify-center'
              )}
            >
              Read here
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};