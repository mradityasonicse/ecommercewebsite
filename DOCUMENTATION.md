# EaseHub Developer Documentation & Guide

## 1. How to Add a New Service (1-Step Configuration)

Because EaseHub uses a centralized data model and repository architecture, adding a new service requires **exactly one entry** in `src/data/services.ts`.

### Step: Add Service to `ECOSYSTEM_SERVICES`
Open `src/data/services.ts` and append a new `Service` object to `ECOSYSTEM_SERVICES`:

```typescript
{
  id: 'printing',
  slug: 'printing',
  name: 'Campus Cloud Printing & Stationery',
  shortDescription: 'Hostel doorstep delivery of lab manuals, thesis bindings, and exam notes.',
  shortDesc: 'Hostel doorstep delivery of lab manuals, thesis bindings, and exam notes.',
  fullDescription: 'Upload PDFs via student portal, select spiral binding or color prints, and pick up at hostel security or campus hub within 45 minutes.',
  fullDesc: 'Upload PDFs via student portal, select spiral binding or color prints, and pick up at hostel security or campus hub within 45 minutes.',
  category: 'cleaning', // Or a new category ID
  iconName: 'FileText',
  badgeText: 'Same-Day Dispatch',
  startingPrice: '₹2',
  numericStartingPrice: 2,
  pricingUnit: 'per page',
  popularFeatures: ['Spiral Binding', 'Color & B/W', 'Hostel Drop', 'Instant Upload'],
  metrics: {
    providersAvailable: 8,
    avgDeliveryTime: '45 mins',
    studentSatisfaction: '99.0%',
    ratingScore: 4.9,
    reviewCount: 154,
  },
  accentColor: 'blue',
  available: true,
  availabilityStatus: 'available',
  campusIds: ['dtu-delhi', 'bits-pilani', 'vit-vellore'],
  tags: ['Print', 'Stationery', 'Thesis', 'Lab Manual', 'Exam Notes'],
  isFeatured: false,
  priorityOrder: 9,
}
```

### Automatic System Consumption
Once added:
1. The **Service Discovery Page** automatically displays the new card with filtered tags, dynamic category count, and price sorting.
2. The **Search Engine** automatically indexes the new service name, tags, and features.
3. The **Campus Filter** automatically includes the service for configured campuses.
4. The **Navigation Mega-Menu** and **Footer** immediately reflect the updated service list.

---

## 2. Search & Filter Algorithm Specification

The search algorithm (`ServiceRepository.filterAndSortServices`) is designed to eliminate user friction:

### Search Capabilities
* **Case-Insensitive**: Matches `wifi`, `WiFi`, and `WIFI`.
* **Multi-Token Matching**: Entering `laundry hostel` splits into `['laundry', 'hostel']` and requires both tokens to be present across the service name, description, tags, features, or badge.
* **Whitespace-Tolerant**: Leading, trailing, and multiple internal spaces are trimmed.
* **Zero AI Dependencies**: Fast, deterministic, sub-millisecond client execution.

### Sorting Options
* `recommended`: Featured services first, followed by `priorityOrder`.
* `popular`: Descending order by `metrics.providersAvailable`.
* `rating`: Descending order by `metrics.ratingScore`.
* `price-asc`: Ascending order by `numericStartingPrice`.
* `price-desc`: Descending order by `numericStartingPrice`.

---

## 3. Empty & Error State Handling

* **EmptyState** (`src/components/discovery/EmptyState.tsx`):
  Triggered when search query or filter combination returns 0 results. Provides intelligent suggestions and a single-click "Clear All Filters" reset button.
* **ErrorState** (`src/components/discovery/ErrorState.tsx`):
  Triggered if data fetching rejects or fails. Provides a reassuring message and a "Try Again" retry action without exposing technical stack traces to users.
* **LoadingState** (`src/components/discovery/LoadingState.tsx`):
  Displays pulse skeleton cards matching the exact layout of service cards, respecting `prefers-reduced-motion`.

---

