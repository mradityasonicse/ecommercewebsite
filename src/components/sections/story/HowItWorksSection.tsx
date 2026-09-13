import React from 'react';
import { Smartphone, CheckCircle2, Users, PartyPopper } from 'lucide-react';
import { Container } from '../../primitives/Container';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Browse Services',
      desc: 'Explore our range of student-focused services',
      icon: Smartphone,
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      num: '2',
      title: 'Select & Request',
      desc: 'Choose what you need and submit your request',
      icon: CheckCircle2,
      color: '#16A34A',
      bg: 'rgba(22, 163, 74, 0.1)',
    },
    {
      num: '3',
      title: 'Get Matched',
      desc: 'We connect you with verified service providers',
      icon: Users,
      color: '#EA580C',
      bg: 'rgba(234, 88, 12, 0.1)',
    },
    {
      num: '4',
      title: 'Enjoy Convenience',
      desc: 'Sit back and let us handle the rest',
      icon: PartyPopper,
      color: '#9333EA',
      bg: 'rgba(147, 51, 234, 0.1)',
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      style={{
        padding: '5.5rem 0',
        backgroundColor: 'var(--color-bg-secondary, #F8FAFC)',
        borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
        borderBottom: '1px solid var(--color-border-subtle, #E2E8F0)',
        position: 'relative',
      }}
    >
      <Container variant="wide">
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto 3.5rem',
          }}
        >
          <h2
            id="how-it-works-heading"
            style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary, #0F172A)',
              marginBottom: '0.75rem',
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary, #475569)',
              lineHeight: 1.6,
            }}
          >
            Get started in 4 simple steps
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '2rem',
            position: 'relative',
          }}
        >
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-surface-1, #FFFFFF)',
                  border: '1px solid var(--color-border-default, #E2E8F0)',
                  borderRadius: '16px',
                  padding: '2.25rem 1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.03)';
                }}
              >
                {/* Step Number Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted, #94A3B8)',
                    fontFamily: 'var(--font-display, inherit)',
                  }}
                >
                  Step {step.num}
                </div>

                {/* Step Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: step.bg,
                    color: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <IconComponent size={28} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display, inherit)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #0F172A)',
                    marginBottom: '0.65rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--color-text-secondary, #64748B)',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
