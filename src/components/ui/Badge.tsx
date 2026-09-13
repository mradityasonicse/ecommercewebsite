import React from 'react';
import { Check, Flame, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export type BadgeVariant =
  | 'brand'
  | 'blue'       // compatibility alias
  | 'red'        // compatibility alias
  | 'verified'
  | 'live'
  | 'popular'
  | 'new'
  | 'discount'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  pulse = false,
  className = '',
  style = {},
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'brand':
      case 'blue':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          color: '#F8FAFC',
          border: '1px solid rgba(255, 255, 255, 0.16)',
        };
      case 'red':
      case 'danger':
        return {
          backgroundColor: 'var(--color-semantic-error-bg)',
          color: 'var(--color-semantic-error-text)',
          border: '1px solid var(--color-semantic-error-border)',
        };
      case 'live':
        return {
          backgroundColor: 'var(--color-red-subtle)',
          color: 'var(--color-red-light)',
          border: '1px solid rgba(255, 43, 43, 0.4)',
        };
      case 'verified':
        return {
          backgroundColor: 'var(--color-semantic-success-bg)',
          color: 'var(--color-semantic-success-text)',
          border: '1px solid var(--color-semantic-success-border)',
        };
      case 'success':
        return {
          backgroundColor: 'var(--color-semantic-success-bg)',
          color: 'var(--color-semantic-success-text)',
          border: '1px solid var(--color-semantic-success-border)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-semantic-warning-bg)',
          color: 'var(--color-semantic-warning-text)',
          border: '1px solid var(--color-semantic-warning-border)',
        };
      case 'info':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          color: '#F1F5F9',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        };
      case 'popular':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          color: '#FBBF24',
          border: '1px solid rgba(245, 158, 11, 0.35)',
        };
      case 'new':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.22)',
        };
      case 'discount':
        return {
          backgroundColor: 'rgba(255, 43, 43, 0.12)',
          color: '#FF7B72',
          border: '1px solid rgba(255, 43, 43, 0.35)',
          fontWeight: 700,
        };
      case 'neutral':
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)',
        };
    }
  };

  const getDefaultIcon = () => {
    if (icon) return icon;
    if (variant === 'verified') return <ShieldCheck size={12} />;
    if (variant === 'popular') return <Flame size={12} />;
    if (variant === 'new') return <Zap size={12} />;
    if (variant === 'warning') return <AlertTriangle size={12} />;
    if (variant === 'success') return <Check size={12} />;
    return null;
  };

  const resolvedIcon = getDefaultIcon();

  return (
    <span
      className={`easehub-badge easehub-badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        fontSize: size === 'sm' ? '0.6875rem' : 'var(--text-body-xs)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        letterSpacing: '0.01em',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
        ...getStyles(),
        ...style,
      }}
      {...props}
    >
      {(variant === 'live' || pulse) && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: variant === 'live' ? 'var(--color-brand-red)' : 'var(--color-semantic-success)',
            display: 'inline-block',
            boxShadow: variant === 'live' ? '0 0 8px var(--color-brand-red)' : '0 0 8px var(--color-semantic-success)',
          }}
          className="animate-pulse-dot"
        />
      )}
      {resolvedIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{resolvedIcon}</span>}
      {children}
    </span>
  );
};
