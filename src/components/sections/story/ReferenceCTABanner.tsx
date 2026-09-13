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
        padding: '5rem 0',
        backgroundColor: '#0F382C', // EaseHub Deep Pine / Emerald Anchor
        background: 'linear-gradient(135deg, #0F382C 0%, #164E3E 100%)',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container variant="narrow">
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: 'clamp(2.1rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}
          >
            Ready to Simplify Your College Life?
          </h2>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.88)',
              marginBottom: '2.5rem',
              maxWidth: '560px',
            }}
          >
            Join thousands of students who trust EaseHub for their daily needs
          </p>

          <button
            type="button"
            onClick={handleClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.95rem 2rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              color: '#0F382C',
              fontFamily: 'var(--font-display, inherit)',
              fontWeight: 700,
              fontSize: '1.05rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.18)';
            }}
          >
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  );
};
