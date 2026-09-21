import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../primitives/Container';

export interface ReferenceCTABannerProps {
  onGetStarted?: () => void;
}

export const ReferenceCTABanner: React.FC<ReferenceCTABannerProps> = ({
  onGetStarted,
}) => {
  const handleClick = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      window.location.hash = '#auth/sign-up';
    }
  };

  return (
    <section
      aria-label="Call to Action"
      style={{
        padding: 'var(--space-16) 0',
        backgroundColor: 'var(--color-surface-1)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        color: 'var(--color-text-primary)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container variant="narrow">
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif, "Domine", serif)',
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-3) 0',
            }}
          >
            Find Your Campus Essentials in One Place
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              margin: '0 0 var(--space-8) 0',
              maxWidth: '520px',
            }}
          >
            Audited student accommodations, meal tiffins, and doorstep laundry with transparent rates.
          </p>

          <button
            type="button"
            onClick={handleClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.8rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-blue)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
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
            <span>Create Student Account</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </Container>
    </section>
  );
};
