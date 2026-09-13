import React from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ScrollProgressProps {
  className?: string;
  height?: number;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = '',
  height = 2,
}) => {
  const progress = useScrollProgress();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-[9999] pointer-events-none ${className}`}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scaleX(${progress})`,
          transformOrigin: '0 50%',
          background: 'linear-gradient(90deg, #0B7FC2 0%, #38BDF8 60%, #E52425 100%)',
          boxShadow: '0 0 8px rgba(11, 127, 194, 0.4), 0 0 14px rgba(229, 36, 37, 0.25)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
