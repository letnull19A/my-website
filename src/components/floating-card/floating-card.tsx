'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface FloatingCardProps {
  id: string;
  imageSrc: string;
  imageAlt: string;
  width?: number;
  height?: number;
  desktopPos: { x: number; y: number };
  mobilePos: { x: number; y: number };
  alignRightOnMobile?: boolean;
  bounceDelay?: string;
  isVisible: boolean;
  onClose: (id: string) => void;
  className?: string;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  id,
  imageSrc,
  imageAlt,
  width = 260,
  height = 240,
  desktopPos,
  mobilePos,
  alignRightOnMobile = false,
  bounceDelay = '0s',
  isVisible,
  onClose,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isInitializedRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastPointerPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const momentumRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) {
      isInitializedRef.current = false;
      return;
    }

    if (!isInitializedRef.current && cardRef.current?.parentElement) {
      const parent = cardRef.current.parentElement.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const targetPercent = isMobile ? mobilePos : desktopPos;

      // Реальная ширина элемента с запасом
      const actualCardWidth = cardRef.current.offsetWidth || (isMobile ? 180 : width);
      const actualCardHeight = cardRef.current.offsetHeight || (isMobile ? 180 : height);

      let initialX = (parent.width * targetPercent.x) / 100;
      const initialY = (parent.height * targetPercent.y) / 100;

      if (isMobile && alignRightOnMobile) {
        initialX = parent.width - actualCardWidth - 8;
      }

      const safeX = Math.max(8, Math.min(initialX, parent.width - actualCardWidth - 8));
      const safeY = Math.max(8, Math.min(initialY, parent.height - actualCardHeight - 8));

      posRef.current = { x: safeX, y: safeY };
      setPos({ x: safeX, y: safeY });
      isInitializedRef.current = true;
    }

    return () => {
      if (momentumRafRef.current) cancelAnimationFrame(momentumRafRef.current);
    };
  }, [isVisible, desktopPos, mobilePos, alignRightOnMobile, width, height]);

  const applyTransform = useCallback((x: number, y: number) => {
    posRef.current = { x, y };
    const el = cardRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  // Синхронизируем DOM-transform с posRef после каждого рендера,
  // чтобы рендер не сбрасывал позицию, установленную при перетаскивании.
  useEffect(() => {
    if (isVisible && isInitializedRef.current && cardRef.current) {
      cardRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    }
  }, [isVisible, isDragging, pos]);

  const runMomentum = useCallback(() => {
    const parentEl = cardRef.current?.parentElement;
    const cardEl = cardRef.current;
    if (!parentEl || !cardEl) return;

    const parent = parentEl.getBoundingClientRect();
    const card = cardEl.getBoundingClientRect();
    const minX = 4;
    const maxX = parent.width - card.width - 4;
    const minY = 4;
    const maxY = parent.height - card.height - 4;
    const friction = 0.92;
    const bounceFriction = 0.4;

    const step = () => {
      velocityRef.current.vx *= friction;
      velocityRef.current.vy *= friction;

      let nextX = posRef.current.x + velocityRef.current.vx;
      let nextY = posRef.current.y + velocityRef.current.vy;

      if (nextX <= minX) {
        nextX = minX;
        velocityRef.current.vx = -velocityRef.current.vx * bounceFriction;
      } else if (nextX >= maxX) {
        nextX = maxX;
        velocityRef.current.vx = -velocityRef.current.vx * bounceFriction;
      }

      if (nextY <= minY) {
        nextY = minY;
        velocityRef.current.vy = -velocityRef.current.vy * bounceFriction;
      } else if (nextY >= maxY) {
        nextY = maxY;
        velocityRef.current.vy = -velocityRef.current.vy * bounceFriction;
      }

      applyTransform(nextX, nextY);

      if (Math.abs(velocityRef.current.vx) > 0.1 || Math.abs(velocityRef.current.vy) > 0.1) {
        momentumRafRef.current = requestAnimationFrame(step);
      }
    };

    momentumRafRef.current = requestAnimationFrame(step);
  }, [applyTransform]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-close-trigger]')) return;

    if (momentumRafRef.current) cancelAnimationFrame(momentumRafRef.current);

    const card = cardRef.current;
    const parent = card?.parentElement;
    if (!card || !parent) return;

    try {
      card.setPointerCapture(e.pointerId);
    } catch {}

    setIsDragging(true);
    const cardRect = card.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top,
    };

    lastPointerPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    velocityRef.current = { vx: 0, vy: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !cardRef.current?.parentElement) return;

    const parent = cardRef.current.parentElement.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerPosRef.current.time);

    velocityRef.current = {
      vx: ((e.clientX - lastPointerPosRef.current.x) / dt) * 14,
      vy: ((e.clientY - lastPointerPosRef.current.y) / dt) * 14,
    };

    lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: now };

    let newX = e.clientX - parent.left - dragOffsetRef.current.x;
    let newY = e.clientY - parent.top - dragOffsetRef.current.y;

    newX = Math.max(0, Math.min(newX, parent.width - card.width));
    newY = Math.max(0, Math.min(newY, parent.height - card.height));

    applyTransform(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging && cardRef.current) {
      try {
        cardRef.current.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
      momentumRafRef.current = requestAnimationFrame(runMomentum);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: pos ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : 'none',
        visibility: pos ? 'visible' : 'hidden',
        touchAction: 'none',
      }}
      className={`absolute top-0 left-0 z-10 cursor-grab active:cursor-grabbing select-none will-change-transform ${
        isDragging ? 'z-30 drop-shadow-[0_0_12px_rgba(154,208,0,0.4)]' : ''
      } ${className}`}
    >
      <div
        style={{ animationDelay: bounceDelay }}
        className={`relative inline-block ${
          !isDragging ? 'animate-[floating_4.5s_ease-in-out_infinite]' : ''
        }`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={width}
          height={height}
          unoptimized
          draggable={false}
          className="pointer-events-none block h-auto w-[160px] sm:w-[200px] md:w-[260px] object-contain"
        />

        <button
          type="button"
          data-close-trigger="true"
          onClick={(e) => {
            e.stopPropagation();
            if (window.innerWidth < 1024) return;
            onClose(id);
          }}
          aria-label={`Close ${imageAlt}`}
          className="hidden lg:block absolute top-0 right-0 z-40 h-8 w-8 sm:h-9 sm:w-9 cursor-pointer bg-transparent border-none opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime"
        />
      </div>
    </div>
  );
};