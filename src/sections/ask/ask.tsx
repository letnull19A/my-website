'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';

export interface AskSectionProps {
  title?: string;
  description?: string;
  placeholder?: string;
  suggestions?: string[];
  onSubmit?: (query: string) => void;
  className?: string;
}

const defaultSuggestions = [
  'Which projects required both frontend and backend ownership? >>',
  'How do clients see risk before delivery slips? >>',
];

export const AskSection: React.FC<AskSectionProps> = ({
  title = 'ASK ABOUT MY WORK.',
  description = 'Ask about product fit, engineering decisions, or the stack behind a specific case — personal AI got you covered.',
  placeholder = 'What would you like to know?',
  suggestions = defaultSuggestions,
  onSubmit,
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    if (onSubmit) onSubmit(query.trim());
  };

  const handleSuggestionClick = (text: string) => {
    const cleanText = text.replace(/\s*>>$/, '');
    setQuery(cleanText);
    if (onSubmit) onSubmit(cleanText);
  };

  return (
    <section
      id="ask"
      className='mt-20 border border-y'
    >
    <div className={`w-full bg-[#033604] border-y text-lime font-mono px-4 py-8 sm:px-6 md:px-8 select-none ${className}`}>
        <div className="mx-auto flex flex-col gap-6 ">
        {/* Шапка: Заголовок слева + Ретро-бейдж COMMAND INPUT справа */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
              {title}
            </h2>
            <p className="w-[80%] leading-5 mt-2 text-lg text-lime-light  max-w-xl">
              {description}
            </p>
          </div>

          {/* Правый ретро-виджет COMMAND INPUT */}
          <div className="hidden sm:flex flex-col gap-1.5 p-2 border border-lime self-start shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 border border-lime text-base tracking-wider font-bold uppercase text-lime">
                COMMAND INPUT
              </div>
              <div className="px-2 py-0.5 border border-lime text-base font-bold text-lime">
                &gt;&gt;
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 border border-lime text-base font-bold text-lime">
                &gt;&gt;
              </div>
              <div className="px-2 py-0.5 border border-lime text-base tracking-wider font-bold uppercase text-lime">
                COMMAND INPUT
              </div>
            </div>
          </div>
        </div>

        {/* Форма ввода с кнопкой */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full h-11 sm:h-12 bg-transparent border border-lime-soft px-4 text-xs sm:text-sm text-lime placeholder:text-lime/40 outline-none focus:border-lime focus:ring-1 focus:ring-lime tracking-wide"
            />
          </div>

          <Button
            type="submit"
            variant="lime-light"
            className="h-11 sm:h-12 px-6 sm:px-8 text-lg sm:text-xl font-bold uppercase tracking-wider rounded-none shrink-0"
          >
            FIND AN ANSWER
          </Button>
        </form>

        {/* Список быстрых подсказок (Suggestions) */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 text-base sm:text-lg md:text-xl text-lime">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="text-left bg-transparent border-none p-0 cursor-pointer text-lime/80 hover:text-lime hover:underline tracking-wide transition-colors font-mono"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
    </section>
  );
};