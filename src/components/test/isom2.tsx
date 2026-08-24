'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface IsometricCubeMorphProps {
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  className?: string;
}

const STEPS = [
  { label: 'Base', labelKey: 'base' },
  { label: 'Pillar', labelKey: 'pillar' },
  { label: 'Wings', labelKey: 'wings' },
  { label: 'Lock', labelKey: 'lock' },
];

export const IsometricCubeMorph2: React.FC<IsometricCubeMorphProps> = ({
  autoPlay = true,
  loop = true,
  showControls = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStep, setCurrentStep] = useState(0);
  const lastStepRef = useRef<number>(-1);

  const rawId = useId();
  const idPrefix = rawId.replace(/:/g, '');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Инициализация стартовых состояний
      gsap.set('.cluster-module', { y: 60, opacity: 0 });
      gsap.set('.laser-cage', { opacity: 0 });
      gsap.set('.core-glow', { opacity: 0.15, scale: 0.85 });

      const cagePaths = gsap.utils.toArray<SVGPathElement>('.laser-cage');
      cagePaths.forEach((path) => {
        const length = path.getTotalLength() || 400;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      const tl = gsap.timeline({
        paused: !autoPlay,
        repeat: loop ? -1 : 0,
        repeatDelay: 2,
        onUpdate: () => {
          const p = tl.progress();
          let step = 3;
          if (p < 0.22) step = 0;
          else if (p < 0.48) step = 1;
          else if (p < 0.78) step = 2;
          if (step !== lastStepRef.current) {
            lastStepRef.current = step;
            setCurrentStep(step);
          }
        },
      });

      // Шаг 0: Базовая площадка
      tl.addLabel('base', 0)

        // Шаг 1: Подъем центральной колонны
        .addLabel('pillar', '+=0.2')
        .to('.cluster-pillar', {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
        })

        // Шаг 2: Подъем боковых крыльев и фронтального блока
        .addLabel('wings', '+=0.1')
        .to(
          ['.cluster-wing-left', '.cluster-wing-right'],
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
          },
          'wings'
        )
        .to(
          '.cluster-front',
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
          },
          '-=0.3'
        )

        // Шаг 3: Лазерная фиксация
        .addLabel('lock', '+=0.1')
        .to(
          '.laser-cage',
          {
            opacity: 1,
            duration: 0.1,
            stagger: 0.03,
          },
          'lock'
        )
        .to(
          '.laser-cage',
          {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: 'power2.inOut',
          },
          'lock'
        )
        .to(
          '.core-glow',
          {
            opacity: 0.85,
            scale: 1.15,
            duration: 0.5,
            ease: 'power2.out',
          },
          'lock+=0.4'
        )
        .to(
          '.laser-cage',
          {
            filter: 'drop-shadow(0 0 8px rgba(202, 240, 95, 0.9))',
            duration: 0.4,
            yoyo: true,
            repeat: 1,
          },
          '-=0.2'
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

  const goToStep = (labelKey: string) => {
    if (!timelineRef.current) return;
    timelineRef.current.pause();
    setIsPlaying(false);

    const targetTime = timelineRef.current.labels[labelKey];
    if (typeof targetTime === 'number') {
      gsap.to(timelineRef.current, {
        time: targetTime,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={
        showControls
          ? `relative flex flex-col items-center justify-center p-6 bg-[#0B0C0B] border border-[#222] rounded-2xl overflow-hidden select-none shadow-2xl ${className}`
          : `relative w-full h-full flex items-center justify-center ${className}`
      }
    >
      {showControls && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
      )}

      {/* Радиальное свечение */}
      {showControls && (
        <div className="core-glow absolute w-64 h-64 rounded-full bg-[#CAF05F]/10 blur-3xl pointer-events-none transition-all" />
      )}

      {/* SVG контейнер */}
      <div
        className={
          showControls
            ? "relative z-10 w-full max-w-[320px] aspect-[315/361] flex items-center justify-center"
            : "relative z-10 h-full max-h-full max-w-full aspect-[315/361] flex items-center justify-center"
        }
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 315 361"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`${idPrefix}-pat0`}
              patternUnits="userSpaceOnUse"
              patternTransform="matrix(13.7352 7.93 -29.4449 17 171.784 218.054)"
              preserveAspectRatio="none"
              viewBox="0 0 15.86 34"
              width="1"
              height="1"
            >
              <rect width="1" height="34" fill="#454645" />
            </pattern>
            <pattern
              id={`${idPrefix}-pat1`}
              patternUnits="userSpaceOnUse"
              patternTransform="matrix(9.87269 5.7 -29.4449 17 238.597 112.264)"
              preserveAspectRatio="none"
              viewBox="0 0 11.4 34"
              width="1"
              height="1"
            >
              <rect width="1" height="34" fill="#454645" />
            </pattern>
            <pattern
              id={`${idPrefix}-pat2`}
              patternUnits="userSpaceOnUse"
              patternTransform="matrix(9.87269 5.7 -29.4449 17 104.597 154.264)"
              preserveAspectRatio="none"
              viewBox="0 0 11.4 34"
              width="1"
              height="1"
            >
              <rect width="1" height="34" fill="#454645" />
            </pattern>
            <pattern
              id={`${idPrefix}-pat3`}
              patternUnits="userSpaceOnUse"
              patternTransform="matrix(9.87269 5.7 -29.4449 17 171.596 39.2642)"
              preserveAspectRatio="none"
              viewBox="0 0 11.4 34"
              width="1"
              height="1"
            >
              <rect width="1" height="34" fill="#454645" />
            </pattern>
            <pattern
              id={`${idPrefix}-pat4`}
              patternUnits="userSpaceOnUse"
              patternTransform="matrix(9.87269 5.7 -29.4449 17 171.597 232.264)"
              preserveAspectRatio="none"
              viewBox="0 0 11.4 34"
              width="1"
              height="1"
            >
              <rect width="1" height="34" fill="#454645" />
            </pattern>
          </defs>

          {/* 2. ЦЕНТРАЛЬНАЯ КОЛОННА */}
          <g className="cluster-module cluster-pillar">
            <path d="M224.366 48.0991L157.425 86.7476V239.014L224.366 200.366V48.0991Z" fill="#9AD000" stroke="#454645" />
            <path d="M90.3662 48.0991L157.307 86.7476V239.014L90.3662 200.366V48.0991Z" fill="#9AD000" stroke="#454645" />
            <path d="M157.307 9.36572L224.248 48.0142L157.307 86.6626L90.3656 48.0142L157.307 9.36572Z" fill="#9AD000" />
            <path d="M157.307 9.36572L224.248 48.0142L157.307 86.6626L90.3656 48.0142L157.307 9.36572Z" fill={`url(#${idPrefix}-pat3)`} stroke="#454645" />
          </g>

          {/* 3. ПРАВЫЙ БЛОК */}
          <g className="cluster-module cluster-wing-right">
            <path d="M157.366 120.866L224.307 159.514V295.014L157.366 256.366V120.866Z" fill="#9AD000" stroke="#454645" />
            <path d="M291.366 120.717L224.425 159.366V295.014L291.366 256.366V120.717Z" fill="#9AD000" stroke="#454645" />
            <path d="M224.308 82.3657L291.249 121.014L224.308 159.663L157.367 121.014L224.308 82.3657Z" fill="#9AD000" />
            <path d="M224.308 82.3657L291.249 121.014L224.308 159.663L157.367 121.014L224.308 82.3657Z" fill={`url(#${idPrefix}-pat1)`} stroke="#454645" />
          </g>

          {/* 4. ЛЕВЫЙ БЛОК (выровнен низ) */}
          <g className="cluster-module cluster-wing-left">
            <path d="M157.366 162.866L90.4252 201.514V295.014L157.366 256.366V162.866Z" fill="#9AD000" stroke="#454645" />
            <path d="M23.3662 163.217L90.3073 201.866V295.014L23.3662 256.366V163.217Z" fill="#9AD000" stroke="#454645" />
            <path d="M90.3076 124.366L157.249 163.014L90.3076 201.663L23.3666 163.014L90.3076 124.366Z" fill="#9AD000" />
            <path d="M90.3076 124.366L157.249 163.014L90.3076 201.663L23.3666 163.014L90.3076 124.366Z" fill={`url(#${idPrefix}-pat2)`} stroke="#454645" />
          </g>

          {/* 5. ФРОНТАЛЬНЫЙ БЛОК (опущен на место к исходным высотам) */}
          <g className="cluster-module cluster-front">
            <path d="M224.272 240.866L157.331 279.514V334.014L224.272 295.366V240.866Z" fill="#9AD000" stroke="#454645" />
            <path d="M90.3662 240.865L157.307 279.514V334.014L90.3662 295.366V240.865Z" fill="#9AD000" stroke="#454645" />
            <path d="M157.308 202.366L224.249 241.014L157.308 279.663L90.3666 241.014L157.308 202.366Z" fill="#9AD000" />
            <path d="M157.308 202.366L224.249 241.014L157.308 279.663L90.3666 241.014L157.308 202.366Z" fill={`url(#${idPrefix}-pat4)`} stroke="#454645" />
          </g>

          {/* 6. ЛАЗЕРНЫЙ КАРКАС */}
          <g>
            <path className="laser-cage" d="M23.3662 67.3657L23.3662 282.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M157.366 144.366L157.366 359.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M291.366 67.3657L291.366 282.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M1.36719 243.366L171.367 341.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M313.367 243.366L143.367 341.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M1.36621 73.3657L171.366 171.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 73.3657L143.366 171.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M171.366 1.36572L1.36621 99.3657" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M143.366 1.36572L313.366 99.3657" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
          </g>
        </svg>
      </div>

      {/* Панель управления */}
      {showControls && (
      <div className="relative z-10 flex items-center justify-between w-full mt-6 pt-4 border-t border-[#1F201F]">
        <div className="flex gap-1.5 sm:gap-2">
          {STEPS.map((step, idx) => (
            <button
              key={step.labelKey}
              onClick={() => goToStep(step.labelKey)}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-all ${
                currentStep === idx
                  ? 'bg-[#9AD000]/15 text-[#CAF05F] border-[#CAF05F] shadow-[0_0_8px_rgba(202,240,95,0.2)]'
                  : 'bg-transparent text-neutral-500 border-[#222] hover:border-neutral-600 hover:text-neutral-300'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={togglePlay}
            className="p-2 text-[#CAF05F] bg-[#141614] hover:bg-[#1C201C] rounded border border-[#222] transition-colors active:scale-95"
            title={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={restart}
            className="p-2 text-neutral-400 bg-[#141614] hover:text-[#CAF05F] hover:bg-[#1C201C] rounded border border-[#222] transition-colors active:scale-95"
            title="Перезапустить"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      )}
    </div>
  );
};