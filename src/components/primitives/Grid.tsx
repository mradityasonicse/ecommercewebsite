import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  colsTablet?: 1 | 2 | 3 | 4 | 6 | 8;
  colsMobile?: 1 | 2 | 4;
  gap?: 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
  as?: React.ElementType;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 12,
  colsTablet,
  colsMobile = 1,
  gap = 6,
  as: Component = 'div',
  className = '',
  style = {},
  ...props
}) => {
  return (
    <Component
      className={`easehub-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: `var(--space-${gap})`,
        width: '100%',
        ...style,
      }}
      {...props}
    >
      <style>{`
        @media (max-width: 1024px) {
          .easehub-grid {
            grid-template-columns: repeat(${colsTablet || Math.min(cols, 8)}, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .easehub-grid {
            grid-template-columns: repeat(${colsMobile}, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
      {children}
    </Component>
  );
};

export interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanTablet?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  spanMobile?: 1 | 2 | 3 | 4;
}

export const GridCol: React.FC<GridColProps> = ({
  children,
  span = 12,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      className={`easehub-grid-col ${className}`}
      style={{
        gridColumn: `span ${span} / span ${span}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
