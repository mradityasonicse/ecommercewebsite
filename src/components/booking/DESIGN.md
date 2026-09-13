---
name: Academic Hearth
colors:
  surface: '#f3fbf5'
  surface-dim: '#d3dcd6'
  surface-bright: '#f3fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf6ef'
  surface-container: '#e7f0e9'
  surface-container-high: '#e2eae4'
  surface-container-highest: '#dce5de'
  on-surface: '#151d1a'
  on-surface-variant: '#414845'
  inverse-surface: '#2a322e'
  inverse-on-surface: '#eaf3ec'
  outline: '#717975'
  outline-variant: '#c1c8c3'
  surface-tint: '#3f6658'
  primary: '#002218'
  on-primary: '#ffffff'
  primary-container: '#0f382c'
  on-primary-container: '#79a292'
  inverse-primary: '#a6d0be'
  secondary: '#725c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed33c'
  on-secondary-container: '#715b00'
  tertiary: '#002218'
  on-tertiary: '#ffffff'
  tertiary-container: '#00392b'
  on-tertiary-container: '#6ea490'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecda'
  primary-fixed-dim: '#a6d0be'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#274e41'
  secondary-fixed: '#ffe082'
  secondary-fixed-dim: '#ebc22b'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#564500'
  tertiary-fixed: '#b6eed8'
  tertiary-fixed-dim: '#9bd2bd'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#185040'
  background: '#f3fbf5'
  on-background: '#151d1a'
  surface-variant: '#dce5de'
  surface-base: '#FBF9F1'
  surface-card: '#FFFFFF'
  border-subtle: '#E8E4D5'
  text-muted: '#6B736D'
  accent-hover: '#E2B822'
  status-success: '#2E7D32'
  status-alert: '#D3452E'
typography:
  display-lg:
    fontFamily: Domine
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Domine
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Domine
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
  headline-lg-mobile:
    fontFamily: Domine
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-md:
    fontFamily: Domine
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
  title-md:
    fontFamily: Manrope
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
  body-lg:
    fontFamily: Manrope
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-md:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  label-md:
    fontFamily: Manrope
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Manrope
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an elevated collegiate atmosphere tailored for student living, accommodations, and lifestyle management. Moving away from sterile booking engines or hyper-playful youth apps, the interface crafts a sense of architectural permanence, dependable hospitality, and domestic calm. It speaks directly to university students seeking autonomy and parents seeking security and verified standards.

The visual direction merges **Minimalist Structure** with **Subtle Warmth and Tactile Precision**. Grounded architectural serifs anchor key milestones and headings, while balanced, highly legible geometric sans-serif type guides transaction-heavy flows such as lease agreements, daily mess meal selections, and laundry pickup scheduling. Visual elements lean on rich botanical tones, warm paper-like backdrops, and tailored borders to impart institutional trust with modern digital agility.

## Colors

The palette is rooted in classic collegiate greens and warm natural tones:
- **Primary Brand (`#0F382C` & `#164E3E`)**: Deep Pine and Forest Green form the anchor of trust, authority, and shelter. Used for main action points, primary headings, active tab indicators, and verified property badges.
- **Secondary Accent (`#F8CE37` & `#E2B822`)**: Warm Amber Gold introduces vitality, used sparingly for primary conversion actions (e.g., "Book Now", "Renew Subscription"), urgency highlights, and star ratings.
- **Surface & Neutrals (`#FBF9F1`, `#FFFFFF`, `#E8E4D5`)**: Soft Cream serves as the underlying canvas, eliminating digital eye strain. Pure White is reserved for elevated cards, modal panels, and segmented control containers. Pale Sand forms discreet structural dividers.
- **Text Hierarchy (`#212925`, `#6B736D`)**: Charcoal Slate ensures crisp legibility without harsh absolute black contrast; Olive Grey softens metadata, timestamps, and secondary specifications.
- **Functional Semantics**: Sage Green indicates available beds, dietary preferences (veg), and delivered service cycles. Terracotta Red signals payment deadlines, fully booked residences, or cancellation notices.

## Typography

Typography strikes a balance between academic heritage and operational efficiency. 

- **Headlines (Domine)**: A sturdy, modern editorial serif that evokes architectural permanence, campus libraries, and established institutions. Reserved for page titles, residence names, service showcase banners, and total transaction figures.
- **Body & Controls (Manrope)**: A balanced geometric sans-serif engineered for clean readability across smaller sizes. Handles filter options, pricing breakdowns, daily menu listings, amenity tags, and dashboard schedules with no optical clutter.
- **Micro-labels and Overlines**: Rendered in Manrope Semibold with slightly increased tracking (`0.04em`) to establish visual order in metadata badges, service tags, and status trackers.

## Layout & Spacing

Layout conforms to an 8pt architectural rhythm structured around content density:

