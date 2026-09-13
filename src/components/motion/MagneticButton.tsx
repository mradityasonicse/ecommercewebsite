import React from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  maxDistance?: number;
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  maxDistance = 6,
  className = '',
  style = {},
  ...props
}) => {
  const { ref, transform, transition, handleMouseMove, handleMouseLeave } = useMagnetic<HTMLButtonElement>({
    maxDistance,
  });

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        transform,
        transition,
        willChange: 'transform',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
