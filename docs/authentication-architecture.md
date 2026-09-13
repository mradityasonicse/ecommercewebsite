# EaseHub — Authentication Architecture Specification
**Phase 8: Identity & Student Account Foundation**  
**Document Version:** 1.0.0  
**Status:** Production-Ready Architecture & Adapter Specification  

---

## 1. Executive Architecture Overview

EaseHub's authentication foundation is built on an enterprise-grade, adapter-driven architecture designed to support a multi-tenant university campus ecosystem. The identity layer mediates access across students, localized service providers, and campus administrative staff without coupling UI components to any specific backend identity vendor.

```
+-------------------------------------------------------------------------+
|                              EaseHub UI Layer                           |
|  (SignInForm, SignUpForm, ResetPasswordForm, EmailVerification, etc.)   |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        React Auth Context Layer                         |
|      (AuthContext / useAuth: Reactive User State, Session Hook)         |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                          AuthService Singleton                          |
|         (Delegator, In-Memory Session Cache, Adapter Switcher)          |
+------------------------------------+------------------------------------+
                                     |
            +------------------------+------------------------+
            |                                                 |
            v                                                 v
+-----------------------+                         +-----------------------+
| MockAuthProvider      |                         | Production Adapter    |
| Adapter               |                         | (Supabase / Firebase /|
| (Interactive Sandbox) |                         | Custom OAuth / JWT)   |
+-----------------------+                         +-----------------------+
```

---

## 2. Adapter Interface Pattern (`IAuthProviderAdapter`)

All authentication operations are strictly encapsulated behind the `IAuthProviderAdapter` TypeScript contract defined in [`src/types/auth.ts`](file:///e:/Easehub/src/types/auth.ts):

```typescript
export interface IAuthProviderAdapter {
  signIn(credentials: SignInCredentials): Promise<AuthResult>;
  signUp(data: SignUpData): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  requestPasswordReset(email: string): Promise<{ success: boolean; message: string }>;
  resetPassword(payload: PasswordResetPayload): Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmail(token: string): Promise<EmailVerificationResult>;
  resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }>;
}
```

### 2.1 Backend Adapter Portability Matrix

| Identity Target | Adapter Implementation | Transport Layer | Production Session Storage |
| :--- | :--- | :--- | :--- |
| **Current Prototype** | `MockAuthProviderAdapter` | In-Memory / LocalStorage Sandbox | Simulated secure session token |
| **Supabase Auth** | `SupabaseAuthAdapter` | GoTrue REST / WebSocket | HTTP-only Refresh Cookie + JWT |
| **Firebase Auth** | `FirebaseAuthAdapter` | Google Identity Toolkit REST | Firebase IndexedDB Session / Cookie |
| **Custom Campus SSO** | `CampusSSOAuthAdapter` | SAML 2.0 / Shibboleth / OIDC | Secure, SameSite=Strict Session Cookie |

---

## 3. Role Hierarchy & Multi-Persona Extensibility

EaseHub models accounts with a strict `UserRole` discriminator:

```typescript
export type UserRole = 'student' | 'provider' | 'admin';
```

### 3.1 Role Capabilities & Entitlements

1. **Student (`student`)**:
   - Primary consumer persona.
   - Campus geofencing validation (hostel room, block, department ID).
   - Ordering, subscription management (mess, gym, laundry).
   - View personal delivery arrivals, transaction history, and privacy settings.

2. **Service Provider (`provider`)**:
   - Dual-sided marketplace vendor persona.
   - Access to localized dispatch board, order status controls (preparing, ready, delivered).
   - Inventory toggling, operating hours management, and campus security gate clearance.

3. **Platform Administrator (`admin`)**:
   - Campus supervisor persona.
   - Provider verification and background badge approval.
   - Dispute resolution, dispute escrow holds, platform rate limiter configurations.

---

## 4. Entity Separation & Privacy Domain Model

To prevent monolithic state bloat and enforce least-privilege data disclosure, user profiles are segmented into distinct structural sub-domains:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  campusId?: string;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  profile?: StudentProfile;
  notifications?: NotificationPreferences;
  privacy?: PrivacyPreferences;
}
```

### 4.1 Student Profile Domain (`StudentProfile`)
Houses campus-specific geolocation details:
- `hostelBlock`, `roomNumber`, `department`, `yearOfStudy`, `emergencyContact`.

### 4.2 Notification Preferences Domain (`NotificationPreferences`)
Fine-grained multi-channel notification permissions:
- `smsAlerts`: Urgent delivery doorbell & gate arrival alerts.
- `emailReceipts`: Digital tax invoices & booking records.
- `deliveryArrivalNotices`: Push updates when verified couriers enter hostel gates.
- `marketingAnnouncements`: Optional campus discounts & deal digests.

### 4.3 Privacy & Data Sharing Domain (`PrivacyPreferences`)
Enforces student sovereignty over campus disclosure:
- `hideRoomFromExternalCouriers`: Masks specific room number, routing delivery to hostel reception desk.
- `shareContactWithWarden`: Permits hostel warden office coordination during maintenance visits.
- `allowPeerCampusDiscovery`: Enables classmates in the same hostel wing to bundle group orders.

---

## 5. Security & Threat Mitigations

### 5.1 Open Redirect Prevention (`validateSafeReturnUrl`)
To protect students against phishing redirects upon successful sign-in or verification, EaseHub strictly validates all redirect URLs through [`validateSafeReturnUrl`](file:///e:/Easehub/src/utils/routes.ts):
- Rejects protocol-relative URLs (`//evil.com`).
- Rejects external protocol schemes (`https:`, `http:`, `javascript:`, `data:`).
- Rejects header-injection characters (`\r`, `\n`, `\0`).
- Only authorizes relative internal SPA paths (`/...` or `#...`).
- Safely falls back to `#account`.

### 5.2 Safe Enumeration Defense
The password reset flow and registration endpoints employ **constant-response privacy messaging**:
- Requests for non-existent student email addresses return identical success confirmations:  
  *“If an active student account exists for that email, recovery instructions have been sent.”*
- Prevents malicious scrapers from compiling campus directory rosters.

### 5.3 Password Resilience Standards
- Minimum 8 characters required.
- Real-time password strength meter scoring:
  - Base length scoring.
  - Character diversity scoring (mixed case, numbers, special symbols).
  - Visual color-coded strength bar and progressive guidance badges.
