import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  User,
  SignInCredentials,
  SignUpData,
  AuthResult,
  PasswordResetPayload,
  EmailVerificationResult,
  NotificationPreferences,
  PrivacyPreferences,
  UserRole,
  UserStatus,
} from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  role: UserRole | undefined;
  status: UserStatus | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithPhone: (phoneNumber: string, fullName?: string) => Promise<AuthResult>;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (payload: PasswordResetPayload) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmail: (token: string) => Promise<EmailVerificationResult>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (updated: Partial<User>) => void;
  updateProfile: (updated: Partial<User>) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updatePreferences: (prefs: {
    notifications?: Partial<NotificationPreferences>;
    privacy?: Partial<PrivacyPreferences>;
  }) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;
    AuthService.getCurrentUser().then((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await AuthService.signIn(credentials);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await AuthService.signInWithGoogle();
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithPhone = useCallback(async (phoneNumber: string, fullName?: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await AuthService.signInWithPhone(phoneNumber, fullName);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await AuthService.signUp(data);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    return AuthService.requestPasswordReset(email);
  }, []);

  const resetPassword = useCallback(async (payload: PasswordResetPayload) => {
    return AuthService.resetPassword(payload);
  }, []);

  const verifyEmail = useCallback(async (token: string): Promise<EmailVerificationResult> => {
    const res = await AuthService.verifyEmail(token);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const resendVerificationEmail = useCallback(async (email: string) => {
    return AuthService.resendVerificationEmail(email);
  }, []);

  const updateUser = useCallback((updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  }, []);

  const updateProfile = useCallback(async (updated: Partial<User>): Promise<User> => {
    const saved = await AuthService.updateProfile(updated);
    setUser(saved);
    return saved;
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    return AuthService.changePassword(currentPassword, newPassword);
  }, []);

  const updatePreferences = useCallback(
    (prefs: {
      notifications?: Partial<NotificationPreferences>;
      privacy?: Partial<PrivacyPreferences>;
    }) => {
      setUser((prev) => {
        if (!prev) return null;
        const updatedUser: User = {
          ...prev,
          notifications: prefs.notifications
            ? {
                ...(prev.notifications || {
                  serviceUpdates: true,
                  bookingReminders: true,
                  deliveryArrivalNotices: true,
                  marketingAnnouncements: false,
                  emailReceipts: true,
                  smsAlerts: true,
                }),
                ...prefs.notifications,
              }
            : prev.notifications,
          privacy: prefs.privacy
            ? {
                ...(prev.privacy || {
                  hideRoomFromExternalCouriers: false,
                  shareContactWithWarden: true,
                  allowPeerCampusDiscovery: true,
                }),
                ...prefs.privacy,
              }
            : prev.privacy,
        };
        // Persist to AuthService storage
        AuthService.updateProfile(updatedUser);
        return updatedUser;
      });
    },
    []
  );

  const value: AuthContextValue = {
    user,
    role: user?.role,
    status: user?.status,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    signUp,
    signOut,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    updateUser,
    updateProfile,
    changePassword,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
