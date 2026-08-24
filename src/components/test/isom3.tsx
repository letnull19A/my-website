'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

interface IsometricCubeMorphProps {
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  className?: string;
}

const STEPS = [
  { label: 'Seeds', labelKey: 'seeds' },
  { label: 'Wave 1', labelKey: 'wave1' },
  { label: 'Wave 2', labelKey: 'wave2' },
  { label: 'Lock', labelKey: 'lock' },
];

/**
 * Верхняя грань (ромб) — ровно 5 линий с равным шагом
 */
const IsometricDiamond = ({
  top,
  right,
  bottom,
  left,
  hasHatches = true,
}: {
  top: [number, number];
  right: [number, number];
  bottom: [number, number];
  left: [number, number];
  hasHatches?: boolean;
}) => {
  const d = `M${top[0]} ${top[1]}L${right[0]} ${right[1]}L${bottom[0]} ${bottom[1]}L${left[0]} ${left[1]}Z`;

  return (
    <g>
      <path d={d} fill="#9AD000" stroke="#454645" strokeWidth={1} />
      {hasHatches &&
        [1, 2, 3, 4, 5].map((i) => {
          const t = i / 6;
          const x1 = top[0] + (right[0] - top[0]) * t;
          const y1 = top[1] + (right[1] - top[1]) * t;
          const x2 = left[0] + (bottom[0] - left[0]) * t;
          const y2 = left[1] + (bottom[1] - left[1]) * t;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#454645"
              strokeWidth={1.2}
              strokeLinecap="round"
              shapeRendering="geometricPrecision"
            />
          );
        })}
    </g>
  );
};

/**
 * Левая боковая грань — ровно 5 вертикальных линий одинаковой толщины и цвета
 */
const IsometricLeftFace = ({
  top,
  bottom,
  width = 28.9859,
  height = 28.9859,
  hasHatches = true,
}: {
  top: [number, number]; // левая верхняя точка ромба
  bottom: [number, number]; // нижняя центральная точка ромба
  width?: number;
  height?: number;
  hasHatches?: boolean;
}) => {
  const pTopLeft = top;
  const pTopRight = bottom;
  const pBottomLeft: [number, number] = [top[0], top[1] + height];
  const pBottomRight: [number, number] = [bottom[0], bottom[1] + height];

  const pathD = `M${pTopLeft[0]} ${pTopLeft[1]}L${pTopRight[0]} ${pTopRight[1]}L${pBottomRight[0]} ${pBottomRight[1]}L${pBottomLeft[0]} ${pBottomLeft[1]}Z`;

  return (
    <g>
      <path d={pathD} fill="#9AD000" stroke="#454645" strokeWidth={1} />
      {hasHatches &&
        [1, 2, 3, 4, 5].map((i) => {
          const t = i / 6;
          const xTop = pTopLeft[0] + (pTopRight[0] - pTopLeft[0]) * t;
          const yTop = pTopLeft[1] + (pTopRight[1] - pTopLeft[1]) * t;
          const yBottom = yTop + height;

          return (
            <line
              key={i}
              x1={xTop}
              y1={yTop}
              x2={xTop}
              y2={yBottom}
              stroke="#454645"
              strokeWidth={1.2}
              strokeLinecap="round"
              shapeRendering="geometricPrecision"
            />
          );
        })}
    </g>
  );
};

