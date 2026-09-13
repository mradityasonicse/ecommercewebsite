import React from 'react';
import { Layers } from 'lucide-react';
import type { Service } from '../../types/service';
import { ServiceCard } from '../discovery/ServiceCard';

interface RelatedServicesProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export const RelatedServices: React.FC<RelatedServicesProps> = ({
  services,
  onSelectService,
}) => {
  if (!services || services.length === 0) return null;

  return (
    <section
      aria-label="Related Campus Services"
      style={{
        padding: 'var(--space-16) 0',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-10)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <Layers size={13} color="#FFFFFF" />
          <span>Ecosystem Synergy</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Frequently Paired Services.
        </h2>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Students using this service also bundle these complementary campus essentials.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {services.map((srv) => (
          <ServiceCard
            key={srv.id}
            service={srv}
            onSelectService={onSelectService}
          />
        ))}
      </div>
    </section>
  );
};
