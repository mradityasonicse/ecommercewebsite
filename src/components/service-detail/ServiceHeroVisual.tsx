import React from 'react';
import { 
  ShieldCheck, 
  SprayCan, 
  Users, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  Home, 
  Shirt, 
  Dumbbell, 
  Wifi, 
  Bike, 
  Wrench 
} from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';

interface ServiceHeroVisualProps {
  service: ServiceDetail;
}

export const ServiceHeroVisual: React.FC<ServiceHeroVisualProps> = ({ service }) => {
  const getLargeIcon = (iconName: string) => {
    const size = 56;
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

  const isRedAccent = service.accentColor === 'red';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '360px',
        backgroundColor: 'var(--color-surface-1, #FFFFFF)',
        border: '1px solid var(--color-border-subtle, #E8E4D5)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-20%',
          width: '320px',
          height: '320px',
          background: isRedAccent
            ? 'radial-gradient(circle, rgba(211, 69, 46, 0.08) 0%, rgba(211, 69, 46, 0) 70%)'
            : 'radial-gradient(circle, rgba(15, 56, 44, 0.05) 0%, rgba(15, 56, 44, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: Verification Standard Badge */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: '#f3fbf5',
            border: '1px solid var(--color-border-subtle, #E8E4D5)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--color-brand-blue, #0F382C)',
          }}
        >
          <ShieldCheck size={14} color="var(--color-brand-blue, #0F382C)" />
          <span>{service.heroVisualBadge}</span>
        </div>

        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted, #6B736D)',
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
          position: 'relative',
          zIndex: 1,
          margin: 'var(--space-6) 0',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        <div
          style={{
            width: '92px',
            height: '92px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: '#f3fbf5',
            border: '1px solid var(--color-border-subtle, #E8E4D5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand-blue, #0F382C)',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {getLargeIcon(service.iconName)}
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted, #6B736D)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            EaseHub Institutional Service Standard
          </div>
          <div style={{ fontSize: '1.45rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', lineHeight: 1.2, margin: '0 0 0.35rem 0' }}>
            {service.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-secondary, #414845)' }}>
            <span style={{ color: '#2E7D32', fontWeight: 600 }}>● Operational</span>
            <span>•</span>
            <span>Direct Student Concierge</span>
          </div>
        </div>
      </div>

      {/* Bottom Triple Live Metric Overlays */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-3)',
          borderTop: '1px solid var(--color-border-subtle, #E8E4D5)',
          paddingTop: 'var(--space-4)',
        }}
      >
        <div style={{ backgroundColor: '#f3fbf5', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle, #E8E4D5)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #6B736D)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <Users size={11} color="var(--color-brand-blue, #0F382C)" />
            <span>Partners</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary, #151D1A)' }}>
            {service.metrics.providersAvailable} Live
          </div>
        </div>

        <div style={{ backgroundColor: '#f3fbf5', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle, #E8E4D5)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #6B736D)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <Clock size={11} color="var(--color-brand-blue, #0F382C)" />
            <span>Turnaround SLA</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)' }}>
            {service.metrics.avgDeliveryTime}
          </div>
        </div>

        <div style={{ backgroundColor: '#f3fbf5', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle, #E8E4D5)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #6B736D)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <CheckCircle2 size={11} color="#2E7D32" />
            <span>Satisfaction</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: '#2E7D32' }}>
            {service.metrics.studentSatisfaction}
          </div>
        </div>
      </div>
    </div>
  );
};
