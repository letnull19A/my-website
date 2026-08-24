'use client'

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface IsometricCubeMorphProps {
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

export const IsometricCubeMorph1: React.FC<IsometricCubeMorphProps> = ({
  autoPlay = true,
  loop = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Инициализация стартового состояния (виден только нижний блок)
      gsap.set('.cube-layer-mid', { y: 70, opacity: 0, scale: 0.95 });
      gsap.set('.cube-layer-top', { y: 140, opacity: 0, scale: 0.9 });
      gsap.set('.laser-cage', { strokeDashoffset: 1000, opacity: 0 });

      // Подготовка неонового контура для эффекта "рисования линий"
      const cagePaths = gsap.utils.toArray<SVGPathElement>('.laser-cage');
      cagePaths.forEach((path) => {
        const length = path.getTotalLength() || 600;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      // Главный таймлайн анимации
      const tl = gsap.timeline({
        paused: !autoPlay,
        repeat: loop ? -1 : 0,
        repeatDelay: 2,
        onUpdate: () => {
          // Вычисление текущего шага для индикаторов
          const progress = tl.progress();
          if (progress < 0.3) setCurrentStep(0);
          else if (progress < 0.6) setCurrentStep(1);
          else if (progress < 0.85) setCurrentStep(2);
          else setCurrentStep(3);
        },
      });

      // Фаза 1: Выдвижение среднего яруса
      tl.to('.cube-layer-mid', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
      })
        // Фаза 2: Выдвижение верхнего яруса
        .to(
          '.cube-layer-top',
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
          },
          '+=0.15'
        )
        // Фаза 3: Включение и отрисовка лазерной сетки
        .to(
          '.laser-cage',
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: 'power2.inOut',
          },
          '+=0.1'
        )
        // Фаза 4: Финальное неоновое свечение/пульсация
        .to(
          '.laser-cage',
          {
            filter: 'drop-shadow(0 0 8px rgba(202, 240, 95, 0.9))',
            duration: 0.4,
            yoyo: true,
            repeat: 1,
          },
          '-=0.3'
        );

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [autoPlay, loop]);

  const togglePlay = () => {
    if (!timelineRef.current) return;
    if (isPlaying) {
      timelineRef.current.pause();
    } else {
      timelineRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (!timelineRef.current) return;
    timelineRef.current.restart();
    setIsPlaying(true);
  };

  const goToStep = (progress: number) => {
    if (!timelineRef.current) return;
    timelineRef.current.pause();
    setIsPlaying(false);
    gsap.to(timelineRef.current, { progress, duration: 0.6, ease: 'power2.out' });
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center p-6 bg-[#0B0C0B] border border-[#222] rounded-2xl overflow-hidden select-none ${className}`}
    >
      {/* Фоновая сетка для киберпанк стилистики */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

      {/* SVG контейнер (Figma Vector Asset) */}
      <div className="relative z-10 w-full max-w-[320px] aspect-[315/361] flex items-center justify-center">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 315 361"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Паттерны штриховки */}
          <defs>
            <pattern
              id="cube_hatch"
              patternUnits="userSpaceOnUse"
              patternTransform="matrix(9.87 5.7 -29.44 17 171.7 217)"
              viewBox="0 0 11.4 34"
              width="1"
              height="1"
            >
              <rect width="1" height="34" fill="#454645" />
            </pattern>
          </defs>

          {/* ЯРУС 1: Базовый (Нижний куб) */}
          <g className="cube-layer-base">
            <path
              d="M157.493 148.366L291.62 225.804L157.493 303.242L23.3663 225.804L157.493 148.366Z"
              fill="#9AD000"
            />
            <path
              d="M157.493 148.366L291.62 225.804L157.493 303.242L23.3663 225.804L157.493 148.366Z"
              fill="url(#cube_hatch)"
              stroke="#454645"
            />
            <path
              d="M291.856 225.975L157.73 303.413V331.866L291.856 254.428V225.975Z"
              fill="#9AD000"
              stroke="#454645"
            />
            <path
              d="M23.3662 225.975L157.493 303.413V331.866L23.3662 254.428V225.975Z"
              fill="#9AD000"
              stroke="#454645"
            />
          </g>

          {/* ЯРУС 2: Средний куб */}
          <g className="cube-layer-mid origin-center">
            <path
              d="M157.493 78.3655L291.62 155.804L157.493 233.242L23.3663 155.804L157.493 78.3655Z"
              fill="#9AD000"
            />
            <path
              d="M157.493 78.3655L291.62 155.804L157.493 233.242L23.3663 155.804L157.493 78.3655Z"
              fill="url(#cube_hatch)"
              stroke="#454645"
            />
            <path
              d="M291.856 155.975L157.73 233.413V261.866L291.856 184.428V155.975Z"
              fill="#9AD000"
              stroke="#454645"
            />
            <path
              d="M23.3662 155.975L157.493 233.413V261.866L23.3662 184.428V155.975Z"
              fill="#9AD000"
              stroke="#454645"
            />
          </g>

          {/* ЯРУС 3: Верхний куб */}
          <g className="cube-layer-top origin-center">
            <path
              d="M157.493 8.36572L291.62 85.8039L157.493 163.242L23.3663 85.8039L157.493 8.36572Z"
              fill="#9AD000"
            />
            <path
              d="M157.493 8.36572L291.62 85.8039L157.493 163.242L23.3663 85.8039L157.493 8.36572Z"
              fill="url(#cube_hatch)"
              stroke="#454645"
            />
            <path
              d="M291.856 85.9749L157.73 163.413V191.865L291.856 114.427V85.9749Z"
              fill="#9AD000"
              stroke="#454645"
            />
            <path
              d="M23.3662 85.9749L157.493 163.413V191.865L23.3662 114.427V85.9749Z"
              fill="#9AD000"
              stroke="#454645"
            />
          </g>

          {/* ЛАЗЕРНЫЙ КАРКАС (#CAF05F) */}
          <g>
            <path className="laser-cage" d="M1.36621 242.366L171.366 340.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 242.366L143.366 340.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M1.36621 172.366L171.366 270.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 172.366L143.366 270.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M1.36621 102.366L171.366 200.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 102.366L143.366 200.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M1.36621 213.366L171.366 311.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 213.366L143.366 311.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M1.36621 143.366L171.366 241.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 143.366L143.366 241.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M1.36621 73.3657L171.366 171.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 73.3657L143.366 171.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M171.366 1.36572L1.36621 99.3657" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M143.366 1.36572L313.366 99.3657" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M290.366 64.3657L290.366 279.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M23.3662 64.3657L23.3662 279.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
            <path className="laser-cage" d="M157.366 143.366L157.366 359.366" stroke="#CAF05F" strokeWidth="2" strokeLinecap="square" />
          </g>
        </svg>
      </div>

      {/* Панель управления и индикаторы шагов */}
      <div className="relative z-10 flex items-center justify-between w-full mt-6 pt-4 border-t border-[#1F201F]">
        <div className="flex gap-2">
          {['Init', 'Expand 1', 'Expand 2', 'Lock'].map((label, idx) => (
            <button
              key={label}
              onClick={() => goToStep(idx * 0.33)}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-all ${
                currentStep === idx
                  ? 'bg-[#9AD000]/10 text-[#CAF05F] border-[#CAF05F]'
                  : 'bg-transparent text-neutral-500 border-[#222] hover:border-neutral-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 text-[#CAF05F] bg-[#141614] hover:bg-[#1C201C] rounded border border-[#222] transition-colors"
            title={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={restart}
            className="p-2 text-neutral-400 bg-[#141614] hover:text-[#CAF05F] hover:bg-[#1C201C] rounded border border-[#222] transition-colors"
            title="Перезапустить"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};