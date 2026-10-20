'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useMutation } from '@tanstack/react-query';
import { ContactForm, ContactFormData, ContactFormStatus } from '@/components/contact-form';
import { email as siteEmail } from '@/config/social';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

const IsometricFormLoopCluster = dynamic(
  () => import('@/components/isometric').then((m) => m.IsometricFormLoopCluster),
  { ssr: false, loading: () => null }
);

const LazyIllustration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, inView] = useInView<HTMLDivElement>(0.1);
  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      {inView ? children : null}
    </div>
  );
};

export interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  panelTitle?: string;
  panelFooter?: string;
  directEmail?: string;
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}

const EmailLink: React.FC<{ email: string; className?: string }> = ({
  email,
  className = '',
}) => (
  <p className={`font-bold uppercase tracking-wide text-lime-light break-words ${className}`}>
    YOU CAN ALSO WRITE AN EMAIL ON{' '}
    <a href={`mailto:${email.toLowerCase()}`} className="underline hover:text-lime-soft transition-colors ">
      {email}
    </a>
  </p>
);

export const ContactSection: React.FC<ContactSectionProps> = ({
  title = "LET'S WORK TOGETHER",
  subtitle = 'A new product, an unfinished system or something that needs fixing? Tell me about your project!',
  panelTitle = 'YOUR PROJECT STARTS HERE',
  panelFooter = 'LETNULL19A PORTFOLIO',
  directEmail = siteEmail.toUpperCase(),
  onSubmit,
  className = '',
}) => {
  const mutation = useMutation(trpc.contact.send.mutationOptions());

  const handleSubmit = (data: ContactFormData) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }
    mutation.mutate({
      email: data.email,
      description: data.description,
      agreed: true,
    });
  };

  const status: ContactFormStatus = mutation.isPending
    ? 'pending'
    : mutation.isSuccess
      ? 'success'
      : mutation.isError
        ? 'error'
        : 'idle';

  return (
    <section
      id="contact"
      className={cn(
        'w-full border border-border border-t border-b mt-20 bg-green-dark text-lime font-mono select-none',
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 p-6">
        {/* Левая колонка: Форма */}
        <div className="lg:pr-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
              {title}
            </h2>
            <p className="w-full lg:w-[60%] mt-2 sm:mt-3 text-xl text-lime-light leading-5 mb-6 sm:mb-8">
              {subtitle}
            </p>

            <ContactForm onSubmit={handleSubmit} status={status} />
          </div>

          {/* Email внизу левой колонки (desktop) */}
          <div className="hidden lg:block pt-8 mt-auto">
            <EmailLink email={directEmail} className="text-xl" />
          </div>

            {/* Мобильный подвал (< lg) */}
            <div
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(154, 208, 0, 0.12) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(154, 208, 0, 0.12) 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px',
              }}
              className="mt-6 border border-lime/50 p-4 sm:p-5 flex flex-col gap-4 items-center text-center lg:hidden"
            >
              <EmailLink email={directEmail} className="text-lg sm:text-xl leading-snug text-center" />
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
          {/* Заголовок панели */}
          <p className="relative z-10 text-center text-2xl uppercase tracking-wider text-lime-light">
            {panelTitle}
          </p>

          {/* Центральная анимация */}
          <div className="relative z-0 flex-1 flex items-center justify-center p-6 pointer-events-none min-h-0">
            <div className="relative w-full max-w-130 aspect-square flex items-center justify-center">
              <LazyIllustration>
                <IsometricFormLoopCluster showControls={false} />
              </LazyIllustration>
            </div>
          </div>

          {/* Подпись внизу */}
          <p className="relative z-10 text-center text-2xl uppercase tracking-wider text-lime-light">
            {panelFooter}
          </p>
        </div>
      </div>
    </section>
  );
};
