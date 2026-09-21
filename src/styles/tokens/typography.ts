/**
 * EASEHUB TYPOGRAPHY TOKENS
 * "Academic Hearth" Design Specification
 * Headlines & Editorial Milestones: Domine (Grounded architectural serifs)
 * Body, Controls, Badges, Metrics: Manrope (Balanced geometric sans-serif)
 * Monospace: System / SFMono
 */

export const typography = {
  fonts: {
    display: "'Domine', Georgia, 'Times New Roman', serif",
    body: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.8,
  },

  letterSpacings: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
    wider: '0.04em',
    widest: '0.1em',
  },

  // Semantic Type Scale definitions
  scale: {
    'display': {
      fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
      lineHeight: '1.15',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontFamily: 'display',
    },
    'h1': {
      fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      fontFamily: 'display',
    },
    'h2': {
      fontSize: 'clamp(1.35rem, 2vw, 1.75rem)',
      lineHeight: '1.25',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontFamily: 'display',
    },
    'h3': {
      fontSize: 'clamp(1.125rem, 1.2vw, 1.25rem)',
      lineHeight: '1.35',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      fontFamily: 'body',
    },
    'h4': {
      fontSize: '1rem',
      lineHeight: '1.4',
      fontWeight: 600,
      letterSpacing: '0em',
      fontFamily: 'body',
    },
    'body-lg': {
      fontSize: '1.0625rem',
      lineHeight: '1.6',
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'body',
    },
    'body-md': {
      fontSize: '0.9375rem',
      lineHeight: '1.55',
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'body',
    },
    'body-sm': {
      fontSize: '0.8125rem',
      lineHeight: '1.5',
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'body',
    },
    'body-xs': {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'body',
    },
    'label': {
      fontSize: '0.8125rem',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontFamily: 'body',
    },
    'caption': {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 500,
      letterSpacing: '0.01em',
      fontFamily: 'body',
    },
    'metadata': {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 500,
      letterSpacing: '0.02em',
      fontFamily: 'body',
    },
    'navigation': {
      fontSize: '0.875rem',
      lineHeight: '1.2',
      fontWeight: 500,
      letterSpacing: '0.005em',
      fontFamily: 'body',
    },
    'button': {
      fontSize: '0.875rem',
      lineHeight: '1.2',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontFamily: 'body',
    },
    'input': {
      fontSize: '0.875rem',
      lineHeight: '1.45',
      fontWeight: 400,
      letterSpacing: '0em',
      fontFamily: 'body',
    },
    'status': {
      fontSize: '0.75rem',
      lineHeight: '1.2',
      fontWeight: 600,
      letterSpacing: '0.03em',
      fontFamily: 'body',
    },
    'eyebrow': {
      fontSize: '0.75rem',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '0.04em',
      fontFamily: 'body',
    },
    // Compatibility keys
    'display-xl': {
      fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
      lineHeight: '1.15',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontFamily: 'display',
    },
    'display-lg': {
      fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
      lineHeight: '1.15',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontFamily: 'display',
    },
    'display-md': {
      fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      fontFamily: 'display',
    },
    'heading-xl': {
      fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      fontFamily: 'display',
    },
    'heading-lg': {
      fontSize: 'clamp(1.35rem, 2vw, 1.75rem)',
      lineHeight: '1.25',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontFamily: 'display',
    },
    'heading-md': {
      fontSize: 'clamp(1.125rem, 1.2vw, 1.25rem)',
      lineHeight: '1.35',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      fontFamily: 'body',
    },
    'heading-sm': {
      fontSize: '1rem',
      lineHeight: '1.4',
      fontWeight: 600,
      letterSpacing: '0em',
      fontFamily: 'body',
    },
    'label-lg': {
      fontSize: '0.875rem',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontFamily: 'body',
    },
    'label-md': {
      fontSize: '0.8125rem',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontFamily: 'body',
    },
    'label-sm': {
      fontSize: '0.75rem',
      lineHeight: '1.2',
      fontWeight: 500,
      letterSpacing: '0.01em',
      fontFamily: 'body',
    },
  },
} as const;

export type TypographyTokens = typeof typography;
export type TypeScaleKey = keyof typeof typography.scale;
