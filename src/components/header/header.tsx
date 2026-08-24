'use client';

import React, { useEffect, useState, useRef, useId } from 'react';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/button';
import { cn } from '@/lib/utils';
import { socialLinks } from '@/config/social';

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
  const activeIdRef = useRef<string>(items[0]?.id || '');

  // Блокировка скролла страницы при открытии мобильного меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMobileMenuOpen]);

  // Active section + slider indicator, rAF-throttled on scroll/resize
  useEffect(() => {
    const computeActiveId = (prev: string): string => {
      const triggerY = window.scrollY + window.innerHeight * 0.35;
      const actionId = action.href.replace('#', '');
      const actionEl = document.getElementById(actionId);

      if (
        actionEl &&
        (triggerY >= actionEl.offsetTop ||
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50)
      ) {
        return actionId;
      }

      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && triggerY >= el.offsetTop) return items[i].id;
      }

      if (window.scrollY < 120) {
        const brandTargetId = brand.href.replace('#', '');
        return brandTargetId || items[0]?.id || '';
      }

      return prev;
    };

    const computeSlider = (currentActiveId: string): number | null => {
      if (!headerRef.current || window.innerWidth < 768) return null;

      const headerRect = headerRef.current.getBoundingClientRect();
      const actionId = action.href.replace('#', '');
      const brandId = brand.href.replace('#', '');

      let targetEl: HTMLElement | null = null;
      if (navItemRefs.current.has(currentActiveId)) {
        targetEl = navItemRefs.current.get(currentActiveId) || null;
      } else if (currentActiveId === actionId && actionRef.current) {
        targetEl = actionRef.current;
      } else if (currentActiveId === brandId && brandRef.current) {
        targetEl = brandRef.current;
      }

      if (targetEl) {
        const targetRect = targetEl.getBoundingClientRect();
        return targetRect.left - headerRect.left + targetRect.width / 2;
      }
      return null;
    };

    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const nextActiveId = computeActiveId(activeIdRef.current);
        if (nextActiveId !== activeIdRef.current) {
          activeIdRef.current = nextActiveId;
          setActiveId(nextActiveId);
        }
        const nextSlider = computeSlider(nextActiveId);
        setSliderLeft((prev) => (prev === nextSlider ? prev : nextSlider));
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [items, action.href, brand.href]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const actionId = action.href.replace('#', '');
  const isActionActive = activeId === actionId;

  return (
    <header
      ref={headerRef}
      className={`sticky z-60 top-0 w-full bg-background text-foreground font-mono select-none ${className}`}
    >
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1.2fr_2fr_1fr] items-stretch border-b border-border">
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
                    aria-current={isActive ? 'true' : undefined}
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

        <div
          ref={actionRef}
          className="hidden md:flex items-center justify-center px-6"
        >
          <a
            href={action.href}
            aria-current={isActionActive ? 'true' : undefined}
            className={`text-xl tracking-wide transition-all py-1 px-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActionActive
                ? 'bg-lime text-background font-semibold'
                : 'text-foreground hover:opacity-80'
            }`}
          >
            {action.label}
          </a>
        </div>

        <div className="flex md:hidden items-center justify-center px-4">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 text-foreground hover:text-lime transition-colors bg-transparent border-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[1.75]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[1.75]" />
            )}
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative h-4 w-full border-b border-border bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] bg-size-[16px_100%] bg-repeat-x"
      >
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

      {isMobileMenuOpen && (
        <nav
          id={mobileMenuId}
          aria-label="Mobile Navigation"
          className="fixed top-18.25 inset-x-0 bottom-0 z-60 md:hidden border-b border-border bg-background/95 backdrop-blur-md px-6 py-6 flex flex-col gap-6 overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <ul className="flex flex-col gap-3 list-none m-0 p-0">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  className={`block py-2 px-2.5 text-sm font-medium transition-colors ${
                    activeId === item.id
                      ? 'bg-lime text-background font-semibold'
                      : 'text-lime-light hover:text-lime'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CONTACTS */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-lime-light">
              Contacts
            </h3>
            <div className="grid grid-cols-3 divide-x divide-y divide-border border border-border">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-start justify-between p-3 min-h-25 hover:bg-lime/10 transition-colors ${
                    item.id === 'email' ? 'col-span-2' : ''
                  }`}
                >
                  <span className="text-base font-medium text-lime tracking-wider">
                    {item.label}
                  </span>
                  <span
                    style={{
                      mask: `url(${item.iconSrc}) no-repeat center / contain`,
                      WebkitMask: `url(${item.iconSrc}) no-repeat center / contain`,
                    }}
                    className="w-4 h-4 bg-lime transition-colors pointer-events-none mt-3"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* CONTACT ME */}
          <div className="mt-auto">
            <a
              href={action.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                buttonVariants({ variant: 'lime-light' }),
                'w-full h-14 text-lg font-bold uppercase tracking-wider rounded-none'
              )}
            >
              CONTACT ME
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};