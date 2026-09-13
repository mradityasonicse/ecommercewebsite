import React from 'react';
import { CAMPUSES } from '../../data/campuses';
import { ECOSYSTEM_SERVICES } from '../../data/services';
import { SITE_CONFIG } from '../../data/site-config';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#050608',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '5rem',
        paddingBottom: '3rem'
      }}
    >
      <div className="container">
        
        {/* Main 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}
        >
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border-hover)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'var(--color-blue)',
                    transform: 'rotate(45deg)',
                    top: '2px',
                    left: '2px'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '3px',
                    right: '3px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-red)'
                  }}
                />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-white)', fontFamily: 'var(--font-display)' }}>
                Ease<span style={{ color: 'var(--color-blue)' }}>Hub</span>
              </span>
            </div>

            <p style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '280px', margin: 0 }}>
              Connecting university students with verified living infrastructure and trusted operators across India.
            </p>
          </div>

          {/* Ecosystem Services */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              8-Pillar Ecosystem
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {ECOSYSTEM_SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#ecosystem"
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', transition: 'color var(--duration-fast)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Campuses */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              University Hubs
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {CAMPUSES.map((c) => (
                <li key={c.id}>
                  <a
                    href="#campuses"
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', transition: 'color var(--duration-fast)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {c.name} ({c.city})
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Contact */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Student Safety & Trust
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <li>
                <a href="#trust" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Verification Criteria
                </a>
              </li>
              <li>
                <a href="#trust" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Deposit Escrow Protection
                </a>
              </li>
              <li>
                <a href="#trust" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Campus Food Hygiene Audits
                </a>
              </li>
              <li>
                <a href="#trust" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Student Grievance Redressal
                </a>
              </li>
            </ul>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              <div>Campus Helpline: <strong style={{ color: 'var(--color-white)' }}>{SITE_CONFIG.contact.campusHelpline}</strong></div>
              <div>Student Support: <strong style={{ color: 'var(--color-white)' }}>{SITE_CONFIG.contact.supportEmail}</strong></div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} EaseHub Technologies Inc. Built for university students with care.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit' }}>Security Standards</a>
            <a href="#" style={{ color: 'inherit' }}>Provider Agreement</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
