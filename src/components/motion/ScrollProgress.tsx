import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ScrollProgressProps {
  className?: string;
  height?: number;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = '',
  height = 2,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    let ticking = false;
    const updateProgress = () => {
      const bar = barRef.current;
      if (!bar) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-[9999] pointer-events-none ${className}`}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '100%',
          transform: 'scaleX(0)',
          transformOrigin: '0 50%',
          background: 'linear-gradient(90deg, #16A34A 0%, #22C55E 50%, #86EFAC 100%)',
          boxShadow: '0 0 8px rgba(22, 163, 74, 0.4)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
