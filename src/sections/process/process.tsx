'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ProcessStatus } from '@/components/process-status';
import { Button } from '@/components/button';

export interface ProcessStep {
  stepNumber: string; // '01'
  title: string; // 'FRAME THE PROBLEM'
  description: string; // 'Define user, operational...'
  imageSrc: string | StaticImageData;
  status: 'ACTIVE' | 'READY';
  progressPercent: number; // 21
}

export interface WorkProcessSectionProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
  className?: string;
}

const defaultSteps: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'FRAME THE PROBLEM',
    description:
      'Define user, operational, and technical constraints before interface work starts.',
    imageSrc: '/images/process-step-1.webp',
    status: 'ACTIVE',
    progressPercent: 21,
  },
  {
    stepNumber: '02',
    title: 'EXPOSE THE STATE',
    description:
      'Design the product so progress, risk, and next steps remain visible to non-engineers.',
    imageSrc: '/images/process-step-2.webp',
    status: 'ACTIVE',
    progressPercent: 46,
  },
  {
    stepNumber: '03',
    title: 'SHIP IN SLICES',
    description:
      'Prefer incremental releases that preserve momentum and keep assumptions testable.',
    imageSrc: '/images/process-step-3.webp',
    status: 'ACTIVE',
    progressPercent: 83,
  },
  {
    stepNumber: '04',
    title: 'REVIEW THE EVIDENCE',
    description:
      'Measure outcomes, revisit tradeoffs, and decide the next engineering move with shared context.',
    imageSrc: '/images/process-step-4.webp',
    status: 'READY',
    progressPercent: 100,
  },
];

const NavigationButtons: React.FC<{
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}> = ({ onPrev, onNext, className = '' }) => (
  <div className={`gap-2.5 sm:gap-2 ${className}`}>
    <Button
      variant="outline"
      onClick={onPrev}
      className="w-full sm:w-auto font-bold text-lg sm:text-xl tracking-wider px-3 sm:px-4 h-14 rounded-none uppercase transition-colors"
    >
      &lt;&lt; PREV STEP
    </Button>
    <Button
      variant="outline"
      onClick={onNext}
      className="w-full sm:w-auto font-bold text-lg sm:text-xl tracking-wider px-3 sm:px-4 h-14 rounded-none uppercase transition-colors"
    >
      NEXT STEP &gt;&gt;
    </Button>
  </div>
);

export const WorkProcessSection: React.FC<WorkProcessSectionProps> = ({
  title = 'WORK PROCESS.',
  subtitle = 'I work in visible slices: clear framing, explicit risk, and delivery signals that stay legible to clients.',
  steps = defaultSteps,
  className = '',
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === steps.length - 1;

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const currentStep = steps[currentStepIdx] || steps[0];
  const stepVariantCode = String(currentStepIdx + 1).padStart(3, '0');

  return (
    <section
      id="process"
      className={`w-full bg-background text-foreground font-mono mt-20 px-4 py-4 sm:py-6 sm:px-6 md:px-8 border-b border-t border-border select-none ${className}`}
    >
      <div className="mx-auto flex flex-col gap-6">
        {/* Шапка: Заголовок + десктопные кнопки справа */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lime-light uppercase">
              {title}
            </h2>
            <p className="w-[80%] mt-2 text-lg text-lime-light leading-5">
              {subtitle}
            </p>
          </div>

          {/* Кнопки видны в шапке ТОЛЬКО от sm и выше */}
          <NavigationButtons onPrev={handlePrev} onNext={handleNext} className="hidden sm:flex items-center shrink-0" />
        </div>

        {/* Главный экран терминала */}
        <div
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.045) 2px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 2px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
          className="relative w-full border border-lime/50 bg-card p-5 flex flex-col justify-between min-h-130 sm:min-h-145 md:min-h-160 overflow-hidden"
        >
          {/* Иллюстрация строго по центру всего терминала */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pointer-events-none z-0">
            <div className="relative w-full max-w-[320px] sm:max-w-120 md:max-w-155 aspect-square sm:aspect-16/10 flex items-center justify-center">
              <Image
                key={currentStep.stepNumber}
                src={currentStep.imageSrc}
                alt={`${currentStep.title} isometric schema`}
                width={700}
                height={460}
                loading="lazy"
                draggable={false}
                className="object-contain w-full h-full pointer-events-none transition-opacity duration-200"
              />
            </div>
          </div>

          {/* Верхняя часть: Текст шага + Виджет справа */}
          <div className="relative flex items-start justify-between gap-2 sm:gap-4 z-10 pointer-events-auto">
            <div className="max-w-[60%] sm:max-w-sm">
              <h3 className="text-2xl md:text-4xl font-bold text-lime-soft uppercase tracking-tight flex flex-wrap items-center gap-1 sm:gap-2">
                <span>{currentStep.stepNumber}</span>
                <span>{currentStep.title}</span>
              </h3>
              <p className="hidden lg:block mt-1.5 sm:mt-2 text-base sm:text-xl text-lime-soft leading-snug sm:leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            {/* Компактный виджет на мобилках */}
            <div className="scale-75 origin-top-right sm:scale-100 shrink-0">
              <ProcessStatus
                status={currentStep.status}
                progressPercent={currentStep.progressPercent}
                variantIndex={currentStepIdx + 1}
                totalSteps={steps.length}
              />
            </div>
          </div>

          {/* Нижний футер терминала */}
          <div className="relative flex items-center justify-between pt-3 text-base text-lime-soft uppercase tracking-widest font-mono z-10 pointer-events-auto mt-auto">
            <span>YOUR PROJECT / WORKFLOW / {stepVariantCode}</span>
            <span className="hidden sm:inline">LETNULL19A PORTFOLIO</span>
          </div>
        </div>

        {/* Мобильные кнопки под терминалом (видны ТОЛЬКО на экранах до sm) */}
        <NavigationButtons onPrev={handlePrev} onNext={handleNext} className="grid grid-cols-2 sm:hidden w-full" />
      </div>
    </section>
  );
};
