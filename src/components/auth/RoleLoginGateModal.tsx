import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Building2,
  UtensilsCrossed,
  Shirt,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export type UserPersona = 'student' | 'pg_owner' | 'mess_partner' | 'laundry_partner' | 'admin';

export interface RoleLoginGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserPersona) => void;
}

export const RoleLoginGateModal: React.FC<RoleLoginGateModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const [activePersona, setActivePersona] = useState<UserPersona>('student');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate role credentials or fallback to demo
    if (activePersona === 'admin') {
      if (emailOrPhone.includes('admin') || password === 'admin123' || password === 'easehub2026' || !password) {
        completeRoleLogin('admin');
      } else {
        setError('Invalid Admin credentials. Hint: click "1-Click Demo Login as Admin"');
      }
    } else if (activePersona === 'pg_owner') {
      completeRoleLogin('pg_owner');
    } else if (activePersona === 'mess_partner') {
      completeRoleLogin('mess_partner');
    } else if (activePersona === 'laundry_partner') {
      completeRoleLogin('laundry_partner');
    } else {
      completeRoleLogin('student');
    }
  };

  const completeRoleLogin = (role: UserPersona) => {
    try {
      localStorage.setItem('easehub_user_role', role);
      localStorage.setItem('easehub_current_role', role);
      if (role === 'admin') {
        sessionStorage.setItem('easehub_admin_auth', 'true');
      }
    } catch (e) {
      console.warn('Storage error', e);
    }
    onSelectRole(role);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="EaseHub Multi-Role Campus Access Gate"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        overflowY: 'auto',
      }}
    >
      {/* Central Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid rgba(22, 163, 74, 0.25)',
          boxShadow: '0 25px 60px -10px rgba(15, 81, 50, 0.2), 0 0 40px rgba(250, 204, 21, 0.12)',
          padding: '2.25rem 2rem',
          color: '#0F172A',
          animation: 'easehub-fade-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close / Guest button */}
        <button
          type="button"
          onClick={() => {
            completeRoleLogin('student');
          }}
          aria-label="Explore as Guest Student"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#F8FAF7',
            border: '1px solid #E2E8F0',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#EFF5EC';
            e.currentTarget.style.color = '#15803D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAF7';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <X size={17} />
        </button>

        {/* Brand & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#DCFCE7',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #86EFAC',
              color: '#15803D',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '0.65rem',
            }}
          >
            <Sparkles size={13} />
            <span>SELECT YOUR CAMPUS ROLE</span>
          </div>

          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 0.35rem 0',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome to EaseHub
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748B', lineHeight: 1.4 }}>
            Apna role chunein — website aapke portal ke according open hogi:
          </p>
        </div>

        {/* 5 Distinct Role Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.4rem',
            backgroundColor: '#F8FAF7',
            padding: '0.35rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            marginBottom: '1.5rem',
          }}
        >
          {/* 1. Student */}
          <button
            type="button"
            onClick={() => {
              setActivePersona('student');
              setError(null);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.6rem 0.25rem',
              borderRadius: '10px',
              border: activePersona === 'student' ? '1.5px solid #16A34A' : '1px solid transparent',
              backgroundColor: activePersona === 'student' ? '#FFFFFF' : 'transparent',
              color: activePersona === 'student' ? '#15803D' : '#64748B',
              boxShadow: activePersona === 'student' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              gap: '0.25rem',
            }}
          >
            <GraduationCap size={18} strokeWidth={2.4} />
            <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>Student</span>
          </button>

          {/* 2. PG Owner */}
          <button
            type="button"
            onClick={() => {
              setActivePersona('pg_owner');
              setError(null);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.6rem 0.25rem',
              borderRadius: '10px',
              border: activePersona === 'pg_owner' ? '1.5px solid #16A34A' : '1px solid transparent',
              backgroundColor: activePersona === 'pg_owner' ? '#FFFFFF' : 'transparent',
              color: activePersona === 'pg_owner' ? '#15803D' : '#64748B',
              boxShadow: activePersona === 'pg_owner' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              gap: '0.25rem',
            }}
          >
            <Building2 size={18} strokeWidth={2.4} />
            <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>PG Owner</span>
          </button>

          {/* 3. Mess Partner */}
          <button
            type="button"
            onClick={() => {
              setActivePersona('mess_partner');
              setError(null);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.6rem 0.25rem',
              borderRadius: '10px',
              border: activePersona === 'mess_partner' ? '1.5px solid #16A34A' : '1px solid transparent',
              backgroundColor: activePersona === 'mess_partner' ? '#FFFFFF' : 'transparent',
              color: activePersona === 'mess_partner' ? '#15803D' : '#64748B',
              boxShadow: activePersona === 'mess_partner' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              gap: '0.25rem',
            }}
          >
            <UtensilsCrossed size={18} strokeWidth={2.4} />
            <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>Mess</span>
          </button>

          {/* 4. Laundry Partner */}
          <button
            type="button"
            onClick={() => {
              setActivePersona('laundry_partner');
              setError(null);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.6rem 0.25rem',
              borderRadius: '10px',
              border: activePersona === 'laundry_partner' ? '1.5px solid #16A34A' : '1px solid transparent',
              backgroundColor: activePersona === 'laundry_partner' ? '#FFFFFF' : 'transparent',
              color: activePersona === 'laundry_partner' ? '#15803D' : '#64748B',
              boxShadow: activePersona === 'laundry_partner' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              gap: '0.25rem',
            }}
          >
            <Shirt size={18} strokeWidth={2.4} />
            <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>Laundry</span>
          </button>

          {/* 5. Central Admin */}
          <button
            type="button"
            onClick={() => {
              setActivePersona('admin');
              setError(null);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.6rem 0.25rem',
              borderRadius: '10px',
              border: activePersona === 'admin' ? '1.5px solid #16A34A' : '1px solid transparent',
              backgroundColor: activePersona === 'admin' ? '#FFFFFF' : 'transparent',
              color: activePersona === 'admin' ? '#15803D' : '#64748B',
              boxShadow: activePersona === 'admin' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              gap: '0.25rem',
            }}
          >
            <ShieldCheck size={18} strokeWidth={2.4} />
            <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>Admin</span>
          </button>
        </div>

        {/* Persona Info Card */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#EFF5EC',
            borderRadius: '14px',
            border: '1px solid #BBF7D0',
            marginBottom: '1.25rem',
          }}
        >
          {activePersona === 'student' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#15803D' }}>
                🎓 Student &amp; Resident Experience
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem' }}>
                Browse zero-brokerage PGs, view today's daily mess menu, order midnight snacks, and track doorstep laundry deliveries.
              </div>
            </div>
          )}

          {activePersona === 'pg_owner' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#15803D' }}>
                🏠 PG Owner Vacancy Portal (#pg-portal)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem' }}>
                Manage vacant &amp; occupied rooms, update handover dates (e.g. "Available from 1st Oct"), adjust bed rent, and broadcast live vacancies to students.
              </div>
            </div>
          )}

          {activePersona === 'mess_partner' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#15803D' }}>
                🍲 Mess Partner Kitchen Console (#mess-portal)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem' }}>
                Update today's Lunch &amp; Dinner dishes, change cooking stages, and click <strong>"Hostel Gate Pe Pahunch Gaya"</strong> to send arrival alerts to students.
              </div>
            </div>
          )}

          {activePersona === 'laundry_partner' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#15803D' }}>
                👕 Laundry Partner Pickup Queue (#laundry-portal)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem' }}>
                View scheduled pickup times by room number, record laundry bag weights, and advance through 5-stage wash &amp; steam pressing lifecycle.
              </div>
            </div>
          )}

          {activePersona === 'admin' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#15803D' }}>
                🛡️ Super Admin Operations Console (#admin)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem' }}>
                Access interactive student booking spreadsheet with live status updates, edit service catalog prices, and <strong>Export to CSV / Excel</strong> in 1 click.
              </div>
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#FEE2E2',
              border: '1px solid #F87171',
              borderRadius: '8px',
              color: '#B91C1C',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {/* 1-Click Instant Demo Login Button (Highlight) */}
        <button
          type="button"
          onClick={() => completeRoleLogin(activePersona)}
          style={{
            width: '100%',
            padding: '0.9rem 1.25rem',
            backgroundColor: '#15803D',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(21, 128, 61, 0.3)',
            transition: 'all 0.15s ease',
            marginBottom: '0.75rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#166534')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#15803D')}
        >
          <span>
            {activePersona === 'student' && '🚀 Open Student Marketplace (Demo)'}
            {activePersona === 'pg_owner' && '🏠 Open PG Owner Portal (Demo)'}
            {activePersona === 'mess_partner' && '🍲 Open Mess Partner Portal (Demo)'}
            {activePersona === 'laundry_partner' && '👕 Open Laundry Partner Portal (Demo)'}
            {activePersona === 'admin' && '🛡️ Open Admin Operations Console (Demo)'}
          </span>
          <ArrowRight size={17} />
        </button>

        {/* Custom Login Form (Optional for custom credentials) */}
        <form onSubmit={handleRoleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
              {activePersona === 'student' ? 'Mobile Number or Student Email' : `${activePersona.toUpperCase()} User ID / Email`}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={
                  activePersona === 'student'
                    ? '98765 43210 or student@easehub.in'
                    : activePersona === 'pg_owner'
                    ? 'pg@easehub.in'
                    : activePersona === 'mess_partner'
                    ? 'mess@easehub.in'
                    : activePersona === 'laundry_partner'
                    ? 'laundry@easehub.in'
                    : 'admin@easehub.in'
                }
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.84rem',
                  color: '#0F172A',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
              Password / Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.84rem',
                color: '#0F172A',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.75rem',
              backgroundColor: '#F8FAF7',
              color: '#334155',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EFF5EC';
              e.currentTarget.style.color = '#15803D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAF7';
              e.currentTarget.style.color = '#334155';
            }}
          >
            Sign In with Entered Credentials
          </button>
        </form>

        {/* Guest Explore Link */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
          <button
            type="button"
            onClick={() => completeRoleLogin('student')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Or continue directly to Homepage as Guest Student</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
