'use client';

import React from 'react';

export interface ProcessStatusProps {
  status: 'ACTIVE' | 'READY' | string;
  progressPercent: number; // например: 21, 46, 83, 100
  variantIndex: number; // 1, 2, 3, 4
  totalSteps?: number; // по умолчанию 4
  className?: string;
}

export const ProcessStatus: React.FC<ProcessStatusProps> = ({
  status,
  progressPercent,
  variantIndex,
  totalSteps = 4,
  className = '',
}) => {
  const formattedVariant = String(variantIndex).padStart(3, '0');

  return (
    <div
      className={`text-lime-soft font-mono p-2.5 sm:p-3 w-37.5 sm:w-42.5 select-none ${className}`}
    >
      {/* 1. Верхняя табличка: STATUS и PROGRESS */}
      <div className='border border-lime-soft p-1'>
        <div className="grid grid-cols-[1fr_auto] gap-x-2 text-[10px] sm:text-xs font-bold leading-tight uppercase tracking-wider pb-1 ">
        <span className="text-lime-soft">STATUS</span>
        <span className="text-right text-lime-soft font-bold">{status}</span>
        <span className="text-lime-soft">PROGRESS</span>
        <span className="text-right text-lime-soft font-bold">{progressPercent}%</span>
      </div>

      {/* 2. Ретро-пиктограммы (Глобус + Пересекающиеся круги) */}
      <div className="flex items-center gap-1.5 py-1.5 text-lime-soft">
        {/* Глобус */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
        </svg>

        {/* Пересекающиеся круги */}
        <svg
          width="20"
          height="14"
          viewBox="0 0 28 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0"
        >
          <circle cx="9" cy="8" r="7" />
          <circle cx="19" cy="8" r="7" />
        </svg>
      </div>
      </div>

      {/* 3. Четырехсегментный прогресс-бар */}
      <div className="grid grid-cols-4 gap-1 pt-1">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isFilled = idx < variantIndex;
          return (
            <div
              key={idx}
              className={`h-2 sm:h-2.5 border border-lime-soft transition-colors duration-200 ${
                isFilled ? 'bg-lime-soft' : 'bg-transparent'
              }`}
            />
          );
        })}
      </div>

      {/* 4. Нижняя подпись: ::: VARIANT [ 001 ] */}
      <div className="flex items-center justify-between pt-1.5 text-[9px] sm:text-[10px] tracking-wider text-lime-soft font-mono">
        <span className="opacity-70">:::</span>
        <span className="font-bold">VARIANT [ {formattedVariant} ]</span>
      </div>
    </div>
  );
};