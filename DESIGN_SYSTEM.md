# EaseHub Design System Specification — "Academic Hearth"

```text
EASEHUB DESIGN SYSTEM SPECIFICATION — "ACADEMIC HEARTH"
COLLEGIATE TRUST · PHYSICAL TACTILITY · EDITORIAL SCHOLARSHIP
```

---

## 1. Design Philosophy & Aesthetic Archetype

EaseHub operates on the **"Academic Hearth"** design archetype. This aesthetic rejects sterile neo-brutalist tech tropes and generic SaaS dark modes in favor of an environment reminiscent of collegiate common rooms, oak-paneled university libraries, warm reading rooms, and tangible student campus life.

### Core Tenets
* **Academic Gravitas & Grounded Authority**: Deep pine green, forest tones, and warm amber gold convey permanence and legitimacy over fleeting startup aesthetics.
* **Warm Canvas & Editorial Legibility**: Soft warm cream (`#FBF9F1`) and subtle pine-tinted surfaces replace sterile blues and stark whites. Headlines speak with literary conviction in **Domine** serif.
* **Physical Tactility**: Cards feature physical presence through pale sand architectural borders (`#E8E4D5`) and botanical ambient drop shadows.
* **High-Utility Campus Wayfinding**: Segmented pill selectors, verified student trust seals, and geofenced micro-copy communicate institutional reliability.

---

## 2. Color Palette & Token System

All colors originate from `src/styles/tokens/colors.ts` and are synchronized with `src/styles/tokens.css`.

### Canvas & Backgrounds
| Token | CSS Variable | Hex / Value | Description |
| :--- | :--- | :--- | :--- |
| `canvas.base` | `--color-canvas-base` | `#FBF9F1` | Soft Cream canvas, main document body |
| `canvas.subtle` | `--color-canvas-subtle` | `#f3fbf5` | Subtle Pine-tinted canvas for alternating sections |
| `surface.1` | `--color-surface-1` | `#FFFFFF` | Level 1: Primary cards, booking containers, interactive modals |
| `surface.2` | `--color-surface-2` | `#edf6ef` | Level 2: Secondary containers, pills, toggles, review headers |
| `surface.3` | `--color-surface-3` | `#e4efe7` | Level 3: Active hover states, interactive card depths |
| `border.subtle` | `--color-border-subtle` | `#E8E4D5` | Pale Sand: Structural card borders, dividers, equation bars |
| `border.default`| `--color-border-default`| `#D5CEBC` | Medium Sand: Input borders, unselected tabs |

### Brand Identity
| Token | CSS Variable | Hex / Value | Description |
| :--- | :--- | :--- | :--- |
| `primary.deep` | `--color-brand-blue` / `--color-pine-deep` | `#0F382C` | Deep Pine: Primary brand anchor, nav branding, titles, headers |
| `primary.forest` | `--color-forest` | `#164E3E` | Forest Green: Card emphasis, hover states, secondary actions |
| `accent.gold` | `--color-accent-gold` | `#F8CE37` | Warm Amber Gold: High-conversion CTAs, primary buttons, spotlights |
| `accent.ochre` | `--color-ochre-muted` | `#E2B822` | Muted Ochre: Border trims, badges, ratings |

### Typographic Contrast Scale
| Token | CSS Variable | Hex / Value | Usage |
| :--- | :--- | :--- | :--- |
| `text.primary` | `--color-text-primary` | `#151D1A` | Charcoal Slate: Headlines, card titles, key values |
| `text.secondary`| `--color-text-secondary`| `#414845` | Olive Grey: Body copy, feature descriptions, instructions |
| `text.muted` | `--color-text-muted` | `#6B736D` | Subdued Grey: Eyebrows, timestamps, secondary labels |

