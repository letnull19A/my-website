'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Button } from '@/components/button';

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
      <div className="relative w-full aspect-16/10 border border-lime-light bg-card flex items-center justify-center overflow-hidden">
        {coverImage ? (
          isImageSource(coverImage) ? (
            <Image
              src={coverImage}
              alt={title}
              width={400}
              height={250}
              unoptimized
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
          <h3 className="text-lg sm:xl font-bold text-lime-light uppercase tracking-tight leading-snug">
            {title}
          </h3>
          <p className="mt-2 leading-5 text-lg sm:text-xl text-lime-light min-h-13.5">
            {description}
          </p>
        </div>

        {/* Кнопки с масочными иконками */}
        <div className="mt-5 hidden lg:grid grid-cols-[1fr_1fr_1.2fr] gap-1.5 sm:gap-2 ">
          {/* Linkedin */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(linkedinHref, '_blank')}
            className="group h-12 px-2 text-lg font-bold rounded-none border-lime text-lime flex items-center justify-center gap-1.5"
          >
            <span
              style={{
                mask: `url(${linkedinIconSrc}) no-repeat center / contain`,
                WebkitMask: `url(${linkedinIconSrc}) no-repeat center / contain`,
              }}
              className="w-4 h-4 mr-2 shrink-0 bg-lime transition-colors pointer-events-none"
              aria-hidden="true"
            />
            <span className="truncate">linkedin</span>
          </Button>

          {/* Telegram */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(telegramHref, '_blank')}
            className="group h-12 px-2 text-lg font-bold rounded-none border-lime text-lime flex items-center justify-center gap-1.5"
          >
            <span
              style={{
                mask: `url(${telegramIconSrc}) no-repeat center / contain`,
                WebkitMask: `url(${telegramIconSrc}) no-repeat center / contain`,
              }}
              className="w-4 h-4 mr-2 shrink-0 bg-lime transition-colors pointer-events-none"
              aria-hidden="true"
            />
            <span className="truncate">telegram</span>
          </Button>

          {/* Read here */}
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              window.location.href = readHref;
            }}
            className="h-12 px-2 text-lg font-bold uppercase rounded-none truncate text-background"
          >
            Read here
          </Button>
        </div>
      </div>
    </article>
  );
};