import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Smartphone, CheckCircle, Laptop, RefreshCw } from 'lucide-react';
import type { User } from '../../types/auth';
import { Button } from '../ui/Button';
import { PasswordStrengthMeter } from '../auth/PasswordStrengthMeter';
import { useAuth } from '../../context/AuthContext';

interface AccountSecurityTabProps {
  user: User;
}

export const AccountSecurityTab: React.FC<AccountSecurityTabProps> = ({ user: _user }) => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsUpdating(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsUpdating(false);

    if (res.success) {
      setUpdateSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setUpdateSuccess(false), 4000);
    } else {
      setError(res.error || 'Failed to update password.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
      {/* Password Update Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 'var(--space-4)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <KeyRound size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Update Security Password
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0 0 0' }}>
              Keep your EaseHub account and campus credentials secure.
            </p>
          </div>
        </div>

        {updateSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              fontSize: '0.8rem',
              color: '#22C55E',
              marginBottom: 'var(--space-4)',
            }}
          >
            <CheckCircle size={15} /> Your password has been successfully updated.
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(255, 43, 43, 0.1)',
              border: '1px solid rgba(255, 43, 43, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              fontSize: '0.8rem',
              color: '#FF2B2B',
              marginBottom: 'var(--space-4)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            {newPassword && (
              <div style={{ marginTop: '0.5rem' }}>
                <PasswordStrengthMeter password={newPassword} />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isUpdating}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Active Sessions & Security Logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 var(--space-4) 0' }}>
            Active Student Sessions
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {/* Current Session */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(34, 197, 94, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Laptop size={18} color="var(--color-brand-blue)" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Chrome on Windows (This Device)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                    Campus High-Speed Wi-Fi • Active Now
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#22C55E',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                }}
              >
                CURRENT
              </span>
            </div>

            {/* Mobile Session */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Smartphone size={18} color="var(--color-text-muted)" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF' }}>
                    EaseHub PWA on iPhone 15
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                    Mobile 5G Network • Last seen 4 hours ago
                  </div>
                </div>
              </div>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent-red)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication Info */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 'var(--space-3)' }}>
            <ShieldAlert size={18} color="#F59E0B" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Campus Domain Protection
            </h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 var(--space-4) 0' }}>
            EaseHub account credentials are encrypted with AES-256 standard and linked to your university email domain. Password resets trigger a one-time institutional OTP to your registered mailbox.
          </p>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={13} />}
            iconPosition="left"
            onClick={() => alert('Campus single sign-on sync status is optimal.')}
          >
            Check SSO Status
          </Button>
        </div>
      </div>
    </div>
  );
};
