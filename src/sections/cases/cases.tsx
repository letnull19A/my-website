'use client';

import React from 'react';
import { CaseCard, CaseCardProps } from '@/components/case-card';
import { Button } from '@/components/button';
import { cases as siteCases } from '@/config/cases';

export interface CasesSectionProps {
  title?: string;
  viewAllHref?: string;
  cases?: CaseCardProps[];
  className?: string;
}

export const CasesSection: React.FC<CasesSectionProps> = ({
  title = 'SELECTED WORK.',
  viewAllHref = '/cases',
  cases = siteCases,
  className = '',
}) => {
  return (
    <section
      id="cases"
      className={`w-full bg-background text-foreground font-mono px-4 py-8 sm:px-6 md:px-8 border-b border-t border-border select-none ${className}`}
    >
      <div className=" mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
            {title}
          </h2>

          <Button
            variant="lime-light"
            className="h-15 sm:h-16 px-4 sm:px-6 text-base sm:text-lg font-bold uppercase rounded-none tracking-wider transition-transform hover:brightness-105 active:scale-[0.99]"
            onClick={() => {
              window.location.href = viewAllHref;
            }}
          >
            VIEW ALL CASES
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {cases.map((card) => (
            <CaseCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};