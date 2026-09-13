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
        backgroundColor: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top minimal navigation header */}
      <div
        style={{
          height: '64px',
          padding: '0 var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border-subtle)',
          backgroundColor: 'rgba(5, 5, 5, 0.8)',
          backdropFilter: 'blur(12px)',
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
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'color var(--duration-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
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
          padding: 'var(--space-8) var(--space-6) var(--space-16)',
        }}
      >
        <div
          style={{
            maxWidth: '1020px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'var(--space-12)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Brand Story & Value Proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                alignSelf: 'flex-start',
              }}
            >
              <ShieldCheck size={12} color="var(--color-brand-gold)" /> Student Living Operating System
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Every student need. <br />
              <span style={{ color: '#E2E8F0' }}>One verified account.</span>
            </h1>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Connect your verified campus identity to track meals, doorstep laundry, emergency hostel repairs, and campus shuttles in real-time.
            </p>

            {/* 3 Value Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#10B981" />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  100% Background-checked & police-verified campus operators
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 43, 43, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={16} color="var(--color-brand-red)" />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  Zero broker commissions & fixed student subsidized rates
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--color-border-subtle)',
              padding: 'var(--space-8)',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2
                style={{
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 var(--space-1) 0',
                }}
              >
                {title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
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
