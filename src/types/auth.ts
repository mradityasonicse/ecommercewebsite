/**
 * EASEHUB AUTHENTICATION & STUDENT ACCOUNT TYPES
 * Production-grade, extensible data contracts for Phase 8.
 */

export type UserRole = 'student' | 'provider' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'disabled';

export interface StudentProfile {
  userId?: string;
  campusId?: string;
  campusName?: string;
  university?: string;
  course?: string;
  branch?: string;
  year?: string | number;
  academicProgram?: string;
  graduatingYear?: number;
  hostelBlock?: string;
  roomNumber?: string;
  studentId?: string;
  avatarUrl?: string;
}

export interface NotificationPreferences {
  serviceUpdates: boolean;
  bookingReminders: boolean;
  deliveryArrivalNotices: boolean;
  marketingAnnouncements: boolean;
  emailReceipts: boolean;
  smsAlerts: boolean;
  inAppAlerts?: boolean;
  pushAlerts?: boolean;
}

export interface PrivacyPreferences {
  hideRoomFromExternalCouriers: boolean;
  shareContactWithWarden: boolean;
  allowPeerCampusDiscovery: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status?: UserStatus;
  emailVerified: boolean;
  avatarUrl?: string;
  profile?: StudentProfile;
  notifications?: NotificationPreferences;
  privacy?: PrivacyPreferences;
  createdAt: string;
  updatedAt?: string;

  // Flattened convenience properties for backward compatibility
  campusId?: string;
  campusName?: string;
  hostelBlock?: string;
  roomNumber?: string;
  studentId?: string;
}

export interface SignInCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  campusId: string;
  studentId?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  errorCode?: AuthErrorCode;
}

export type AuthViewMode =
  | 'sign-in'
  | 'sign-up'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'error';

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'account_locked'
  | 'email_not_verified'
  | 'expired_session'
  | 'invalid_token'
  | 'rate_limited'
  | 'network_error'
  | 'unknown_error';

export type EmailVerificationState =
  | 'verifying'
  | 'success'
  | 'expired'
  | 'invalid'
  | 'already_verified';

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}

export interface EmailVerificationResult {
  state: EmailVerificationState;
  message: string;
  user?: User;
}
