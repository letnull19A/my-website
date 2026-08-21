'use client';

import React from 'react';

export interface DesktopIconProps {
  label: string;
  type: 'image' | 'text' | 'folder';
  onClick: () => void;
  className?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  label,
  type,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-1.5 p-1 text-lime bg-transparent border-none cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime ${className}`}
    >
      {/* Векторная иконка в ретро-стиле */}
      <div className="w-10 h-10 border border-lime flex items-center justify-center bg-background/80 group-hover:bg-lime/10 transition-colors">
        {type === 'image' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
        {type === 'text' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16v16H4z" />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
        )}
        {type === 'folder' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 7v13h18V7H12L10 4H3v3z" />
          </svg>
        )}
      </div>
      <span className="text-[10px] tracking-wider uppercase font-mono">{label}</span>
    </button>
  );
};