'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { StackCard, StackCardProps } from '@/components/stack-card';
import { useInView } from '@/hooks/use-in-view';

const IsometricCubeStack = dynamic(
  () => import('@/components/isometric').then((m) => m.IsometricCubeStack),
  { ssr: false, loading: () => null }
);
const IsometricCubeCluster = dynamic(
  () => import('@/components/isometric').then((m) => m.IsometricCubeCluster),
  { ssr: false, loading: () => null }
);
const IsometricVoxelPyramid = dynamic(
  () => import('@/components/isometric').then((m) => m.IsometricVoxelPyramid),
  { ssr: false, loading: () => null }
);

const LazyIllustration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, inView] = useInView<HTMLDivElement>(0.1);
  return (
    <div ref={ref} className="w-full h-full">
      {inView ? children : null}
    </div>
  );
};

export interface AboutStackSectionProps {
  title?: string;
  description?: string;
  principlesImageSrc?: string;
  cards?: StackCardProps[];
  className?: string;
}

const defaultCards: StackCardProps[] = [
  {
    number: '01',
    title: 'FRONTEND',
    illustration: (
      <LazyIllustration>
        <IsometricCubeStack showControls={false} />
      </LazyIllustration>
    ),
    tags: [
      'TYPESCRIPT', 'JAVASCRIPT', 'RSPACK', 'WEBPACK',
      'NODEJS', 'REACTJS', 'REDUX TOOLKIT', 'ZUSTAND',
      'SHADCN', 'PRIME REACT', 'BOOTSTRAP', 'SCSS',
      'SASS', 'TAILWIND', 'NEXTJS', 'VITE',
    ],
  },
  {
    number: '02',
    title: 'BACKEND',
    illustration: (
      <LazyIllustration>
        <IsometricCubeCluster showControls={false} />
      </LazyIllustration>
    ),
    tags: [
      'VITEST', 'NESTJS', 'POSTGRES', 'MONGODB',
      'SUPABASE', 'DRIZZLE ORM', 'TYPEORM', 'PRISMA',
      'DOCKER', 'DOCKER COMPOSE', 'TYPESCRIPT', 'JAVASCRIPT',
      'RSPACK', 'WEBPACK', 'NODEJS',
    ],
  },
  {
    number: '03',
    title: 'OTHER',
    illustration: (
      <LazyIllustration>
        <IsometricVoxelPyramid showControls={false} />
      </LazyIllustration>
    ),
    tags: [
      'CLAUDE', 'CHATGPT', 'GOOGLE', 'META',
      'LANGCHAIN', 'LANGGRAPH', 'OPENROUTER', 'RAG / CAG',
      'FIGMA', 'PHOTOSHOP', 'PENCIL',
    ],
  },
];

export const AboutStackSection: React.FC<AboutStackSectionProps> = ({
  title = 'ABOUT & STACK.',
  description = 'I am a full-stack engineer focused on products where interface clarity and system behavior have to support each other.',
  principlesImageSrc = '/images/principles-widget.webp',
  cards = defaultCards,
  className = '',
}) => {
  return (
    <section
      id="about"
      className={`w-full bg-background text-foreground font-mono mt-20 px-4 py-6 sm:px-6 md:px-8 border-b border-t border-border select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-8">
        {/* Шапка секции */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
              {title}
            </h2>
            <p className="w-[90%] mt-3 text-sm sm:text-base md:text-xl text-lime-light leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          {/* Картинка принципов в правом верхнем углу */}
          <div className="relative w-full max-w-85 sm:max-w-105 hidden lg:block shrink-0 overflow-hidden">
            <Image
              src={principlesImageSrc}
              alt="Clarity over assumptions principles"
              width={420}
              height={140}
              loading="lazy"
              draggable={false}
              className="w-full h-auto object-contain pointer-events-none block"
            />
          </div>
        </div>

        {/* Сетка из 3-х карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {cards.map((card) => (
            <StackCard
              key={card.number}
              number={card.number}
              title={card.title}
              illustration={card.illustration}
              tags={card.tags}
            />
          ))}
        </div>
      </div>
    </section>
  );
};