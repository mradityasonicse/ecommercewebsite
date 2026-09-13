/**
 * EASEHUB RADIUS TOKENS
 * "Academic Hearth" Restrained Architectural Curvature (DESIGN.md)
 * 0.25rem base inputs, 0.5rem cards, 0.75rem modals, 9999px pill exception.
 */

export const radius = {
  none: '0px',
  xs: '2px',       // Checkboxes, micro-tags
  sm: '4px',       // 0.25rem: base inputs, subtle tags, table cells
  md: '6px',       // 0.375rem
  lg: '8px',       // 0.5rem: housing cards, service panels, buttons
  xl: '12px',      // 0.75rem: navigation bars, modals, hero containers
  '2xl': '16px',
  pill: '9999px',  // Pill exception: status indicators, 3-service switcher
} as const;

export type RadiusKey = keyof typeof radius;
