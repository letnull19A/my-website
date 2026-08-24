'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';

export interface StackCardProps {
  number: string;
  title: string;
  illustration: React.ReactNode | string | StaticImageData;
  tags: string[];
  className?: string;
}

const isImageSource = (item: unknown): item is string | StaticImageData => {
  return typeof item === 'string' || (typeof item === 'object' && item !== null && 'src' in item);
};

export const StackCard: React.FC<StackCardProps> = ({
  number,
  title,
  illustration,
  tags,
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
      className={`relative bg-card border border-lime/40 p-4 sm:p-5 flex flex-col justify-between font-mono select-none ${className}`}
    >
      {/* Шапка карточки: Заголовок + Номер */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-lime-soft uppercase">
          {title}
        </h3>
        <span className="text-xl font-bold text-lime-soft tracking-widest opacity-90">
          {number}
        </span>
      </div>

      {/* Центральный слот под 3D-кубик / схему */}
      <div className="relative w-full aspect-4/3 flex items-center justify-center my-3 overflow-hidden">
        {isImageSource(illustration) ? (
          <Image
            src={illustration}
            alt={`${title} diagram`}
            width={340}
            height={260}
            unoptimized
            loading="lazy"
            draggable={false}
            className="object-contain max-h-full max-w-full pointer-events-none"
          />
        ) : (
          (illustration as React.ReactNode)
        )}
      </div>

      {/* Список технологий (теги) */}
      <div className="mt-2 pt-3 h-27.5 overflow-hidden b-2">
        <p className="text-justify [text-align-last:justify] leading-5 text-xl font-bold tracking-wide text-lime-soft uppercase m-0">
          {tags.join(' ')}
        </p>
      </div>
    </article>
  );
};