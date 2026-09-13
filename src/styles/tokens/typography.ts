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
    'display-xl': {
      fontSize: 'clamp(2.75rem, 5vw + 1rem, 4.5rem)',
      lineHeight: '1.1',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontFamily: 'display',
    },
    'display-lg': {
      fontSize: 'clamp(2.25rem, 4vw + 0.8rem, 3.25rem)',
      lineHeight: '1.15',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontFamily: 'display',
    },
    'display-md': {
      fontSize: 'clamp(1.75rem, 2.8vw + 0.6rem, 2.5rem)',
      lineHeight: '1.2',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      fontFamily: 'display',
    },
    'heading-xl': {
      fontSize: 'clamp(1.5rem, 2.2vw + 0.5rem, 2.125rem)',
      lineHeight: '1.25',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      fontFamily: 'display',
    },
    'heading-lg': {
      fontSize: 'clamp(1.35rem, 1.6vw + 0.4rem, 1.75rem)',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontFamily: 'display',
    },
    'heading-md': {
      fontSize: 'clamp(1.2rem, 1.1vw + 0.3rem, 1.375rem)',
      lineHeight: '1.35',
      fontWeight: 600,
      fontFamily: 'display',
    },
    'heading-sm': {
      fontSize: '1.125rem',
      lineHeight: '1.4',
      fontWeight: 600,
      fontFamily: 'display',
    },
    'body-lg': {
      fontSize: '1rem',
      lineHeight: '1.625',
      fontWeight: 400,
      fontFamily: 'body',
    },
    'body-md': {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: 400,
      fontFamily: 'body',
    },
    'body-sm': {
      fontSize: '0.8125rem',
      lineHeight: '1.45',
      fontWeight: 400,
      fontFamily: 'body',
    },
    'body-xs': {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 400,
      fontFamily: 'body',
    },
    'label-lg': {
      fontSize: '1rem',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontFamily: 'body',
    },
    'label-md': {
      fontSize: '0.75rem',
      lineHeight: '1.2',
      fontWeight: 600,
      letterSpacing: '0.04em',
      fontFamily: 'body',
    },
    'label-sm': {
      fontSize: '0.6875rem',
      lineHeight: '1.15',
      fontWeight: 500,
      letterSpacing: '0.02em',
      fontFamily: 'body',
    },
    'caption': {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 400,
      fontFamily: 'body',
    },
    'eyebrow': {
      fontSize: '0.6875rem',
      lineHeight: '1.15',
      fontWeight: 700,
      letterSpacing: '0.12em',
      fontFamily: 'body',
    },
  },
} as const;

export type TypographyTokens = typeof typography;
export type TypeScaleKey = keyof typeof typography.scale;
