'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Button } from '@/components/button';
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
  principlesImageSrc = '/images/principles-widget.png',
  cases = siteCases,
  className = '',
}) => {
  return (
    <section
      id="cases"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.045) 2px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 2px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }}
      className={`w-full min-h-screen bg-background text-foreground font-mono px-4 py-8 sm:px-6 md:px-8 border-b border-border select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = backHref;
                }}
                className="h-9 px-4 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-none border-lime-light text-lime-light hover:bg-hatch-dark"
              >
                &lt;&lt; BACK
              </Button>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
              {title}
            </h1>
          </div>

          <div className="relative w-full max-w-[320px] sm:max-w-105 shrink-0 overflow-hidden">
            <Image
              src={principlesImageSrc}
              alt="Clarity over assumptions principles"
              width={420}
              height={140}
              unoptimized
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