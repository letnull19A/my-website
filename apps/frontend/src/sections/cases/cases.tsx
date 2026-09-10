'use client';

import React from 'react';
import Link from 'next/link';
import { CaseCard, CaseCardProps } from '@/components/case-card';
import { buttonVariants } from '@/components/button';
import { cn, vibrateOnTap } from '@/lib/utils';

export interface CasesSectionProps {
  title?: string;
  viewAllHref?: string;
  cases?: CaseCardProps[];
  className?: string;
}

const DataUnavailable: React.FC = () => (
  <div className="w-full border border-lime/40 bg-card p-8 flex flex-col items-center justify-center gap-4 text-center">
    <span className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-lime">
      DATA UNAVAILABLE
    </span>
    <span className="text-sm sm:text-base text-lime-light/70 max-w-md">
      Cases could not be loaded. Please try again later.
    </span>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className={cn(
        buttonVariants({ variant: 'lime-light' }),
        'h-12 px-5 text-sm font-bold uppercase rounded-none tracking-wider cursor-pointer'
      )}
    >
      TRY AGAIN
    </button>
  </div>
);

export const CasesSection: React.FC<CasesSectionProps> = ({
  title = 'SELECTED WORK.',
  viewAllHref = '/cases',
  cases = [],
  className = '',
}) => {
  return (
    <section
      id="cases"
      className={`w-full bg-background text-foreground font-mono px-4 py-8 sm:px-6 md:px-8 border-b border-t border-border select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
            {title}
          </h2>

          {cases.length > 0 && (
            <Link
              href={viewAllHref}
              onClick={vibrateOnTap}
              className={cn(
                buttonVariants({ variant: 'lime-light' }),
                'hidden md:inline-flex h-15 sm:h-16 px-4 sm:px-6 text-base sm:text-lg font-bold uppercase rounded-none tracking-wider transition-transform hover:brightness-105 active:scale-[0.99]'
              )}
            >
              VIEW ALL CASES
            </Link>
          )}
        </div>

        {cases.length === 0 ? (
          <DataUnavailable />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {cases.map((card) => (
                <CaseCard key={card.slug ?? card.title} {...card} />
              ))}
            </div>

            <Link
              href={viewAllHref}
              onClick={vibrateOnTap}
              className={cn(
                buttonVariants({ variant: 'lime-light' }),
                'md:hidden h-14 px-4 text-base font-bold uppercase rounded-none tracking-wider w-full justify-center'
              )}
            >
              VIEW ALL CASES
            </Link>
          </>
        )}
      </div>
    </section>
  );
};