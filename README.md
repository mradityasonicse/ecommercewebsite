# EaseHub — One Platform. Every Student Need.

EaseHub is a high-craft student living operating system and campus services marketplace connecting university students with background-verified housing, hygienic food mess subscriptions, doorstep laundry, campus shuttles, dedicated fiber Wi-Fi, cleaning, and emergency maintenance.

---

## 🚀 Key Platform Features

* **Phase 0 — Architecture Foundation**: Modern React 19 + TypeScript + Vite architecture with modular structure and zero runtime bloat.
* **Phase 1 — Design System**: Tokenized color hierarchy (Deep Black `#050505`, Electric Blue `#1677FF`, Signal Red `#FF2B2B`), fluid typography, accessible button/badge primitives, and strict anti-AI principles.
* **Phase 2 — Brand & Global Navigation**: Sticky navigation header with geofenced university switcher, services mega-menu, mobile navigation drawer, and institutional footer.
* **Phase 3 — World-Class Hero Experience**: High-impact editorial hero with interactive 8-pillar constellation, subtle cursor parallax, and live student search.
* **Phase 4 — Homepage Storytelling**: Continuous product story leading students from friction (Problem) to clarity (Solution), 8 living pillars (Ecosystem), visual arithmetic (Bundles), institutional trust guarantees (Trust & Safety), campus hubs (Network), and partner onboarding (Operators).
* **Phase 5 — Service Ecosystem & Discovery**: Dedicated `/services` discovery engine with multi-token search, 8 centralized categories, deterministic sorting, mobile bottom-sheet filters, URL query param synchronization, and repository abstraction.
* **Phase 6 — Service Detail Experience**: Individual service route (`/services/[slug]`) for all 8 living pillars with asymmetric editorial hero, trust metrics, transparent inclusions/exclusions, plan tier comparison, campus perimeter coverage, verified on-ground operators, verified student reviews, accessible FAQ accordion, and persistent sticky action bar.
* **Phase 7 — Booking & Service Request UX**: End-to-end 4-step booking and request flow (`/services/[slug]/book`) adapting dynamically to service action type (`booking` vs `inquiry` vs `subscription`), 14-day date picker, campus gate-aligned time slot selector, hostel room address input, summary review, and confirmation screen with tracking reference (`EH-XXXXXX`).
* **Phase 8 — Auth Foundation & Student Account**: Institutional student auth (`/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`) with 1-click demo account (`student@easehub.in` / `Student#2026`), pluggable adapter boundary (`IAuthProviderAdapter`), role architecture (`student`, `provider`, `admin`), safe `returnTo` open-redirect prevention, and global Navbar session integration.
* **Phase 9 — Student Dashboard & Request Tracking**: Production-ready Student Dashboard (`/account`, `/account/dashboard`, `/account/requests`, `/account/requests/:id`) with time-aware personalized welcome, quick actions toolbar, active requests cards, upcoming service schedule, chronological activity stream, 5-stage visual `RequestTimeline`, state-aware cancellations, and strict request ownership security.
* **Phase 10 — Student Profile, Settings & Notifications Center**: Comprehensive student account console featuring segregated Personal Identity & Academic Residence management, profile avatar photo management, dedicated Notification Center (`/account/notifications`) with reactive unread counter, multi-channel alert preferences (In-app, Email, SMS/WhatsApp), privacy data masking, and accessible Danger Zone confirmation dialogs.
* **Phase 11 — Provider / Vendor Ecosystem Foundation**: Supply-side campus operator ecosystem featuring high-impact operator landing page (`/provider`), 8-step guided vendor onboarding wizard (`/provider/onboarding`) with draft auto-saving, live application lifecycle tracker (`/provider/status`), partner storefront profile editor (`/provider/profile`), multi-channel dispatch settings (`/provider/settings`), zero-automatic-role-promotion security, and strict tenant data isolation.

---

## 🛠 Tech Stack

* **Frontend Framework**: React 19, TypeScript
* **Build Tooling**: Vite 8.2.2
* **Styling**: Vanilla CSS with Design System Tokens (`src/styles/tokens/*`)
* **Icons**: `lucide-react`
* **Linter & Code Quality**: `oxlint`

---

## 🧭 Routes & Views

* `/` or `#`: **Homepage Storytelling Experience**
* `/services` or `#services`: **Dedicated Service Discovery Marketplace**
  * Supports deep-links: `/services?category=laundry&campus=bits-pilani&search=wifi&sort=price-asc`
* `/services/:slug` or `#services/:slug`: **Individual Service Detail Experience**
  * Examples: `/services/mess`, `/services/hostel-pg`, `/services/laundry`, `/services/gym-fitness`, `/services/wifi`, `/services/transport`, `/services/cleaning`, `/services/maintenance`
* `/services/:slug/book` or `#services/:slug/book`: **Service Booking & Request UX Flow**
* `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`: **Authentication Routes**
* `/account` or `#account` / `/account/dashboard`: **Student Dashboard Overview**
* `/account/requests`: **My Service Requests Management**
* `/account/requests/:id`: **Dedicated Request Tracking & Lifecycle Timeline**
* `/account/notifications`: **In-App Notification Center**
* `/account/profile`: **Student Identity & Academic Residence Settings**
* `/account/settings`: **Security Credentials, Privacy Controls & Danger Zone**
* `/provider` or `#provider`: **Provider Ecosystem Landing & Value Proposition**
* `/provider/onboarding`: **8-Step Provider Onboarding & Compliance Wizard**
* `/provider/status`: **Partner Application Status & Audit Lifecycle Tracker**
* `/provider/profile`: **Verified Provider Storefront & Service Catalog Manager**
* `/provider/settings`: **Multi-Channel Dispatch, Capacity & Security Preferences**
* `/design-system` or `#design-system`: **Live Design System Showcase & Token Inspector**

---

## 🏃‍♂️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Lint codebase
npm run lint

# 4. Compile and verify production build
npm run build
```

---

## 📖 Architecture & Documentation

* Detailed Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
* Provider Ecosystem Architecture: [`PROVIDER-ECOSYSTEM.md`](./PROVIDER-ECOSYSTEM.md)
* Authentication Architecture: [`AUTH.md`](./AUTH.md)
* Student Dashboard & Request System: [`STUDENT-DASHBOARD.md`](./STUDENT-DASHBOARD.md)
* Developer & Extensibility Guide: [`DOCUMENTATION.md`](./DOCUMENTATION.md)
* Complete Design System Specification: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
