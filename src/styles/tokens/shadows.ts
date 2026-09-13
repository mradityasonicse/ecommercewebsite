/**
 * EASEHUB SHADOW & ELEVATION TOKENS
 * "Academic Hearth" Soft Tactile Standard (DESIGN.md)
 * Pine-tinted diffused ambient contact replacing harsh dark dropshadows.
 */

export const shadows = {
  none: 'none',
  sm: '0 1px 3px 0 rgba(15, 56, 44, 0.04), 0 1px 2px 0 rgba(15, 56, 44, 0.02)',
  md: '0 2px 8px -2px rgba(15, 56, 44, 0.05), 0 1px 2px 0 rgba(15, 56, 44, 0.03)', // Level 1 (Default cards & tiles)
  lg: '0 8px 24px -4px rgba(15, 56, 44, 0.08), 0 3px 6px -1px rgba(15, 56, 44, 0.04)', // Level 2 (Hover & floating)
  xl: '0 20px 40px -8px rgba(15, 56, 44, 0.14)', // Level 3 (Modals & overlays)
  
  glowBlue: '0 4px 16px rgba(15, 56, 44, 0.18)',
  glowRed: '0 4px 16px rgba(211, 69, 46, 0.18)',
  glowGold: '0 4px 16px rgba(248, 206, 55, 0.3)',
  glowFocus: '0 0 0 3px rgba(15, 56, 44, 0.15)',
} as const;

export type ShadowKey = keyof typeof shadows;
