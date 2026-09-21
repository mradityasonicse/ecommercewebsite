import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import type { AuthErrorCode, AuthViewMode } from '../../types/auth';
import { Button } from '../ui/Button';

interface AuthErrorProps {
  code?: AuthErrorCode;
  message?: string;
  onRetry?: () => void;
  onSwitchMode?: (mode: AuthViewMode) => void;
}

export const AuthError: React.FC<AuthErrorProps> = ({
  code = 'unknown_error',
  message,
  onRetry,
  onSwitchMode,
}) => {
  const getErrorContent = () => {
    switch (code) {
      case 'invalid_credentials':
        return {
          title: 'Incorrect Credentials',
          desc: message || 'The email, mobile number, or password provided does not match our campus directory records.',
          action: 'sign-in' as AuthViewMode,
          actionLabel: 'Try Signing In Again',
        };
      case 'account_locked':
        return {
          title: 'Account Temporarily Guarded',
          desc: message || 'To prevent unauthorized campus identity access, this account is temporarily locked. Please reset your password to regain access.',
          action: 'forgot-password' as AuthViewMode,
          actionLabel: 'Reset Account Access',
        };
      case 'email_not_verified':
        return {
          title: 'Email Verification Required',
          desc: message || 'Your student email address has not been verified yet. Please check your inbox or request a fresh verification link.',
          action: 'verify-email' as AuthViewMode,
          actionLabel: 'Verify Campus Email',
        };
      case 'expired_session':
        return {
          title: 'Session Expired',
          desc: message || 'Your authenticated student session has timed out for security. Please sign in again to continue.',
          action: 'sign-in' as AuthViewMode,
          actionLabel: 'Sign In Again',
        };
      case 'rate_limited':
        return {
          title: 'Rate Limit Enforced',
          desc: message || 'Too many authentication attempts were detected from your network. Please wait a few minutes before retrying.',
          action: 'sign-in' as AuthViewMode,
          actionLabel: 'Return to Sign In',
        };
      case 'network_error':
        return {
          title: 'Network Communication Failed',
          desc: message || 'Unable to establish a secure link with campus verification servers. Please check your internet connection.',
          action: 'sign-in' as AuthViewMode,
          actionLabel: 'Retry Connection',
        };
      case 'invalid_token':
        return {
          title: 'Invalid Security Token',
          desc: message || 'The security token in your link has expired or has already been consumed.',
          action: 'forgot-password' as AuthViewMode,
          actionLabel: 'Request New Link',
        };
      default:
        return {
          title: 'Authentication Condition',
          desc: message || 'An unexpected condition occurred while verifying your student identity. Please try again.',
          action: 'sign-in' as AuthViewMode,
          actionLabel: 'Return to Sign In',
        };
    }
  };

  const { title, desc, action, actionLabel } = getErrorContent();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-6)',
        width: '100%',
        padding: 'var(--space-4) 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          border: '1.5px solid #FECACA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#DC2626',
        }}
      >
        <ShieldAlert size={28} />
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 var(--space-2) 0' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          {desc}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
        {onRetry ? (
          <Button
            variant="primary"
            size="md"
            icon={<RefreshCw size={14} />}
            iconPosition="left"
            fullWidth
            onClick={onRetry}
          >
            Retry Request
          </Button>
        ) : onSwitchMode ? (
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onSwitchMode(action)}
          >
            {actionLabel}
          </Button>
        ) : null}

        {onSwitchMode && (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => onSwitchMode('sign-in')}
          >
            Back to Sign In
          </Button>
        )}
      </div>
    </div>
  );
};