export const IsometricCubeMorph3: React.FC<IsometricCubeMorphProps> = ({
  autoPlay = true,
  loop = true,
  showControls = true,
  className = '',
}) => {
  const [containerRef, inView] = useInView<HTMLDivElement>(0.2);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasInitializedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStep, setCurrentStep] = useState(0);
  const lastStepRef = useRef<number>(-1);

  useEffect(() => {
    // Создаём таймлайн только при первом попадании в зону видимости,
    // чтобы не тратить main thread на setup во время загрузки страницы
    if (hasInitializedRef.current || !inView) return;
    hasInitializedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.set('.voxel-node', {
        scale: 0,
        opacity: 0,
        y: 20,
        transformOrigin: '50% 50%',
      });
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
        paused: true,
        repeat: loop ? -1 : 0,
        repeatDelay: 2,
        onUpdate: () => {
          const p = tl.progress();
          let step = 3;
          if (p < 0.25) step = 0;
          else if (p < 0.55) step = 1;
          else if (p < 0.8) step = 2;
          if (step !== lastStepRef.current) {
            lastStepRef.current = step;
            setCurrentStep(step);
          }
        },
      });

      // Волна 0: 2 нижних крайних кубика
      tl.addLabel('seeds', 0)
        .to('.voxel-seed', {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'back.out(1.7)',
        })

        // Волна 1: Средний и нижний ярус
        .addLabel('wave1', '+=0.1')
        .to(
          '.voxel-w1',
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: 'back.out(1.5)',
          },
          'wave1'
        )

        // Волна 2: Верхний ярус и верхушка
        .addLabel('wave2', '+=0.1')
        .to(
          '.voxel-w2',
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: 'back.out(1.5)',
          },
          'wave2'
        )

        // Волна 3: Неоновый каркас
        .addLabel('lock', '+=0.15')
        .to('.laser-cage', { opacity: 1, duration: 0.1, stagger: 0.02 }, 'lock')
        .to(
          '.laser-cage',
          {
            strokeDashoffset: 0,
            duration: 1.1,
            stagger: 0.04,
            ease: 'power2.inOut',
          },
          'lock'
        )
        .to(
          '.core-glow',
          {
            opacity: 0.9,
            scale: 1.25,
            duration: 0.45,
            ease: 'power2.out',
          },
          'lock+=0.3'
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
  }, [inView, autoPlay, loop, containerRef]);

  // Играть только когда компонент в зоне видимости
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (inView && isPlaying) {
      tl.play();
    } else {
      tl.pause();
    }
  }, [inView, isPlaying]);

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

      {/* Фоновое свечение */}
      <div
        className={
          showControls
            ? "core-glow absolute w-64 h-64 rounded-full bg-[#CAF05F]/10 blur-3xl pointer-events-none transition-all"
            : "core-glow absolute left-1/2 top-1/2 w-64 h-64 -ml-32 -mt-32 rounded-full bg-[#CAF05F]/10 blur-3xl pointer-events-none transition-all"
        }
      />

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
          {/* ================= ШАГ 0: 2 НИЖНИХ КРАЙНИХ КУБА (SEEDS) ================= */}
          {/* 1. Левый крайний куб */}
          <g className="voxel-node voxel-seed">
            <IsometricDiamond
              top={[39.0723, 201.727]}
              right={[67.4555, 218.114]}
              bottom={[39.3779, 234.325]}
              left={[10.9946, 217.938]}
              hasHatches={false}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 67.4365 218.135)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[10.9946, 217.938]}
              bottom={[39.3779, 234.325]}
              height={28.9859}
              hasHatches={true}
            />
          </g>

          {/* 2. Правый крайний куб */}
          <g className="voxel-node voxel-seed">
            <IsometricDiamond
              top={[276.619, 200.861]}
              right={[305.304, 217.422]}
              bottom={[276.928, 233.804]}
              left={[248.244, 217.243]}
              hasHatches={false}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 304.986 217.615)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[248.244, 217.243]}
              bottom={[276.928, 233.804]}
              height={28.9859}
              hasHatches={false}
            />
          </g>

          {/* ================= ШАГ 1: ВОЛНА ПО НИЖНЕМУ И СРЕДНЕМУ СЛОЮ ================= */}
          {/* 3. Фронтальный самый нижний куб */}
          <g className="voxel-node voxel-w1">
            <IsometricDiamond
              top={[156.913, 270.18]}
              right={[185.598, 286.741]}
              bottom={[157.222, 303.124]}
              left={[128.537, 286.563]}
              hasHatches={false}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 185.279 286.934)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[128.537, 286.563]}
              bottom={[157.222, 303.124]}
              height={28.9859}
              hasHatches={true}
            />
          </g>

          {/* 4. Левый внутренний куб */}
          <g className="voxel-node voxel-w1">
            <IsometricDiamond
              top={[97.8916, 236.366]}
              right={[126.576, 252.927]}
              bottom={[98.2005, 269.31]}
              left={[69.516, 252.749]}
              hasHatches={false}
            />
            <IsometricLeftFace
              top={[69.516, 252.749]}
              bottom={[98.2005, 269.31]}
              height={28.9859}
              hasHatches={true}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 126.258 253.121)" fill="#9AD000" stroke="#454645" />
          </g>

          {/* 5. Центральный средний куб */}
          <g className="voxel-node voxel-w1">
            <IsometricDiamond
              top={[156.913, 211.259]}
              right={[185.598, 227.82]}
              bottom={[157.222, 244.203]}
              left={[128.537, 227.642]}
              hasHatches={false}
            />
            <IsometricLeftFace
              top={[128.537, 227.642]}
              bottom={[157.222, 244.203]}
              height={28.9859}
              hasHatches={true}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 185.279 228.012)" fill="#9AD000" stroke="#454645" />
          </g>

          {/* 6. Правый внутренний куб */}
          <g className="voxel-node voxel-w1">
            <IsometricDiamond
              top={[220.297, 233.788]}
              right={[248.981, 250.349]}
              bottom={[220.606, 266.732]}
              left={[191.921, 250.171]}
              hasHatches={false}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 248.664 250.542)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[191.921, 250.171]}
              bottom={[220.606, 266.732]}
              height={28.9859}
              hasHatches={false}
            />
          </g>

          {/* 7. Левый средний куб */}
          <g className="voxel-node voxel-w1">
            <IsometricDiamond
              top={[39.0723, 142.806]}
              right={[67.4555, 159.193]}
              bottom={[39.3779, 175.403]}
              left={[10.9946, 159.016]}
              hasHatches={false}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 67.4365 159.213)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[10.9946, 159.016]}
              bottom={[39.3779, 175.403]}
              height={28.9859}
              hasHatches={true}
            />
          </g>

          {/* 8. Правый средний куб */}
          <g className="voxel-node voxel-w1">
            <IsometricDiamond
              top={[276.619, 141.939]}
              right={[305.304, 158.5]}
              bottom={[276.928, 174.883]}
              left={[248.244, 158.322]}
              hasHatches={false}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 304.986 158.693)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[248.244, 158.322]}
              bottom={[276.928, 174.883]}
              height={28.9859}
              hasHatches={false}
            />
          </g>

          {/* ================= ШАГ 2: ВОЛНА ПО ВЕРХНЕМУ СЛОЮ И ВЕРХУШКЕ ================= */}
          {/* 9. Центральный верхний куб */}
          <g className="voxel-node voxel-w2">
            <IsometricDiamond
              top={[156.913, 147.138]}
              right={[185.598, 163.699]}
              bottom={[157.222, 180.082]}
              left={[128.537, 163.521]}
              hasHatches={true}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 185.279 163.892)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[128.537, 163.521]}
              bottom={[157.222, 180.082]}
              height={28.9859}
              hasHatches={true}
            />
          </g>

          {/* 10. Левый верхний куб */}
          <g className="voxel-node voxel-w2">
            <IsometricDiamond
              top={[39.0723, 78.6851]}
              right={[67.4555, 95.0721]}
              bottom={[39.3779, 111.283]}
              left={[10.9946, 94.8957]}
              hasHatches={true}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 67.4365 95.0928)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[10.9946, 94.8957]}
              bottom={[39.3779, 111.283]}
              height={28.9859}
              hasHatches={true}
            />
            
            <IsometricDiamond
              top={[97.8916, 113.324]}
              right={[126.576, 129.885]}
              bottom={[98.2005, 146.268]}
              left={[69.516, 129.707]}
              hasHatches={true}
            />
            <IsometricLeftFace
              top={[69.516, 129.707]}
              bottom={[98.2005, 146.268]}
              height={28.9859}
              hasHatches={true}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 126.579 130.347)" fill="#9AD000" stroke="#454645" />
          </g>

          {/* 11. Правый верхний куб */}
          <g className="voxel-node voxel-w2">
            <IsometricDiamond
              top={[276.619, 77.8188]}
              right={[305.304, 94.3798]}
              bottom={[276.928, 110.762]}
              left={[248.244, 94.2015]}
              hasHatches={true}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 245.965 124.88)" fill="#9AD000" stroke="#454645" />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 304.986 94.5725)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[248.244, 94.2015]}
              bottom={[276.928, 110.762]}
              height={28.9859}
              hasHatches={false}
            />
            
            <IsometricDiamond
              top={[220.297, 110.745]}
              right={[248.981, 127.306]}
              bottom={[220.606, 143.689]}
              left={[191.921, 127.128]}
              hasHatches={true}
            />
            <rect width="32.4213" height="29.2208" transform="matrix(-0.866025 0.5 0 1 248.664 127.499)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[191.921, 127.128]}
              bottom={[220.606, 143.689]}
              height={28.9859}
              hasHatches={false}
            />
          </g>

          {/* 12. Верхние боковые ромбы */}
          <g className="voxel-node voxel-w2">
            <IsometricDiamond
              top={[217.599, 44.0049]}
              right={[246.283, 60.5659]}
              bottom={[217.907, 76.9485]}
              left={[189.223, 60.3875]}
              hasHatches={true}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 245.965 60.7585)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[189.223, 60.3875]}
              bottom={[217.907, 76.9485]}
              height={28.9859}
              hasHatches={false}
            />

            <IsometricDiamond
              top={[102.457, 42.292]}
              right={[130.84, 58.6791]}
              bottom={[102.763, 74.8897]}
              left={[74.3794, 58.5026]}
              hasHatches={true}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 130.82 58.6997)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[74.3794, 58.5026]}
              bottom={[102.763, 74.8897]}
              height={28.9859}
              hasHatches={false}
            />
          </g>

          {/* 13. Финальный пиковый куб (APEX) */}
          <g className="voxel-node voxel-w2">
            <IsometricDiamond
              top={[158.779, 9.36572]}
              right={[187.163, 25.7528]}
              bottom={[159.085, 41.9635]}
              left={[130.702, 25.5764]}
              hasHatches={true}
            />
            <rect width="32.4213" height="28.6728" transform="matrix(-0.866025 0.5 0 1 187.143 25.7734)" fill="#9AD000" stroke="#454645" />
            <IsometricLeftFace
              top={[130.702, 25.5764]}
              bottom={[159.085, 41.9635]}
              height={28.9859}
              hasHatches={false}
            />
          </g>

          {/* ================= ЛАЗЕРНЫЙ КАРКАС (#CAF05F) ================= */}
          <g>
            <path className="laser-cage" d="M11.3662 67.3657L11.3662 282.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M157.366 144.366L157.366 359.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M305.366 67.3657L305.366 282.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M1.36719 243.366L171.367 341.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M313.367 243.366L143.367 341.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M1.36621 90.3657L171.366 188.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
            <path className="laser-cage" d="M313.366 90.3657L143.366 188.366" stroke="#CAF05F" strokeWidth={2} strokeLinecap="square" />
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