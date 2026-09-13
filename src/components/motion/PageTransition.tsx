import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger on next frame
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (prefersReducedMotion) {
    return <div className={`page-transition-wrapper ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`page-transition-wrapper ${className}`}
      style={{
        opacity: isMounted ? 1 : 0,
        transform: isMounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 8px, 0)',
        transition: 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
