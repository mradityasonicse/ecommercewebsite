import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, Award } from 'lucide-react';
import { Container } from '../../primitives/Container';

export const TestimonialsSection: React.FC = () => {
  const standards = [
    {
      icon: <ShieldCheck size={24} color="var(--color-brand-blue)" />,
      title: 'In-Person Campus Audits',
      description:
        'Every listed mess kitchen, PG property, and laundry facility undergoes physical verification for hygiene, security, and true amenities.',
      badge: 'Audit Standard',
    },
    {
      icon: <FileCheck size={24} color="var(--color-brand-blue)" />,
      title: 'Fixed Student Rate Cards',
      description:
        'Zero broker commissions, locked monthly tariffs, and standard written agreements protecting your security deposit.',
      badge: 'Pricing Guarantee',
    },
    {
      icon: <CheckCircle2 size={24} color="var(--color-brand-blue)" />,
      title: 'Verified Student ID Reviews',
      description:
        'Reviews are unlocked exclusively for enrolled students after a completed service request. Zero fake ratings or paid placements.',
      badge: 'Authenticity Guarantee',
    },
  ];

  return (
    <section
      id="trust-standards"
      aria-labelledby="standards-heading"
      style={{
        padding: 'var(--space-16) 0',
        backgroundColor: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <Container>
        {/* Section Header */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto var(--space-12)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <Award size={14} color="var(--color-brand-blue)" />
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--color-brand-blue)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Institutional Standards
            </span>
          </div>

          <h2
            id="standards-heading"
            style={{
              fontFamily: 'var(--font-serif, "Domine", serif)',
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-3) 0',
              lineHeight: 1.25,
            }}
          >
            Verified Campus Living Standards
          </h2>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Built on physical verification, fixed student rate cards, and transparent provider agreements.
          </p>
        </div>

        {/* 3 Standards Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {standards.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--duration-fast), border-color var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-brand-blue)',
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-serif, "Domine", serif)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 var(--space-2) 0',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
