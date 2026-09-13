import React, { useState, useEffect } from 'react';
import {
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { ProviderSettings } from '../../types/provider';
import { ProviderService } from '../../services/providerService';
import { useAuth } from '../../context/AuthContext';

interface ProviderSettingsPageProps {
  onNavigateToProfile?: () => void;
  onNavigateToAuth?: () => void;
}

export const ProviderSettingsPage: React.FC<ProviderSettingsPageProps> = ({
  onNavigateToProfile,
  onNavigateToAuth,
}) => {
  const { user, isAuthenticated, changePassword } = useAuth();

  const [settings, setSettings] = useState<ProviderSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      ProviderService.getSettings(user.id).then((s) => {
        if (!isMounted) return;
        setSettings(s);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
          Provider Authentication Required
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Please sign in to access partner operational preferences and notification channels.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            if (onNavigateToAuth) onNavigateToAuth();
            else window.location.hash = '#auth/sign-in?returnTo=#provider/settings';
          }}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (isLoading || !settings) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Loading provider preferences...
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await ProviderService.updateSettings(user.id, settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);
    setIsChangingPwd(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPwdMessage({ text: res.message || 'Password successfully updated.' });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPwdMessage({ text: res.error || 'Failed to update password.', isError: true });
      }
    } finally {
      setIsChangingPwd(false);
    }
  };

  return (
    <div className="easehub-provider-settings-page" style={{ minHeight: '100vh', padding: 'calc(var(--navbar-height, 76px) + 2rem) 0 5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-blue-light)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
              Operations Management
            </div>
            <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Provider Settings & Dispatch
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {onNavigateToProfile && (
              <Button variant="outline" size="sm" onClick={onNavigateToProfile}>
                View Storefront Profile
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveSettings}
              disabled={isSaving}
              icon={<Save size={15} />}
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#10B981',
              fontSize: '0.84rem',
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Settings and notification channels have been securely saved.</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* 1. Multi-Channel Notification Dispatch */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} color="var(--color-blue-light)" />
              <span>Order Dispatch & Notification Preferences</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <ToggleRow
                title="Instant Student Booking Alerts"
                desc="Receive real-time push and sound notification when a student submits an urgent service request."
                checked={settings.notifications.newOrderAlerts}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, newOrderAlerts: val },
                  })
                }
              />

              <ToggleRow
                title="WhatsApp Dispatch Bot"
                desc="Forward customer room numbers and pickup time slots to your verified WhatsApp mobile."
                checked={settings.notifications.whatsappUpdates}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, whatsappUpdates: val },
                  })
                }
              />

              <ToggleRow
                title="SMS Backup Alerts"
                desc="Send SMS failover notices for high-priority bookings if connection is poor."
                checked={settings.notifications.smsDispatch}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, smsDispatch: val },
                  })
                }
              />

              <ToggleRow
                title="Daily Settlement & Payout Summary"
                desc="Receive daily email breakdown of total campus orders fulfilled and pending disbursements."
                checked={settings.notifications.dailyDigest}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, dailyDigest: val },
                  })
                }
              />
            </div>
          </div>

          {/* 2. Order Fulfillment Capacity */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--color-blue-light)" />
              <span>Capacity & Booking Controls</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <ToggleRow
                title="Auto-Accept Verified Student Orders"
                desc="Automatically approve orders during operational hours without manual confirmation."
                checked={settings.autoAcceptOrders}
                onChange={(val) => setSettings({ ...settings, autoAcceptOrders: val })}
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                  Maximum Simultaneous Bookings / Active Queue Limit
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={settings.instantBookingCapacity}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instantBookingCapacity: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  style={{
                    width: '160px',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Prevents kitchen or laundry overload during exam rush hours.
                </span>
              </div>
            </div>
          </div>

          {/* 3. Security & Credentials */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} color="var(--color-blue-light)" />
              <span>Account Security & Password</span>
            </h3>

            <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                  New Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              {pwdMessage && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: pwdMessage.isError ? '#FF7B72' : '#10B981',
                  }}
                >
                  {pwdMessage.text}
                </div>
              )}

              <Button variant="outline" size="sm" type="submit" disabled={isChangingPwd}>
                {isChangingPwd ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleRow: React.FC<{
  title: string;
  desc: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}> = ({ title, desc, checked, onChange }) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      padding: '0.85rem 1rem',
      backgroundColor: 'var(--color-surface-2)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
    }}
  >
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
        {desc}
      </div>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{
        marginTop: '4px',
        accentColor: 'var(--color-brand-blue)',
        width: '18px',
        height: '18px',
        cursor: 'pointer',
      }}
    />
  </label>
);
