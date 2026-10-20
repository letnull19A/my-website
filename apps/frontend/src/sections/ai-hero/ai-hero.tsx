'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface AiHeroSectionProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  suggestions?: string[];
  disclaimer?: string;
  submitIconSrc?: string;
  glowBgSrc?: string;
  className?: string;
}

const defaultSuggestions = [
  'Which projects required both frontend and backend ownership? >>',
  'How do clients see risk before delivery slips? >>',
];

const LEAVE_MS = 320;

export const AiHeroSection: React.FC<AiHeroSectionProps> = ({
  title = 'AI ASSISTANT',
  subtitle = 'Ask about product fit, engineering decisions, or the stack behind a specific case – personal AI got you covered.',
  placeholder = 'What would you like to know?',
  suggestions = defaultSuggestions,
  disclaimer = 'AI can make mistakes. Please verify important information. Not an offer or legally binding agreement.',
  submitIconSrc = '/icons/enter_question.svg',
  glowBgSrc = '/bg_bright.webp',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [leaving, setLeaving] = useState(false);
  const leaveTimer = useRef<number | null>(null);
  const router = useRouter();

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    },
    []
  );

  const goToChat = (q: string) => {
    const clean = q.trim();
    if (!clean || leaving) return;
    // Плавный переход: гасим hero, затем уходим на страницу чата
    setLeaving(true);
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null;
      router.push(`/chat?q=${encodeURIComponent(clean)}`);
    }, LEAVE_MS);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    goToChat(query);
  };

  return (
    <section
      className={`relative bg-background text-foreground font-mono select-none flex flex-col min-h-[calc(100svh-74px)] ${className}`}
    >
      {/* Фон: faint grid + lime glow */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(154, 208, 0, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(154, 208, 0, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
          }}
        />
        <Image
          src={glowBgSrc}
          alt=""
          width={1295}
          height={1007}
          priority
          draggable={false}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] sm:w-[110%] max-w-none h-auto opacity-80"
        />
      </div>

      <div
        className={`relative z-10 mx-auto w-full max-w-3xl px-6 py-14 max-sm:py-6 flex-1 flex flex-col items-center justify-center text-center transition-opacity duration-300 ${
          leaving ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="w-full flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-lime-light leading-none">
            {title}
          </h1>
          <p className="mt-4 text-sm sm:text-2xl leading-none text-lime-light max-w-152">
            {subtitle}
          </p>
        </div>

        {/* Строка ввода */}
        <form onSubmit={handleSubmit} className="mt-8 w-full max-sm:order-3 max-sm:mt-2">
          <div className="relative">
            <label className="sr-only" htmlFor="ai-hero-query">
              {placeholder}
            </label>
            <input
              type="text"
              id="ai-hero-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full h-11 sm:h-13 bg-black border border-neutral-600 pl-4 pr-14 text-sm sm:text-lg text-lime-light placeholder:text-neutral-600 outline-none focus:border-lime focus:ring-1 focus:ring-lime tracking-wide"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <button
                type="submit"
                aria-label="Ask"
                title="Ask"
                className="p-1 bg-transparent border-none cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <Image
                  src={submitIconSrc}
                  alt=""
                  aria-hidden
                  width={48}
                  height={48}
                  draggable={false}
                  className="block w-6 h-6 pointer-events-none"
                />
              </button>
            </div>
          </div>
        </form>

        {/* Подсказки */}
        {suggestions.length > 0 && (
          <div className="mt-5 max-sm:mt-0 max-sm:order-2 w-full flex flex-col gap-2 text-left text-xs sm:text-base text-lime">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToChat(item.replace(/\s*>>$/, ''))}
                className="text-left bg-transparent border-none p-0 cursor-pointer text-lime hover:text-lime-light hover:underline tracking-wide transition-colors font-mono"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Дисклеймер */}
      <p className="relative z-10 shrink-0 border-t border-border bg-black px-6 py-2 text-center text-[10px] leading-snug text-neutral-600">
        {disclaimer}
      </p>
    </section>
  );
};
