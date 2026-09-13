import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { PasswordField } from './PasswordField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import type { AuthViewMode } from '../../types/auth';

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
  onSwitchMode: (mode: AuthViewMode) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token = 'valid_demo_token',
  onSuccess,
  onSwitchMode,
}) => {
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(token === 'expired');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !confirmPassword) {
      setErrorMessage('Please enter and confirm your new password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword({ token, newPassword: password });
    setIsLoading(false);

    if (!result.success) {
      if (token === 'expired') {
        setIsTokenExpired(true);
      }
      setErrorMessage(result.error || 'Failed to reset password. Please try again.');
    } else {
      setIsSuccess(true);
    }
  };

  if (isTokenExpired) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444',
          }}
        >
          <AlertCircle size={26} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-2) 0' }}>
            Reset Link Expired
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Security tokens expire after 30 minutes to protect your student credentials. Please request a fresh reset link.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
          <Button
            variant="primary"
            size="md"
            icon={<RefreshCw size={14} />}
            iconPosition="left"
            fullWidth
            onClick={() => onSwitchMode('forgot-password')}
          >
            Request New Reset Link
          </Button>

          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => onSwitchMode('sign-in')}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22C55E',
          }}
        >
          <CheckCircle2 size={26} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-2) 0' }}>
            Password Reset Complete
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Your account security credentials have been updated. You may now sign in using your new password.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<ArrowRight size={14} />}
          iconPosition="right"
          fullWidth
          onClick={() => {
            if (onSuccess) onSuccess();
            else onSwitchMode('sign-in');
          }}
        >
          Continue to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: 'var(--color-accent-red)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <PasswordField
        id="reset-new-password"
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter at least 8 characters"
        autoComplete="new-password"
        disabled={isLoading}
      />

      {password && (
        <div style={{ marginTop: '-0.25rem' }}>
          <PasswordStrengthMeter password={password} />
        </div>
      )}

      <PasswordField
        id="reset-confirm-password"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        icon={<KeyRound size={14} />}
        iconPosition="left"
        loading={isLoading}
        fullWidth
        style={{ marginTop: 'var(--space-2)' }}
      >
        Update Password
      </Button>

      <button
        type="button"
        onClick={() => onSwitchMode('sign-in')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: 'var(--space-2)',
        }}
      >
        <ArrowLeft size={14} /> Back to Sign In
      </button>
    </form>
  );
};
