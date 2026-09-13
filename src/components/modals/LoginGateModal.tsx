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
        backgroundColor: 'rgba(5, 11, 24, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        overflowY: 'auto',
      }}
    >
      {/* Modal Card matching user screenshot layout */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#0F172A', // Sleek Navy/Midnight Slate
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(24, 76, 180, 0.25)',
          padding: '2.25rem 2rem',
          color: '#FFFFFF',
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
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <X size={16} />
        </button>

        {/* Header matching exact user screenshot */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2
            style={{
              fontSize: '1.75rem',
              fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 0.5rem 0',
              lineHeight: 1.2,
              letterSpacing: '-0.015em',
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
              fontSize: '0.88rem',
              color: 'var(--color-text-secondary, #94A3B8)',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: 'var(--font-body, sans-serif)',
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
