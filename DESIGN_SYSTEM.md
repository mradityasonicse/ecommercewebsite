# EaseHub Production Design System Specification — Phase 1

```text
EASEHUB PRODUCTION DESIGN SYSTEM
AUTHORITY · RESTRAINT · TACTILE PRECISION · ACCESSIBILITY
```

---

## 1. Executive Summary & Principles

This specification defines the production design system for EaseHub. The system elevates the interface from generic AI-generated/template aesthetic into a serious, human-designed product.

### Core Principles
1. **Precision Over Decoration**: No random gradients, neon glows, floating blobs, liquid shimmer beams, or decorative particles. Every element exists with clear UX intent.
2. **Harmonious Color Hierarchy**: Royal/Electric Blue (`#3B82F6` / `#12285A`) for brand navigation, interactive links, and selected states. Signal Red (`#EF4444`) for high-consequence actions, alerts, and critical emphasis. Obsidian Black (`#060709`) and Royal Navy (`#0A1633`) provide crisp tonal depth.
3. **Controlled Radii & Shadows**: Controlled radius scale (4px, 6px, 8px, 12px) prevents the "toy-like" over-rounded look. Subtle elevation and surface contrast replace massive glowing drop shadows.
4. **Accessible & Responsive**: Contrast compliant (WCAG AA/AAA), keyboard focusable with visible focus rings (`:focus-visible`), responsive across 360px–1920px+ viewports, and strictly honoring `prefers-reduced-motion`.

---

## 2. Centralized Design Token Architecture

