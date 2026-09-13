import React, { useState } from 'react';
import type { AuthViewMode, User, AuthErrorCode } from '../types/auth';
import {
  AuthLayout,
  SignInForm,
  SignUpForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  EmailVerification,
  AuthError,
} from '../components/auth';

interface AuthPageProps {
  initialMode?: AuthViewMode;
  returnTo?: string;
  token?: string;
  errorCode?: string;
  onAuthSuccess?: (user?: User) => void;
  onBackToApp?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'sign-in',
  returnTo,
  token,
  errorCode,
  onAuthSuccess,
  onBackToApp,
}) => {
  const [mode, setMode] = useState<AuthViewMode>(initialMode);
  const [prevInitialMode, setPrevInitialMode] = useState<AuthViewMode>(initialMode);

  // Sync mode when initialMode changes externally during navigation
  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
  }

  const getTitleAndSubtitle = () => {
    switch (mode) {
      case 'sign-up':
        return {
          title: 'Create Your Student Account',
          subtitle: 'Instant campus geofencing, student discounts, and streamlined booking across campus.',
        };
      case 'forgot-password':
        return {
          title: 'Reset Account Access',
          subtitle: 'Enter your registered email address to receive secure OTP recovery instructions.',
        };
      case 'reset-password':
        return {
          title: 'Create New Password',
          subtitle: 'Choose a resilient, unique passphrase to safeguard your student identity and bookings.',
        };
      case 'verify-email':
        return {
          title: 'Verify Campus Email',
          subtitle: 'Validating your student institutional email address for verified campus access.',
        };
      case 'error':
        return {
          title: 'Authentication Exception',
          subtitle: 'We encountered an issue processing your security credentials.',
        };
      case 'sign-in':
      default:
        return {
          title: 'Welcome Back, Scholar',
          subtitle: 'Sign in to access your active bookings, saved hostel addresses, and student perks.',
        };
    }
  };

  const { title, subtitle } = getTitleAndSubtitle();

  const handleSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    } else if (returnTo) {
      window.location.href = returnTo.startsWith('#') ? returnTo : `#${returnTo}`;
    } else {
      window.location.hash = '#account';
    }
  };

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      onBackToApp={onBackToApp}
    >
      {mode === 'sign-in' && (
        <SignInForm
          returnTo={returnTo}
          onSuccess={handleSuccess}
          onSwitchMode={setMode}
        />
      )}

      {mode === 'sign-up' && (
        <SignUpForm
          returnTo={returnTo}
          onSuccess={handleSuccess}
          onSwitchMode={setMode}
        />
      )}

      {mode === 'forgot-password' && (
        <ForgotPasswordForm
          onSwitchMode={setMode}
        />
      )}

      {mode === 'reset-password' && (
        <ResetPasswordForm
          token={token}
          onSuccess={() => setMode('sign-in')}
          onSwitchMode={setMode}
        />
      )}

      {mode === 'verify-email' && (
        <EmailVerification
          token={token}
          onSuccess={() => setMode('sign-in')}
          onSwitchMode={setMode}
        />
      )}

      {mode === 'error' && (
        <AuthError
          code={errorCode as AuthErrorCode}
          onRetry={() => setMode('sign-in')}
          onSwitchMode={setMode}
        />
      )}
    </AuthLayout>
  );
};
