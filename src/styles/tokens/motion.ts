/**
 * EASEHUB MOTION TOKENS
 * Fast, physics-based, responsive transitions.
 * Philosophy: FAST -> CLEAN -> CONTROLLED -> CONFIDENT
 * Prioritizes tactile feedback without unnecessary bouncy distractions.
 */

export const motion = {
  duration: {
    instant: '50ms',      // Press states, instant feedback
    fast: '150ms',         // Hover states, focus rings, toggles, micro-nudges
    normal: '240ms',       // Modal open, drawer slides, accordion expands, page transitions
    deliberate: '380ms',   // Section reveals, complex component transitions
    cinematic: '520ms',    // Major narrative storytelling elements, hero reveals
    slow: '450ms',         // Compatibility alias
  },

  ease: {
    // Curated high-performance cubic-bezier curves
    standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',        // Controlled deceleration
    emphasized: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',  // Snappy, authoritative
    spring: 'cubic-bezier(0.34, 1.3, 0.64, 1)',      // Subtle controlled tactile spring
    enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',         // Immediate start, smooth end
    exit: 'cubic-bezier(0.4, 0.0, 1, 1)',            // Clean acceleration out
  },

  distance: {
    micro: '2px',         // Button press / micro icon nudge
    sm: '6px',            // Subtle card lift / dropdown offset
    md: '14px',           // Tooltip reveal / component entrance
    lg: '28px',           // Section scroll entrance / modal slide
  },

  scale: {
    buttonHover: '1.015', // Subtle button presence enhancement
    buttonActive: '0.985',// Tactile press depression feedback
    cardHover: '1.012',   // Refined card hover elevation
    modalEnter: '0.985',  // Subtle scale-up on entrance
  },
} as const;

export type MotionTokens = typeof motion;
