'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

interface FormLoopClusterProps {
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  className?: string;
}

const STEPS = [
  { label: 'Back', labelKey: 'back' },
  { label: 'Middle', labelKey: 'mid' },
  { label: 'Front', labelKey: 'front' },
  { label: 'Lock', labelKey: 'lock' },
];

export const IsometricFormLoopCluster: React.FC<FormLoopClusterProps> = ({
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

  const rawId = useId();
  const idPrefix = rawId.replace(/:/g, '');

  useEffect(() => {
    if (hasInitializedRef.current || !inView) return;
    hasInitializedRef.current = true;

    const ctx = gsap.context(() => {
      // Исходные состояния слоев
      gsap.set('.form-back', { opacity: 0, y: -45, scale: 0.95, transformOrigin: '50% 50%' });
      gsap.set('.form-mid', { opacity: 0, y: 35, scale: 0.95, transformOrigin: '50% 50%' });
      gsap.set('.form-front', { opacity: 0, y: 55, scale: 0.95, transformOrigin: '50% 50%' });
      gsap.set('.core-glow', { opacity: 0.15, scale: 0.85 });

      const tl = gsap.timeline({
        paused: true,
        repeat: loop ? -1 : 0,
        repeatDelay: 2,
        onUpdate: () => {
          const p = tl.progress();
          let step = 3;
          if (p < 0.25) step = 0;
          else if (p < 0.52) step = 1;
          else if (p < 0.78) step = 2;
          if (step !== lastStepRef.current) {
            lastStepRef.current = step;
            setCurrentStep(step);
          }
        },
      });

      // Шаг 0: Задняя часть (FormCubeBack — точные пути из Figma)
      tl.addLabel('back', 0)
        .to('.form-back', {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'power3.out',
        })

        // Шаг 1: Средняя связующая группа (FormCubeMiddle — точные пути из Figma)
        .addLabel('mid', '+=0.1')
        .to(
          '.form-mid',
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
          },
          'mid'
        )

        // Шаг 2: Фронтальная часть (FormCubeFront — точные пути из Figma)
        .addLabel('front', '+=0.1')
        .to(
          '.form-front',
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
          },
          'front'
        )

        // Шаг 3: Финальное свечение
        .addLabel('lock', '+=0.15')
        .to(
          '.core-glow',
          {
            opacity: 0.9,
            scale: 1.25,
            duration: 0.45,
            ease: 'power2.out',
          },
          'lock'
        );

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [inView, autoPlay, loop, containerRef]);

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

      {/* Радиальное свечение */}
      <div
        className={
          showControls
            ? 'core-glow absolute w-64 h-64 rounded-full bg-[#CAF05F]/10 blur-3xl pointer-events-none transition-all'
            : 'core-glow absolute left-1/2 top-1/2 w-64 h-64 -ml-32 -mt-32 rounded-full bg-[#CAF05F]/10 blur-3xl pointer-events-none transition-all'
        }
      />

      {/* SVG контейнер — единый viewBox 0 0 401 509, слои из исходников Figma */}
      <div
        className={
          showControls
            ? 'relative z-10 w-full max-w-[320px] aspect-[401/509] flex items-center justify-center'
            : 'relative z-10 h-full max-h-full max-w-full aspect-[401/509] flex items-center justify-center'
        }
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 401 509"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>

            <pattern id={`${idPrefix}-back-p0`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4817 6.63575 -27.8841 16.1154 197.434 92.3105)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-back-p0-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-back-p0-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-back-p0-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-back-p0-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-back-p1`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5481 11.653)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-back-p1-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-back-p1-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-back-p1-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-back-p1-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-back-p2`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4817 6.63575 -27.8841 16.1154 272.66 23.2507)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-back-p2-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-back-p2-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-back-p2-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-back-p2-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-back-p3`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5743 11.6764)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-back-p3-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-back-p3-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-back-p3-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-back-p3-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-back-p4`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4799 6.63883 -27.8798 16.1229 348.304 131.179)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-back-p4-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-back-p4-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-back-p4-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-back-p4-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-back-p5`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5743 11.6764)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-back-p5-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-back-p5-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-back-p5-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-back-p5-inner`} transform="translate(7 17)"/>
            </pattern>
            <pattern id={`${idPrefix}-mid-p0`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4799 6.63883 -27.8798 16.1229 132.606 142.81)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-mid-p0-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-mid-p0-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-mid-p0-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-mid-p0-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-mid-p1`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5481 11.653)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-mid-p1-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-mid-p1-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-mid-p1-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-mid-p1-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-mid-p2`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4817 6.63575 -27.8841 16.1154 208.454 73.7771)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-mid-p2-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-mid-p2-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-mid-p2-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-mid-p2-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-mid-p3`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5743 11.6764)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-mid-p3-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-mid-p3-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-mid-p3-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-mid-p3-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-mid-p4`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4817 6.63575 -27.8841 16.1154 284.097 117.36)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-mid-p4-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-mid-p4-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-mid-p4-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-mid-p4-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-mid-p5`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5743 11.6764)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-mid-p5-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-mid-p5-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-mid-p5-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-mid-p5-inner`} transform="translate(7 17)"/>
            </pattern>
            <pattern id={`${idPrefix}-front-p0`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4817 6.63575 -27.8841 16.1154 68.0681 71.0107)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-front-p0-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-front-p0-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-front-p0-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-front-p0-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-front-p1`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4799 6.63883 -27.8798 16.1229 143.652 222.876)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-front-p1-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-front-p1-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-front-p1-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-front-p1-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-front-p2`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5481 11.653)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-front-p2-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-front-p2-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-front-p2-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-front-p2-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-front-p3`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5481 11.653)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-front-p3-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-front-p3-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-front-p3-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-front-p3-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-front-p4`} patternUnits="userSpaceOnUse" patternTransform="matrix(11.4817 6.63575 -27.8841 16.1154 219.237 266.412)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-front-p4-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-front-p4-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-front-p4-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-front-p4-inner`} transform="translate(7 17)"/>
            </pattern><pattern id={`${idPrefix}-front-p5`} patternUnits="userSpaceOnUse" patternTransform="matrix(13.2613 0 0 32.206 30.5481 11.653)" preserveAspectRatio="none" viewBox="0 0 14 34" width="1" height="1">
            <use href={`#${idPrefix}-front-p5-inner`} transform="translate(0 -34)"/>
            <use href={`#${idPrefix}-front-p5-inner`} transform="translate(7 -17)"/>
            <g id={`${idPrefix}-front-p5-inner`}>
            <rect width="1" height="34" fill="#454645"/>
            </g>
            <use href={`#${idPrefix}-front-p5-inner`} transform="translate(7 17)"/>
            </pattern>
          </defs>

          {/* 1. ЗАДНЯЯ ЧАСТЬ — FormCubeBack.svg, оригинальные d и matrix */}
          <g className="form-back">

            <path d="M183.904 215.966L237.622 247.011L183.904 278.057L130.187 247.011L183.904 215.966Z" fill="#9AD000"/>
            <path d="M183.904 215.966L184.314 215.729L183.904 215.492L183.494 215.729L183.904 215.966ZM237.622 247.011L238.032 247.248L238.442 247.011L238.032 246.774L237.622 247.011ZM183.904 278.057L183.494 278.294L183.904 278.531L184.314 278.294L183.904 278.057ZM130.187 247.011L129.777 246.774L129.367 247.011L129.777 247.248L130.187 247.011ZM183.904 215.966L183.494 216.203L237.212 247.248L237.622 247.011L238.032 246.774L184.314 215.729L183.904 215.966ZM237.622 247.011L237.212 246.774L183.494 277.82L183.904 278.057L184.314 278.294L238.032 247.248L237.622 247.011ZM183.904 278.057L184.314 277.82L130.597 246.774L130.187 247.011L129.777 247.248L183.494 278.294L183.904 278.057ZM130.187 247.011L130.597 247.248L184.314 216.203L183.904 215.966L183.494 215.729L129.777 246.774L130.187 247.011Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 130.186 247.079)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 237.716 247.079)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M183.904 142.771L237.622 173.817L183.904 204.863L130.187 173.817L183.904 142.771Z" fill="#9AD000"/>
            <path d="M183.904 142.771L184.314 142.534L183.904 142.298L183.494 142.534L183.904 142.771ZM237.622 173.817L238.032 174.054L238.442 173.817L238.032 173.58L237.622 173.817ZM183.904 204.863L183.494 205.1L183.904 205.337L184.314 205.1L183.904 204.863ZM130.187 173.817L129.777 173.58L129.367 173.817L129.777 174.054L130.187 173.817ZM183.904 142.771L183.494 143.008L237.212 174.054L237.622 173.817L238.032 173.58L184.314 142.534L183.904 142.771ZM237.622 173.817L237.212 173.58L183.494 204.626L183.904 204.863L184.314 205.1L238.032 174.054L237.622 173.817ZM183.904 204.863L184.314 204.626L130.597 173.58L130.187 173.817L129.777 174.054L183.494 205.1L183.904 204.863ZM130.187 173.817L130.597 174.054L184.314 143.008L183.904 142.771L183.494 142.534L129.777 173.58L130.187 173.817Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 130.186 173.885)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 237.716 173.885)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 130.186 100.691)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 237.716 100.691)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M183.902 69.5791L237.586 100.605L183.902 131.631L130.219 100.605L183.902 69.5791Z" fill="#9AD000"/>
            <path d="M183.902 69.5791L237.586 100.605L183.902 131.631L130.219 100.605L183.902 69.5791Z" fill={`url(#${idPrefix}-back-p0)`}/>
            <path d="M183.902 69.5791L237.586 100.605L183.902 131.631L130.219 100.605L183.902 69.5791Z" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M259.486 259.636L313.204 290.681L259.486 321.727L205.769 290.681L259.486 259.636Z" fill="#9AD000"/>
            <path d="M259.486 259.636L259.896 259.399L259.486 259.162L259.076 259.399L259.486 259.636ZM313.204 290.681L313.614 290.918L314.024 290.681L313.614 290.444L313.204 290.681ZM259.486 321.727L259.076 321.964L259.486 322.201L259.896 321.964L259.486 321.727ZM205.769 290.681L205.359 290.444L204.949 290.681L205.359 290.918L205.769 290.681ZM259.486 259.636L259.076 259.873L312.794 290.918L313.204 290.681L313.614 290.444L259.896 259.399L259.486 259.636ZM313.204 290.681L312.794 290.444L259.076 321.49L259.486 321.727L259.896 321.964L313.614 290.918L313.204 290.681ZM259.486 321.727L259.896 321.49L206.179 290.444L205.769 290.681L205.359 290.918L259.076 321.964L259.486 321.727ZM205.769 290.681L206.179 290.918L259.896 259.873L259.486 259.636L259.076 259.399L205.359 290.444L205.769 290.681Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 205.766 290.749)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 313.297 290.749)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M335.07 364.934L388.788 395.979L335.07 427.025L281.353 395.979L335.07 364.934Z" fill="#9AD000"/>
            <path d="M335.07 364.934L335.48 364.697L335.07 364.46L334.66 364.697L335.07 364.934ZM388.788 395.979L389.198 396.216L389.608 395.979L389.198 395.742L388.788 395.979ZM335.07 427.025L334.66 427.262L335.07 427.499L335.48 427.262L335.07 427.025ZM281.353 395.979L280.943 395.742L280.533 395.979L280.943 396.216L281.353 395.979ZM335.07 364.934L334.66 365.171L388.378 396.216L388.788 395.979L389.198 395.742L335.48 364.697L335.07 364.934ZM388.788 395.979L388.378 395.742L334.66 426.788L335.07 427.025L335.48 427.262L389.198 396.216L388.788 395.979ZM335.07 427.025L335.48 426.788L281.763 395.742L281.353 395.979L280.943 396.216L334.66 427.262L335.07 427.025ZM281.353 395.979L281.763 396.216L335.48 365.171L335.07 364.934L334.66 364.697L280.943 395.742L281.353 395.979Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 281.352 396.047)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 388.881 396.047)" fill="#9AD000"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 388.881 396.047)" fill={`url(#${idPrefix}-back-p1)`}/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 388.881 396.047)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M259.128 0.473633L312.891 31.5454L259.128 62.6172L205.365 31.5454L259.128 0.473633Z" fill="#9AD000"/>
            <path d="M259.128 0.473633L312.891 31.5454L259.128 62.6172L205.365 31.5454L259.128 0.473633Z" fill={`url(#${idPrefix}-back-p2)`}/>
            <path d="M259.128 0.473633L312.891 31.5454L259.128 62.6172L205.365 31.5454L259.128 0.473633Z" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 205.365 31.6143)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 205.365 31.6143)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 205.365 31.6143)" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 312.985 31.6143)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 312.985 31.6143)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 312.985 31.6143)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M334.774 206.298L388.529 237.384L334.774 268.47L281.02 237.384L334.774 206.298Z" fill="#9AD000"/>
            <path d="M334.774 206.298L335.184 206.061L334.774 205.824L334.364 206.061L334.774 206.298ZM388.529 237.384L388.939 237.621L389.349 237.384L388.939 237.147L388.529 237.384ZM334.774 268.47L334.364 268.707L334.774 268.945L335.184 268.707L334.774 268.47ZM281.02 237.384L280.61 237.147L280.2 237.384L280.61 237.621L281.02 237.384ZM334.774 206.298L334.364 206.535L388.119 237.621L388.529 237.384L388.939 237.147L335.184 206.061L334.774 206.298ZM388.529 237.384L388.119 237.147L334.364 268.233L334.774 268.47L335.184 268.707L388.939 237.621L388.529 237.384ZM334.774 268.47L335.184 268.233L281.43 237.147L281.02 237.384L280.61 237.621L334.364 268.707L334.774 268.47ZM281.02 237.384L281.43 237.621L335.184 206.535L334.774 206.298L334.364 206.061L280.61 237.147L281.02 237.384Z" fill="#454645"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 281.012 237.437)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 388.632 237.437)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 388.632 237.437)" fill={`url(#${idPrefix}-back-p3)`}/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 388.632 237.437)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M334.774 108.392L388.529 139.478L334.774 170.564L281.02 139.478L334.774 108.392Z" fill="#9AD000"/>
            <path d="M334.774 108.392L388.529 139.478L334.774 170.564L281.02 139.478L334.774 108.392Z" fill={`url(#${idPrefix}-back-p4)`}/>
            <path d="M334.774 108.392L388.529 139.478L334.774 170.564L281.02 139.478L334.774 108.392Z" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 281.012 139.531)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 388.632 139.531)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 388.632 139.531)" fill={`url(#${idPrefix}-back-p5)`}/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 388.632 139.531)" stroke="#454645" strokeWidth="0.947236"/>
          </g>

          {/* 2. СРЕДНЯЯ ЧАСТЬ — FormCubeMiddle.svg, оригинальные d и matrix */}
          <g className="form-mid">

            <path d="M119.078 266.455L172.787 297.515L119.078 328.575L65.369 297.515L119.078 266.455Z" fill="#9AD000"/>
            <path d="M119.078 266.455L119.488 266.218L119.078 265.981L118.668 266.218L119.078 266.455ZM172.787 297.515L173.197 297.752L173.607 297.515L173.197 297.278L172.787 297.515ZM119.078 328.575L118.668 328.812L119.078 329.049L119.488 328.812L119.078 328.575ZM65.369 297.515L64.959 297.278L64.549 297.515L64.959 297.752L65.369 297.515ZM119.078 266.455L118.668 266.692L172.377 297.752L172.787 297.515L173.197 297.278L119.488 266.218L119.078 266.455ZM172.787 297.515L172.377 297.278L118.668 328.338L119.078 328.575L119.488 328.812L173.197 297.752L172.787 297.515ZM119.078 328.575L119.488 328.338L65.779 297.278L65.369 297.515L64.959 297.752L118.668 328.812L119.078 328.575ZM65.369 297.515L65.779 297.752L119.488 266.692L119.078 266.455L118.668 266.218L64.959 297.278L65.369 297.515Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 65.3594 297.568)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 172.889 297.568)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M119.078 193.262L172.787 224.322L119.078 255.382L65.369 224.322L119.078 193.262Z" fill="#9AD000"/>
            <path d="M119.078 193.262L119.488 193.025L119.078 192.788L118.668 193.025L119.078 193.262ZM172.787 224.322L173.197 224.559L173.607 224.322L173.197 224.085L172.787 224.322ZM119.078 255.382L118.668 255.619L119.078 255.856L119.488 255.619L119.078 255.382ZM65.369 224.322L64.959 224.085L64.549 224.322L64.959 224.559L65.369 224.322ZM119.078 193.262L118.668 193.499L172.377 224.559L172.787 224.322L173.197 224.085L119.488 193.025L119.078 193.262ZM172.787 224.322L172.377 224.085L118.668 255.145L119.078 255.382L119.488 255.619L173.197 224.559L172.787 224.322ZM119.078 255.382L119.488 255.145L65.779 224.085L65.369 224.322L64.959 224.559L118.668 255.619L119.078 255.382ZM65.369 224.322L65.779 224.559L119.488 193.499L119.078 193.262L118.668 193.025L64.959 224.085L65.369 224.322Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 65.3594 224.375)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 172.889 224.375)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 65.3594 151.181)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 172.888 151.181)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M119.076 120.068L172.752 151.109L119.076 182.149L65.4008 151.109L119.076 120.068Z" fill="#9AD000"/>
            <path d="M119.076 120.068L172.752 151.109L119.076 182.149L65.4008 151.109L119.076 120.068Z" fill={`url(#${idPrefix}-mid-p0)`}/>
            <path d="M119.076 120.068L172.752 151.109L119.076 182.149L65.4008 151.109L119.076 120.068Z" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M194.662 310.125L248.38 341.171L194.662 372.216L140.945 341.171L194.662 310.125Z" fill="#9AD000"/>
            <path d="M194.662 310.125L195.072 309.888L194.662 309.651L194.252 309.888L194.662 310.125ZM248.38 341.171L248.79 341.408L249.2 341.171L248.79 340.934L248.38 341.171ZM194.662 372.216L194.252 372.453L194.662 372.69L195.072 372.453L194.662 372.216ZM140.945 341.171L140.535 340.934L140.124 341.171L140.535 341.408L140.945 341.171ZM194.662 310.125L194.252 310.362L247.97 341.408L248.38 341.171L248.79 340.934L195.072 309.888L194.662 310.125ZM248.38 341.171L247.97 340.934L194.252 371.979L194.662 372.216L195.072 372.453L248.79 341.408L248.38 341.171ZM194.662 372.216L195.072 371.979L141.355 340.934L140.945 341.171L140.535 341.408L194.252 372.453L194.662 372.216ZM140.945 341.171L141.355 341.408L195.072 310.362L194.662 310.125L194.252 309.888L140.535 340.934L140.945 341.171Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 140.943 341.239)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 248.473 341.239)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M270.242 353.671L323.96 384.716L270.242 415.762L216.525 384.716L270.242 353.671Z" fill="#9AD000"/>
            <path d="M270.242 353.671L270.652 353.434L270.242 353.197L269.832 353.434L270.242 353.671ZM323.96 384.716L324.37 384.953L324.78 384.716L324.37 384.48L323.96 384.716ZM270.242 415.762L269.832 415.999L270.242 416.236L270.652 415.999L270.242 415.762ZM216.525 384.716L216.115 384.48L215.705 384.716L216.115 384.953L216.525 384.716ZM270.242 353.671L269.832 353.908L323.55 384.953L323.96 384.716L324.37 384.48L270.652 353.434L270.242 353.671ZM323.96 384.716L323.55 384.48L269.832 415.525L270.242 415.762L270.652 415.999L324.37 384.953L323.96 384.716ZM270.242 415.762L270.652 415.525L216.935 384.48L216.525 384.716L216.115 384.953L269.832 415.999L270.242 415.762ZM216.525 384.716L216.935 384.953L270.652 353.908L270.242 353.671L269.832 353.434L216.115 384.48L216.525 384.716Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 216.523 384.784)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 324.056 384.784)" fill="#9AD000"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 324.056 384.784)" fill={`url(#${idPrefix}-mid-p1)`}/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 324.056 384.784)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M194.922 120.882L248.685 151.954L194.922 183.025L141.159 151.954L194.922 120.882Z" fill="#9AD000"/>
            <path d="M194.922 120.882L195.332 120.645L194.922 120.408L194.512 120.645L194.922 120.882ZM248.685 151.954L249.095 152.191L249.505 151.954L249.095 151.717L248.685 151.954ZM194.922 183.025L194.512 183.262L194.922 183.499L195.332 183.262L194.922 183.025ZM141.159 151.954L140.749 151.717L140.339 151.954L140.749 152.191L141.159 151.954ZM194.922 120.882L194.512 121.119L248.275 152.191L248.685 151.954L249.095 151.717L195.332 120.645L194.922 120.882ZM248.685 151.954L248.275 151.717L194.512 182.788L194.922 183.025L195.332 183.262L249.095 152.191L248.685 151.954ZM194.922 183.025L195.332 182.788L141.569 151.717L141.159 151.954L140.749 152.191L194.512 183.262L194.922 183.025ZM141.159 151.954L141.569 152.191L195.332 121.119L194.922 120.882L194.512 120.645L140.749 151.717L141.159 151.954Z" fill="#454645"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 141.157 152.021)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 248.779 152.021)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M194.922 51L248.685 82.0718L194.922 113.144L141.159 82.0718L194.922 51Z" fill="#9AD000"/>
            <path d="M194.922 51L248.685 82.0718L194.922 113.144L141.159 82.0718L194.922 51Z" fill={`url(#${idPrefix}-mid-p2)`}/>
            <path d="M194.922 51L248.685 82.0718L194.922 113.144L141.159 82.0718L194.922 51Z" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 141.157 82.1396)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 141.157 82.1396)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 141.157 82.1396)" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 248.779 82.1396)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 248.779 82.1396)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 248.779 82.1396)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M270.565 167.838L324.328 198.91L270.565 229.981L216.803 198.91L270.565 167.838Z" fill="#9AD000"/>
            <path d="M270.565 167.838L270.975 167.601L270.565 167.364L270.155 167.601L270.565 167.838ZM324.328 198.91L324.738 199.147L325.148 198.91L324.738 198.673L324.328 198.91ZM270.565 229.981L270.155 230.218L270.565 230.455L270.975 230.218L270.565 229.981ZM216.803 198.91L216.393 198.673L215.982 198.91L216.393 199.147L216.803 198.91ZM270.565 167.838L270.155 168.075L323.918 199.147L324.328 198.91L324.738 198.673L270.975 167.601L270.565 167.838ZM324.328 198.91L323.918 198.673L270.155 229.744L270.565 229.981L270.975 230.218L324.738 199.147L324.328 198.91ZM270.565 229.981L270.975 229.744L217.213 198.673L216.803 198.91L216.393 199.147L270.155 230.218L270.565 229.981ZM216.803 198.91L217.213 199.147L270.975 168.075L270.565 167.838L270.155 167.601L216.393 198.673L216.803 198.91Z" fill="#454645"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 216.803 198.978)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 324.423 198.978)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 324.423 198.978)" fill={`url(#${idPrefix}-mid-p3)`}/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 324.423 198.978)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M270.565 94.583L324.328 125.655L270.565 156.727L216.803 125.655L270.565 94.583Z" fill="#9AD000"/>
            <path d="M270.565 94.583L324.328 125.655L270.565 156.727L216.803 125.655L270.565 94.583Z" fill={`url(#${idPrefix}-mid-p4)`}/>
            <path d="M270.565 94.583L324.328 125.655L270.565 156.727L216.803 125.655L270.565 94.583Z" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(0.865803 0.500384 0 1 216.803 125.723)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 324.423 125.723)" fill="#9AD000"/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 324.423 125.723)" fill={`url(#${idPrefix}-mid-p5)`}/>
            <rect width="62.0959" height="55.5588" transform="matrix(-0.865803 0.500384 0 1 324.423 125.723)" stroke="#454645" strokeWidth="0.947236"/>
          </g>

          {/* 3. ПЕРЕДНЯЯ ЧАСТЬ — FormCubeFront.svg, оригинальные d и matrix */}
          <g className="form-front">

            <path d="M54.5381 302.831L108.256 333.877L54.5381 364.922L0.820585 333.877L54.5381 302.831Z" fill="#9AD000"/>
            <path d="M54.5381 302.831L54.9481 302.594L54.5381 302.357L54.128 302.594L54.5381 302.831ZM108.256 333.877L108.666 334.114L109.076 333.877L108.666 333.64L108.256 333.877ZM54.5381 364.922L54.128 365.159L54.5381 365.396L54.9481 365.159L54.5381 364.922ZM0.820585 333.877L0.410525 333.64L0.00046563 333.877L0.410526 334.114L0.820585 333.877ZM54.5381 302.831L54.128 303.068L107.846 334.114L108.256 333.877L108.666 333.64L54.9481 302.594L54.5381 302.831ZM108.256 333.877L107.846 333.64L54.128 364.685L54.5381 364.922L54.9481 365.159L108.666 334.114L108.256 333.877ZM54.5381 364.922L54.9481 364.685L1.23065 333.64L0.820585 333.877L0.410526 334.114L54.128 365.159L54.5381 364.922ZM0.820585 333.877L1.23065 334.114L54.9481 303.068L54.5381 302.831L54.128 302.594L0.410525 333.64L0.820585 333.877Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 0.819336 333.945)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 108.349 333.945)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M54.5381 229.638L108.256 260.683L54.5381 291.729L0.820585 260.683L54.5381 229.638Z" fill="#9AD000"/>
            <path d="M54.5381 229.638L54.9481 229.401L54.5381 229.164L54.128 229.401L54.5381 229.638ZM108.256 260.683L108.666 260.92L109.076 260.683L108.666 260.446L108.256 260.683ZM54.5381 291.729L54.128 291.966L54.5381 292.203L54.9481 291.966L54.5381 291.729ZM0.820585 260.683L0.410525 260.446L0.00046563 260.683L0.410526 260.92L0.820585 260.683ZM54.5381 229.638L54.128 229.875L107.846 260.92L108.256 260.683L108.666 260.446L54.9481 229.401L54.5381 229.638ZM108.256 260.683L107.846 260.446L54.128 291.492L54.5381 291.729L54.9481 291.966L108.666 260.92L108.256 260.683ZM54.5381 291.729L54.9481 291.492L1.23065 260.446L0.820585 260.683L0.410526 260.92L54.128 291.966L54.5381 291.729ZM0.820585 260.683L1.23065 260.92L54.9481 229.875L54.5381 229.638L54.128 229.401L0.410525 260.446L0.820585 260.683Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 0.819336 260.751)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 108.349 260.751)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 0.819336 79.3916)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 108.349 79.3916)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M54.5361 48.2793L108.22 79.3054L54.5361 110.331L0.852433 79.3054L54.5361 48.2793Z" fill="#9AD000"/>
            <path d="M54.5361 48.2793L108.22 79.3054L54.5361 110.331L0.852433 79.3054L54.5361 48.2793Z" fill={`url(#${idPrefix}-front-p0)`}/>
            <path d="M54.5361 48.2793L108.22 79.3054L54.5361 110.331L0.852433 79.3054L54.5361 48.2793Z" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M130.122 389.072L183.831 420.132L130.122 451.192L76.4129 420.132L130.122 389.072Z" fill="#9AD000"/>
            <path d="M130.122 389.072L130.532 388.835L130.122 388.598L129.712 388.835L130.122 389.072ZM183.831 420.132L184.241 420.369L184.651 420.132L184.241 419.895L183.831 420.132ZM130.122 451.192L129.712 451.429L130.122 451.667L130.532 451.429L130.122 451.192ZM76.4129 420.132L76.0029 419.895L75.5929 420.132L76.0029 420.369L76.4129 420.132ZM130.122 389.072L129.712 389.309L183.421 420.369L183.831 420.132L184.241 419.895L130.532 388.835L130.122 389.072ZM183.831 420.132L183.421 419.895L129.712 450.955L130.122 451.192L130.532 451.429L184.241 420.369L183.831 420.132ZM130.122 451.192L130.532 450.955L76.8229 419.895L76.4129 420.132L76.0029 420.369L129.712 451.429L130.122 451.192ZM76.4129 420.132L76.8229 420.369L130.532 389.309L130.122 389.072L129.712 388.835L76.0029 419.895L76.4129 420.132Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 76.4033 420.186)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 183.933 420.186)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M130.122 269.936L183.831 300.996L130.122 332.056L76.4129 300.996L130.122 269.936Z" fill="#9AD000"/>
            <path d="M130.122 269.936L130.532 269.698L130.122 269.461L129.712 269.698L130.122 269.936ZM183.831 300.996L184.241 301.233L184.651 300.996L184.241 300.758L183.831 300.996ZM130.122 332.056L129.712 332.293L130.122 332.53L130.532 332.293L130.122 332.056ZM76.4129 300.996L76.0029 300.758L75.5929 300.996L76.0029 301.233L76.4129 300.996ZM130.122 269.936L129.712 270.173L183.421 301.233L183.831 300.996L184.241 300.758L130.532 269.698L130.122 269.936ZM183.831 300.996L183.421 300.758L129.712 331.819L130.122 332.056L130.532 332.293L184.241 301.233L183.831 300.996ZM130.122 332.056L130.532 331.819L76.8229 300.758L76.4129 300.996L76.0029 301.233L129.712 332.293L130.122 332.056ZM76.4129 300.996L76.8229 301.233L130.532 270.173L130.122 269.936L129.712 269.698L76.0029 300.758L76.4129 300.996Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 76.4033 301.049)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 183.933 301.049)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M130.122 200.114L183.831 231.174L130.122 262.234L76.4129 231.174L130.122 200.114Z" fill="#9AD000"/>
            <path d="M130.122 200.114L183.831 231.174L130.122 262.234L76.4129 231.174L130.122 200.114Z" fill={`url(#${idPrefix}-front-p1)`}/>
            <path d="M130.122 200.114L183.831 231.174L130.122 262.234L76.4129 231.174L130.122 200.114Z" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 76.4033 231.228)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 183.933 231.228)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M205.705 390.047L259.423 421.092L205.705 452.138L151.988 421.092L205.705 390.047Z" fill="#9AD000"/>
            <path d="M205.705 390.047L206.115 389.81L205.705 389.573L205.295 389.81L205.705 390.047ZM259.423 421.092L259.833 421.329L260.243 421.092L259.833 420.855L259.423 421.092ZM205.705 452.138L205.295 452.375L205.705 452.612L206.115 452.375L205.705 452.138ZM151.988 421.092L151.578 420.855L151.167 421.092L151.578 421.329L151.988 421.092ZM205.705 390.047L205.295 390.284L259.013 421.329L259.423 421.092L259.833 420.855L206.115 389.81L205.705 390.047ZM259.423 421.092L259.013 420.855L205.295 451.901L205.705 452.138L206.115 452.375L259.833 421.329L259.423 421.092ZM205.705 452.138L206.115 451.901L152.398 420.855L151.988 421.092L151.578 421.329L205.295 452.375L205.705 452.138ZM151.988 421.092L152.398 421.329L206.115 390.284L205.705 390.047L205.295 389.81L151.578 420.855L151.988 421.092Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 151.985 421.161)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 421.161)" fill="#9AD000"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 421.161)" fill={`url(#${idPrefix}-front-p2)`}/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 421.161)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M205.705 316.854L259.423 347.9L205.705 378.946L151.988 347.9L205.705 316.854Z" fill="#9AD000"/>
            <path d="M205.705 316.854L206.115 316.618L205.705 316.381L205.295 316.618L205.705 316.854ZM259.423 347.9L259.833 348.137L260.243 347.9L259.833 347.663L259.423 347.9ZM205.705 378.946L205.295 379.183L205.705 379.42L206.115 379.183L205.705 378.946ZM151.988 347.9L151.578 347.663L151.167 347.9L151.578 348.137L151.988 347.9ZM205.705 316.854L205.295 317.091L259.013 348.137L259.423 347.9L259.833 347.663L206.115 316.618L205.705 316.854ZM259.423 347.9L259.013 347.663L205.295 378.709L205.705 378.946L206.115 379.183L259.833 348.137L259.423 347.9ZM205.705 378.946L206.115 378.709L152.398 347.663L151.988 347.9L151.578 348.137L205.295 379.183L205.705 378.946ZM151.988 347.9L152.398 348.137L206.115 317.091L205.705 316.854L205.295 316.618L151.578 347.663L151.988 347.9Z" fill="#454645"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 151.985 347.968)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 347.968)" fill="#9AD000"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 347.968)" fill={`url(#${idPrefix}-front-p3)`}/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 347.968)" stroke="#454645" strokeWidth="0.947236"/>
            <path d="M205.705 243.661L259.423 274.707L205.705 305.752L151.988 274.707L205.705 243.661Z" fill="#9AD000"/>
            <path d="M205.705 243.661L259.423 274.707L205.705 305.752L151.988 274.707L205.705 243.661Z" fill={`url(#${idPrefix}-front-p4)`}/>
            <path d="M205.705 243.661L259.423 274.707L205.705 305.752L151.988 274.707L205.705 243.661Z" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(0.865803 0.500384 0 1 151.985 274.774)" fill="#9AD000" stroke="#454645" strokeWidth="0.947236"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 274.774)" fill="#9AD000"/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 274.774)" fill={`url(#${idPrefix}-front-p5)`}/>
            <rect width="62.0435" height="55.512" transform="matrix(-0.865803 0.500384 0 1 259.517 274.774)" stroke="#454645" strokeWidth="0.947236"/>
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
