/**
 * EASEHUB AUTHENTICATION SERVICE & ADAPTER LAYER
 * Decoupled, production-grade authentication boundary.
 *
 * Implements an Adapter Pattern supporting:
 * - Mock Adapter (Development & local testing)
 * - Supabase Adapter (Production ready contract)
 * - Custom REST/Backend Adapter (Future enterprise integration)
 */

import type {
  User,
  SignInCredentials,
  SignUpData,
  AuthResult,
  PasswordResetPayload,
  EmailVerificationResult,
} from '../types/auth';

const SESSION_KEY = 'easehub_auth_session_v1';
const USERS_KEY = 'easehub_auth_registered_users_v1';

// Seed demo student account
export const DEMO_STUDENT: User = {
  id: 'usr-student-aditya',
  name: 'Aditya Soni',
  email: 'student@easehub.in',
  phone: '+91 98765 43210',
  role: 'student',
  status: 'active',
  emailVerified: true,
  avatarUrl: undefined,
  campusId: 'campus-hub',
  campusName: 'Campus Living Hub',
  hostelBlock: 'Block B',
  roomNumber: '304',
  studentId: 'STU-2024-042',
  profile: {
    userId: 'usr-student-aditya',
    campusId: 'campus-hub',
    campusName: 'Campus Living Hub',
    university: 'Campus Living Hub',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    academicProgram: 'B.Tech Computer Science & Engineering',
    graduatingYear: 2026,
    hostelBlock: 'Block B',
    roomNumber: '304',
    studentId: 'STU-2024-042',
  },
  notifications: {
    serviceUpdates: true,
    bookingReminders: true,
    deliveryArrivalNotices: true,
    marketingAnnouncements: false,
    emailReceipts: true,
    smsAlerts: true,
    inAppAlerts: true,
    pushAlerts: true,
  },
  privacy: {
    hideRoomFromExternalCouriers: false,
    shareContactWithWarden: true,
    allowPeerCampusDiscovery: true,
  },
  createdAt: '2026-08-01T10:00:00.000Z',
};

/**
 * Universal interface for authentication provider adapters.
 */
export interface IAuthProviderAdapter {
  getCurrentUser(): Promise<User | null>;
  signIn(credentials: SignInCredentials): Promise<AuthResult>;
  signInWithGoogle?(): Promise<AuthResult>;
  signInWithPhone?(phoneNumber: string, fullName?: string): Promise<AuthResult>;
  signUp(data: SignUpData): Promise<AuthResult>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<{ success: boolean; message: string }>;
  resetPassword(payload: PasswordResetPayload): Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmail(token: string): Promise<EmailVerificationResult>;
  resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }>;
  updateProfile(updates: Partial<User>): Promise<User>;
  changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }>;
}

/**
 * Development & testing mock adapter with browser session persistence.
 */
export class MockAuthProviderAdapter implements IAuthProviderAdapter {
  private getStoredSession(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setStoredSession(user: User | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Storage unavailable
    }
  }

