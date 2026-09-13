import React from 'react';
import { ShieldCheck, MapPin, Star, ArrowUpRight } from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';
import type { Campus } from '../../data/campuses';
import { PROVIDERS, type Provider } from '../../data/providers';

interface ServiceProviderSectionProps {
  service: ServiceDetail;
  activeCampus: Campus;
  onSelectProvider: (provider: Provider) => void;
}

export const ServiceProviderSection: React.FC<ServiceProviderSectionProps> = ({
  service,
  activeCampus,
  onSelectProvider,
}) => {
  // Find providers matching this service and campus
  const matchingProviders = PROVIDERS.filter(
    p => p.serviceId === service.id && (p.campusId === activeCampus.id || p.campusId === 'campus-hub')
  );

  if (matchingProviders.length === 0) return null;

  return (
    <section
      id="providers"
      aria-label="Verified Campus Service Providers"
      style={{
        padding: 'var(--space-16) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-12)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(15, 56, 44, 0.06)',
            border: '1px solid rgba(15, 56, 44, 0.16)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: 'var(--color-brand-blue, #0F382C)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <ShieldCheck size={13} color="var(--color-brand-blue, #0F382C)" />
          <span>Audited Operators</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary, #151D1A)',
            lineHeight: 1.2,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Verified Providers Serving Your Gate.
        </h2>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6, margin: 0 }}>
          Every partner listed below has passed in-person identity verification, hygiene registration audits, and agreed to fixed student rate cards.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {matchingProviders.map((prov) => (
          <div
            key={prov.id}
            onClick={() => onSelectProvider(prov)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectProvider(prov);
              }
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border-subtle, #E8E4D5)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--color-brand-blue, #0F382C)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle, #E8E4D5)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#2E7D32',
                    backgroundColor: '#f3fbf5',
                    border: '1px solid rgba(46, 125, 50, 0.25)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <ShieldCheck size={12} color="#2E7D32" />
                  <span>{prov.verificationBadge}</span>
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--color-text-primary, #151D1A)', fontWeight: 700 }}>
                  <Star size={13} fill="#F8CE37" color="#F8CE37" />
                  <span>{prov.rating}</span>
                  <span style={{ color: 'var(--color-text-muted, #6B736D)', fontWeight: 400 }}>({prov.reviewsCount})</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', margin: '0 0 var(--space-2) 0' }}>
                {prov.name}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.5, margin: '0 0 var(--space-4) 0' }}>
                {prov.bio}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: 'var(--space-4)' }}>
                {prov.tags.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-text-muted, #6B736D)',
                      backgroundColor: '#f3fbf5',
                      border: '1px solid var(--color-border-subtle, #E8E4D5)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--color-border-subtle, #E8E4D5)',
                paddingTop: 'var(--space-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--color-text-muted, #6B736D)' }}>
                <MapPin size={12} color="var(--color-brand-blue, #0F382C)" />
                <span>{prov.distanceFromCampus}</span>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-brand-blue, #0F382C)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Inspect Profile</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