- **Grid Structure**:
  - **Desktop (1024px+)**: 12-column responsive grid with `2rem` gutters and dynamic outer margins capped at `1280px` container width. Multi-column dashboard layouts divide evenly into room inventories, subscription summaries, and interactive maps.
  - **Tablet (768px - 1023px)**: 8-column grid with `1.5rem` gutters and `2rem` margins.
  - **Mobile (<768px)**: 4-column fluid layout with `1rem` gutters and `1rem` edge margins. Primary service selectors (PG, Mess, Laundry) stack horizontally in a scrollable rail.

- **Component Spacing Rules**:
  - `space-xs` (4px) and `space-sm` (8px) govern tight pairings: icons next to badge counts, bed count chips, and form helper text.
  - `space-md` (16px) establishes internal card paddings and input field spacing.
  - `space-lg` (24px) creates visual separation between distinct card groups, meal session blocks, and payment line items.
  - `space-xl` (40px) demarcates macro sections across student residence detail pages and onboarding steps.

## Elevation & Depth

Visual depth follows a soft tactile standard that replaces harsh elevation with warm, diffused atmospheric contact:

- **Level 0 (Flat Surface)**: The canvas sits on `surface-base` (`#FBF9F1`). Non-elevated sections rely on a `1px` continuous border of Pale Sand (`#E8E4D5`).
- **Level 1 (Default Cards & Tiles)**: Property listings, food subscription meal slots, and laundry cycle containers use `#FFFFFF` surfaces with a subtle tint shadow: `0 2px 8px -2px rgba(15, 56, 44, 0.05), 0 1px 2px 0 rgba(15, 56, 44, 0.03)` alongside a `1px` border of `#E8E4D5`.
- **Level 2 (Hover & Floating Elements)**: Interactive cards on hover, quick-booking drawers, and dropdown filters shift upward with an ambient shadow: `0 8px 24px -4px rgba(15, 56, 44, 0.08), 0 3px 6px -1px rgba(15, 56, 44, 0.04)`.
- **Level 3 (Modals & Overlays)**: Bed selection lightboxes and KYC verification modals use `0 20px 40px -8px rgba(15, 56, 44, 0.14)` combined with a frosted backdrop layer (`rgba(15, 56, 44, 0.35)` with `4px` blur).

## Shapes

The design uses a restrained, architectural curvature (`roundedness: 1`):
- **Base Corner Radius (0.25rem / 4px)**: Applied to input elements, subtle tags, and table cells.
- **Large Radius (0.5rem / 8px)**: Applied to housing overview cards, service panels, button groupings, and filter dropdowns.
- **Extra Large Radius (0.75rem / 12px)**: Applied to high-level navigation bars, modal dialogs, and hero media containers.
- **Pill Exception**: Status indicators (e.g., "Immediate Move-in", "Veg Only", "Ironing Done") and the top-level triple-service switcher (PG / Mess / Laundry) retain fully rounded pill geometry (`9999px`) to distinguish actionable selection tags from structural content containers.

## Components

### Buttons
- **Primary**: Solid Deep Pine (`#0F382C`) background with pure white text. Hover transitions to Forest Green (`#164E3E`). Height 44px (mobile) to 48px (desktop), 0.25rem border radius, Manrope 600.
- **Accent Action**: Warm Amber Gold (`#F8CE37`) background with Charcoal Slate (`#212925`) text for high-conversion CTAs ("Book Room", "Subscribe to Plan"). Hover scales to Muted Ochre (`#E2B822`).
- **Secondary / Outline**: `#FFFFFF` background with a `1px` border in `#E8E4D5` and `#0F382C` text. Hover applies `#FBF9F1` fill.

### Service Segmented Pill Selector
- A central pill container on `#FBF9F1` bordered by `#E8E4D5`. Houses three mutually distinct services: **PG / Flats**, **Mess & Food**, and **Laundry**. Active item snaps with a solid Deep Pine fill, pure white text, and a subtle drop shadow; inactive items remain muted in Olive Grey (`#6B736D`).

### Property & Service Cards
- Pure white surfaces with `0.5rem` border radii and a subtle `1px` border of `#E8E4D5`. Features an integrated photo carousel, verified shield icon badge top-left, monthly/daily price highlighted in Domine serif, and key attribute chips below (e.g., "AC", "Attached Washroom", "Wi-Fi included").

### Input Fields & Filters
- Background `#FFFFFF` with `1px` border in `#E8E4D5`. Padding `0.75rem 1rem`. Focus state triggers a clean `1.5px` border in `#0F382C` without aggressive outer glow rings. Error states use Terracotta Red (`#D3452E`) with contextual inline feedback.

### Checkboxes & Radio Controls
- Square with `2px` rounded corners for checkboxes; circular for radios. Inactive border in `#6B736D`; active state fills with `#0F382C` displaying a crisp white mark.

### Status Badges & Trust Seals
- Compact pill-shaped badges (`0.6875rem` font size, `0.25rem 0.5rem` padding). 
  - **Verified Shield**: Deep Pine background with Gold check icon.
  - **Meal Type**: Light sage tint with Sage Green text (`#2E7D32`).
  - **Laundry Stage**: Neutral sand tint with Charcoal Slate text.