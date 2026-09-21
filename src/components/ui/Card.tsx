import React from 'react';

export type CardVariant =
  | 'default'
  | 'elevated'
  | 'interactive'
  | 'service'
  | 'provider'
  | 'bundle'
  | 'feature'
  | 'stat'
  | 'testimonial';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 2 | 3 | 4 | 5 | 6 | 8;
  hoverable?: boolean;
  selected?: boolean;
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 6,
  hoverable,
  selected = false,
  as: Component = 'div',
  className = '',
  style = {},
  ...props
}) => {
  const isInteractive = hoverable ?? (variant === 'interactive' || variant === 'service' || variant === 'provider' || variant === 'bundle');

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-default)',
          boxShadow: 'var(--shadow-md)',
        };
      case 'stat':
        return {
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        };
      case 'feature':
        return {
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-default)',
        };
      case 'provider':
      case 'service':
      case 'bundle':
      case 'interactive':
      case 'default':
      default:
        return {
          backgroundColor: 'var(--color-surface-1)',
          border: selected ? '1px solid var(--color-brand-blue)' : '1px solid var(--color-border-subtle)',
          boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        };
    }
  };

  return (
    <Component
      className={`easehub-card easehub-card-${variant} ${isInteractive ? 'interactive-card' : ''} ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: `var(--space-${padding})`,
        cursor: isInteractive ? 'pointer' : 'default',
        position: 'relative',
        boxSizing: 'border-box',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// --- Subcomponents for Card Composition ---
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style = {},
  ...props
}) => (
  <div
    className={`easehub-card-header ${className}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      marginBottom: 'var(--space-4)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style = {},
  ...props
}) => (
  <div
    className={`easehub-card-body ${className}`}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style = {},
  ...props
}) => (
  <div
    className={`easehub-card-footer ${className}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'var(--space-5)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--color-border-subtle)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
