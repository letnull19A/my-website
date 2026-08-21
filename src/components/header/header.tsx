'use client';

import React, { useEffect, useState, useRef, useId } from 'react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeaderProps {
  brand: {
    title: string;
    href: string;
  };
  items: NavItem[];
  action: {
    label: string;
    href: string;
  };
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  brand,
  items,
  action,
  className = '',
}) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const [sliderLeft, setSliderLeft] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const mobileMenuId = useId();

  const headerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const actionRef = useRef<HTMLDivElement>(null);

  // 1. Определение активной секции при скролле
  useEffect(() => {
    const handleScroll = () => {
      // Линия триггера (1/3 от верха окна)
      const triggerY = window.scrollY + window.innerHeight * 0.35;
      const actionId = action.href.replace('#', '');
      const actionEl = document.getElementById(actionId);

      // Если доскроллили до футера/экшена в самом низу
      if (
        actionEl &&
        (triggerY >= actionEl.offsetTop ||
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50)
      ) {
        setActiveId(actionId);
        return;
      }

      // Проверяем секции в обратном порядке (снизу вверх)
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el && triggerY >= el.offsetTop) {
          setActiveId(item.id);
          return;
        }
      }

      // Если в самом верху страницы
      if (window.scrollY < 120) {
        const brandTargetId = brand.href.replace('#', '');
        setActiveId(brandTargetId || items[0]?.id || '');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, action.href, brand.href]);

  // 2. Расчет позиции индикатора по центру активного элемента (только Desktop)
  useEffect(() => {
    const updateSliderPosition = () => {
      if (!headerRef.current || window.innerWidth < 768) {
        setSliderLeft(null);
        return;
      }

      const headerRect = headerRef.current.getBoundingClientRect();
      const actionId = action.href.replace('#', '');
      const brandId = brand.href.replace('#', '');

      let targetEl: HTMLElement | null = null;

      if (navItemRefs.current.has(activeId)) {
        targetEl = navItemRefs.current.get(activeId) || null;
      } else if (activeId === actionId && actionRef.current) {
        targetEl = actionRef.current;
      } else if (activeId === brandId && brandRef.current) {
        targetEl = brandRef.current;
      }

      if (targetEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const centerPos = targetRect.left - headerRect.left + targetRect.width / 2;
        setSliderLeft(centerPos);
      }
    };

    updateSliderPosition();
    window.addEventListener('resize', updateSliderPosition);
    window.addEventListener('scroll', updateSliderPosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updateSliderPosition);
      window.removeEventListener('scroll', updateSliderPosition);
    };
  }, [activeId, action.href, brand.href]);

  const actionId = action.href.replace('#', '');
  const isActionActive = activeId === actionId;

  return (
    <header
      ref={headerRef}
      className={`sticky z-40 top-0 z-sticky w-full bg-background text-foreground font-mono select-none ${className}`}
    >
      {/* Главная панель */}
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1.2fr_2fr_1fr] items-stretch border-b border-border">
        {/* Бренд */}
        <div
          ref={brandRef}
          className="flex items-center px-4 md:px-6 py-4 border-r border-border"
        >
          <a
            href={brand.href}
            className="text-xl md:text-base font-normal tracking-wide text-foreground hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {brand.title}
          </a>
        </div>

        {/* Desktop Навигация */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center justify-center border-r border-border px-2"
        >
          <ul className="flex items-center gap-6 lg:gap-10 list-none m-0 p-0">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    ref={(el) => {
                      if (el) navItemRefs.current.set(item.id, el);
                      else navItemRefs.current.delete(item.id);
                    }}
                    href={item.href}
                    className={`text-xl tracking-wide transition-all py-1 px-2.5 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? 'bg-lime text-background font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Action */}
        <div
          ref={actionRef}
          className="hidden md:flex items-center justify-center px-6"
        >
          <a
            href={action.href}
            className={`text-xl tracking-wide transition-all py-1 px-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActionActive
                ? 'bg-lime text-background font-semibold'
                : 'text-foreground hover:opacity-80'
            }`}
          >
            {action.label}
          </a>
        </div>

        {/* Mobile Меню Тоггл */}
        <div className="flex md:hidden items-center justify-center px-4">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={`w-6 h-[1.5px] bg-foreground transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-[1.5px] bg-foreground transition-opacity duration-200 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-[1.5px] bg-foreground transition-transform duration-200 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Шкала с насечками */}
      <div
        aria-hidden="true"
        className="relative h-4 w-full border-b border-border bg-[repeating-linear-gradient(90deg,transparent_0_4px,color-mix(in_srgb,var(--lime-light)_22%,transparent)_4px_5px)]"
      >
        {/* Индикатор ромбика: скрыт на мобильных (hidden), виден только на md+ */}
        {sliderLeft !== null && (
          <div
            className="hidden md:flex absolute top-0 -translate-x-1/2 flex-col items-center pointer-events-none transition-[left] duration-300 ease-out"
            style={{ left: `${sliderLeft}px` }}
          >
            <svg
              width="14"
              height="20"
              viewBox="0 0 14 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-lime overflow-visible drop-shadow-[0_0_6px_var(--lime)] -translate-y-1.25"
            >
              <path
                d="M7 0L13.5 6.5L8.2 11.8V20H5.8V11.8L0.5 6.5L7 0Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Выпадающее мобильное меню */}
      {isMobileMenuOpen && (
        <nav
          id={mobileMenuId}
          aria-label="Mobile Navigation"
          className="md:hidden border-b border-border bg-surface px-6 py-4 flex flex-col gap-4"
        >
          <ul className="flex flex-col gap-3 list-none m-0 p-0">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-1.5 px-2 text-sm transition-colors ${
                    activeId === item.id
                      ? 'bg-lime text-background font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-border">
            <a
              href={action.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm block py-1.5 px-2 transition-colors ${
                isActionActive
                  ? 'bg-lime text-background font-semibold'
                  : 'text-foreground hover:text-lime'
              }`}
            >
              {action.label}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};