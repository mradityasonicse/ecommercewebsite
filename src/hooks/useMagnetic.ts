import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface UseMagneticOptions {
  /** Maximum magnetic displacement in pixels (default: 6px per Phase 1 spec) */
  maxDistance?: number;
  /** Damping factor (0 to 1, default 0.35) */
  damping?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: UseMagneticOptions = {}
) {
  const { maxDistance = 6, damping = 0.35 } = options;
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(media.matches);

    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    if (media.addEventListener) {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    } else {
      media.addListener(handler);
      return () => media.removeListener(handler);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T> | MouseEvent) => {
      if (prefersReducedMotion || !canHover || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const targetX = Math.max(-maxDistance, Math.min(maxDistance, deltaX * maxDistance * (1 + damping)));
      const targetY = Math.max(-maxDistance, Math.min(maxDistance, deltaY * maxDistance * (1 + damping)));

      setOffset({ x: targetX, y: targetY });
    },
    [prefersReducedMotion, canHover, maxDistance, damping]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const transform =
    prefersReducedMotion || !canHover || (offset.x === 0 && offset.y === 0)
      ? 'translate3d(0, 0, 0)'
      : `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`;

  const transition =
    offset.x === 0 && offset.y === 0
      ? 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)'
      : 'transform 80ms cubic-bezier(0.25, 1, 0.5, 1)';

  return {
    ref,
    offset,
    transform,
    transition,
    handleMouseMove,
    handleMouseLeave,
    isMagneticActive: canHover && !prefersReducedMotion,
  };
}
