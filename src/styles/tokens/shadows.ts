/**
 * EASEHUB SHADOW & ELEVATION TOKENS
 * "Academic Hearth" Soft Tactile Standard (DESIGN.md)
 * Pine-tinted diffused ambient contact replacing harsh dark dropshadows.
 */

export const shadows = {
  none: 'none',
  sm: '0 1px 3px 0 rgba(59, 130, 246, 0.04), 0 1px 2px 0 rgba(59, 130, 246, 0.02)',
  md: '0 2px 8px -2px rgba(59, 130, 246, 0.05), 0 1px 2px 0 rgba(59, 130, 246, 0.03)', // Level 1 (Default cards & tiles)
  lg: '0 8px 24px -4px rgba(59, 130, 246, 0.08), 0 3px 6px -1px rgba(59, 130, 246, 0.04)', // Level 2 (Hover & floating)
  xl: '0 20px 40px -8px rgba(59, 130, 246, 0.14)', // Level 3 (Modals & overlays)
  
  focusRing: '0 0 0 2px rgba(59, 130, 246, 0.35)',
  focusRingError: '0 0 0 2px rgba(239, 68, 68, 0.35)',
} as const;

export type ShadowKey = keyof typeof shadows;
