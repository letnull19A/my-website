'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/button';
import { cn, vibrateOnTap } from '@/lib/utils';

export interface CaseAction {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'lime-light' | 'outline' | 'secondary' | 'ghost';
}

export interface CaseMeta {
  role: string;
  duration: string;
  status: string;
  stack: string;
}

export interface CaseCardProps {
  title: string;
  role: string;
  description: string;
  logo: React.ReactNode | string | StaticImageData;
  actions: CaseAction[];
  className?: string;

  // Опциональные поля для детальной страницы
  slug?: string;
  fullTitle?: string;
  subtitle?: string;
  meta?: CaseMeta;
  problem?: string;
  previewImageSrc?: string | StaticImageData;
  previewCaption?: string;
  solution?: string;
  results?: string;
}

const isImageSrc = (logo: CaseCardProps['logo']): logo is string | StaticImageData => {
  return typeof logo === 'string' || (typeof logo === 'object' && logo !== null && 'src' in logo);
};

export const CaseCard: React.FC<CaseCardProps> = ({
  title,
  role,
  description,
  logo,
  actions,
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
      className={`relative bg-card border border-border/80 p-4 sm:p-5 flex flex-col justify-between font-mono select-none ${className}`}
    >
      {/* Контейнер с логотипом */}
      <div className="relative w-full aspect-16/8 sm:aspect-16/7.5 border border-lime-light flex items-center justify-center bg-card overflow-hidden px-4">
        {isImageSrc(logo) ? (
          <Image
            src={logo}
            alt={title}
            width={320}
            height={120}
            draggable={false}
            className="object-contain max-h-[70%] max-w-[85%] pointer-events-none"
          />
        ) : (
          (logo as React.ReactNode)
        )}
      </div>

      {/* Текстовая информация */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs sm:text-base uppercase tracking-wider block mb-2 font-bold text-lime-light">
            {role}
          </span>
          <p className="text-base sm:text-lg text-lime-light leading-relaxed min-h-11">
            {description}
          </p>
        </div>

        {/* Кнопки действий с поддержкой Next Link */}
        <div
          className={`mt-5 grid gap-0 ${
            actions.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {actions.map((act, idx) => {
            const buttonClass = cn(
              buttonVariants({
                variant: act.variant || (idx === 0 ? 'lime-light' : 'default'),
              }),
              'h-15 sm:h-16 w-full rounded-none text-lg font-bold uppercase tracking-wider transition-transform hover:brightness-105 active:scale-[0.99] flex items-center justify-center',
              actions.length > 1 && idx === 0
                ? 'border-r border-background/20'
                : ''
            );

            if (act.href) {
              const isExternal = /^https?:\/\//.test(act.href);

              if (isExternal) {
                return (
                  <a
                    key={act.id}
                    href={act.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={vibrateOnTap}
                    className={buttonClass}
                  >
                    {act.label}
                  </a>
                );
              }

              return (
                <Link
                  key={act.id}
                  href={act.href}
                  onPointerDown={vibrateOnTap}
                  className={buttonClass}
                >
                  {act.label}
                </Link>
              );
            }

            return (
              <Button
                key={act.id}
                variant={act.variant || (idx === 0 ? 'lime-light' : 'default')}
                className={buttonClass}
                onClick={act.onClick}
              >
                {act.label}
              </Button>
            );
          })}
        </div>
      </div>
    </article>
  );
};