All design decisions are centralized across two synchronized layers:
* **CSS Custom Properties**: [`src/styles/tokens.css`](file:///e:/Easehub/src/styles/tokens.css) & [`src/styles/index.css`](file:///e:/Easehub/src/styles/index.css)
* **TypeScript Token Constants**: [`src/styles/tokens/`](file:///e:/Easehub/src/styles/tokens/)

Developers can modify any color, radius, shadow, font, or spacing scale across the entire application directly from these files.

---

## 3. Color System

### Semantic Color Tokens
```css
/* Core Foundations */
--color-background          : Canvas background color (Navy in primary, Obsidian #060709 in dark)
--color-surface             : Level 1 card & container surface
--color-surface-elevated    : Level 2 floating panels, menus, and drawers
--color-surface-hover       : Hover state background for interactive cards

/* Text Hierarchy */
--color-text-primary        : Highest contrast headlines & primary numbers
--color-text-secondary      : Body text, secondary descriptors, instructions
--color-text-muted          : Labels, helper copy, tertiary timestamps
--color-text-disabled       : Disabled states

/* Structural Borders */
--color-border              : Default crisp dividing lines
--color-border-subtle       : Discreet card dividers and internal lines
--color-border-hover        : Subtle brightening on card hover

/* Brand Anchors */
--color-brand-blue          : #3B82F6 (Interactive brand blue, primary links, active badges)
--color-brand-navy          : #12285A (Collegiate royal navy foundation)
--color-brand-red           : #EF4444 (Signal red: high-consequence CTAs, alerts, vacancies)

/* Semantic Feedback */
--color-success             : #22C55E / #16A34A (Confirmed bookings, verified badges)
--color-warning             : #F59E0B / #D97706 (Slot warnings, pending items)
--color-error               : #EF4444 / #DC2626 (Form validation errors, failed requests)
--color-info                : #3B82F6 (Status notes, campus announcements)
```

---

## 4. Typography Scale & Semantic Tokens (Phase 3 System)

Clean editorial typography combining **Domine** (for collegiate, authoritative serif display and section milestones) and **Manrope** (for geometric, ultra-crisp UI controls, body text, form fields, navigation, and tabular metrics).

### Centralized Semantic Typography Matrix

| Token | Family | Font Size | Weight | Line Height | Tracking | Text Wrap | Primary Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Domine | `clamp(2.25rem, 4vw, 3.25rem)` | 700 | 1.15 | -0.02em | `balance` | Hero moments & brand statements |
| **H1** | Domine | `clamp(1.75rem, 3vw, 2.35rem)` | 700 | 1.2 | -0.015em | `balance` | Page primary titles & major section headers |
| **H2** | Domine | `clamp(1.35rem, 2vw, 1.75rem)` | 600 | 1.25 | -0.01em | `balance` | Subsection titles, bundle names, group headers |
| **H3** | Manrope | `clamp(1.125rem, 1.2vw, 1.25rem)` | 600 | 1.35 | -0.005em | `balance` | Service card titles, module headings |
| **H4** | Manrope | `1rem` (16px) | 600 | 1.4 | 0em | — | Component subheadings, drawer section titles |
| **Body Large** | Manrope | `1.0625rem` (17px) | 400 | 1.6 | 0em | `pretty` | Editorial subtitles, lead copy (max 65ch) |
| **Body** | Manrope | `0.9375rem` (15px) | 400 | 1.55 | 0em | `pretty` | Standard paragraphs, modal descriptions |
| **Body Small** | Manrope | `0.8125rem` (13px) | 400 | 1.5 | 0em | — | Helper notes, supporting specs, card details |
| **Label** | Manrope | `0.8125rem` (13px) | 600 | 1.3 | +0.01em | — | Form field labels, spec tags, filter chips |
| **Caption** | Manrope | `0.75rem` (12px) | 500 | 1.4 | +0.01em | — | Helper text, unit pricing (`/month`), timestamps |
| **Metadata** | Manrope / Mono | `0.75rem` (12px) | 500 | 1.4 | +0.02em | — | Booking IDs, reference codes, audit tags |
| **Navigation** | Manrope | `0.875rem` (14px) | 500 / 600 | 1.2 | +0.005em | — | Navbar links, mobile drawer items |
| **Button Text** | Manrope | `0.875rem` (14px) | 600 | 1.2 | +0.01em | — | Primary CTAs, WhatsApp buttons, tab pills |
| **Input Text** | Manrope | `0.875rem` (14px) | 400 | 1.45 | 0em | — | Form text inputs, search bar, textareas |
| **Status Text** | Manrope | `0.75rem` (12px) | 600 | 1.2 | +0.03em | — | Status pills (`VERIFIED`, `PENDING`), chips |

### Strict Typography Rules & Anti-Patterns Purged

1. **Zero Gradient Text**: Solid brand colors (`#FFFFFF`, `var(--color-brand-gold)`, `var(--color-brand-blue)`) replace all `background-clip: text` pseudo-glows.
2. **Eliminate Uppercase Abuse**: Form labels, paragraph titles, and regular badges use natural sentence case. Uppercase is strictly restricted to select micro status chips with max `0.04em` tracking.
3. **No Monospace on Form Labels**: Form labels use `Manrope` 600, not robotic monospace uppercase.
4. **Readable Line Lengths**: All editorial paragraphs enforce `max-inline-size: 65ch` (`--container-text-max`) to prevent fatigue on ultra-wide viewports.
5. **No Orphan Words**: Headings enforce `text-wrap: balance` to prevent awkward single-word wrapping.
6. **No Fragmented Micro-Sizes**: Banned `0.62rem`, `0.68rem`, `0.72rem`, `0.74rem`, and `0.86rem` fragmentation. Every element must snap to the standardized type scale (`0.75rem`, `0.8125rem`, `0.875rem`, `0.9375rem`, `1.0625rem`).

---

## 5. Spacing Scale

Strict 4px/8px-based rhythm ensuring geometric consistency:
```css
--space-1  : 4px   (--space-4 in px terms)
--space-2  : 8px
--space-3  : 12px
--space-4  : 16px
--space-6  : 24px
--space-8  : 32px
--space-10 : 40px
--space-12 : 48px
--space-16 : 64px
--space-20 : 80px
--space-24 : 96px
--space-30 : 120px
```

---

## 6. Border Radius Scale

Controlled curvature avoiding "bubble/toy" aesthetics:
* `--radius-none` : `0px`
* `--radius-xs`   : `2px` (micro-tags, checkmarks)
* `--radius-sm`   : `4px` (input fields, tag badges, small buttons)
* `--radius-md`   : `6px` (standard buttons, dropdown items, tabs)
* `--radius-lg`   : `8px` (service cards, provider cards, notification banners)
* `--radius-xl`   : `12px` (dialog modals, navigation shell, drawers)
* `--radius-pill` : `9999px` (strictly reserved for circular avatars and selected pill chips)

---

## 7. Shadow & Elevation System

Replaces exaggerated 30px+ dark glows and colored halos with restrained, physically grounded shadows:
* `--shadow-none` : `none`
* `--shadow-sm`   : `0 1px 2px rgba(0, 0, 0, 0.25)` (Rest state for cards)
* `--shadow-md`   : `0 4px 12px -2px rgba(0, 0, 0, 0.35)` (Hover state for interactive cards)
* `--shadow-lg`   : `0 10px 24px -4px rgba(0, 0, 0, 0.45)` (Floating drawers and dropdowns)
* `--shadow-xl`   : `0 20px 48px -8px rgba(0, 0, 0, 0.60)` (Center-stage dialog modals)

---

## 8. Button System

Standardized button variants across [`src/components/ui/Button.tsx`](file:///e:/Easehub/src/components/ui/Button.tsx) and CSS classes:
* **Primary**: Solid Royal/Electric Blue (`var(--color-brand-blue)`), white text, subtle hover lift (`translateY(-1px)`).
* **Secondary**: Subtle surface with crisp border, contrasting text.
* **Destructive**: Solid Signal Red (`var(--color-brand-red)`), reserved for cancel/refund/delete actions.
* **Outline**: Transparent background, `1px solid var(--color-border)`, active state on hover.
* **Ghost**: Minimal padding, no border, soft background highlight on hover.
* **Icon Button**: Tactile, touch-target compliant (min 44px on mobile) with accessible label.

*All buttons support Default, Hover, Active, Focus-Visible, Disabled, and Loading spinner states.*

---

## 9. Form Control System

Standardized in [`src/components/ui/FormControls.tsx`](file:///e:/Easehub/src/components/ui/FormControls.tsx):
* **Inputs & Textareas**: `height: 42px`, `padding: 0 12px`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-sm)`.
* **Focus State**: `outline: none; border-color: var(--color-brand-blue); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35)`.
* **Error State**: `border-color: var(--color-brand-red); box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.35)` with dedicated accessible error helper text.
* **Form Labels**: Distinct from input fields, never relying solely on placeholders.

---

## 10. Reusable State Visual Foundation

Exported from [`src/components/ui/StateVisuals.tsx`](file:///e:/Easehub/src/components/ui/StateVisuals.tsx):
* **`LoadingState`**: Dedicated accessible spinner and status message.
* **`EmptyState`**: Dashed border container, neutral icon, helpful instructions, and primary reset action.
* **`ErrorState`**: Semantic red feedback icon, error details, and retry button.
* **`SuccessState`**: Positive confirmation checkmark with next-step CTA.
* **`UnavailableState`**: Restrained messaging for unserved hubs or full occupancy.

---

## 11. Motion Tokens & Accessibility

Centralized in [`src/styles/motion.css`](file:///e:/Easehub/src/styles/motion.css):
* `--duration-fast`: `150ms` (hover, click, focus feedback)
* `--duration-standard`: `250ms` (dropdowns, drawers, tabs)
* `--duration-emphasis`: `350ms` (modal entrance, route transition)
* `--ease-standard`: `cubic-bezier(0.2, 0, 0, 1)`
* `--ease-smooth`: `cubic-bezier(0.16, 1, 0.3, 1)`

### Accessibility Safeguard:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
Universal `:focus-visible` ensures keyboard navigability across all buttons, anchors, and inputs without aesthetic degradation for mouse users.
