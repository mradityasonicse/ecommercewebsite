import React from 'react';
import { Navigation, School } from 'lucide-react';
import type { Campus } from '../../data/campuses';
import type { ServiceDetail } from '../../types/serviceDetail';

interface ServiceLocationProps {
  service: ServiceDetail;
  activeCampus: Campus;
}

export const ServiceLocation: React.FC<ServiceLocationProps> = ({ service, activeCampus }) => {
  return (
    <section
      aria-label="Campus Location & Delivery Coverage"
      style={{
        padding: 'var(--space-16) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-8)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.16)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: 'var(--color-brand-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <School size={13} color="var(--color-brand-blue)" />
          <span>Local Geofence</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Operating Around {activeCampus.shortName}.
        </h2>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          All verified providers for this service maintain active operations within 1.5 km of your university gates to ensure rapid arrival and delivery.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-brand-blue)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Hub Operations Base
          </div>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 var(--space-3) 0' }}>
            {activeCampus.hubLocation}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 var(--space-4) 0' }}>
            Direct access points established at main university gates, hostel cluster corridors, and local student residential colonies.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-brand-blue)' }}>
            <Navigation size={14} />
            <span>Average transit to your room: <strong>{service.metrics.avgDeliveryTime}</strong></span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-2)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Covered University Zones:
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-brand-blue)' }}>•</span>
              <span>All On-Campus Hostels & Residential Halls</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-brand-blue)' }}>•</span>
              <span>Off-Campus PGs & Student Apartments within 1.5 km</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-brand-blue)' }}>•</span>
              <span>Campus Gate 1, 2, & Main Transit Corridors</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
