import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'subtle' | 'default' | 'strong';
  spacing?: 2 | 4 | 6 | 8 | 12;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'default',
  spacing = 4,
  className = '',
  style = {},
  ...props
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'subtle': return 'var(--color-border-subtle)';
      case 'strong': return 'var(--color-border-strong)';
      case 'default': default: return 'var(--color-border-default)';
    }
  };

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`easehub-divider-vertical ${className}`}
        style={{
          display: 'inline-block',
          width: '1px',
          alignSelf: 'stretch',
          backgroundColor: getBorderColor(),
          marginLeft: `var(--space-${spacing})`,
          marginRight: `var(--space-${spacing})`,
          border: 'none',
          ...style,
        }}
        {...props}
      />
    );
  }

  return (
    <hr
      role="separator"
      className={`easehub-divider-horizontal ${className}`}
      style={{
        border: 'none',
        height: '1px',
        width: '100%',
        backgroundColor: getBorderColor(),
        marginTop: `var(--space-${spacing})`,
        marginBottom: `var(--space-${spacing})`,
        ...style,
      }}
      {...props}
    />
  );
};
