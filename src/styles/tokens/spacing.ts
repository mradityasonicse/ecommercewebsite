/**
 * EASEHUB SPACING TOKENS
 * Strict 4px-based geometric rhythm scale.
 * Eliminates random optical values (17px, 23px, 37px) and ensures clean layout harmony.
 */

export const spacing = {
  0: '0px',
  1: '4px',      // 0.25rem
  2: '8px',      // 0.5rem
  3: '12px',     // 0.75rem
  4: '16px',     // 1rem
  5: '20px',     // 1.25rem
  6: '24px',     // 1.5rem
  8: '32px',     // 2rem
  10: '40px',    // 2.5rem
  12: '48px',    // 3rem
  16: '64px',    // 4rem
  20: '80px',    // 5rem
  24: '96px',    // 6rem
  30: '120px',   // 7.5rem
  40: '160px',   // 10rem
} as const;

export type SpacingKey = keyof typeof spacing;
