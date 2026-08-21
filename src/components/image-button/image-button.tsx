'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';

export interface DesktopIconProps {
  label: string;
  img: string | StaticImageData;
  onClick: () => void;
  className?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  label,
  img,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-1.5 p-1 text-lime bg-transparent border-none cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime ${className}`}
    >
      <div className="relative w-16 h-16 flex items-center justify-center bg-background/80 transition-colors p-1 overflow-hidden">
        <Image
          src={img}
          alt={label}
          width={100}
          height={100}
          unoptimized
          draggable={false}
          className="object-contain w-full h-full pointer-events-none"
        />
      </div>
      <span className="text-[10px] tracking-wider uppercase font-mono">{label}</span>
    </button>
  );
};