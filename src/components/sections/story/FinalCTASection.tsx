import React from 'react';
import { ArrowRight, School } from 'lucide-react';
import { Container } from '../../primitives/Container';

interface FinalCTASectionProps {
  onRequestCampusOpen: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onRequestCampusOpen }) => {
  const handleScrollToEcosystem = () => {
    const el = document.getElementById('core-services') || document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="cta"
      aria-label="Get Started with EaseHub"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-primary)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-24)',
        borderBottom: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
      }}
    >
      <Container variant="narrow">
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            Make Student Life Easier.{' '}
            <span
              style={{
                color: 'var(--color-brand-gold, #FAC908)',
              }}
            >
              All in One Place.
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              maxWidth: '620px',
              margin: '0 auto var(--space-8) auto',
            }}
          >
            Verified student housing, authentic campus meal plans, and doorstep laundry with upfront student pricing and fast WhatsApp booking.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}
          >
            <button
              type="button"
              onClick={handleScrollToEcosystem}
              className="easehub-btn-tactile"
              style={{
                padding: '0.85rem 2.2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-brand-gold, #FAC908)',
                color: '#112758',
                border: 'none',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(250, 201, 8, 0.3)',
                transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E5B507';
                e.currentTarget.style.transform = 'translateY(-1.5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-gold, #FAC908)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0.5px) scale(0.985)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1.5px)';
              }}
            >
              <span>Explore Campus Services</span>
              <ArrowRight size={17} className="easehub-icon-nudge" />
            </button>

            <button
              type="button"
              onClick={onRequestCampusOpen}
              className="easehub-btn-tactile"
              style={{
                padding: '0.85rem 2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-1)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
                e.currentTarget.style.transform = 'translateY(-1.5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0.5px) scale(0.985)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1.5px)';
              }}
            >
              <School size={16} />
              <span>Request for My Campus</span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};
