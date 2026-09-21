import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { SignInForm } from '../auth/SignInForm';
import { SignUpForm } from '../auth/SignUpForm';
import { ForgotPasswordForm } from '../auth/ForgotPasswordForm';
import type { AuthViewMode } from '../../types/auth';

interface LoginGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginGateModal: React.FC<LoginGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [authMode, setAuthMode] = useState<AuthViewMode>('sign-in');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Student Sign In Gate"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        overflowY: 'auto',
      }}
    >
      {/* Modal Card matching clean white campus aesthetic */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid rgba(22, 163, 74, 0.22)',
          boxShadow: '0 25px 60px -12px rgba(15, 81, 50, 0.15), 0 0 35px rgba(250, 204, 21, 0.1)',
          padding: '2.25rem 2rem',
          color: '#0F172A',
          animation: 'easehub-fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close / Dismiss as Guest Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Explore as Guest"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F8FAF7',
            border: '1px solid rgba(22, 163, 74, 0.2)',
            color: '#334155',
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
            e.currentTarget.style.color = '#334155';
          }}
        >
          <X size={16} />
        </button>

        {/* Header matching exact user screenshot */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2
            style={{
              fontSize: 'var(--text-h2)',
              fontFamily: 'var(--font-family-h2)',
              fontWeight: 'var(--weight-h2)',
              color: '#0F172A',
              margin: '0 0 0.5rem 0',
              lineHeight: 'var(--leading-h2)',
              letterSpacing: 'var(--tracking-h2)',
              textWrap: 'balance',
            }}
          >
            {authMode === 'sign-in'
              ? 'Welcome Back, Scholar'
              : authMode === 'sign-up'
              ? 'Create Your Student Account'
              : 'Reset Account Password'}
          </h2>
          <p
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: 'var(--leading-body-sm)',
              fontFamily: 'var(--font-family-body-sm)',
            }}
          >
            {authMode === 'sign-in'
              ? 'Sign in to access your active bookings, saved hostel addresses, and student perks.'
              : authMode === 'sign-up'
              ? 'Join fellow campus residents for verified hostel bookings, mess plans, and doorstep laundry.'
              : 'Enter your email or phone to reset your collegiate security credentials.'}
          </p>
        </div>

        {/* Content Body */}
        {authMode === 'sign-in' && (
          <SignInForm
            onSuccess={onSuccess}
            onSwitchMode={(newMode) => setAuthMode(newMode)}
          />
        )}

        {authMode === 'sign-up' && (
          <SignUpForm
            onSuccess={onSuccess}
            onSwitchMode={(newMode) => setAuthMode(newMode)}
          />
        )}

        {authMode === 'forgot-password' && (
          <ForgotPasswordForm
            onSwitchMode={(newMode) => setAuthMode(newMode)}
          />
        )}

        {/* Optional Guest Bypass */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted, #64748B)',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FAC908')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            <span>Explore Campus Marketplace as Guest</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes easehub-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
