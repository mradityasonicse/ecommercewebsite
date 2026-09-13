# EaseHub Authentication & Student Account Architecture (Phase 8)

> "One Platform. Every Student Need."

---

## 1. Architectural Overview

The EaseHub authentication layer is designed as an institutional identity boundary separating presentation components from the underlying authorization provider. It adheres to an **Adapter Pattern**, providing seamless interoperability between local mock environments, headless backend APIs, and enterprise identity providers (such as Supabase, Firebase, or University SAML/SSO).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer (UI)                         │
│  SignInForm │ SignUpForm │ ForgotPasswordForm │ EmailVerification     │
│  UserActions (Navbar Session Badge) │ AccountShell Layout             │
├────────────────────────────────────────────────────────────────────────┤
│                       Centralized Auth State                           │
│                      (src/context/AuthContext.tsx)                     │
│  user │ role │ status │ isAuthenticated │ isLoading │ signIn()        │
│  signUp() │ signOut() │ resetPassword() │ verifyEmail() │ updateProfile│
├────────────────────────────────────────────────────────────────────────┤
│                        Auth Service Boundary                           │
│                      (src/services/authService.ts)                     │
│                  IAuthProviderAdapter Contract Methods                 │
├────────────────────────────────────────────────────────────────────────┤
│                   Pluggable Identity Adapters                          │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────┐  │
│  │ MockAuthProviderAdapter│  │ SupabaseAuthAdapter   │  │ OAuth / SSO│  │
│  │ (Session / LocalStorage│  │ (JWT / Cookies / RLS) │  │ (SAML/CAS) │  │
│  └───────────────────────┘  └───────────────────────┘  └────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. User & Student Data Models

To ensure modularity and high scalability as more academic services are introduced, the **User identity** is logically separated from the **StudentProfile**.

### Core User Model (`src/types/auth.ts`)
```typescript
export type UserRole = 'student' | 'provider' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'disabled';

export interface User {
  id: string;                         // Canonical institutional ID: e.g. "usr-dtu-aditya"
  name: string;                       // Full student name
  email: string;                      // Verified institutional or personal email
  phone?: string;                     // Primary mobile contact
  role: UserRole;                     // Authorization tier
  status?: UserStatus;                // Account lifecycle status
  emailVerified: boolean;             // Verification gate indicator
  avatarUrl?: string;                 // Profile avatar URL (local or CDN)
  profile?: StudentProfile;           // Segregated academic domain details
  notifications?: NotificationPreferences;
  privacy?: PrivacyPreferences;
  createdAt: string;                  // ISO 8601 creation timestamp
  updatedAt?: string;                 // ISO 8601 last modified timestamp
}
```

### Student Profile Model (`StudentProfile`)
```typescript
export interface StudentProfile {
  userId?: string;                    // Foreign key to User.id
  campusId?: string;                  // Campus identifier (e.g., 'dtu-delhi')
  campusName?: string;                // Canonical campus name
  university?: string;                // Higher education institution
  course?: string;                    // Degree level (e.g., 'B.Tech', 'MBA')
  branch?: string;                    // Specialization department
  year?: string | number;             // Current academic cohort
  graduatingYear?: number;            // Expected completion year
  hostelBlock?: string;               // Assigned hostel building
  roomNumber?: string;                // Delivery node / room
  studentId?: string;                 // Official roll number (e.g. DTU-2023-CS-042)
  avatarUrl?: string;                 // Cached avatar reference
}
```

---

## 3. Role Architecture & Server Enforcement

The platform enforces 3 access control tiers:

| Role | Permissions & Scope | Navigation Surface |
| :--- | :--- | :--- |
| **`student`** | Access personal dashboard, place requests, cancel pending bookings, manage hostel delivery preferences and alerts. | Student Dashboard, My Requests, Notifications, Profile, Settings |
| **`provider`** | Accept/reject campus service orders, update fulfillment timeline milestones, configure pricing rate cards. | Provider Dashboard, Service Orders, Provider Profile |
| **`admin`** | Full institutional oversight, manage vendor onboarding, campus geofence configurations, emergency alerts. | Admin Dashboard, University Nodes, System Logs |

> [!IMPORTANT]
> **Zero Client-Side Trust**: Role modification is prohibited on the client. Roles must never be updated via client-side state, URL query strings, localStorage, or unvalidated request bodies. In production mode, JWT claims verified on the backend enforce role permissions.

---

## 4. Required Authentication Routes

EaseHub supports dual-mode routing: path-based routing (`/auth/...`) for standard servers and hash-based routing (`#auth/...`) for zero-configuration SPA / static hosting.

| Route | View Purpose | Supported URL Parameters |
| :--- | :--- | :--- |
| `/auth/sign-in` | Student & Provider Sign-In | `returnTo` (safe relative path) |
| `/auth/sign-up` | Institutional Registration Flow | `returnTo` |
| `/auth/forgot-password`| Request Secure Password Reset | `email` (pre-fill) |
| `/auth/reset-password` | Set New Passphrase | `token` (cryptographic token) |
| `/auth/verify-email` | Institutional Mailbox Verification | `token` (verification token) |

---

## 5. Security & Protection Standards

1. **No Plaintext Passwords**: Passwords are never logged or stored in plaintext. In development, demo accounts are authenticated securely through the adapter boundary; in production, PBKDF2/Argon2 hashing or bcrypt via Supabase Auth is required.
2. **Open Redirect Vulnerability Prevention**: All `returnTo` destination URLs are validated through `validateSafeReturnUrl` in `src/utils/routes.ts`. External protocols (`http:`, `https:`, `javascript:`, `data:`) and protocol-relative URLs (`//evil.com`) are rejected, defaulting safely to `#account`.
3. **Account Enumeration Defense**: The password recovery and sign-in handlers return generic messages (e.g., *"If an active EaseHub account is associated with this address, secure reset instructions have been dispatched"*) to avoid disclosing whether an institutional email address exists in the system.
4. **Token Handling**: Verification and reset tokens are parsed through query parameters, processed in-memory, and immediately scrubbed from the address bar upon state confirmation.

---

## 6. Pre-Configured Demo Credentials

For testing and pair-programming evaluation, the mock adapter seeds a verified DTU student account:

- **Institutional Email**: `student@easehub.in`
- **Password**: `Student#2026`
- **Role**: `student`
- **Status**: `active`
- **Campus**: Delhi Technological University (DTU Main Campus)
