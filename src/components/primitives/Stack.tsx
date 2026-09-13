import React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  inline?: boolean;
  as?: React.ElementType;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  gap = 4,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  inline = false,
  as: Component = 'div',
  className = '',
  style = {},
  ...props
}) => {
  const getAlign = () => {
    switch (align) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'center': return 'center';
      case 'baseline': return 'baseline';
      case 'stretch': default: return 'stretch';
    }
  };

  const getJustify = () => {
    switch (justify) {
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      case 'start': default: return 'flex-start';
    }
  };

  return (
    <Component
      className={`easehub-stack ${className}`}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        alignItems: getAlign(),
        justifyContent: getJustify(),
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: `var(--space-${gap})`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};
