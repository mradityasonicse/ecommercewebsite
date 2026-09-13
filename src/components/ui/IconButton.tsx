import React from 'react';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  'aria-label': string; // Enforce accessible label
  shape?: 'square' | 'rounded' | 'circle';
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  shape = 'rounded',
  className = '',
  style = {},
  disabled,
  ...props
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: '32px', height: '32px', fontSize: '14px' };
      case 'lg': return { width: '48px', height: '48px', fontSize: '20px' };
      case 'md': default: return { width: '40px', height: '40px', fontSize: '16px' };
    }
  };

  const getBorderRadius = () => {
    switch (shape) {
      case 'circle': return 'var(--radius-pill)';
      case 'square': return 'var(--radius-xs)';
      case 'rounded': default: return 'var(--radius-md)';
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-brand-blue)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 2px 8px var(--color-blue-glow)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-brand-red)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          border: '1px solid transparent',
        };
      case 'secondary': default:
        return {
          backgroundColor: 'var(--color-surface-2)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-default)',
        };
    }
  };

  return (
    <button
      className={`easehub-icon-btn ${className}`}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        borderRadius: getBorderRadius(),
        transition: 'all var(--duration-fast) var(--ease-standard)',
        flexShrink: 0,
        outline: 'none',
        ...getDimensions(),
        ...getVariantStyles(),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'var(--color-blue-hover)';
          } else if (variant === 'secondary') {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-3)';
            e.currentTarget.style.borderColor = 'var(--color-border-hover)';
          } else if (variant === 'ghost') {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = 'var(--color-red-hover)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, getVariantStyles(), style);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
