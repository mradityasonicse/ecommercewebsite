import React, { useState } from 'react';
import {
  Bell,
  Lock,
  UserCheck,
  CheckCircle2,
  Mail,
  Smartphone,
  Info,
  Sliders,
  Package,
} from 'lucide-react';
import type { User } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface AccountSettingsTabProps {
  user: User;
  onNavigateToSecurityTab?: () => void;
}

export const AccountSettingsTab: React.FC<AccountSettingsTabProps> = ({
  user,
  onNavigateToSecurityTab,
}) => {
  const { updatePreferences, signOut } = useAuth();
  const [saveBanner, setSaveBanner] = useState<string | null>(null);
  const [confirmModalType, setConfirmModalType] = useState<'sign_out_all' | 'deactivate' | null>(null);

  const handleConfirmDangerAction = () => {
    if (confirmModalType === 'sign_out_all') {
      setConfirmModalType(null);
      signOut();
      window.location.hash = '';
    } else if (confirmModalType === 'deactivate') {
      setConfirmModalType(null);
      signOut();
      window.location.hash = '#auth/sign-in';
    }
  };

  const notifications = user.notifications || {
    smsAlerts: true,
    emailReceipts: true,
    deliveryArrivalNotices: true,
    marketingAnnouncements: false,
  };

  const privacy = user.privacy || {
    hideRoomFromExternalCouriers: false,
    shareContactWithWarden: true,
    allowPeerCampusDiscovery: true,
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    const nextVal = !notifications[key];
    updatePreferences({ notifications: { [key]: nextVal } });
    showBanner('Notification preferences saved');
  };

  const handleTogglePrivacy = (key: keyof typeof privacy) => {
    const nextVal = !privacy[key];
    updatePreferences({ privacy: { [key]: nextVal } });
    showBanner('Privacy settings updated');
  };

  const showBanner = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => {
      setSaveBanner((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Toast Banner */}
      {saveBanner && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(56, 158, 13, 0.12)',
            border: '1px solid rgba(56, 158, 13, 0.3)',
            color: '#73d13d',
            fontSize: '0.88rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Section 1: Account Identification */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <UserCheck size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
              Account Identity & Hierarchy
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Core identity credentials and access control tier
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>
              Full Name
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              {user.name}
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>
              Email Address
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF' }}>{user.email}</span>
              {user.emailVerified && (
                <span
                  title="Email Verified"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '0.68rem',
                    backgroundColor: 'rgba(56, 158, 13, 0.15)',
                    color: '#73d13d',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={11} /> Verified
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>
              Platform Role
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor:
                    user.role === 'admin'
                      ? 'rgba(255, 77, 79, 0.15)'
                      : user.role === 'provider'
                      ? 'rgba(250, 140, 22, 0.15)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color:
                    user.role === 'admin'
                      ? '#ff7875'
                      : user.role === 'provider'
                      ? '#ffa940'
                      : '#FFFFFF',
                }}
              >
                {user.role || 'student'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                Tier 1 Access
              </span>
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>
              Account Identifier
            </div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              {user.id}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Notification Preferences */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Bell size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
              Notification Preferences
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Choose how you receive delivery, service updates, and campus alerts
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* SMS Toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Smartphone size={18} color="var(--color-brand-blue)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Instant SMS & WhatsApp Alerts
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                  Receive urgent updates when laundry is ready or maintenance staff arrives at your door.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.smsAlerts}
              onChange={() => handleToggleNotification('smsAlerts')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }}
            />
          </label>

          {/* Email Receipts */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Mail size={18} color="var(--color-brand-blue)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Email Receipts & Booking Confirmations
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                  Detailed digital invoices, provider assignments, and calendar event invites.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailReceipts}
              onChange={() => handleToggleNotification('emailReceipts')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }}
            />
          </label>

          {/* Delivery Notices */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Package size={18} color="var(--color-brand-blue)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Hostel Gate & Delivery Arrival Notices
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                  Notifications when verified packages or meal couriers pass hostel security gates.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.deliveryArrivalNotices}
              onChange={() => handleToggleNotification('deliveryArrivalNotices')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }}
            />
          </label>

          {/* Marketing Digest */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Info size={18} color="var(--color-text-tertiary)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Campus Community Highlights & Special Deals
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                  Occasional digest on seasonal mess discounts, gym trial passes, and study gear popups.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.marketingAnnouncements}
              onChange={() => handleToggleNotification('marketingAnnouncements')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }}
            />
          </label>
        </div>
      </div>

      {/* Section 3: Privacy Controls */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Sliders size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
              Campus Privacy & Data Sharing
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Manage how your room number and contact details are disclosed to partners
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Hide Room from Couriers */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                Mask Specific Room Number from External Couriers
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                Couriers deliver to the central hostel reception drop point instead of showing your exact room.
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacy.hideRoomFromExternalCouriers}
              onChange={() => handleTogglePrivacy('hideRoomFromExternalCouriers')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }}
            />
          </label>

          {/* Share with Warden */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                Authorize Hostel Warden / Caretaker Coordination
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                Permits hostel warden office to assist when maintenance technicians need access to your block.
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacy.shareContactWithWarden}
              onChange={() => handleTogglePrivacy('shareContactWithWarden')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }}
            />
          </label>

          {/* Peer Discovery */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                Allow Peer Campus Delivery Coordination
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                Allows classmates from the same hostel wing to bundle group delivery requests.
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacy.allowPeerCampusDiscovery}
              onChange={() => handleTogglePrivacy('allowPeerCampusDiscovery')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }}
            />
          </label>
        </div>
      </div>

      {/* Section 4: Security Quick Jump */}
      <div
        style={{
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Lock size={20} color="#FFFFFF" />
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
              Password & Authentication Credentials
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Manage your password, active sessions, and multi-factor campus authentication.
            </div>
          </div>
        </div>

        {onNavigateToSecurityTab && (
          <button
            type="button"
            onClick={onNavigateToSecurityTab}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            Go to Security Settings &rarr;
          </button>
        )}
      </div>

      {/* Section 5: Danger Zone */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid rgba(255, 43, 43, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
        }}
      >
        <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.05rem', color: '#FF7B72', fontWeight: 700 }}>
          Danger Zone
        </h3>
        <p style={{ margin: '0 0 var(--space-5) 0', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
          Irreversible and session-wide destructive account actions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Sign Out All Sessions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                Sign Out of All Active Campus Sessions
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                Terminates all web, mobile PWA, and library kiosk sessions associated with this student identity.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmModalType('sign_out_all')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 43, 43, 0.4)',
                color: '#FF7B72',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign Out All Devices
            </button>
          </div>

          {/* Deactivate Student Account */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                Deactivate EaseHub Student Account
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                Temporarily suspends order placements and notifications while preserving student verification record.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmModalType('deactivate')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 43, 43, 0.1)',
                border: '1px solid #FF4D4F',
                color: '#FF4D4F',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Confirmation Dialog Modal */}
      {confirmModalType && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="danger-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setConfirmModalType(null);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <h3 id="danger-modal-title" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {confirmModalType === 'sign_out_all'
                ? 'Sign Out All Devices?'
                : 'Deactivate Student Account?'}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {confirmModalType === 'sign_out_all'
                ? 'This action will revoke active authentication tokens on all laptops, smartphones, and campus terminals. You will need to sign in again.'
                : 'Deactivating your student profile will pause active notifications and scheduled bookings. You can reactivate anytime by signing back in with your institutional email.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => setConfirmModalType(null)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDangerAction}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FF4D4F',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {confirmModalType === 'sign_out_all' ? 'Sign Out All Sessions' : 'Deactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
