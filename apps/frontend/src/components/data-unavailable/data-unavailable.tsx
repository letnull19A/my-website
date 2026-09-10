'use client';

import React from 'react';
import { buttonVariants } from '@/components/button';
import { cn } from '@/lib/utils';

export interface DataUnavailableProps {
  message?: string;
  backHref?: string;
  backLabel?: string;
  showRetry?: boolean;
  className?: string;
}

export const DataUnavailable: React.FC<DataUnavailableProps> = ({
  message = 'Data could not be loaded. Please try again later.',
  backHref = '/',
  backLabel = 'BACK TO MAIN PAGE',
  showRetry = true,
  className = '',
}) => {
  return (
    <div
      className={`w-full border border-lime/40 bg-card p-8 flex flex-col items-center justify-center gap-4 text-center ${className}`}
    >
      <span className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-lime">
        DATA UNAVAILABLE
      </span>
      <span className="text-sm sm:text-base text-lime-light/70 max-w-md">{message}</span>
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        {showRetry && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={cn(
              buttonVariants({ variant: 'lime-light' }),
              'h-12 px-5 text-sm font-bold uppercase rounded-none tracking-wider cursor-pointer'
            )}
          >
            TRY AGAIN
          </button>
        )}
        <a
          href={backHref}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-12 px-5 text-sm font-bold uppercase rounded-none tracking-wider cursor-pointer'
          )}
        >
          {backLabel}
        </a>
      </div>
    </div>
  );
};