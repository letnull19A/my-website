'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { vibrateOnTap } from '@/lib/utils';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  description: string;
  agreed: boolean;
}

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    description: '',
    agreed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) return;
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 sm:gap-3.5 font-mono select-none ${className}`}
    >
      <label className="sr-only" htmlFor="contact-name">
        Name
      </label>
      <input
        type="text"
        id="contact-name"
        name="name"
        required
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full h-11 sm:h-12 bg-transparent border border-lime-soft px-4 text-xl xl:text-2xl text-green-mid placeholder:text-lime-soft/70 outline-none focus:border-lime focus:ring-1 focus:ring-lime"
      />

      <label className="sr-only" htmlFor="contact-email">
        Email
      </label>
      <input
        type="email"
        id="contact-email"
        name="email"
        required
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full h-11 sm:h-12 bg-transparent border border-lime-soft px-4 text-xl xl:text-2xl text-green-mid placeholder:text-lime-soft/70 outline-none focus:border-lime focus:ring-1 focus:ring-lime"
      />

      <label className="sr-only" htmlFor="contact-company">
        Company
      </label>
      <input
        type="text"
        id="contact-company"
        name="company"
        placeholder="Company [ optional ]"
        value={formData.company}
        onChange={handleChange}
        className="w-full h-11 sm:h-12 bg-transparent border border-lime-soft px-4 text-xl xl:text-2xl text-green-mid placeholder:text-lime-soft/70 outline-none focus:border-lime focus:ring-1 focus:ring-lime"
      />

      <label className="sr-only" htmlFor="contact-description">
        Description
      </label>
      <textarea
        name="description"
        id="contact-description"
        required
        rows={3}
        placeholder="What currently exists and what needs to be done"
        value={formData.description}
        onChange={handleChange}
        className="w-full bg-transparent border border-lime-soft p-4 text-xl xl:text-2xl text-green-mid placeholder:text-lime-soft/70 outline-none focus:border-lime focus:ring-1 focus:ring-lime resize-none min-h-20"
      />

      {/* Кнопка отправки */}
      <Button
        type="submit"
        variant="lime-light"
        className="mt-1 h-16 w-full text-xl font-bold uppercase tracking-wider rounded-none shrink-0"
      >
        SEND PROJECT BRIEF
      </Button>

      {/* Чекбокс согласия с политикой */}
      <label
        onClick={vibrateOnTap}
        className="flex items-start gap-2.5 mt-2 cursor-pointer group"
      >
        <input
          type="checkbox"
          name="agreed"
          required
          checked={formData.agreed}
          onChange={handleChange}
          className="peer sr-only"
        />
        <div className="w-8 h-8 mt-0.5 shrink-0 border border-lime bg-transparent peer-checked:bg-lime flex items-center justify-center transition-colors">
          {formData.agreed && (
            <svg
              className="w-8 h-8 text-background stroke-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className="text-base ml-2 w-full md:w-[62%] sm:text-xl text-lime leading-tight group-hover:text-lime-soft transition-colors">
          By clicking the &ldquo;Send project brief&rdquo; button, I agree to the{' '}
          <a href="#privacy" className="underline hover:text-lime-soft">
            Privacy Policy
          </a>
        </span>
      </label>
    </form>
  );
};