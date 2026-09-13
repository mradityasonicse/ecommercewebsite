import React from 'react';

// --- Heading Component ---
export type HeadingLevel = 'display-xl' | 'display-lg' | 'display-md' | 'heading-xl' | 'heading-lg' | 'heading-md' | 'heading-sm';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
  gradient?: 'none' | 'blue' | 'electric';
  color?: string;
  weight?: 600 | 700 | 800;
}

function getDefaultTag(level: HeadingLevel): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' {
  switch (level) {
    case 'display-xl':
    case 'display-lg':
      return 'h1';
    case 'display-md':
    case 'heading-xl':
      return 'h2';
    case 'heading-lg':
      return 'h3';
    case 'heading-md':
      return 'h4';
    case 'heading-sm':
    default:
      return 'h5';
  }
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 'heading-md',
  as,
  gradient = 'none',
  color,
  weight,
  className = '',
  style = {},
  ...props
}) => {

  const getGradientStyle = (): React.CSSProperties => {
    if (gradient === 'blue') {
      return {
        background: 'linear-gradient(135deg, #FFFFFF 30%, #93C5FD 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
    if (gradient === 'electric') {
      return {
        background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
    return { color: color || 'var(--color-text-primary)' };
  };

  return React.createElement(
    as || getDefaultTag(level),
    {
      className: `text-${level} ${className}`,
      style: {
        margin: 0,
        fontWeight: weight,
        ...getGradientStyle(),
        ...style,
      },
      ...props,
    },
    children
  );
};

// --- Text Component ---
export type TextVariant =
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'body-xs'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'caption'
  | 'eyebrow';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'blue' | 'red' | 'success' | 'inherit';
  weight?: 400 | 500 | 600 | 700;
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body-md',
  color = 'primary',
  weight,
  as: Component = 'p',
  className = '',
  style = {},
  ...props
}) => {
  const getColorStyle = (): string => {
    switch (color) {
      case 'secondary': return 'var(--color-text-secondary)';
      case 'muted': return 'var(--color-text-muted)';
      case 'inverse': return 'var(--color-text-inverse)';
      case 'blue': return 'var(--color-brand-blue)';
      case 'red': return 'var(--color-brand-red)';
      case 'success': return 'var(--color-semantic-success)';
      case 'inherit': return 'inherit';
      case 'primary': default: return 'var(--color-text-primary)';
    }
  };

  return (
    <Component
      className={`text-${variant} ${className}`}
      style={{
        margin: 0,
        color: getColorStyle(),
        fontWeight: weight,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// --- Link Component ---
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'blue' | 'neutral' | 'subtle';
  underline?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  children,
  variant = 'blue',
  underline = false,
  className = '',
  style = {},
  ...props
}) => {
  const getColor = () => {
    if (variant === 'blue') return 'var(--color-text-link)';
    if (variant === 'neutral') return 'var(--color-text-primary)';
    return 'var(--color-text-secondary)';
  };

  return (
    <a
      className={`easehub-link ${className}`}
      style={{
        color: getColor(),
        textDecoration: underline ? 'underline' : 'none',
        textUnderlineOffset: '3px',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        cursor: 'pointer',
        transition: 'color var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...props}
    >
      {children}
    </a>
  );
};
