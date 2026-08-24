'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { buttonVariants } from '@/components/button';
import { cn, vibrateOnTap } from '@/lib/utils';
import { CaseCard, CaseCardProps } from '@/components/case-card';
import { cases as siteCases } from '@/config/cases';

export interface OtherWorkSectionProps {
  title?: string;
  backHref?: string;
  principlesImageSrc?: string | StaticImageData;
  cases?: CaseCardProps[];
  className?: string;
}

export const OtherWorkSection: React.FC<OtherWorkSectionProps> = ({
  title = 'SELECTED WORK.',
  backHref = '/',
  principlesImageSrc = '/images/principles-widget.webp',
  cases = siteCases,
  className = '',
}) => {
  return (
    <section
      id="cases"
      className={`w-full min-h-screen bg-background text-foreground font-mono px-4 py-8 sm:px-6 md:px-8 border-b border-border select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {cases.map((card, idx) => (
            <CaseCard
              key={`${card.title}-${idx}`}
              title={card.title}
              role={card.role}
              description={card.description}
              logo={card.logo}
              actions={card.actions}
            />
          ))}
        </div>
      </div>
    </section>
  );
};