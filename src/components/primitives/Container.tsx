import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  variant = 'default',
  as: Component = 'div',
  className = '',
  style = {},
  ...props
}) => {
  const getMaxWidth = () => {
    switch (variant) {
      case 'narrow':
        return 'var(--container-narrow)'; // 896px
      case 'wide':
        return 'var(--container-wide)';   // 1440px
      case 'full':
        return 'var(--container-full)';   // 100%
      case 'default':
      default:
        return 'var(--container-default)'; // 1280px
    }
  };

  return (
    <Component
      className={`easehub-container ${className}`}
      style={{
        width: '100%',
        maxWidth: getMaxWidth(),
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 'var(--space-6)',
        paddingRight: 'var(--space-6)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};
