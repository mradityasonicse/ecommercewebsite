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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            border: '1.5px solid #F87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B91C1C',
          }}
        >
          <AlertCircle size={26} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
            Reset Link Expired
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Security tokens expire after 30 minutes to protect your student credentials. Please request a fresh reset link.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
          <Button
            variant="primary"
            size="md"
            icon={<RefreshCw size={14} />}
            iconPosition="left"
            fullWidth
            onClick={() => onSwitchMode('forgot-password')}
            style={{ backgroundColor: '#15803D' }}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803D',
          }}
        >
          <CheckCircle2 size={26} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
            Password Reset Complete
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
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
          style={{ backgroundColor: '#15803D' }}
        >
          Continue to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #F87171',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#B91C1C',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
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
        style={{ marginTop: '0.5rem', backgroundColor: '#15803D' }}
      >
        Update Password
      </Button>

      <button
        type="button"
        onClick={() => onSwitchMode('sign-in')}
        style={{
          background: 'none',
          border: 'none',
          color: '#15803D',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '0.25rem',
        }}
      >
        <ArrowLeft size={14} /> Back to Sign In
      </button>
    </form>
  );
};
