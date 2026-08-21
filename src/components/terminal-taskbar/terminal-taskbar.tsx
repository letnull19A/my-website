'use client';

import React, { useState, useEffect } from 'react';

export interface TaskbarLink {
  id: string;
  label: string;
  href: string;
  iconSrc: string; // путь к белому монохромному .svg, например '/icons/github.svg'
}

const Clock: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [timeStr, setTimeStr] = useState('21:03:04');
  const [dateStr, setDateStr] = useState('18.08.2026');

  useEffect(() => {
    const update = () => {
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

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`flex flex-col text-right font-mono ${className}`}>
      <div>{timeStr}</div>
      <div className="text-lime/80">{dateStr}</div>
    </div>
  );
};

export const TerminalTaskbar: React.FC<{ links: TaskbarLink[] }> = ({ links }) => {
  return (
    <footer className="w-full border-t sm:border border-lime text-lime font-mono select-none bg-background">
      <div className="flex lg:hidden flex-col">
        <div className="grid grid-cols-3 divide-x divide-y divide-lime border-b border-lime">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-2 py-2 hover:bg-lime hover:text-background transition-colors truncate"
            >
              <span
                style={{
                  mask: `url(${link.iconSrc}) no-repeat center / contain`,
                  WebkitMask: `url(${link.iconSrc}) no-repeat center / contain`,
                }}
                className="w-5 h-5 shrink-0 bg-lime group-hover:bg-background transition-colors pointer-events-none"
                aria-hidden="true"
              />
              <span className="truncate text-lg font-medium leading-tight">{link.label}</span>
            </a>
          ))}
          {/* Пустая ячейка для сетки 3x2 */}
          <div className="bg-transparent" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="font-bold tracking-wider text-lg leading-tight">
            PORT<br />FOLIO
          </div>
          <Clock className="text-lg leading-tight" />
        </div>
      </div>

      <div className="hidden lg:grid w-full grid-cols-[auto_1fr_auto] items-stretch">
        <div className="px-2 sm:pr-26 py-1.5 border-r border-lime font-bold tracking-wider flex items-center leading-tight text-base">
          PORT<br />FOLIO
        </div>

        <div className="grid grid-cols-5 divide-x divide-lime">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-3 py-1.5 hover:bg-lime hover:text-background transition-colors flex items-center gap-2 truncate"
            >
              <span
                style={{
                  mask: `url(${link.iconSrc}) no-repeat center / contain`,
                  WebkitMask: `url(${link.iconSrc}) no-repeat center / contain`,
                }}
                className="w-5 h-5 shrink-0 bg-lime group-hover:bg-background transition-colors pointer-events-none"
                aria-hidden="true"
              />
              <span className="truncate text-lg ml-2">{link.label}</span>
            </a>
          ))}
        </div>

        <Clock className="px-4 py-1 border-l border-lime justify-center text-sm leading-tight shrink-0" />
      </div>
    </footer>
  );
};