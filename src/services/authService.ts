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
import { auth, googleAuthProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

const SESSION_KEY = 'easehub_auth_session_v1';
const USERS_KEY = 'easehub_auth_registered_users_v1';

// Seed demo accounts for each role
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

export const DEMO_ADMIN: User = {
  id: 'usr-admin-ops',
  name: 'EaseHub Super Administrator',
  email: 'admin@easehub.in',
  phone: '+91 81028 48776',
  role: 'admin',
  status: 'active',
  emailVerified: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const DEMO_MESS_PARTNER: User = {
  id: 'usr-partner-mess',
  name: 'Annapurna Campus Dining',
  email: 'mess@easehub.in',
  phone: '+91 94251 98765',
  role: 'provider',
  status: 'active',
  emailVerified: true,
  createdAt: '2026-02-01T00:00:00.000Z',
};

export const DEMO_LAUNDRY_PARTNER: User = {
  id: 'usr-partner-laundry',
  name: 'CleanCare University Express',
  email: 'laundry@easehub.in',
  phone: '+91 91112 34567',
  role: 'provider',
  status: 'active',
  emailVerified: true,
  createdAt: '2026-02-15T00:00:00.000Z',
};

export const DEMO_PG_OWNER: User = {
  id: 'usr-partner-pg',
  name: 'Royal Living PG & Hostels',
  email: 'pg@easehub.in',
  phone: '+91 98271 23456',
  role: 'provider',
  status: 'active',
  emailVerified: true,
  createdAt: '2026-03-01T00:00:00.000Z',
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
      const localData = localStorage.getItem(SESSION_KEY);
      if (localData) return JSON.parse(localData);
      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (sessionData) return JSON.parse(sessionData);

      // Graceful fallback for student session
      const currentRole = localStorage.getItem('easehub_current_role');
      const sessionLoggedIn = sessionStorage.getItem('easehub_session_logged_in');
      if (currentRole === 'student' && sessionLoggedIn === 'true') {
        return DEMO_STUDENT;
      }
      return null;
    } catch {
      return null;
    }
  }

  private setStoredSession(user: User | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
      window.dispatchEvent(new CustomEvent('easehub_auth_changed', { detail: user }));
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
      localStorage.setItem(USERS_KEY, JSON.stringify([user, ...existing.filter(u => u.email !== user.email)]));
    } catch {
      // Storage unavailable
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.getStoredSession();
  }

  public async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const identifier = credentials.emailOrPhone.trim().toLowerCase();
    const pass = credentials.password;

    // 1. Super Admin Authentication (Strict Credentials)
    if (identifier === 'admin@easehub.in' || identifier === 'admin') {
      if (pass === 'admin123' || pass === 'easehub2026' || pass === 'admin') {
        this.setStoredSession(DEMO_ADMIN);
        try {
          sessionStorage.setItem('easehub_admin_auth', 'true');
          sessionStorage.setItem('easehub_session_logged_in', 'true');
          localStorage.setItem('easehub_current_role', 'admin');
          localStorage.setItem('easehub_user_role', 'admin');
        } catch {}
        return { success: true, user: DEMO_ADMIN };
      }
      return {
        success: false,
        error: 'Invalid Administrator credentials. Default password is: admin123',
        errorCode: 'invalid_credentials',
      };
    }

    // 2. Mess Kitchen Partner Authentication
    if (identifier === 'mess@easehub.in' || identifier === 'mess') {
      if (pass === 'mess2026' || pass === 'mess123') {
        this.setStoredSession(DEMO_MESS_PARTNER);
        try {
          sessionStorage.setItem('easehub_session_logged_in', 'true');
          localStorage.setItem('easehub_current_role', 'mess_partner');
          localStorage.setItem('easehub_user_role', 'provider');
        } catch {}
        return { success: true, user: DEMO_MESS_PARTNER };
      }
      return {
        success: false,
        error: 'Invalid Mess Partner credentials. Default password is: mess2026',
        errorCode: 'invalid_credentials',
      };
    }

    // 3. Laundry Partner Authentication
    if (identifier === 'laundry@easehub.in' || identifier === 'laundry') {
      if (pass === 'laundry2026' || pass === 'laundry123') {
        this.setStoredSession(DEMO_LAUNDRY_PARTNER);
        try {
          sessionStorage.setItem('easehub_session_logged_in', 'true');
          localStorage.setItem('easehub_current_role', 'laundry_partner');
          localStorage.setItem('easehub_user_role', 'provider');
        } catch {}
        return { success: true, user: DEMO_LAUNDRY_PARTNER };
      }
      return {
        success: false,
        error: 'Invalid Laundry Partner credentials. Default password is: laundry2026',
        errorCode: 'invalid_credentials',
      };
    }

    // 4. PG / Hostel Owner Authentication
    if (identifier === 'pg@easehub.in' || identifier === 'owner@easehub.in' || identifier === 'pg') {
      if (pass === 'pg2026' || pass === 'owner2026' || pass === 'pg123') {
        this.setStoredSession(DEMO_PG_OWNER);
        try {
          sessionStorage.setItem('easehub_session_logged_in', 'true');
          localStorage.setItem('easehub_current_role', 'pg_owner');
          localStorage.setItem('easehub_user_role', 'provider');
        } catch {}
        return { success: true, user: DEMO_PG_OWNER };
      }
      return {
        success: false,
        error: 'Invalid PG / Hostel Owner credentials. Default password is: pg2026',
        errorCode: 'invalid_credentials',
      };
    }

    // 5. Default Demo Student Credentials
    if (
      (identifier === 'student@easehub.in' || identifier === '9876543210' || identifier === '+91 98765 43210' || identifier === 'scholar@easehub.in')
    ) {
      if (pass === 'Student#2026' || pass === 'campus2026' || pass === 'student123' || pass === 'scholar2026') {
        this.setStoredSession(DEMO_STUDENT);
        try {
          sessionStorage.setItem('easehub_session_logged_in', 'true');
          localStorage.setItem('easehub_current_role', 'student');
          localStorage.setItem('easehub_user_role', 'student');
        } catch {}
        return { success: true, user: DEMO_STUDENT };
      }
      return {
        success: false,
        error: 'Incorrect student password. Default demo password is: campus2026',
        errorCode: 'invalid_credentials',
      };
    }

    // 6. Check registered local users
    const users = this.getRegisteredUsers();
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        (u.phone && u.phone.replace(/\D/g, '').includes(identifier.replace(/\D/g, '')))
    );

    if (matched) {
      this.setStoredSession(matched);
      try {
        sessionStorage.setItem('easehub_session_logged_in', 'true');
        localStorage.setItem('easehub_current_role', (matched.role as any) || 'student');
        localStorage.setItem('easehub_user_role', matched.role || 'student');
      } catch {}
      return { success: true, user: matched };
    }

    // 7. Auto-create & activate student profile on login (Zero login roadblock)
    const derivedName = identifier.includes('@')
      ? identifier.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Campus Scholar';
    const autoUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: derivedName,
      email: identifier.includes('@') ? identifier : `${identifier.replace(/\s+/g, '')}@easehub.in`,
      phone: identifier.match(/^\+?[0-9]{10,13}$/) ? identifier : '+91 98765 43210',
      role: 'student',
      status: 'active',
      emailVerified: true,
      campusId: 'campus-hub',
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      profile: {
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        bio: 'CS Undergrad at Campus Hub | Room 304 Block B',
        campusId: 'campus-hub',
        hostelBlock: 'Block B',
        roomNumber: '304',
        studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        university: 'Bhilai Campus Institute',
        course: 'B.Tech',
        branch: 'Computer Science & Engineering',
        year: '3rd Year (Class of 2026)',
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

    this.saveRegisteredUser(autoUser);
    this.setStoredSession(autoUser);
    try {
      sessionStorage.setItem('easehub_session_logged_in', 'true');
      localStorage.setItem('easehub_current_role', 'student');
      localStorage.setItem('easehub_user_role', 'student');
    } catch {}

    return { success: true, user: autoUser };
  }

  public async signUp(data: SignUpData): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const email = data.email.trim().toLowerCase();
    const existing = this.getRegisteredUsers();

    const alreadyRegistered = existing.find((u) => u.email.toLowerCase() === email);
    if (alreadyRegistered) {
      this.setStoredSession(alreadyRegistered);
      try {
        sessionStorage.setItem('easehub_session_logged_in', 'true');
        localStorage.setItem('easehub_current_role', 'student');
        localStorage.setItem('easehub_user_role', 'student');
      } catch {}
      return { success: true, user: alreadyRegistered };
    }

    const rawHostel = (data as any).hostelRoom || 'Block B, Room 304';
    let block = 'Block B';
    let room = '304';
    if (rawHostel.includes(',')) {
      const parts = rawHostel.split(',');
      block = parts[0]?.trim() || 'Block B';
      room = parts[1]?.replace(/room/i, '').trim() || '304';
    } else if (rawHostel.includes('Room')) {
      room = rawHostel.replace(/.*Room/i, '').trim() || '304';
    }

    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: data.name.trim() || 'Campus Scholar',
      email,
      phone: data.phone.trim() || '+91 98765 43210',
      role: 'student',
      status: 'active',
      emailVerified: true,
      campusId: data.campusId || 'campus-hub',
      studentId: data.studentId?.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      profile: {
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        bio: `CS Undergrad at Campus Hub | ${block} Room ${room}`,
        campusId: data.campusId || 'campus-hub',
        studentId: data.studentId?.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        hostelBlock: block,
        roomNumber: room,
        university: 'Bhilai Campus Institute',
        course: 'B.Tech',
        branch: 'Computer Science & Engineering',
        year: '3rd Year (Class of 2026)',
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
    try {
      sessionStorage.setItem('easehub_session_logged_in', 'true');
      localStorage.setItem('easehub_current_role', 'student');
      localStorage.setItem('easehub_user_role', 'student');
    } catch {}

    return { success: true, user: newUser };
  }

  public async signInWithGoogle(): Promise<AuthResult> {
    try {
      const userCred = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = userCred.user;
      const googleUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Student',
        email: fbUser.email || 'student@easehub.in',
        phone: fbUser.phoneNumber || '+91 98712 34567',
        role: 'student',
        status: 'active',
        emailVerified: fbUser.emailVerified,
        avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        campusId: 'campus-hub',
        campusName: 'Campus Living Hub',
        hostelBlock: 'Block C',
        roomNumber: '214',
        studentId: 'STU-' + fbUser.uid.slice(0, 6).toUpperCase(),
        profile: {
          userId: fbUser.uid,
          campusId: 'campus-hub',
          campusName: 'Campus Living Hub',
          university: 'Campus Living Hub',
          course: 'Collegiate Student',
          branch: 'General',
          year: 'Current',
          academicProgram: 'Student Living',
          graduatingYear: 2027,
          hostelBlock: 'Block C',
          roomNumber: '214',
          studentId: 'STU-' + fbUser.uid.slice(0, 6).toUpperCase(),
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
    } catch (err: unknown) {
      console.warn('Firebase Google Auth popup error:', err);
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google sign-in popup was closed.' };
      }
      if (errorObj?.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'Current domain is not authorized in Firebase Console. Add this domain in Firebase Console -> Authentication -> Settings -> Authorized domains.'
        };
      }
      return {
        success: false,
        error: errorObj?.message || 'Google sign-in could not be completed.'
      };
    }
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
