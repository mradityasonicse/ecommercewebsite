import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CreditCard, 
  Layers 
} from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';
import type { Campus } from '../../data/campuses';

interface ServiceSummaryProps {
  service: ServiceDetail;
  activeCampus: Campus;
}

export const ServiceSummary: React.FC<ServiceSummaryProps> = ({ service, activeCampus }) => {
  const summaryFacts = [
    {
      icon: <Layers size={18} color="var(--color-brand-blue)" />,
      label: 'Category Pillar',
      value: service.category.toUpperCase().replace('-', ' & '),
    },
    {
      icon: <Clock size={18} color="var(--color-brand-blue)" />,
      label: 'Turnaround SLA',
      value: service.metrics.avgDeliveryTime,
    },
    {
      icon: <MapPin size={18} color="var(--color-brand-blue)" />,
      label: 'Campus Perimeter',
      value: `1.5 km of ${activeCampus.shortName}`,
    },
    {
      icon: <CreditCard size={18} color="var(--color-brand-blue)" />,
      label: 'Rate Guarantee',
      value: `From ${service.startingPrice} ${service.pricingUnit}`,
    },
    {
      icon: <ShieldCheck size={18} color="var(--color-brand-blue)" />,
      label: 'Audit Standard',
      value: service.badgeText,
    },
  ];

  return (
    <section
      aria-label="Service Specifications and Summary"
      style={{
        padding: 'var(--space-10) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {summaryFacts.map((fact, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              {fact.icon}
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {fact.label}
              </span>
            </div>
            <div style={{ fontSize: '0.98rem', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {fact.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
