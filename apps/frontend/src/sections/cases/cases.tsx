'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CaseCard, CaseCardProps } from '@/components/case-card';
import { buttonVariants } from '@/components/button';
import { cn, vibrateOnTap } from '@/lib/utils';
import { cases as fallbackCases } from '@/config/cases';
import { trpcClient } from '@/lib/trpc/client';
import type { Case } from '@my-website/schemas';

function mapCaseToCard(c: Case): CaseCardProps {
  return {
    slug: c.slug,
    title: c.title,
    role: c.role,
    description: c.description,
    fullTitle: c.fullTitle,
    subtitle: c.subtitle,
    logo: c.logo,
    actions: c.actions,
    meta: c.meta,
    problem: c.problem,
    solution: c.solution,
    results: c.results,
    previewImageSrc: c.previewImageSrc ?? undefined,
    previewCaption: c.previewCaption ?? undefined,
  };
}

export interface CasesSectionProps {
  title?: string;
  viewAllHref?: string;
  cases?: CaseCardProps[];
  className?: string;
}

export const CasesSection: React.FC<CasesSectionProps> = ({
  title = 'SELECTED WORK.',
  viewAllHref = '/cases',
  cases: propCases,
  className = '',
}) => {
  const { data } = useQuery({
    queryKey: ['trpc', 'cases', 'list'],
    queryFn: () => trpcClient.cases.list.query(),
    staleTime: 30_000,
  });

  const cases = propCases ?? (data?.items ? data.items.map(mapCaseToCard) : fallbackCases);

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {cases.map((card) => (
            <CaseCard key={card.slug ?? card.title} {...card} />
          ))}
        </div>

        {/* Кнопка VIEW ALL на мобилке — внизу секции */}
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
      </div>
    </section>
  );
};
