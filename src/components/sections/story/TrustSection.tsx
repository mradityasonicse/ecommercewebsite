import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  CheckCircle2, 
  Award,
  FileCheck2
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { SITE_CONFIG } from '../../../data/site-config';

export const TrustSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    const props = { size: 24, color: 'var(--color-brand-green)' };
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Lock': return <Lock {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <ShieldCheck {...props} />;
    }
  };

  return (
    <section
      id="trust"
      aria-label="Student Trust and Safety Standards"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-secondary)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)',
        borderBottom: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <Award size={13} color="var(--color-brand-gold)" />
            <span
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                color: 'var(--color-brand-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Institutional Integrity
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-3) 0',
            }}
          >
            Built Around{' '}
            <span
              style={{
                color: 'var(--color-brand-gold)',
              }}
            >
              Student Confidence.
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Student life is high-stakes. We eliminate risk with uncompromised background checks, legal lease escrow, and rapid campus response teams.
          </p>
        </div>

        {/* 4 Trust Guarantee Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {SITE_CONFIG.trustGuarantees.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--duration-fast), box-shadow var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-5)',
                  }}
                >
                  {getIcon(item.icon)}
                </div>

                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-body)', color: 'var(--color-brand-gold)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                  GUARANTEE 0{idx + 1}
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 var(--space-3) 0',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.86rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>

              <div
                style={{
                  marginTop: 'var(--space-6)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <FileCheck2 size={14} color="#58A940" />
                <span>Enforced by EaseHub Campus Council</span>
              </div>
            </div>
          ))}
        </div>

        {/* Real Ecosystem Metric Banner */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6) var(--space-8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-6)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-gold)', lineHeight: 1.1 }}>
              100%
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', fontWeight: 600 }}>
              Police &amp; FSSAI Audited
            </div>
          </div>

          <div>
            <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-gold)', lineHeight: 1.1 }}>
              ₹0
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', fontWeight: 600 }}>
              Brokerage on All Accommodations
            </div>
          </div>

          <div>
            <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-gold)', lineHeight: 1.1 }}>
              30 Min
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', fontWeight: 600 }}>
              Rapid Campus Emergency Response
            </div>
          </div>

          <div>
            <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-gold)', lineHeight: 1.1 }}>
              4.8 ★
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', fontWeight: 600 }}>
              Student Rating from 12+ Campuses
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
