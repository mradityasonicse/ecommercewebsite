/**
 * EASEHUB CORE COLOR TOKENS
 * Single source of truth for the EaseHub Brand Color Architecture:
 * - Deep Royal Navy (#12285A) — Primary brand anchor & "EASE" wordmark
 * - Campus Leaf Green (#58A940) — Secondary brand anchor & "HUB" wordmark
 * - Sunflower Gold (#FACA12) — Food & Vitality accent (cutlery mark & high-conversion CTAs)
 * - Foundations: Clean Modern Light Canvas (#F8FAFC) & Pure White Surfaces (#FFFFFF)
 * - Borders: Crisp Modern (#E2E8F0)
 */

export const colors = {
  // --- Foundations & Backgrounds ---
  bg: {
    primary: '#F8FAFC',
    secondary: '#F0F4FA',
    tertiary: '#F2F9F0',
    elevated: '#FFFFFF',
    inverse: '#0F172A',
  },

  // --- Surfaces & Cards ---
  surface: {
    default: '#FFFFFF',
    elevated: '#FFFFFF',
    interactive: '#FFFFFF',
    active: '#E2E8F0',
    inverse: '#0F172A',
    overlay: 'rgba(18, 40, 90, 0.45)',
    glass: 'rgba(255, 255, 255, 0.92)',
  },

  // --- Brand Accents ---
  brand: {
    // Primary Action: Deep Royal Navy
    navy: '#12285A',
    blue: '#12285A',
    blueHover: '#0D1E45',
    blueActive: '#081430',
    blueLight: '#1A397B',
    blueSubtle: 'rgba(18, 40, 90, 0.08)',
    blueGlow: 'rgba(18, 40, 90, 0.16)',

    // Secondary Action: Campus Leaf Green
    green: '#58A940',
    greenDark: '#2E7D32',
    greenLight: '#6DBF55',
    greenSubtle: 'rgba(88, 169, 64, 0.12)',

    // High-Conversion Accent: Sunflower Gold
    gold: '#FACA12',
    goldHover: '#E5B60A',
    goldActive: '#D4A300',
    goldSubtle: 'rgba(250, 202, 18, 0.18)',

    // Alert: Terracotta / Crimson Red
    red: '#D3452E',
    redHover: '#B83520',
    redActive: '#9E2B18',
    redLight: '#E85B44',
    redSubtle: 'rgba(211, 69, 46, 0.12)',
    redGlow: 'rgba(211, 69, 46, 0.25)',

    white: '#FFFFFF',
  },

  // --- Neutrals ---
  neutral: {
    white: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    850: '#0F172A',
    900: '#0B1324',
    950: '#050B17',
    black: '#000000',
  },

  // --- Typography / Text Hierarchy ---
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#64748B',
    disabled: '#94A3B8',
    inverse: '#FFFFFF',
    link: '#12285A',
    linkHover: '#58A940',
  },

  // --- Borders & Dividers ---
  border: {
    subtle: '#E2E8F0',
    default: '#E2E8F0',
    strong: '#94A3B8',
    focus: '#12285A',
    focusGlow: 'rgba(18, 40, 90, 0.18)',
    brand: '#12285A',
    red: 'rgba(211, 69, 46, 0.4)',
  },

  // --- Semantic Feedback ---
  semantic: {
    success: '#2E7D32',
    successBg: 'rgba(88, 169, 64, 0.12)',
    successBorder: 'rgba(88, 169, 64, 0.3)',
    successText: '#2E7D32',

    warning: '#B45309',
    warningBg: 'rgba(250, 202, 18, 0.18)',
    warningBorder: 'rgba(250, 202, 18, 0.4)',
    warningText: '#92400E',

    error: '#D3452E',
    errorBg: '#FFDAD6',
    errorBorder: 'rgba(211, 69, 46, 0.3)',
    errorText: '#BA1A1A',

    info: '#12285A',
    infoBg: 'rgba(18, 40, 90, 0.08)',
    infoBorder: 'rgba(18, 40, 90, 0.2)',
    infoText: '#12285A',
  },
} as const;

export type ColorTokens = typeof colors;
