# EaseHub — Provider / Vendor Ecosystem Architecture (Phase 11)

## 📌 Overview
Phase 11 establishes the supply-side foundation of EaseHub: a dedicated operating portal for campus service operators (dining kitchens/tiffins, student accommodations/hostels/PGs, laundromats, fitness centers, student shuttles, fiber broadband providers, housekeeping, and repair technicians).

---

## 🧭 Provider Routes & Navigation

| Route | Canonical Hash | Description | Access Protection |
|---|---|---|---|
| `/provider` | `#provider` | Provider landing & value proposition page | Public |
| `/provider/onboarding` | `#provider/onboarding` | 8-step guided vendor onboarding wizard with draft saving | Semi-protected (saves guest draft, authenticates upon submit) |
| `/provider/status` | `#provider/status` | Application tracking & verification milestone status | Protected (tied to authenticated user's application) |
| `/provider/profile` | `#provider/profile` | Public storefront profile & service catalog editor | Protected (requires approved provider status) |
| `/provider/settings` | `#provider/settings` | Multi-channel dispatch & booking capacity preferences | Protected (requires provider status) |

---

## 🔒 Access Control & Tenant Security

### 1. Role Boundary & Authorization
* **Roles supported**: `student`, `provider`, `admin`.
* **Zero Automatic Role Promotion**: Visiting `/provider` or filling out onboarding as a student **never** mutates the user's role to `provider` until approved.
* **Server-Side Enforcement**: Role permissions and application states are validated inside `ProviderService`. Client code, localStorage, query params, or manipulated payloads cannot forge `providerStatus = 'approved'`.

### 2. Strict Tenant Isolation
* Every provider data record (application, profile, settings, catalog) is strictly linked to a verified `userId`.
* Accessing or modifying resources belonging to another provider throws an authorization rejection error.
* Provider A cannot view, inspect, or edit Provider B's profile, application, or business data.

---

## 📋 Multi-Step Onboarding Architecture

```
Step 1: Welcome & Value Proposition
  ↓
Step 2: Primary Provider Category Selection (8 Living Pillars)
  ↓
Step 3: Business Information & Legal Credentials (FSSAI/GST)
  ↓
Step 4: Primary Contact Details & WhatsApp Order Dispatch Preference
  ↓
Step 5: Dynamic Service Catalog Configuration (Title, Pricing, Turnaround)
  ↓
Step 6: Target Campus Association & Service Perimeter (Radius km)
  ↓
Step 7: Weekly Operational Schedule Matrix (Mon-Sun Timings)
  ↓
Step 8: Full Review & Physical Audit Compliance Agreement
  ↓
Application Submission → Status: 'under_review' (Reference: EH-APP-XXXXX)
```

### In-Progress Draft Persistence
* As providers transition between onboarding steps, the progress is automatically persisted to `ProviderService.saveDraft(userId, data)`.
* Providers can leave at Step 4, close the browser, and resume exactly where they left off.

---

## 🔄 Provider Application Lifecycle

```
[Draft]
   │
   ▼ (Submit application)
[Submitted / Under Review] ────► [Physical Campus Audit]
   │                                   │
   ├───────────────────────────────────┤
   ▼                                   ▼
[Approved]                         [Rejected]
   │                                   │
   ▼                                   ▼
Live Storefront & Catalog           Revision & Resubmission Flow
```

* **`draft`**: In-progress application, editable by applicant.
* **`submitted` / `under_review`**: Received by EaseHub Campus Operations. Audit milestone timeline displayed to applicant with tracking reference.
* **`approved`**: Verified following physical premise and hygiene inspection. Storefront unlocked; eligible to receive student bookings.
* **`rejected`**: Audit rejected with transparent operational reason (e.g. hygiene deficiency). Applicant can revise and resubmit.
* **`suspended`**: Existing provider temporarily disabled by campus moderation.

---

## 🔗 Integration with Phase 13 (Admin & Moderation) & Phase 12 (Operations)

* **Admin Dependency (Phase 13)**: The data models (`ProviderApplication`, `ProviderProfile`) and `ProviderService.simulateAdminReview` method serve as the clean integration contract for the Phase 13 Admin Moderation Dashboard.
* **Operations Scope Separation (Phase 12)**: Phase 11 purposefully establishes only the **Ecosystem Entry, Onboarding, Storefront Profile, and Settings**. Real-time order dispatch, live student request management, and financial payouts are handled in **Phase 12: Provider Dashboard & Operations**.
