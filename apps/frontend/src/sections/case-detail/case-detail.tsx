'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { CaseCard, CaseCardProps } from '@/components/case-card';
import { CaseMetaGrid } from '@/components/case-meta-grid';

export interface CaseMeta {
  role: string;
  duration: string;
  status: string;
  stack: string;
}

export interface CaseDetailProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  principlesImageSrc?: string | StaticImageData;
  meta?: CaseMeta;
  problem?: string;
  previewImageSrc?: string | StaticImageData;
  previewCaption?: string;
  solution?: string;
  results?: string;
  otherCases?: CaseCardProps[];
  className?: string;
}

const defaultMeta: CaseMeta = {
  role: 'FULL-STACK DEVELOPER',
  duration: '4 MONTHS',
  status: 'PRODUCTION',
  stack: 'REACT / ASP.NET / POSTGRESQL / THREE.JS',
};

const defaultOtherCases: CaseCardProps[] = [
  {
    title: 'SPEKA',
    role: 'FULLSTACK',
    description:
      'A client-facing specification editor designed around progress transparency and predictable delivery signal',
    logo: '/images/project-speka.webp',
    actions: [
      { id: 'view', label: 'VIEW CASE', href: '/cases/speka', emphasis: 'primary' },
      { id: 'try', label: 'TRY OUT', href: 'https://speka.example.com', emphasis: 'secondary' },
    ],
  },
  {
    title: 'BIMAR SYSTEM',
    role: 'FRONTEND // BACKEND',
    description:
      'Construction workflows, product data, and 3D configuration logic in one browser platform',
    logo: '/images/project-bimar.webp',
    actions: [
      { id: 'view', label: 'VIEW CASE', href: '/cases/bimar-system', emphasis: 'primary' },
    ],
  },
];

export const CaseDetailSection: React.FC<CaseDetailProps> = ({
  title = 'CONSTRUCTION DATA, 3D CONFIGURATION, AND PRODUCTION VISIBILITY UNIFIED IN ONE BROWSER PLATFORM.',
  subtitle = 'The product had to keep commercial, context, and production execution data aligned while providing real-time 3D visibility of customized product data and model versions.',
  backHref = '/cases',
  principlesImageSrc = '/images/principles-widget-small.webp',
  meta = defaultMeta,
  problem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  previewImageSrc,
  previewCaption = 'FIGMA/DEV-001 // System Interactive backend operation matrix',
  solution = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  results = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  otherCases = defaultOtherCases,
  className = '',
}) => {
  const router = useRouter();
  return (
    <div
      className={`w-full min-h-screen bg-background text-foreground font-mono py-6 sm:py-8 select-none flex flex-col ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 sm:gap-16 lg:gap-20">
        {/* 1. Header & Title */}
        <div id='case' className="flex flex-col gap-4 sm:gap-6 border-border border-b pb-6 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  router.push(backHref);
                }}
                className="h-10 sm:h-14 md:h-16 px-4 text-xs sm:text-base md:text-lg font-bold tracking-wider uppercase rounded-none"
              >
                &lt;&lt; BACK
              </Button>
            </div>

            <div className="relative w-full max-w-65 sm:max-w-[320px] md:max-w-105 shrink-0 overflow-hidden self-start sm:self-auto hidden lg:block">
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

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-lime-light max-w-5xl leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-lime-light/80 max-w-4xl leading-relaxed w-full lg:w-[60%]">
            {subtitle}
          </p>

          <div className="pt-2">
            <Button
              variant="default"
              className="h-12 sm:h-14 md:h-16 px-4 sm:px-6 text-xs sm:text-base md:text-xl font-bold uppercase rounded-none tracking-wider w-full sm:w-auto"
              onClick={() => {
                const contactEl = document.getElementById('contact');
                contactEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              DISCUSS A SIMILAR PROJECT
            </Button>
          </div>
        </div>

        {/* 2. ABOUT (Мета-параметры) */}
        <CaseMetaGrid meta={meta} />

        {/* 3. PROBLEM */}
        <section id='problem' className="flex flex-col gap-3 border-border border-b border-t py-6 px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-lime-light uppercase">
            PROBLEM.
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-lime-light leading-relaxed max-w-5xl">
            {problem}
          </p>
        </section>

        {/* 4. Зеленый визуальный блок превью / Схема */}
        <div className="w-full border-y sm:border border-border bg-green-dark p-3 sm:p-6 md:p-8 flex flex-col gap-2">
          <div className="relative w-full aspect-video bg-dark-green border border-lime/60 flex items-center justify-center overflow-hidden">
            {previewImageSrc ? (
              <Image
                src={previewImageSrc}
                alt="Case Preview"
                fill
                className="object-contain"
              />
            ) : (
              <div
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(154, 208, 0, 0.25) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(154, 208, 0, 0.25) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
                className="w-full h-full flex items-center justify-center p-4 text-center"
              >
                <span className="text-lime text-[11px] sm:text-xs md:text-sm uppercase tracking-widest bg-background/80 px-3 py-1.5 border border-lime/40">
                  Interactive Platform Workspace Preview
                </span>
              </div>
            )}
          </div>
          <span className="text-center text-[11px] sm:text-xs md:text-sm text-lime-light uppercase tracking-wider py-1 break-words">
            * {previewCaption} *
          </span>
        </div>

        {/* 5. SOLUTION */}
        <section id='solution' className="flex flex-col gap-3 border-border border-b border-t py-6 px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-lime-light uppercase">
            SOLUTION.
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-lime-light leading-relaxed max-w-5xl">
            {solution}
          </p>
        </section>

        {/* 6. RESULTS */}
        <section id='results' className="flex flex-col gap-3 border-border border-b border-t py-6 px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-lime-light uppercase">
            RESULTS.
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-lime-light leading-relaxed max-w-5xl">
            {results}
          </p>
        </section>

        {/* 7. OTHER CASES */}
        <section id='other-cases' className="flex flex-col gap-6 pt-4 border-border border-b border-t py-6 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-lime-light uppercase">
              OTHER CASES
            </h2>
            <Button
              variant="lime-light"
              onClick={() => {
                router.push('/cases');
              }}
              className="h-10 sm:h-14 md:h-16 px-4 text-xs sm:text-base md:text-lg font-bold uppercase rounded-none w-full sm:w-auto"
            >
              VIEW ALL CASES
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            {otherCases.map((card, idx) => (
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
        </section>
      </div>
    </div>
  );
};