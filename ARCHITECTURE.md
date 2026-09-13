# EaseHub Technical Architecture Specification

## 1. Architectural Overview

EaseHub is architected as an institutional student-living marketplace and campus operating system. The platform bridges university students with verified local operators across eight essential living verticals (Mess & Food, Housing & PG, Laundry, Gym & Fitness, Wi-Fi, Campus Transport, Cleaning, and Maintenance).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Presentation Layer                     │
├─────────────────────────────────────────────────────────────────────────┤
│   Homepage Storytelling   │   Service Discovery Engine  │ Design System │
│   (Problem → Solution     │   (/services / #services)   │ (/design-sys) │
│    → Ecosystem → CTA)     │   Search, Filter, Sort      │ Tokens/Specs  │
├───────────────────────────┴─────────────────────────────┴───────────────┤
│                           Global Layout Shell                           │
│   AppShell • Sticky Navbar • Geofenced Campus Context • Global Footer   │
├─────────────────────────────────────────────────────────────────────────┤
│                           Discovery Subsystems                          │
│  DiscoveryHeader │ SearchBar │ CategoryNav │ FilterToolbar │ Drawer     │
│  ServiceResults  │ ServiceCard │ Skeletons │ EmptyState    │ ErrorState │
├─────────────────────────────────────────────────────────────────────────┤
│                        Service Repository Boundary                      │
│                    (src/services/serviceRepository.ts)                  │
│   getServices() │ getServiceBySlug() │ filterAndSort() │ getFeatured()  │
├─────────────────────────────────────────────────────────────────────────┤
│                        Data Layer & State Model                         │
│   ECOSYSTEM_SERVICES │ SERVICE_CATEGORIES │ CAMPUSES │ BUNDLES          │
│   (Ready for drop-in REST/GraphQL/Supabase backend replacement)         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Service Data Architecture

### Core Data Models (`src/types/service.ts`)
```typescript
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable' | 'coming_soon';

export type ServiceSortOption = 
  | 'recommended' 
  | 'popular' 
  | 'rating' 
  | 'price-asc' 
  | 'price-desc';

export interface Service {
  id: string;
  slug: string;                        // Canonical slug (e.g., 'mess', 'laundry')
  name: string;                        // Display name
  shortDescription: string;
  fullDescription: string;
  category: string;                    // Foreign key to ServiceCategory.id
  iconName: string;                    // Lucide icon identifier
  badgeText: string;                   // E.g. 'FSSAI + EaseHub Verified'
  startingPrice: string;               // Display price string (e.g. '₹75')
  numericStartingPrice: number;        // Deterministic price calculation
  pricingUnit: string;                 // E.g. 'per meal', 'per month'
  popularFeatures: string[];
  metrics: ServiceMetrics;             // Providers available, satisfaction, rating
  accentColor: 'blue' | 'red' | 'default';
  available: boolean;
  availabilityStatus: AvailabilityStatus;
  campusIds?: string[];                // Geofenced campuses supporting this service
  tags: string[];
  isFeatured?: boolean;
  priorityOrder?: number;
}
```

### 8 Centralized Categories (`SERVICE_CATEGORIES`)
All categories originate from `src/data/services.ts` and must not be hardcoded or duplicated in UI components:
1. `food-mess`: Food & Mess
2. `hostel-pg`: Hostel & PG
3. `laundry`: Laundry
4. `gym-fitness`: Gym & Fitness
5. `wifi`: Wi-Fi
6. `transport`: Transport
7. `cleaning`: Cleaning
8. `maintenance`: Maintenance

---

## 3. Service Repository Abstraction

The `ServiceRepository` (`src/services/serviceRepository.ts`) serves as an isolation boundary between UI components and the backend data store.

### Contract Methods
* `getServices(params?: ServiceFilterParams): Promise<Service[]>`
* `getServiceBySlug(slug: string): Promise<Service | null>`
* `getServiceDetailBySlug(slugOrAlias: string): Promise<ServiceDetail | null>`
* `getRelatedServices(slug: string): Promise<Service[]>`
* `resolveCanonicalSlug(slugOrAlias: string): string`
* `getServiceById(id: string): Promise<Service | null>`
* `getCategories(): ServiceCategory[]`
* `getFeaturedService(): Promise<Service | null>`
* `filterAndSortServices(services: Service[], params: ServiceFilterParams): Service[]`

### Future API Integration
To connect a live backend (e.g. Node.js/Go API, Supabase, or Firebase):
1. Keep the `ServiceRepository` signature identical.
2. Replace the internal array queries with `fetch('/api/v1/services', ...)` or API SDK calls.
3. UI components require **zero refactoring**.

---

## 4. Routing & URL State Management

### Conventions
* `/services` or `#services`: Opens the dedicated Service Discovery Marketplace.
* `/services/:slug` or `#services/:slug`: Canonical detail path for individual service experiences (e.g. `/services/laundry`, `/services/mess`).
* `/` or `#`: Opens the Homepage Storytelling Experience.
* `/design-system` or `#design-system`: Opens the Design System Showcase.

### Canonical Slug Aliasing System
The `ServiceRepository.resolveCanonicalSlug` engine automatically resolves navigation variants and aliases:
* `food`, `food-mess` → `mess`
* `stay`, `hostel-pg` → `hostel`
* `fitness`, `gym-fitness` → `fitness`
* `transport`, `campus-transit` → `transport`
* `wifi`, `mesh-wifi` → `wifi`
* `laundry`, `fabric-care` → `laundry`
* `cleaning`, `room-cleaning` → `cleaning`
* `maintenance`, `hostel-repairs` → `maintenance`

### Deep Linking
URL parameters are synchronized bi-directionally using `window.history.replaceState`:
* `category`: `/services?category=laundry`
* `campus`: `/services?campus=bits-pilani`
* `search`: `/services?search=wifi`
* `sort`: `/services?sort=price-asc`
* `availability`: `/services?availability=available`

---

## 5. Performance & Accessibility Standards

1. **Deterministic Execution**: Zero simulated network lag or fake spinners; skeleton loaders are displayed only during asynchronous data fetching.
2. **Keyboard Navigation**:
   * Search input triggers focus on `/` keydown.
   * Full tab order and `Enter`/`Space` support for service cards and category pills.
   * `Escape` key immediately closes the mobile `FilterDrawer`.
3. **Responsive Architecture**:
   * Desktop (>=1024px): Full horizontal toolbar, multi-column card grid, asymmetric hero visual layout.
   * Tablet (768px-1023px): Two-column responsive card layout.
## 6. Phase 7: Booking & Service Request Architecture

### Data Models (`src/types/booking.ts`)
```typescript
export type ServiceActionType = 'booking' | 'request' | 'inquiry';

export interface ServiceRequest {
  id: string; // Institutional reference: "EH-XXXXXX"
  serviceSlug: string;
  serviceName: string;
  actionType: ServiceActionType;
  optionId?: string;
  optionName?: string;
  customer: CustomerDetails;
  schedule?: ScheduleDetails;
  notes?: string;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  estimatedPrice?: string;
}
```

### ServiceRequestRepository (`src/services/serviceRequestRepository.ts`)
Decoupled client storage abstraction implementing:
- `createRequest(payload)`: Assigns unique `EH-XXXXXX` tracking ID, records timestamp, persists to session storage.
- `getUserRequests(emailOrPhone)`: Returns historical bookings for active student.
- `getRequestById(id)`: Point lookup for order tracking.
- Zero-refactor readiness for Postgres/Supabase table: `service_requests`.

---

## 7. Phase 8: Authentication & Account Architecture

### AuthService Abstraction (`src/services/authService.ts`)
- Provider mode configurable via `VITE_AUTH_PROVIDER`: `'mock' | 'supabase' | 'firebase' | 'custom-api'`.
- Pre-configured demo student: `student@easehub.in` / `Student#2026`.
- Deterministic session storage persistence via `easehub_auth_session_v1`.

### AuthContext & Hook (`src/context/AuthContext.tsx`)
- Provides `user`, `isAuthenticated`, `isLoading`, `signIn()`, `signUp()`, `signOut()`, `updateUser()`.
- Global AppShell and UserActions automatically react to auth state.
- Safe `returnTo` redirect preservation for checkout and booking resumption.

### Routes Architecture (`src/utils/routes.ts`)
- `#services/:slug/book` / `/services/:slug/book`: Booking flow.
- `#auth/:mode` / `/auth/:mode`: Sign in, sign up, password recovery.
- `#account` / `/account`: Student account management dashboard.

