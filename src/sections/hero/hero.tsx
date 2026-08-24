'use client';

import React, { useState, useMemo } from 'react';
import { FloatingCard } from '@/components/floating-card';
import { DesktopIcon } from '@/components/desctop-icon';
import { buttonVariants } from '@/components/button';
import { cn } from '@/lib/utils';
import { TerminalTaskbar } from '@/components/terminal-taskbar';
import { socialLinks } from '@/config/social';

export interface ActionItem {
  id: string;
  label: string;
  url: string;
  variant: 'default' | 'lime-light';
}

export interface HeroSectionProps {
  cvUrl?: string;
  contactUrl?: string;
  headerHeight?: string;
}

const taskbarLabelSuffix: Record<string, string> = {
  github: '.html',
  linkedin: '.html',
  telegram: '.exe',
  whatsapp: '.exe',
  email: '.exe',
};

const taskbarLinks = socialLinks.map((link) => ({
  ...link,
  label: `${link.label}${taskbarLabelSuffix[link.id] ?? ''}`,
}));

export const HeroSection: React.FC<HeroSectionProps> = ({
  cvUrl = '#cv',
  contactUrl = '#contact',
  headerHeight = '73px',
}) => {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({
    philosophy: true,
    developer: true,
  });

  const actions: ActionItem[] = useMemo(
    () => [
      {
        id: 'cv',
        label: 'DOWNLOAD CV',
        url: cvUrl,
        variant: 'default',
      },
      {
        id: 'contact',
        label: "LET'S WORK TOGETHER",
        url: contactUrl,
        variant: 'lime-light',
      },
    ],
    [cvUrl, contactUrl]
  );

  const handleActionClick = (url: string) => {
    const targetId = url.startsWith('#') ? url.slice(1) : null;
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.assign(url);
    }
  };

  const handleClose = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: false }));
  };

  const handleOpen = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id='portfolio'
      style={{
        height: `calc(100dvh - ${headerHeight})`,
        minHeight: `calc(100dvh - ${headerHeight})`,
        maxHeight: `calc(100dvh - ${headerHeight})`,
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
      className="min-h-[90vh] relative w-full overflow-hidden bg-background text-foreground font-mono flex flex-col justify-between p-0 select-none mb-20"
    >
      <FloatingCard
        id="philosophy"
        imageSrc="/images/philosophy.webp"
        imageAlt="Philosophy Text Window"
        width={240}
        height={220}
        desktopPos={{ x: 5, y: 6 }}
        mobilePos={{ x: 6, y: 3 }}
        bounceDelay="0s"
        isVisible={openCards.philosophy}
        onClose={handleClose}
      />
      <FloatingCard
        id="developer"
        imageSrc="/images/developer.webp"
        imageAlt="Developer Photo Window"
        width={260}
        height={260}
        desktopPos={{ x: 75, y: 32 }}
        mobilePos={{ x: 100, y: 46 }}
        alignRightOnMobile={true}
        bounceDelay="-2.2s"
        isVisible={openCards.developer}
        onClose={handleClose}
      />

      <div className="z-20 flex-1 flex flex-col items-center justify-center my-auto px-2 text-center w-full max-w-4xl mx-auto pointer-events-none">
        <h1 className="w-[90%] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-lime-light leading-[0.98] select-text text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          I BUILD WEB PRODUCTS WHERE TECHNICAL STATE STAYS VISIBLE TO BOTH OPERATORS AND DECISION-MAKERS.
        </h1>
      </div>

      <div className="z-20 w-full flex flex-col items-center">
        <div className="hidden lg:flex flex-col gap-2 absolute left-6 bottom-24">
          <DesktopIcon
            label="DEVELOPER.JPEG"
            img="/icons/developer.webp"
            onClick={() => handleOpen('developer')}
          />
          <DesktopIcon
            label="PHILOSOPHY.TXT"
            img="/icons/philosophy.webp"
            onClick={() => handleOpen('philosophy')}
          />
          <DesktopIcon
            label="CASES"
            img="/icons/cases.webp"
            onClick={() => {
              document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        <div className="w-full md:max-w-165 grid grid-cols-2 mx-auto md:mb-8 shadow-[0_0_24px_rgba(0,0,0,0.8)]">
          {actions.map((action, idx) => (
            <a
              key={action.id}
              href={action.url}
              onClick={(e) => {
                e.preventDefault();
                handleActionClick(action.url);
              }}
              className={cn(
                buttonVariants({ variant: action.variant }),
                'h-22 lg:h-26 w-full px-3 md:px-6 text-sm md:text-lg font-bold uppercase tracking-wider rounded-none transition-transform hover:brightness-105 active:scale-[0.99]',
                idx === 0 ? 'border-r border-background/20' : ''
              )}
            >
              {action.label}
            </a>
          ))}
        </div>

        <TerminalTaskbar links={taskbarLinks} />
      </div>
    </section>
  );
};
