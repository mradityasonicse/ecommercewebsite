import React from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Zap
} from 'lucide-react';
import { Container } from '../../primitives/Container';

export const SolutionSection: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck size={22} color="var(--color-brand-green)" />,
      title: 'Audited Provider Standards',
      subtitle: 'Police verified & physically inspected',
      description: 'Every kitchen, residence, and technician passes an in-person 24-point compliance check before serving a single student.',
      tag: 'Zero Unvetted Vendors',
    },
    {
      icon: <Layers size={22} color="var(--color-brand-gold)" />,
      title: 'Unified Rate Cards',
      subtitle: 'No student surge or hidden broker markups',
      description: 'Transparent, upfront pricing negotiated at institutional scale. What you see is what you pay—guaranteed across every service.',
      tag: 'Fixed Price Standard',
    },
    {
      icon: <Zap size={22} color="var(--color-brand-blue)" />,
      title: 'Single-Window Resolution',
      subtitle: 'Deposit escrow & 30-min rapid fix',
      description: 'One trusted platform stands behind every booking, contract, and repair. Direct student advocate support on every active campus.',
      tag: '100% Accountable',
    },
  ];

  return (
    <section
      id="solution"
      aria-label="The EaseHub Solution"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-primary)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)',
        borderBottom: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-12)' }}>
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
            <ShieldCheck size={14} color="var(--color-brand-gold)" />
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
              The EaseHub Living Standard
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
              margin: '0 0 var(--space-4) 0',
            }}
          >
            From Chaos to Complete Clarity.{' '}
            <span
              style={{
                color: 'var(--color-brand-gold)',
              }}
            >
              One Living Ecosystem.
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            EaseHub replaces the stressful puzzle of student life with an engineered, collegiate standard. 
            All your campus essentials are brought together under one verified umbrella.
          </p>
        </div>

        {/* Visual Transformation: Before vs After EaseHub */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {/* The Old Way */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-brand-red)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                The Old Reality
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                Fragmented &amp; Unregulated
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: '0 0 var(--space-4) 0',
              }}
            >
              Scattered Vendors &amp; Zero Recourse
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6) 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                '8+ random WhatsApp groups with conflicting menus & no hygiene data',
                'Unregulated security deposit withholding by PGs and brokers',
                'Inflated surge pricing when semester emergencies hit',
                'Zero background verification on doorstep repair technicians',
                'Scattered UPI payment records across 10+ untracked vendor accounts',
              ].map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-brand-red)', marginTop: '2px', fontWeight: 700 }}>✕</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 'auto',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--color-border-default)',
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
              }}
            >
              "Students report spending an average of 18 hours each month resolving basic accommodation, food, and commute logistics."
            </div>
          </div>

          {/* The EaseHub Way */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-1)',
              border: '1.5px solid var(--color-brand-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(250, 202, 18, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#12285A',
                  backgroundColor: 'var(--color-brand-gold)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                The EaseHub Standard
              </span>
              <span style={{ fontSize: '0.8rem', color: '#6DBF55', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                100% Institutional Accountability
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: '0 0 var(--space-4) 0',
              }}
            >
              One Engineered Campus Living Hub
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6) 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Single dashboard with verified meal plans, room bookings, and laundry tracking',
                'Transparent contracts with zero hidden broker commission or rent gouging',
                'Pre-negotiated semester rates with guaranteed savings on daily essentials',
                'In-person audited technicians and live status updates on every campus task',
                'Unified digital wallet with instant receipt generation for parental tracking',
              ].map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  <CheckCircle2 size={16} color="var(--color-brand-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 'auto',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              }}
            >
              ✨ "With EaseHub, I consolidated all my campus needs into one reliable place. My room, meals, and laundry take zero effort to manage."
            </div>
          </div>
        </div>

        {/* 3 Pillars Architecture */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--duration-fast), box-shadow var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {pillar.icon}
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-brand-gold)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.35rem',
                }}
              >
                {pillar.tag}
              </div>

              <h4
                style={{
                  fontSize: '1.05rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.25rem 0',
                }}
              >
                {pillar.title}
              </h4>

              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {pillar.subtitle}
              </div>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
