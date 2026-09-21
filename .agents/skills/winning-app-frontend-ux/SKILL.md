---
name: winning-app-frontend-ux
description: >-
  Builds market-ready, visually stunning frontends with modular React components, clean modern visual hierarchy, and high-fidelity interactive prototyping that instills trust and wows users and evaluators.
---

# Winning Application Frontend & User Experience (UX)

This skill guides the design, implementation, and refinement of world-class, market-ready web and mobile user interfaces. Follow this playbook to deliver interfaces that look and feel like polished, production-grade products rather than minimum viable prototypes.

---

## 1. Component-Based Development (React Ecosystem)

### Core Directives
- **Atomic & Modular Structure**: Decompose UIs into clean, single-responsibility components (primitives, compound components, domain features, layout shells).
- **TypeScript First**: Ensure all component props, variant styles, state payloads, and handler signatures are strictly typed with zero implicit `any`.
- **Compound State Management**:
  - Keep UI state close to where it's consumed.
  - Lift state upward only when synchronization across non-sibling nodes is required.
  - Prefer declarative state machines or explicit status enums (`'idle' | 'loading' | 'success' | 'error'`) over brittle boolean flags (`isLoading`, `isFailed`, `isDone`).
- **Resilience & Graceful Degradation**:
  - Always implement stateful visuals for every asynchronous lifecycle: skeleton loaders, rich empty states with actionable CTAs, error boundaries with retry mechanisms.
  - Guard all list renders with unique keys and empty array fallbacks.

---

## 2. Visual Graphic Design & Trust Engineering

### Visual Hierarchy & Layout
- **The 3-Second Trust Rule**: A visitor or judge decides credibility within 3 seconds. The interface must look immediately authoritative, intentional, and high-value.
- **Harmonious Color Systems**:
  - Establish a cohesive palette: Primary Brand (with subtle tonal steps 50–900), Neutral Slate/Gray for typography and borders, Semantic Status (Success, Warning, Destructive, Info).
  - Use subtle gradients, glassmorphism overlays (`backdrop-filter: blur(...)`), and refined 1px border highlights (`border-white/10` or subtle dual shadows).
  - Avoid raw browser default colors or unstyled high-contrast primary hues.
- **Typography & Rhythm**:
  - Pair modern typefaces (e.g., Plus Jakarta Sans, Inter, Outfit, or Geist) with defined type scales:
    - Display / H1: Bold, crisp tracking (`tracking-tight`), tight line height.
    - Body: 14–16px, readable line height (`leading-relaxed`), medium-contrast tone.
    - Metadata / Badges: 11–12px uppercase or semi-bold with comfortable letter-spacing.
- **Micro-Interactions & Motion**:
  - Every interactive element (buttons, cards, inputs, tabs) must provide tactile feedback:
    - Smooth hover elevations (`transform: translateY(-2px)`, shadow transition 150-200ms cubic-bezier).
    - Active press scale down (`active:scale-[0.98]`).
    - Focus visible rings with adequate contrast for accessibility.

---

## 3. Interactive Prototyping & Flow Polish

### Market-Ready Polish Checklist
1. **Zero Dead Ends**:
   - Every click, button, and navigation item must lead to a meaningful state, modal, sheet, or confirmation toast.
   - If a feature is mocked or in preview mode, present a rich interactive modal or notification explaining the feature preview rather than an unhandled click.
2. **Dynamic Data & Zero Placeholders**:
   - Do not display `Lorem Ipsum` or broken placeholders.
   - Populate realistic, domain-specific mock data, user avatars, real prices, campus locations, timestamps, and authentic badge indicators.
3. **Smooth View Transitions**:
   - Use layout animations, drawer slide-ins, and backdrop fades so view changes feel seamless and app-like.
4. **Responsive Adaptability**:
   - Test and ensure perfection across 375px (mobile), 768px (tablet), 1024px (laptop), and 1440px+ (desktop).
   - Sticky bottom navigation bars or dynamic floating action bars on mobile; expanded navigation sidebars or clean header bars on desktop.
