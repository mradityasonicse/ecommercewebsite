import React from 'react';
import { ShieldCheck, ArrowRight, MapPin } from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';
import type { Campus } from '../../data/campuses';
import { ServiceHeroVisual } from './ServiceHeroVisual';

interface ServiceHeroProps {
  service: ServiceDetail;
  activeCampus: Campus;
  onExploreOptions: () => void;
  onViewProviders: () => void;
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({
  service,
  activeCampus,
  onExploreOptions,
  onViewProviders,
}) => {
  const isRed = service.accentColor === 'red';

  return (
    <section
      aria-label={`${service.name} Overview`}
      style={{
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-16)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: 'var(--space-12)',
          alignItems: 'center',
        }}
        className="service-hero-grid"
      >
        {/* Left Column: Editorial Hierarchy */}
        <div>
          {/* Category & Status Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isRed ? 'var(--color-brand-red)' : '#FFFFFF',
                backgroundColor: isRed ? 'rgba(255, 43, 43, 0.1)' : 'rgba(255, 255, 255, 0.08)',
                border: isRed ? '1px solid rgba(255, 43, 43, 0.25)' : '1px solid rgba(255, 255, 255, 0.18)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              {service.category.toUpperCase().replace('-', ' & ')}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <MapPin size={13} color="var(--color-brand-blue)" />
              <span>Available around <strong>{activeCampus.name}</strong></span>
            </div>
          </div>

          {/* Headline & Tagline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              fontFamily: 'var(--font-serif, "Domine", serif)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            {service.name}
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 1.4vw, 1.25rem)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              color: 'var(--color-brand-blue)',
              lineHeight: 1.4,
              margin: '0 0 var(--space-4) 0',
            }}
          >
            {service.tagline}
          </p>

          <p
            style={{
              fontSize: '0.96rem',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              margin: '0 0 var(--space-8) 0',
              maxWidth: '560px',
            }}
          >
            {service.fullDescription}
          </p>

          {/* Verified Price Anchor */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              marginBottom: 'var(--space-8)',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              width: 'max-content',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Student Rate Card:
            </span>
            <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              From {service.startingPrice}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              {service.pricingUnit}
            </span>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onExploreOptions}
              style={{
                padding: '0.85rem 1.8rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-brand-blue)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--duration-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              <span>Explore Plan Options</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={onViewProviders}
              style={{
                padding: '0.85rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                e.currentTarget.style.color = 'var(--color-brand-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              <ShieldCheck size={16} color="var(--color-brand-blue)" />
              <span>Verified Providers</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset */}
        <div>
          <ServiceHeroVisual service={service} />
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .service-hero-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-8) !important;
          }
        }
      `}</style>
    </section>
  );
};
