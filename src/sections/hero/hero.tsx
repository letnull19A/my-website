'use client';

import React, { useState, useMemo } from 'react';
import { FloatingCard } from '@/components/floating-card';
import { DesktopIcon } from '@/components/desctop-icon';
import { Button } from '@/components/button';
import { TaskbarLink, TerminalTaskbar } from '@/components/terminal-taskbar/terminal-taskbar';

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

const taskbarLinks: TaskbarLink[] = [
  { id: 'github', label: 'github.html', href: 'https://github.com', iconSrc: '/icons/github.svg' },
  { id: 'linkedin', label: 'linkedin.html', href: 'https://linkedin.com', iconSrc: '/icons/linkedin.svg' },
  { id: 'telegram', label: 'telegram.exe', href: 'https://t.me', iconSrc: '/icons/telegram.svg' },
  { id: 'whatsapp', label: 'whatsapp.exe', href: 'https://wa.me', iconSrc: '/icons/whatsapp.svg' },
  { id: 'email', label: 'email.exe', href: 'mailto:contact@example.com', iconSrc: '/icons/email.svg' },
];

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
      id='hero'
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
        imageSrc="/images/philosophy.png"
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
        imageSrc="/images/developer.png"
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
            img="/icons/developer.png"
            onClick={() => handleOpen('developer')}
          />
          <DesktopIcon
            label="PHILOSOPHY.TXT"
            img="/icons/philosophy.png"
            onClick={() => handleOpen('philosophy')}
          />
          <DesktopIcon
            label="CASES"
            img="/icons/cases.png"
            onClick={() => {
              document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        <div className="w-full md:max-w-165 grid grid-cols-2 mx-auto md:mb-8 shadow-[0_0_24px_rgba(0,0,0,0.8)]">
          {actions.map((action, idx) => (
            <Button
              key={action.id}
              variant={action.variant}
              className={`h-22 lg:h-26 w-full px-3 md:px-6 text-sm md:text-lg font-bold uppercase tracking-wider rounded-none transition-transform hover:brightness-105 active:scale-[0.99] ${
                idx === 0 ? 'border-r border-background/20' : ''
              }`}
              onClick={() => handleActionClick(action.url)}
            >
              {action.label}
            </Button>
          ))}
        </div>

        <TerminalTaskbar links={taskbarLinks} />
      </div>
    </section>
  );
};