  private getRegisteredUsers(): User[] {
    if (typeof window === 'undefined') return [DEMO_STUDENT];
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [DEMO_STUDENT];
    } catch {
      return [DEMO_STUDENT];
    }
  }

  private saveRegisteredUser(user: User): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getRegisteredUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify([user, ...existing]));
    } catch {
      // Storage unavailable
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.getStoredSession();
  }

  public async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const identifier = credentials.emailOrPhone.trim().toLowerCase();

    // 1. Demo Student Credentials
    if (
      (identifier === 'student@easehub.in' || identifier === '9876543210' || identifier === '+91 98765 43210') &&
      credentials.password === 'Student#2026'
    ) {
      this.setStoredSession(DEMO_STUDENT);
      return { success: true, user: DEMO_STUDENT };
    }

    // 2. Check local registered users
    const users = this.getRegisteredUsers();
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        (u.phone && u.phone.replace(/\D/g, '').includes(identifier.replace(/\D/g, '')))
    );

    if (matched) {
      this.setStoredSession(matched);
      return { success: true, user: matched };
    }

    // Generic error to prevent user enumeration
    return {
      success: false,
      error: 'The email/mobile or password is incorrect. Please check your credentials.',
      errorCode: 'invalid_credentials',
    };
  }

  public async signUp(data: SignUpData): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const email = data.email.trim().toLowerCase();
    const existing = this.getRegisteredUsers();

    if (existing.some((u) => u.email.toLowerCase() === email)) {
      return {
        success: false,
        error: 'An account with this institutional email address is already registered.',
        errorCode: 'account_locked',
      };
    }

    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: data.name.trim(),
      email,
      phone: data.phone.trim(),
      role: 'student',
      campusId: data.campusId,
      studentId: data.studentId?.trim() || undefined,
      emailVerified: false,
      profile: {
        campusId: data.campusId,
        studentId: data.studentId?.trim() || undefined,
      },
      notifications: {
        serviceUpdates: true,
        bookingReminders: true,
        smsAlerts: true,
        emailReceipts: true,
        deliveryArrivalNotices: true,
        marketingAnnouncements: false,
        inAppAlerts: true,
        pushAlerts: true,
      },
      privacy: {
        hideRoomFromExternalCouriers: false,
        shareContactWithWarden: true,
        allowPeerCampusDiscovery: true,
      },
      createdAt: new Date().toISOString(),
    };

    this.saveRegisteredUser(newUser);
    this.setStoredSession(newUser);

    return { success: true, user: newUser };
  }

  public async signInWithGoogle(): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const googleUser: User = {
      id: 'usr-google-student',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@student.edu',
      phone: '+91 98712 34567',
      role: 'student',
      status: 'active',
      emailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Block C',
      roomNumber: '214',
      studentId: 'STU-2024-108',
      profile: {
        userId: 'usr-google-student',
        campusId: 'campus-hub',
        campusName: 'Campus Living Hub',
        university: 'Campus Living Hub',
        course: 'B.Tech Computer Science',
        branch: 'CSE',
        year: '2nd Year',
        academicProgram: 'B.Tech CSE',
        graduatingYear: 2027,
        hostelBlock: 'Block C',
        roomNumber: '214',
        studentId: 'STU-2024-108',
      },
      notifications: {
        serviceUpdates: true,
        bookingReminders: true,
        smsAlerts: true,
        emailReceipts: true,
        deliveryArrivalNotices: true,
        marketingAnnouncements: false,
        inAppAlerts: true,
        pushAlerts: true,
      },
      privacy: {
        hideRoomFromExternalCouriers: false,
        shareContactWithWarden: true,
        allowPeerCampusDiscovery: true,
      },
      createdAt: new Date().toISOString(),
    };

    this.saveRegisteredUser(googleUser);
    this.setStoredSession(googleUser);
    return { success: true, user: googleUser };
  }

  public async signInWithPhone(phoneNumber: string, fullName?: string): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const cleanPhone = phoneNumber.trim();
    const existing = this.getRegisteredUsers().find(
      u => u.phone && u.phone.replace(/\D/g, '').includes(cleanPhone.replace(/\D/g, ''))
    );

    if (existing) {
      this.setStoredSession(existing);
      return { success: true, user: existing };
    }

    const phoneUser: User = {
      id: `usr-ph-${Date.now().toString(36)}`,
      name: fullName?.trim() || 'Campus Student',
      email: `${cleanPhone.replace(/\D/g, '') || 'student'}@student.easehub.in`,
      phone: cleanPhone.startsWith('+') ? cleanPhone : `+91 ${cleanPhone}`,
      role: 'student',
      status: 'active',
      emailVerified: true,
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Block A',
      roomNumber: '102',
      profile: {
        campusId: 'campus-hub',
        campusName: 'Campus Living Hub',
      },
      notifications: {
        serviceUpdates: true,
        bookingReminders: true,
        smsAlerts: true,
        emailReceipts: true,
        deliveryArrivalNotices: true,
        marketingAnnouncements: false,
        inAppAlerts: true,
        pushAlerts: true,
      },
      privacy: {
        hideRoomFromExternalCouriers: false,
        shareContactWithWarden: true,
        allowPeerCampusDiscovery: true,
      },
      createdAt: new Date().toISOString(),
    };

    this.saveRegisteredUser(phoneUser);
    this.setStoredSession(phoneUser);
    return { success: true, user: phoneUser };
  }

  public async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    this.setStoredSession(null);
  }

  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      success: true,
      message: `If an active EaseHub account is associated with ${email}, secure reset instructions have been dispatched.`,
    };
  }

  public async resetPassword(payload: PasswordResetPayload): Promise<{ success: boolean; message?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (payload.token === 'expired') {
      return {
        success: false,
        error: 'This password reset link has expired. Please request a new one.',
      };
    }

    if (payload.token === 'invalid' || !payload.token.trim()) {
      return {
        success: false,
        error: 'The reset link is invalid or has already been used.',
      };
    }

    // Successful mock password update
    const currentUser = this.getStoredSession();
    if (currentUser) {
      currentUser.updatedAt = new Date().toISOString();
      this.setStoredSession(currentUser);
    }

    return {
      success: true,
      message: 'Your password has been successfully reset. You may now sign in with your new credentials.',
    };
  }

  public async verifyEmail(token: string): Promise<EmailVerificationResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (token === 'expired') {
      return {
        state: 'expired',
        message: 'Your email verification link has expired. Please request a new verification token.',
      };
    }

    if (token === 'invalid' || !token.trim()) {
      return {
        state: 'invalid',
        message: 'The verification link is invalid or malformed.',
      };
    }

    if (token === 'already') {
      return {
        state: 'already_verified',
        message: 'Your campus institutional email is already verified.',
      };
    }

    // Default valid token: update current session if present
    const session = this.getStoredSession();
    if (session) {
      session.emailVerified = true;
      this.setStoredSession(session);
      return {
        state: 'success',
        message: 'Your campus email address has been verified successfully. Full campus perks unlocked.',
        user: session,
      };
    }

    return {
      state: 'success',
      message: 'Your campus email address has been verified successfully.',
    };
  }

  public async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      message: `A fresh verification token has been dispatched to ${email}. Please check your inbox.`,
    };
  }

  public async updateProfile(updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const current = this.getStoredSession() || DEMO_STUDENT;
    const updated: User = {
      ...current,
      ...updates,
      profile: {
        ...(current.profile || {}),
        ...(updates.profile || {}),
        campusId: updates.campusId || updates.profile?.campusId || current.profile?.campusId,
        campusName: updates.campusName || updates.profile?.campusName || current.profile?.campusName,
        studentId: updates.studentId || updates.profile?.studentId || current.profile?.studentId,
        hostelBlock: updates.hostelBlock || updates.profile?.hostelBlock || current.profile?.hostelBlock,
        roomNumber: updates.roomNumber || updates.profile?.roomNumber || current.profile?.roomNumber,
      },
      updatedAt: new Date().toISOString(),
    };
    this.setStoredSession(updated);

    // Update in registered users list
    const users = this.getRegisteredUsers();
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = updated;
      try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      } catch {
        // ignore
      }
    }

    return updated;
  }

  public async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (!currentPassword) {
      return { success: false, error: 'Current password is required.' };
    }
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }
    const current = this.getStoredSession();
    if (current) {
      current.updatedAt = new Date().toISOString();
      this.setStoredSession(current);
    }
    return { success: true, message: 'Your password has been securely updated.' };
  }
}

