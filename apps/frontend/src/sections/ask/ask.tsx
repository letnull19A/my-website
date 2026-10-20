'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';

export interface AskSectionProps {
  title?: string;
  description?: string;
  placeholder?: string;
  suggestions?: string[];
  badgeTopSrc?: string | StaticImageData;
  badgeBottomSrc?: string | StaticImageData;
  desktopBgSrc?: string | StaticImageData;
  mobileBgSrc?: string | StaticImageData;
  onSubmit?: (query: string) => void;
  className?: string;
}

const defaultSuggestions = [
  'Which projects required both frontend and backend ownership? >>',
  'How do clients see risk before delivery slips? >>',
];

export const AskSection: React.FC<AskSectionProps> = ({
  title = 'YOU CAN ASK AI ABOUT MY WORK.',
  description = 'About product fit, engineering decisions, or the stack behind a specific case – personal AI got you covered.',
  placeholder = 'What would you like to know?',
  suggestions = defaultSuggestions,
  badgeTopSrc = '/images/AiFormBadge1.svg',
  badgeBottomSrc = '/images/AiFormBadge2.svg',
  desktopBgSrc = '/images/AiFormDesktopBackground.svg',
  mobileBgSrc = '/images/AiFormMobileBackground.svg',
  onSubmit,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const runAsk = (q: string) => {
    const clean = q.trim();
    if (!clean) return;
    if (onSubmit) {
      onSubmit(clean);
      return;
    }
    router.push(`/chat?q=${encodeURIComponent(clean)}`);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runAsk(query);
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text.replace(/\s*>>$/, ''));
  };

  return (
    <section id="ask" className="mt-20 border border-y">
      <div className={`w-full bg-lime text-green-dark font-mono select-none ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
          {/* Левая колонка: заголовок + форма */}
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase leading-none">
                {title}
              </h2>
              <p className="mt-3 text-base sm:text-lg md:text-xl leading-snug max-w-xl">
                {description}
              </p>
            </div>

            {/* Форма ввода с кнопкой */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-2.5 sm:gap-3">
              <div className="relative flex-1">
                <label className="sr-only" htmlFor="ask-query">
                  {placeholder}
                </label>
                <input
                  type="text"
                  id="ask-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full h-12 bg-transparent border border-green-dark px-4 text-lg sm:text-xl text-green-dark placeholder:text-green-dark/60 outline-none focus:ring-1 focus:ring-green-dark tracking-wide"
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full sm:w-auto sm:px-8 text-xl font-bold uppercase tracking-wider rounded-none shrink-0 bg-green-dark text-lime-light hover:bg-green-mid active:bg-green-deep"
              >
                FIND AN ANSWER
              </Button>
            </form>

            {/* Список быстрых подсказок (Suggestions) */}
            {suggestions.length > 0 && (
              <div className="flex flex-col gap-2 pt-1 text-base sm:text-lg md:text-xl">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="text-left bg-transparent border-none p-0 cursor-pointer underline underline-offset-4 decoration-green-dark/50 text-green-dark hover:decoration-green-dark tracking-wide transition-colors font-mono"
                  >
                    {item}
                  </button>
                ))}
                <Link
                  href="/ai"
                  className="text-left underline underline-offset-4 decoration-green-dark/50 text-green-dark hover:decoration-green-dark tracking-wide transition-colors font-mono"
                >
                  OPEN FULL AI ASSISTANT &gt;&gt;
                </Link>
              </div>
            )}
          </div>

          {/* Правая колонка (desktop): фон + бейджи */}
          <div className="hidden lg:block relative overflow-hidden min-h-105">
            <Image
              src={desktopBgSrc}
              alt=""
              aria-hidden
              width={648}
              height={583}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
            />
            <Image
              src={badgeTopSrc}
              alt="Ready for collaboration"
              width={237}
              height={140}
              loading="lazy"
              draggable={false}
              className="absolute top-4 right-4 w-59 h-auto pointer-events-none"
            />
            <Image
              src={badgeBottomSrc}
              alt="Your AI assistant is ready — initiate contact"
              width={237}
              height={67}
              loading="lazy"
              draggable={false}
              className="absolute bottom-4 right-4 w-59 h-auto pointer-events-none"
            />
          </div>

          {/* Нижняя полоса (mobile): фон + бейдж по центру */}
          <div className="lg:hidden relative overflow-hidden">
            <Image
              src={mobileBgSrc}
              alt=""
              aria-hidden
              width={525}
              height={186}
              draggable={false}
              className="block w-full h-auto pointer-events-none"
            />
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              <Image
                src={badgeBottomSrc}
                alt="Your AI assistant is ready — initiate contact"
                width={237}
                height={67}
                loading="lazy"
                draggable={false}
                className="w-3/4 max-w-75 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
