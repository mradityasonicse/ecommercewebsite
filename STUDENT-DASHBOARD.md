# EaseHub Student Dashboard, Request Tracking & Account System (Phase 9 & 10)

> "One Platform. Every Student Need."

---

## 1. Overview & Core Mission

The EaseHub Student Dashboard is the central operating console for authenticated university students. Designed with the high-contrast EaseHub design system (Black, Electric Blue, Signal Red, White, Neutral Grays), it eliminates living friction by allowing students to monitor live request fulfillments, hostel deliveries, scheduled service windows, campus notifications, and academic privacy settings.

---

## 2. Route Hierarchy

The account portal supports deep routing across both canonical paths and hash navigation:

| Route Path | Hash Route | View Component | Functionality |
| :--- | :--- | :--- | :--- |
| `/account` or `/account/dashboard` | `#account` or `#account/dashboard` | `StudentDashboardOverview` | Welcome banner, quick actions, active orders summary, upcoming schedule, recent activity log, discovery bridge. |
| `/account/requests` | `#account/requests` | `AccountRequestsTab` | Filterable list of all orders (All, Confirmed, Pending, Cancelled) with deep links to request tracking. |
| `/account/requests/:id` | `#account/requests/:id` | `RequestDetailPage` | Dedicated order tracking console, step-by-step `RequestTimeline`, operator details, delivery node info, and state-aware cancellation. |
| `/account/notifications` | `#account/notifications` | `AccountNotificationsTab` | Centralized Notification Center with live unread counter, type filtering (Service Updates, Security), and instant mark-read actions. |
| `/account/profile` | `#account/profile` | `AccountProfileTab` | Academic credentials, hostel block, room number, institutional verification status, and avatar image management. |
| `/account/settings` | `#account/settings` | `AccountSettingsTab` & `AccountSecurityTab` | Password change with live strength meter, active device sessions list, notification channel preferences, and Danger Zone dialogs. |

---

## 3. Request Lifecycle & Status Hierarchy

Service requests adhere to a deterministic 5-stage institutional progression:

```
[Pending Review]
       │
       ▼
[Accepted by Provider]
       │
       ▼
[Service Confirmed]
       │
       ▼
[In Progress / En Route]
       │
       ▼
[Service Completed]
```

### Visual State Design (`RequestStatusBadge`)

| Status | Label | Accent Color | Visual Semantics |
| :--- | :--- | :--- | :--- |
| `pending` | `PENDING REVIEW` | Amber (`#F59E0B`) | Waiting for campus partner approval |
| `accepted` | `ACCEPTED` | Sky Blue (`var(--color-blue-light)`) | Partner accepted time window & requirements |
| `confirmed` | `CONFIRMED` | Emerald (`#22C55E`) | Schedule slot locked; technician/courier assigned |
| `in_progress` | `IN PROGRESS` | Electric Blue (`var(--color-brand-blue)`) | Service actively underway or courier en route |
| `completed` | `COMPLETED` | Mint Green (`#10B981`) | Service delivered, verified, and closed |
| `cancelled` | `CANCELLED` | Signal Red (`#FF7B72`) | Terminated by student or provider with zero penalty |

---

## 4. Request Ownership & Security Rules

> [!IMPORTANT]
> **Strict Student Isolation**:
> 1. A student may only access requests where `customer.email` matches their active session email address.
> 2. Direct URL manipulation (e.g. Student A attempting `#account/requests/EH-FOREIGN-ID`) immediately triggers a secure 404 / Access Restricted boundary without leaking the existence or metadata of foreign student orders.
> 3. Cancellation is prohibited for completed orders and requires server-side identity verification before mutating the database.

---

## 5. Notification Center Architecture

In-app notifications are orchestrated centrally by `NotificationService`:

- **Event Generation**: Automatically triggered when bookings are placed, statuses progress, verification changes, or security sessions are registered.
- **Cross-Component Synchronization**: The unread notification counter is reactively bound across the **Navbar UserActions button**, the **Mobile Drawer**, the **Dashboard Preview**, and the **Notification Center Tab**.
- **Delivery Channels**: Preference controls allow students to configure channels for Service Updates, Hostel Gate Notices, and Invoices across **In-app**, **Email**, and **SMS/WhatsApp**.

---

## 6. Accessible Confirmation Dialogs

Destructive actions (e.g. Request Cancellation, Revoke Session, Account Deactivation) implement WCAG-compliant modal dialogs featuring:
- Explicit focus retention and Escape key dismissal
- Descriptive action labels ("Cancel Request", "Deactivate Account" vs vague "Yes/No")
- Contrast compliance and `prefers-reduced-motion` animation respect