### Semantic Feedback
| Status | Token | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Verified / Success** | `--color-semantic-success` | `#2E7D32` | Sage Green: Verified campus partner badges, guaranteed checkmarks |
| **Alert / Urgency** | `--color-brand-red` | `#D3452E` | Terracotta Red: Availability alerts, live room spots remaining |
| **Warning** | `--color-semantic-warning` | `#B45309` | Warm Amber: Maintenance notices, slot warnings |

---

## 3. Typography Architecture

EaseHub combines **editorial scholarship** with **high-density utility**:

```text
Headlines & Numerals : Domine (Google Fonts, 400/500/600/700 Serif)
Body, Buttons & UI   : Manrope (Google Fonts, 300/400/500/600/700/800 Sans)
Mono & Micro-Labels  : JetBrains Mono / SFMono (Monospace)
```

### Type Scale & Roles
| Role | Font Family | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `Domine` | `clamp(2.75rem, 5.5vw, 4.5rem)` | 700 | -0.025em |
| **Section Title**| `Domine` | `clamp(2rem, 3.5vw, 2.75rem)` | 700 | -0.02em |
| **Card Title** | `Domine` | `1.15rem – 1.35rem` | 700 | -0.015em |
| **Pricing Figures**| `Domine` | `1.25rem – 2.0rem` | 700 | -0.02em |
| **Body Large** | `Manrope` | `1.125rem` (18px) | 400 | +0.00em |
| **Body Standard**| `Manrope` | `0.9375rem – 1rem` | 400 / 500 | +0.005em |
| **UI Control** | `Manrope` | `0.875rem` (14px) | 600 / 700 | +0.01em |
| **Campus Eyebrow**| `Manrope` / `Mono` | `0.72rem` (11.5px) | 700 | +0.08em (UPPERCASE) |

---

## 4. Elevation, Radii & Surface Depth

### Elevation
Shadows incorporate botanical pine tint to harmonize with the cream canvas:
* **Level 1 (Card Rest)**: `0 1px 3px rgba(15, 56, 44, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)`
* **Level 2 (Hover / Floating)**: `0 8px 24px -4px rgba(15, 56, 44, 0.12), 0 2px 6px -1px rgba(15, 56, 44, 0.06)`
* **Level 3 (Sticky / Modal)**: `0 20px 48px -12px rgba(15, 56, 44, 0.22), 0 1px 3px rgba(0, 0, 0, 0.04)`

### Radii System
* `radius-sm`: `6px` (Badges, tags, micro-chips)
* `radius-md`: `8px` (Form inputs, date pills, time slot buttons)
* `radius-lg`: `12px` (Service sub-cards, review line items)
* `radius-xl`: `16px` (Main service cards, pricing boxes)
* `radius-2xl`: `20px` (Feature containers, step panels)
* `radius-pill`: `9999px` (Primary CTAs, segmented filters, value badges)

---

## 5. Signature Components & Patterns

### 1. Service Segmented Pill Selector
Located in `src/components/sections/story/CoreServicesSection.tsx`:
* Floating pill container: `backgroundColor: var(--color-canvas-base)`, `border: 1px solid var(--color-border-subtle)`.
* Active tab: `backgroundColor: var(--color-brand-blue)` (`#0F382C`), `color: #FFFFFF`.
* Inactive tab: `color: var(--color-text-secondary)` (`#414845`), hover background `#f3fbf5`.
* Tracks: **PG / Flats**, **Mess & Food**, and **Laundry**.

### 2. Dual-Button Action Hierarchy
* **Primary / Conversion Action**: Warm Amber Gold (`#F8CE37`), text `#212925` (Charcoal Slate), hover lift with gold glow shadow.
* **Secondary / Exploration Action**: Deep Pine (`#0F382C`), text `#FFFFFF`, or White surface with Pale Sand border.

### 3. Trust & Institutional Safeguards
* Verified Campus Partner badges use Sage Green `#2E7D32`.
* Student escrow guarantee banners feature pale green surface overlays (`rgba(46, 125, 50, 0.08)`) with `1px solid rgba(46, 125, 50, 0.22)`.
