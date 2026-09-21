import React from 'react';
import { 
  ShieldCheck, 
  SprayCan, 
  Clock, 
  Utensils, 
  Home, 
  Shirt, 
  Dumbbell, 
  Wifi, 
  Bike, 
  Wrench,
  MapPin,
  Layers
} from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';

interface ServiceHeroVisualProps {
  service: ServiceDetail;
}

export const ServiceHeroVisual: React.FC<ServiceHeroVisualProps> = ({ service }) => {
  const getLargeIcon = (iconName: string) => {
    const size = 52;
    switch (iconName) {
      case 'Utensils': return <Utensils size={size} />;
      case 'Home': return <Home size={size} />;
      case 'Shirt': return <Shirt size={size} />;
      case 'Dumbbell': return <Dumbbell size={size} />;
      case 'Wifi': return <Wifi size={size} />;
      case 'Bike': return <Bike size={size} />;
      case 'SprayCan':
      case 'Sparkles': return <SprayCan size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      default: return <ShieldCheck size={size} />;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '340px',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top Bar: Verification Standard Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--color-brand-blue)',
          }}
        >
          <ShieldCheck size={14} color="var(--color-brand-blue)" />
          <span>{service.heroVisualBadge}</span>
        </div>

        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Campus Gate Perimeter
        </span>
      </div>

      {/* Central Visual Icon / Identity Framing */}
      <div
        style={{
          margin: 'var(--space-6) 0',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand-blue)',
            flexShrink: 0,
          }}
        >
          {getLargeIcon(service.iconName)}
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            EaseHub Institutional Service Standard
          </div>
          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.25, margin: '0 0 0.35rem 0' }}>
            {service.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>● Active Service</span>
            <span>•</span>
            <span>Direct Student Concierge</span>
          </div>
        </div>
      </div>

      {/* Bottom Triple Supported Specifications */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-3)',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-4)',
        }}
      >
        <div style={{ backgroundColor: 'var(--color-surface-2)', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <Layers size={11} color="var(--color-brand-blue)" />
            <span>Category</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {service.category.toUpperCase().replace('-', ' & ')}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-2)', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <Clock size={11} color="var(--color-brand-blue)" />
            <span>Turnaround SLA</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {service.metrics?.avgDeliveryTime || 'Standard'}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-2)', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <MapPin size={11} color="var(--color-brand-blue)" />
            <span>Coverage</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            1.5 km Radius
          </div>
        </div>
      </div>
    </div>
  );
};
