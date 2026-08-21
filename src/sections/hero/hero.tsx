'use client';

import React, { useState, useEffect } from 'react';
import { FloatingCard } from '@/components/floating-card';
import { DesktopIcon } from '@/components/image-button';

export interface HeroSectionProps {
  cvUrl?: string;
  contactUrl?: string;
  headerHeight?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  cvUrl = '#cv',
  contactUrl = '#contact',
  headerHeight = '73px',
}) => {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({
    philosophy: true,
    developer: true,
  });

  const [timeStr, setTimeStr] = useState<string>('21:03:04');
  const [dateStr, setDateStr] = useState<string>('18.08.2026');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now
          .toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace(/\//g, '.')
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: false }));
  };

  const handleOpen = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
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
      className="relative w-full overflow-hidden bg-background text-foreground font-mono flex flex-col justify-between p-2 sm:p-4 md:p-8 border-b border-border select-none"
    >
      {/* 1. Верхняя карточка PHILOSOPHY.TXT */}
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

      {/* 2. Нижняя карточка DEVELOPER.JPEG (на мобилке перекрывает низ текста) */}
      <FloatingCard
        id="developer"
        imageSrc="/images/developer.png"
        imageAlt="Developer Photo Window"
        width={260}
        height={260}
        desktopPos={{ x: 75, y: 32 }}
        mobilePos={{ x: 44, y: 48 }}
        bounceDelay="-2.2s"
        isVisible={openCards.developer}
        onClose={handleClose}
      />

      {/* 3. Центральный крупный заголовок */}
      <div className="z-20 flex-1 flex flex-col items-center justify-center my-auto px-1 text-center w-full max-w-4xl mx-auto pointer-events-none">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-lime-light leading-[0.98] select-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          I BUILD WEB PRODUCTS WHERE TECHNICAL STATE STAYS VISIBLE TO BOTH OPERATORS AND DECISION-MAKERS.
        </h1>
      </div>

      {/* 4. Нижний блок: Кнопки + Таскбар */}
      <div className="z-20 w-full flex flex-col gap-2">
        {/* Десктопные иконки файлов слева */}
        <div className="hidden md:flex flex-col gap-2 absolute left-6 bottom-24">
          <DesktopIcon
            label="DEVELOPER.JPEG"
            type="image"
            onClick={() => handleOpen('developer')}
          />
          <DesktopIcon
            label="PHILOSOPHY.TXT"
            type="text"
            onClick={() => handleOpen('philosophy')}
          />
          <DesktopIcon
            label="CASES"
            type="folder"
            onClick={() => {
              const el = document.getElementById('cases');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Две горизонтальные плашки-кнопки (на мобилке строго 2 колонки) */}
        <div className="w-full max-w-[560px] grid grid-cols-2 mx-auto">
          <a
            href={cvUrl}
            className="flex items-center justify-center py-3 px-2 bg-lime text-background font-bold text-xs sm:text-sm tracking-wider uppercase transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime text-center"
          >
            DOWNLOAD CV
          </a>
          <a
            href={contactUrl}
            className="flex items-center justify-center py-3 px-2 bg-lime-light text-background font-bold text-xs sm:text-sm tracking-wider uppercase transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime text-center"
          >
            LET&apos;S WORK TOGETHER
          </a>
        </div>

        {/* Нижний терминальный таскбар */}
        <div className="w-full border border-lime text-lime text-[10px] sm:text-[11px] grid grid-cols-[auto_1fr_auto] items-stretch bg-background">
          {/* Колонка PORTFOLIO */}
          <div className="px-2 sm:px-3 py-1.5 border-r border-lime font-bold tracking-wider flex items-center justify-center text-center leading-tight">
            PORT<br />FOLIO
          </div>

          {/* Сетка ссылок 3x2 / 2x3 */}
          <div className="grid grid-cols-3 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-lime">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 sm:px-3 py-1 hover:bg-lime hover:text-background transition-colors flex items-center gap-1 truncate"
            >
              <span>🗎</span> github.html
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 sm:px-3 py-1 hover:bg-lime hover:text-background transition-colors flex items-center gap-1 truncate"
            >
              <span>🗎</span> linkedin.html
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 sm:px-3 py-1 hover:bg-lime hover:text-background transition-colors flex items-center gap-1 truncate"
            >
              <span>⚡</span> telegram.exe
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 sm:px-3 py-1 hover:bg-lime hover:text-background transition-colors flex items-center gap-1 truncate"
            >
              <span>⚡</span> whatsapp.exe
            </a>
            <a
              href="mailto:contact@example.com"
              className="px-1.5 sm:px-3 py-1 hover:bg-lime hover:text-background transition-colors flex items-center gap-1 truncate col-span-2 sm:col-span-1"
            >
              <span>✉</span> email.exe
            </a>
          </div>

          {/* Дата и время */}
          <div className="px-2 sm:px-3 py-1 border-l border-lime flex flex-col justify-center text-right font-mono text-[9px] sm:text-[10px] leading-tight shrink-0">
            <div>{timeStr}</div>
            <div className="text-lime/80">{dateStr}</div>
          </div>
        </div>
      </div>
    </section>
  );
};