## 4. Mobile Discovery UX

* Viewport widths from `320px` to `768px` automatically switch the category bar to a horizontal touch-scroller.
* A sticky bottom-sheet `FilterDrawer` opens when tapping the "Filters" toolbar button, supporting campus selection, category selection, availability toggling, and sort ordering.
* Background scroll is locked when the drawer is active, and pressing `Escape` or tapping the backdrop dismisses it instantly.

---

## 5. Phase 6: Service Detail Experience (`/services/[slug]`)

### Overview
Phase 6 delivers an editorial, high-trust product detail experience for every EaseHub living pillar:
* **Canonical URL Routes**: `/services/mess`, `/services/hostel-pg`, `/services/laundry`, `/services/gym-fitness`, `/services/wifi`, `/services/transport`, `/services/cleaning`, `/services/maintenance`.
* **Dynamic Geofence Adaptation**: Shows live provider counts and delivery perimeters customized to the active selected university campus.
* **Component Rhythm**:
  1. **Breadcrumbs**: Hierarchical trail with instant back actions.
  2. **Editorial Hero**: Technical visual badge, live metrics, verified turnaround SLA, starting rate card, and quick jump actions.
  3. **Trust & Safeguards Summary**: 5-pill metric strip (Category, SLA, Perimeter, Rate Guarantee, Audit Standard).
  4. **Transparent Inclusions / Exclusions**: Precise features breakdown with verified checkmarks and explicit exclusions.
  5. **Tiered Living Options**: Interactive plan cards with popular plan highlight, student savings badges, and selection states.
  6. **Perimeter & Campus Coverage**: Specific residential halls, gate corridors, and average room arrival times.
  7. **Audited Providers**: Active on-ground operator cards with hygiene / legal audit tags and direct profile links.
  8. **Verified Student Feedback**: Real student rating aggregates, percentage approval score, and anti-tamper pledge.
  9. **Service FAQ Accordion**: Expandable answers to real student questions regarding pauses, laundry mix-ups, and deposit escrow.
  10. **Cross-Service Recommendations**: Intelligent adjacent pillar suggestions.
  11. **Sticky Bottom Action Bar**: Fast plan selection button and rate display pinned on mobile & desktop.
  12. **Resilient System States**: 404 Not Found (with suggested pillars), Loading Skeleton, and Temporary Inactive notices.

---

## 6. Phase 7: Booking & Request Subsystem Guide

### Flow Architecture
* **Route**: `/services/:slug/book` or `#services/:slug/book`.
* **Step Sequence**:
  - `Step 1: Choose Plan` (`ServiceSelectionStep`): User selects package tier; shows student savings badges and breakdown.
  - `Step 2: Schedule` (`DatePicker`, `TimeSlotSelector`): Date picking up to 14 days ahead, with campus gate aligned arrival windows. Skipped dynamically if service is date-agnostic.
  - `Step 3: Details` (`CustomerDetailsStep`): Captures name, phone (SMS/OTP updates), email, campus perimeter, hostel block, room number, and special instructions.
  - `Step 4: Review` (`BookingReview`): Summary card with direct inline edit buttons, pricing breakdown, and Student Safeguard pledge.
  - `Step 5: Confirmation` (`BookingConfirmation`): Generates unique reference `EH-XXXXXX` with 1-click clipboard copy and CTA to track in student account.

---

## 7. Phase 8: Auth & Student Account Guide

### Demo Credentials
* **Email**: `student@easehub.in`
* **Password**: `Student#2026`
* An **Auto-Fill Credentials** shortcut button is provided on the Sign In page for seamless 1-click testing.

### Account Dashboard Features (`/account`)
* **My Service Requests Tab**: Live list of active and completed orders with status filtering (All, Confirmed, Pending, Cancelled) and accordion detail drawers.
* **Profile & Campus Info Tab**: View and edit student name, phone, campus, hostel, and room numbers.
* **Security & Credentials Tab**: Update password with real-time strength meter, view active sessions across devices, and check SSO domain status.
