import React from 'react';
import { ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onBackToApp?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  onBackToApp,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface-base)',
        color: 'var(--color-text-primary)',
        backgroundImage:
          'radial-gradient(at 0% 0%, rgba(34, 197, 94, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(250, 204, 21, 0.06) 0px, transparent 50%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      }}
    >
      {/* Top minimal navigation header */}
      <div
        style={{
          height: '68px',
          padding: '0 clamp(1rem, 3vw, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-surface-1)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (onBackToApp) onBackToApp();
            else window.location.hash = '';
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <BrandLogo variant="compact" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (onBackToApp) onBackToApp();
            else window.location.hash = '';
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '9999px',
            padding: '0.35rem 0.85rem',
            color: 'var(--color-text-primary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ArrowLeft size={14} />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Main 2-column layout container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem) 4rem',
        }}
      >
        <div
          style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 4vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Brand Story & Value Proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1.5px solid rgba(34, 197, 94, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#16A34A',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                alignSelf: 'flex-start',
              }}
            >
              <ShieldCheck size={14} color="#16A34A" />
              <span>Student Living Operating System</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 2.75rem)',
                fontFamily: 'var(--font-display, "Domine", Georgia, serif)',
                fontWeight: 900,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Every student need. <br />
              <span style={{ color: '#16A34A' }}>One verified account.</span>
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Connect your verified campus identity to track meals, doorstep laundry, emergency hostel repairs, and campus shuttles in real-time.
            </p>

            {/* 2 Value Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={18} color="#16A34A" />
                </div>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  100% Background-checked &amp; police-verified campus operators
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Zap size={18} color="#EF4444" />
                </div>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  Zero broker commissions &amp; fixed student subsidized rates
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: '24px',
              border: '1.5px solid var(--color-border-subtle)',
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-display, "Domine", Georgia, serif)',
                  fontWeight: 900,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.35rem 0',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
