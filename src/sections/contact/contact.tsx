'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { ContactForm, ContactFormData } from '@/components/contact-form';
import { email as siteEmail } from '@/config/social';

export interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  illustrationSrc?: string | StaticImageData;
  statusBadgeSrc?: string | StaticImageData;
  directEmail?: string;
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}

const EmailLink: React.FC<{ email: string; className?: string }> = ({
  email,
  className = '',
}) => (
  <p className={`font-bold uppercase tracking-wide text-lime-light break-keep ${className}`}>
    YOU CAN ALSO WRITE AN EMAIL ON{' '}
    <a href={`mailto:${email.toLowerCase()}`} className="underline hover:text-lime-soft transition-colors ">
      {email}
    </a>
  </p>
);

const StatusBadgeImage: React.FC<{
  src: string | StaticImageData;
  width: number;
  height: number;
  className?: string;
}> = ({ src, width, height, className = '' }) => (
  <div className={`shrink-0 overflow-hidden ${className}`}>
    <Image
      src={src}
      alt="Ready for collaboration badge"
      width={width}
      height={height}
      unoptimized
      draggable={false}
      className="w-full h-auto object-contain pointer-events-none block"
    />
  </div>
);

export const ContactSection: React.FC<ContactSectionProps> = ({
  title = "LET'S WORK TOGETHER",
  subtitle = 'A new product, an unfinished system or something that needs fixing? Tell me about your project!',
  illustrationSrc = '/images/contact-cube-matrix.png',
  statusBadgeSrc = '/images/contact-status-badge.png',
  directEmail = siteEmail.toUpperCase(),
  onSubmit,
  className = '',
}) => {

  return (
    <section
      id="contact"
      className={`w-full border border-border border-t border-b mt-20 bg-green-dark text-lime font-mono select-none ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 p-6">
        {/* Левая колонка: Форма */}
        <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
              {title}
            </h2>
            <p className="w-full lg:w-[60%] mt-2 sm:mt-3 text-lg text-lime-light leading-relaxed mb-6 sm:mb-8">
              {subtitle}
            </p>

            <ContactForm onSubmit={onSubmit} />

            {/* Мобильный подвал (< lg) */}
            <div
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(154, 208, 0, 0.12) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(154, 208, 0, 0.12) 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px',
              }}
              className="mt-6 border border-lime/50 p-3 sm:p-4 grid grid-cols-[1fr_auto] gap-3 items-center lg:hidden"
            >
              <EmailLink email={directEmail} className="text-2xl leading-snug pr-2" />
              <StatusBadgeImage src={statusBadgeSrc} width={130} height={80} className="w-40 sm:w-32.5" />
            </div>
          </div>
        </div>

        {/* Правая колонка (только >= lg) */}
        <div
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(154, 208, 0, 0.12) 2px, transparent 1px),
              linear-gradient(to bottom, rgba(154, 208, 0, 0.12) 2px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
          }}
          className="hidden lg:flex relative border border-lime/50 p-4 flex-col justify-between min-h-130 overflow-hidden"
        >
          {/* Виджет Ready for collaboration */}
          <StatusBadgeImage
            src={statusBadgeSrc}
            width={240}
            height={140}
            className="relative z-10 self-end w-full max-w-55"
          />

          {/* Центральный кубик */}
          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none z-0">
            <div className="relative w-full max-w-130 aspect-square flex items-center justify-center">
              <Image
                src={illustrationSrc}
                alt="Collaboration matrix isometric diagram"
                width={600}
                height={600}
                unoptimized
                draggable={false}
                className="object-contain w-full h-full pointer-events-none"
              />
            </div>
          </div>

          {/* Email внизу */}
          <div className="relative z-10 pt-6 mt-auto mx-auto">
            <EmailLink email={directEmail} className="text-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
