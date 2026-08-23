'use client';

import React from 'react';

export interface SocialLink {
  label: string;
  href: string;
  iconSrc: string;
}

export interface FooterSectionProps {
  designerName?: string;
  designerHref?: string;
  copyrightYear?: string | number;
  className?: string;
}

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Ask', href: '#ask' },
  { label: 'Articles', href: '#articles' },
  { label: 'Contact me', href: '#contact' },
  { label: 'Privacy policy', href: '#privacy' },
];

const socialLinks: SocialLink[] = [
  { label: 'github', href: 'https://github.com', iconSrc: '/icons/github.svg' },
  { label: 'linkedin', href: 'https://linkedin.com', iconSrc: '/icons/linkedin.svg' },
  { label: 'telegram', href: 'https://t.me', iconSrc: '/icons/telegram.svg' },
  { label: 'whatsapp', href: 'https://wa.me', iconSrc: '/icons/whatsapp.svg' },
  { label: 'email', href: 'mailto:letnull19a@gmail.com', iconSrc: '/icons/email.svg' },
  { label: 'email', href: 'mailto:letnull19a@gmail.com', iconSrc: '/icons/email.svg' },
];

const systemSpecs = [
  { label: 'STACK', value: 'React / Next.js\n/ ASP.NET' },
  { label: 'MODE', value: 'Remote / Async-friendly' },
  { label: 'FOCUS', value: 'Interfaces with visible state' },
  { label: 'UPDATED', value: '2026' },
];

export const Footer: React.FC<FooterSectionProps> = ({
  designerName = 'Aleksey Dan',
  designerHref = '#',
  copyrightYear = '2026',
  className = '',
}) => {
  return (
    <footer
      className={`w-full bg-background text-lime font-mono px-4 py-8 sm:px-6 md:px-8 select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {/* 1. Блок: LETNULL19A PORTFOLIO + STATUS */}
          <div className="border border-border bg-background/95 flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xl font-bold text-lime-light uppercase tracking-wider">
                  LETNULL19A PORTFOLIO
                </h3>
              </div>
              <p className="p-4 text-xl text-lime leading-5 border-b border-border">
                Full-stack product engineering for visible systems, operational
                clarity, and productiongrade interfaces.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="px-4 py-3 ">
                <h4 className="text-xl font-bold text-lime uppercase tracking-wider">
                  STATUS
                </h4>
              </div>
              <p className="p-4 text-xl text-lime leading-5">
                Available for selected product systems and engineering-heavy
                interfaces.
              </p>
            </div>
          </div>

          {/* 2. Блок: NAVIGATION */}
          <div className="border border-border bg-background/95 flex flex-col">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-xl font-bold text-lime-light uppercase tracking-wider">
                NAVIGATION
              </h3>
            </div>
            <ul className="p-4 flex flex-col gap-2.5 text-xl text-lime flex-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-foreground hover:underline transition-colors block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Блок: CONTACTS */}
          <div className="border border-border bg-background/95 flex flex-col justify-between">
            <div>
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xl font-bold text-lime-light uppercase tracking-wider">
                  CONTACTS
                </h3>
              </div>
              <p className="p-4 text-xl text-lime leading-5">
                Use the{' '}
                <a href="#ask" className="underline hover:text-foreground">
                  Ask page
                </a>{' '}
                for project-fit questions, fill the{' '}
                <a href="#contact" className="underline hover:text-foreground">
                  contact form
                </a>{' '}
                or send direct context by email
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-y divide-border border-t border-border">
            {socialLinks.map((item, idx) => (
                <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-start justify-between p-3 min-h-25 hover:bg-lime/10 transition-colors"
                >
                <span className="text-base font-medium text-lime tracking-wider">
                    {item.label}
                </span>
                <span
                    style={{
                    mask: `url(${item.iconSrc}) no-repeat center / contain`,
                    WebkitMask: `url(${item.iconSrc}) no-repeat center / contain`,
                    }}
                    className="w-4 h-4 sm:w-5 sm:h-5 bg-lime group-hover:bg-foreground transition-colors pointer-events-none mt-3"
                    aria-hidden="true"
                />
                </a>
            ))}
            </div>
          </div>

          {/* 4. Блок: SYSTEM */}
          <div className="border border-border bg-background/95 flex flex-col">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-xl font-bold text-lime-light uppercase tracking-wider">
                SYSTEM
              </h3>
            </div>

            <div className="flex-1 flex flex-col divide-y divide-lime/40">
              {systemSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="p-3 sm:p-4 grid grid-cols-[80px_1fr] sm:grid-cols-[90px_1fr] gap-2 items-start"
                >
                  <span className="text-xl font-bold text-lime uppercase">
                    {spec.label}
                  </span>
                  <span className="text-xl text-lime whitespace-pre-line leading-snug">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs sm:text-sm text-muted-foreground">
          <a
            href={designerHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-lime transition-colors"
          >
            Design by {designerName}
          </a>

          <p>
            &copy; {copyrightYear} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};