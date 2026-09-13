import { Compass, MapPin, School } from 'lucide-react';
import { Container } from '../primitives/Container';
import type { Campus } from '../../data/campuses';

interface DiscoveryHeaderProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen: () => void;
}

export const DiscoveryHeader: React.FC<DiscoveryHeaderProps> = ({
  selectedCampus,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-8)',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(8, 10, 15, 0) 100%)',
      }}
    >
      <Container variant="wide">
        <div style={{ maxWidth: '820px' }}>
          {/* Breadcrumb / Context Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Compass size={14} color="#FFFFFF" />
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Campus Living Marketplace
            </span>
          </div>

          {/* Editorial Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            Everything you need.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-brand-blue) 0%, #60A5FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Right where you need it.
            </span>
          </h1>

          {/* Editorial Supporting Copy */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              margin: '0 0 var(--space-6) 0',
              maxWidth: '680px',
            }}
          >
            Explore everyday services designed around student life. Audited meal plans, zero-brokerage housing, doorstep laundry, and emergency repairs—verified for your campus.
          </p>

          {/* Location / Campus Context Indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.45rem 0.9rem',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-blue-light)' }}>
              <School size={16} color="var(--color-brand-blue)" />
              <span style={{ fontWeight: 600 }}>Active Campus:</span>
            </div>

            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>
              {selectedCampus.name}
            </span>

            <span style={{ color: 'var(--color-text-muted)' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
              <MapPin size={13} color="var(--color-text-muted)" />
              <span>{selectedCampus.hubLocation}</span>
            </div>

            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: '#4ADE80',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
              }}
            >
              {selectedCampus.activeProviders} Verified Partners
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};
