import React from 'react';
import type { CaseCardProps } from '@/components/case-card';

export const spekaCase: CaseCardProps = {
  slug: 'speka',
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
      href: '/cases/speka',
      variant: 'lime-light',
    },
    {
      id: 'try',
      label: 'TRY OUT',
      href: 'https://speka.example.com',
      variant: 'default',
    },
  ],

  // Детальная страница
  fullTitle: 'A CLIENT-FACING SPECIFICATION EDITOR DESIGNED AROUND PROGRESS TRANSPARENCY.',
  subtitle:
    'A client-facing specification editor designed around progress transparency and predictable delivery signal.',
  meta: {
    role: 'FULL-STACK DEVELOPER',
    duration: '3 MONTHS',
    status: 'PRODUCTION',
    stack: 'REACT / NEXT.JS / NESTJS / POSTGRESQL',
  },
  problem:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  previewCaption: 'FIGMA/DEV-001 // Speka Interactive workspace matrix',
  solution:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  results:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};

export const bimarCase: CaseCardProps = {
  slug: 'bimar-system',
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
      href: '/cases/bimar-system',
      variant: 'lime-light',
    },
  ],

  // Детальная страница
  fullTitle:
    'CONSTRUCTION DATA, 3D CONFIGURATION, AND PRODUCTION VISIBILITY UNIFIED IN ONE BROWSER PLATFORM.',
  subtitle:
    'The product had to keep commercial, context, and production execution data aligned while providing real-time 3D visibility of customized product data and model versions.',
  meta: {
    role: 'FULL-STACK DEVELOPER',
    duration: '4 MONTHS',
    status: 'PRODUCTION',
    stack: 'REACT / ASP.NET / POSTGRESQL / THREE.JS',
  },
  problem:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  previewCaption: 'FIGMA/DEV-001 // System Interactive backend operation matrix',
  solution:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  results:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};

export const cases: CaseCardProps[] = [spekaCase, bimarCase];