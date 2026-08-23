'use client';

import React from 'react';
import { CaseCard, CaseCardProps } from '@/components/case-card';
import { Button } from '@/components/button';

export interface CasesSectionProps {
  title?: string;
  viewAllHref?: string;
  cases?: CaseCardProps[];
  className?: string;
}

const defaultCases: CaseCardProps[] = [
  {
    title: 'SPEKA',
    role: 'FULLSTACK',
    description:
      'A client-facing specification editor designed around progress transparency and predictable delivery signal',
    logo: (
      <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-lime-light select-text">
        SPEKA
      </span>
    ),
    actions: [
      {
        id: 'view',
        label: 'VIEW CASE',
        href: '#case-speka',
        variant: 'lime-light',
      },
      {
        id: 'try',
        label: 'TRY OUT',
        href: 'https://speka.example.com',
        variant: 'default',
      },
    ],
  },
  {
    title: 'BIMAR SYSTEM',
    role: 'FRONTEND // BACKEND',
    description:
      'Construction workflows, product data, and 3D configuration logic in one browser platform',
    logo: (
      <div className="flex items-center gap-3">
        <svg
          width="100"
          height="100"
          viewBox="0 0 48 48"
          fill="none"
          stroke="var(--lime)"
          strokeWidth="1.25"
          className="shrink-0"
        >
          <path d="M24 4L42 14.5V33.5L24 44L6 33.5V14.5L24 4Z" />
          <path d="M24 4V44" />
          <path d="M6 14.5L42 33.5" />
          <path d="M42 14.5L6 33.5" />
        </svg>
        <span className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide uppercase select-text text-lime-light">
          BIMAR SYSTEM
        </span>
      </div>
    ),
    actions: [
      {
        id: 'view',
        label: 'VIEW CASE',
        href: '#case-bimar',
        variant: 'lime-light',
      },
    ],
  },
];

export const CasesSection: React.FC<CasesSectionProps> = ({
  title = 'SELECTED WORK.',
  viewAllHref = '/cases',
  cases = defaultCases,
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