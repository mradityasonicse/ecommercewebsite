import { useState, useEffect } from 'react';

/**
 * Lightweight, GPU-friendly scroll progress hook.
 * Uses requestAnimationFrame to throttle scroll calculations and prevent layout thrashing.
 * Returns normalized progress from 0 to 1.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const nextProgress = Math.min(1, Math.max(0, scrollY / docHeight));
        setProgress(nextProgress);
      } else {
        setProgress(0);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    // Initial call
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return progress;
}
