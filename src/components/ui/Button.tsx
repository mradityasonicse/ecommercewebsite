import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'white' | 'outline' | 'signal' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  loading = false,
  className = '',
  style = {},
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'white':
        return {
          fontWeight: 700,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          minHeight: '32px',
          padding: '0.35rem 0.85rem',
          fontSize: 'var(--text-body-xs)',
          borderRadius: 'var(--radius-sm)',
          gap: '0.375rem',
        };
      case 'lg':
        return {
          minHeight: '48px',
          padding: '0.75rem 1.6rem',
          fontSize: 'var(--text-body-md)',
          borderRadius: 'var(--radius-md)',
          gap: '0.625rem',
        };
      case 'md':
      default:
        return {
          minHeight: '40px',
          padding: '0.55rem 1.25rem',
          fontSize: 'var(--text-body-sm)',
          borderRadius: 'var(--radius-md)',
          gap: '0.5rem',
        };
    }
  };

  return (
    <button
      className={`easehub-btn easehub-btn-${variant} easehub-btn-${size} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled && !loading ? 0.5 : 1,
        transition: 'transform var(--duration-micro, 140ms) var(--ease-smooth), box-shadow var(--duration-fast, 200ms) var(--ease-smooth), background-color var(--duration-fast, 200ms) var(--ease-smooth), border-color var(--duration-fast, 200ms) var(--ease-smooth)',
        width: fullWidth ? '100%' : 'auto',
        outline: 'none',
        position: 'relative',
        userSelect: 'none',
        boxSizing: 'border-box',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
            height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#FFFFFF',
            borderRadius: '50%',
            animation: 'easehubSpin 0.7s linear infinite',
          }}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="easehub-btn-icon-left">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="easehub-btn-icon-right">{icon}</span>
          )}
        </>
      )}
      <style>{`
        @keyframes easehubSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