/**
 * Singleton authentication service orchestrating active adapter.
 */
export class AuthService {
  private static adapter: IAuthProviderAdapter = new MockAuthProviderAdapter();

  /**
   * Plugs in a production auth adapter (e.g. Supabase, Firebase, Custom API).
   */
  public static setAdapter(customAdapter: IAuthProviderAdapter): void {
    this.adapter = customAdapter;
  }

  public static getCurrentUser(): Promise<User | null> {
    return this.adapter.getCurrentUser();
  }

  public static signIn(credentials: SignInCredentials): Promise<AuthResult> {
    return this.adapter.signIn(credentials);
  }

  public static signInWithGoogle(): Promise<AuthResult> {
    if (this.adapter.signInWithGoogle) {
      return this.adapter.signInWithGoogle();
    }
    return Promise.resolve({ success: false, error: 'Google sign-in not supported by adapter' });
  }

  public static signInWithPhone(phoneNumber: string, fullName?: string): Promise<AuthResult> {
    if (this.adapter.signInWithPhone) {
      return this.adapter.signInWithPhone(phoneNumber, fullName);
    }
    return Promise.resolve({ success: false, error: 'Phone sign-in not supported by adapter' });
  }

  public static signUp(data: SignUpData): Promise<AuthResult> {
    return this.adapter.signUp(data);
  }

  public static signOut(): Promise<void> {
    return this.adapter.signOut();
  }

  public static requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    return this.adapter.requestPasswordReset(email);
  }

  public static resetPassword(payload: PasswordResetPayload): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.adapter.resetPassword(payload);
  }

  public static verifyEmail(token: string): Promise<EmailVerificationResult> {
    return this.adapter.verifyEmail(token);
  }

  public static resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    return this.adapter.resendVerificationEmail(email);
  }

  public static updateProfile(updates: Partial<User>): Promise<User> {
    return this.adapter.updateProfile(updates);
  }

  public static changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.adapter.changePassword(currentPassword, newPassword);
  }
}
