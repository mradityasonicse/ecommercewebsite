/**
 * EASEHUB BREAKPOINTS & RESPONSIVE GRID TOKENS
 * Strict 12-col desktop, 8-col tablet, 4-col mobile grid architecture.
 */

export const breakpoints = {
  mobileSm: '360px',
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
  desktopWide: '1440px',
} as const;

export const grid = {
  desktop: {
    columns: 12,
    gutter: '24px',
    margin: '32px',
    maxWidth: '1360px',
  },
  tablet: {
    columns: 8,
    gutter: '16px',
    margin: '24px',
    maxWidth: '100%',
  },
  mobile: {
    columns: 4,
    gutter: '12px',
    margin: '16px',
    maxWidth: '100%',
  },
} as const;

export const containers = {
  narrow: '896px',     // Editorial reading, focused forms, auth
  default: '1280px',   // Standard application pages, product lists
  wide: '1440px',      // Expansive navigation, dashboard analytics
  full: '100%',        // Full-bleed heroes, tickers, dividers
  textMax: '680px',    // Optimal line length for typography readability
} as const;
