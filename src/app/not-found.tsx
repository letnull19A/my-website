'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { buttonVariants } from '@/components/button';
import { cn } from '@/lib/utils';

const navData = {
  brand: { title: 'Letnull19A Portfolio', href: '/' },
  items: [
    { id: 'main', label: 'Main page', href: '/' },
    { id: 'cases', label: 'Cases', href: '/#cases' },
    { id: 'articles', label: 'Articles', href: '/articles' },
  ],
  action: { label: 'Contact me', href: '/#contact' },
};

export default function NotFound() {
  const [timeStr, setTimeStr] = useState('21:03:04');
  const [dateStr, setDateStr] = useState('18.08.2026');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      setTimeStr(`${hours}:${minutes}:${seconds}`);
      setDateStr(`${day}.${month}.${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen lg:min-h-screen lg:h-auto bg-background text-foreground font-mono flex flex-col justify-between select-none overflow-hidden lg:overflow-visible">
      {/* Шапка */}
      <Header {...navData} />

      {/* Основной контейнер 404 */}
      <main
        id="main-content"
        className="flex-1 flex flex-col justify-between overflow-hidden lg:overflow-visible border-b border-border bg-[linear-gradient(to_right,rgba(154,208,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(154,208,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"
      >
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between px-4 pt-2 pb-0 sm:px-6 lg:p-8">
          {/* Десктопная и мобильная сетка */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12 items-center flex-1">
            
            {/* Текстовый блок (у самой шапки) */}
            <div className="flex flex-col gap-1 sm:gap-2 max-w-xl self-start lg:self-center pt-1 lg:pt-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
                THIS PAGE <br />
                DOESN’T EXIST
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-lime-light/80 leading-relaxed max-w-md">
                If your project doesn’t exist as well, contact me to make it real
              </p>

              {/* Десктопная кнопка */}
              <div className="hidden lg:block pt-6">
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: 'lime-light', size: 'lg' }),
                    'h-14 px-10 text-lg'
                  )}
                >
                  BACK TO MAIN PAGE
                </Link>
              </div>
            </div>

            {/* Большая 3D картинка 404 */}
            <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] lg:max-w-none mx-auto flex items-center justify-center py-0 lg:py-0 flex-1 my-auto">
              <Image
                src="/images/404.webp"
                alt="404 — Isometric cubes"
                width={720}
                height={540}
                priority
                unoptimized
                draggable={false}
                className="w-full h-auto object-contain pointer-events-none select-none drop-shadow-[0_0_24px_rgba(154,208,0,0.18)]"
              />
            </div>

            {/* Мобильная кнопка в самом низу */}
            <div className="block lg:hidden w-full mt-auto pb-3">
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: 'lime-light', size: 'lg' }),
                  'w-full h-14 text-lg'
                )}
              >
                BACK TO MAIN PAGE
              </Link>
            </div>
          </div>
        </div>

        {/* Нижняя терминальная плашка с живым таймером и датой */}
        <div className="w-full block lg:hidden border-t border-lime bg-background/95">
          <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-lime font-mono tracking-wider font-bold">
            <div className="flex flex-col leading-tight">
              <span>PAGE</span>
              <span>404</span>
            </div>
            <div className="flex flex-col items-end leading-tight text-right tabular-nums">
              <span>{timeStr}</span>
              <span>{dateStr}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}