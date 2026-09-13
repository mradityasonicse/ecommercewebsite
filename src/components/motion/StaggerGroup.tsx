import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface StaggerGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  staggerMs?: number; // default 40ms per item
  baseDelayMs?: number; // base delay before first item
  distance?: number; // default 16px
  durationMs?: number; // default 320ms
  className?: string;
}

export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  staggerMs = 40,
  baseDelayMs = 0,
  distance = 16,
  durationMs = 320,
  className = '',
  style = {},
  ...props
}) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const childArray = React.Children.toArray(children);

  return (
    <div ref={ref} className={`stagger-group ${className}`} style={style} {...props}>
      {childArray.map((child, index) => {
        const itemDelay = baseDelayMs + index * staggerMs;
        return (
          <div
            key={index}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${distance}px, 0)`,
              transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${itemDelay}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${itemDelay}ms`,
              willChange: 'opacity, transform',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
