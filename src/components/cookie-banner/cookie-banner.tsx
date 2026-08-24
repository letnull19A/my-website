'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/button';

const COOKIE_CONSENT_KEY = 'portfolio_cookie_consent';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, []);

  // Сохраняем предыдущий фокус и переносим его в баннер при открытии
  useEffect(() => {
    if (!isVisible) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const acceptButton = panelRef.current?.querySelector<HTMLButtonElement>('[data-cookie-accept]');
    acceptButton?.focus();
    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isVisible]);

  const close = useCallback((consent: 'accepted' | 'declined') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, consent);
    setIsVisible(false);
  }, []);

  const handleAccept = () => close('accepted');
  const handleDecline = () => close('declined');

  if (!isVisible) return null;

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent banner"
      className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[320px] md:w-[340px] border border-lime bg-background/95 backdrop-blur-md shadow-2xl font-mono text-lime-light select-none animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Шапка окна */}
      <div className="flex items-center justify-between border-b border-lime px-3 py-1.5 bg-card text-xs text-lime">
        <span className="font-bold tracking-wider">COOKIES.HTML</span>
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Close cookie banner"
          className="text-lime hover:text-lime-light text-xs font-bold px-1 transition-colors cursor-pointer"
        >
          X
        </button>
      </div>

      {/* Тело сообщения */}
      <div className="p-3 sm:p-4 flex flex-col gap-3">
        <p className="text-xs sm:text-[13px] leading-relaxed text-lime-light uppercase tracking-tight">
          THIS SITE USES COOKIES TO ENSURE THAT EVERYTHING GOES SMOOTHLY AND PREDICTABLY.
        </p>

        {/* Кнопки действий */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleDecline}
            className="h-9 px-2 text-xs font-bold uppercase rounded-none border-lime text-lime hover:bg-hatch-dark cursor-pointer"
          >
            DECLINE
          </Button>

          <Button
            type="button"
            variant="default"
            data-cookie-accept
            onClick={handleAccept}
            className="h-9 px-2 text-xs font-bold uppercase rounded-none bg-lime text-background hover:bg-lime/90 cursor-pointer"
          >
            OK
          </Button>
        </div>
      </div>
    </aside>
  );
};