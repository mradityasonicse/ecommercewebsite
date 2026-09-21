import React from 'react';
import { 
  Utensils, 
  Home, 
  Shirt, 
  Dumbbell, 
  Wifi, 
  Bike, 
  SprayCan, 
  Wrench, 
  ArrowUpRight, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import type { Service, AvailabilityStatus } from '../../types/service';

interface ServiceCardProps {
  service: Service;
  onSelectService: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectService }) => {
  const getIcon = (iconName: string, size = 20) => {
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

  const renderAvailabilityBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: 'var(--text-status)',
              fontFamily: 'var(--font-family-status)',
              fontWeight: 700,
              color: 'var(--color-brand-green, #10B981)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Available Now
          </span>
        );
      case 'limited':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: 'var(--text-status)',
              fontFamily: 'var(--font-family-status)',
              fontWeight: 700,
              color: 'var(--color-brand-gold, #FAC908)',
              backgroundColor: 'rgba(250, 201, 8, 0.12)',
              border: '1px solid rgba(250, 201, 8, 0.25)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FAC908' }} />
            Limited Slots
          </span>
        );
      case 'coming_soon':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: 'var(--text-status)',
              fontFamily: 'var(--font-family-status)',
              fontWeight: 700,
              color: 'var(--color-brand-red, #EF4444)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
            }}
          >
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <article
      onClick={() => onSelectService(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectService(service);
        }
      }}
      aria-label={`${service.name}, starting from ${service.startingPrice} ${service.pricingUnit}`}
      className="easehub-card-interactive"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast)',
        minHeight: '280px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div>
        {/* Top Meta Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: service.accentColor === 'red' ? 'var(--color-brand-red)' : 'var(--color-brand-blue)',
            }}
          >
            {getIcon(service.iconName, 20)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {renderAvailabilityBadge(service.availabilityStatus)}
          </div>
        </div>

        {/* Verification Badge */}
        <div
          style={{
            fontSize: 'var(--text-status)',
            fontFamily: 'var(--font-family-status)',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            marginBottom: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            letterSpacing: 'var(--tracking-uppercase)',
            textTransform: 'uppercase',
          }}
        >
          <ShieldCheck size={13} color="var(--color-brand-blue)" />
          <span>{service.badgeText}</span>
        </div>

        {/* Service Title */}
        <h3
          style={{
            fontSize: 'var(--text-h3)',
            fontFamily: 'var(--font-family-h3)',
            fontWeight: 'var(--weight-h3)',
            color: 'var(--color-text-primary)',
            margin: '0 0 0.5rem 0',
            lineHeight: 'var(--leading-h3)',
            letterSpacing: 'var(--tracking-h3)',
            textWrap: 'balance',
          }}
        >
          {service.name}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            fontFamily: 'var(--font-family-body-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-body-sm)',
            margin: '0 0 1rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {service.shortDescription}
        </p>

        {/* Popular Feature Bullets */}
        {service.popularFeatures && service.popularFeatures.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {service.popularFeatures.slice(0, 3).map((feat, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 'var(--text-caption)',
                  fontFamily: 'var(--font-family-caption)',
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-surface-2)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {feat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer Details */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Pricing Model */}
        <div>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', display: 'block' }}>
            Starting Rate
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-family-body)', fontWeight: 700, color: 'var(--color-brand-gold)' }}>
              {service.startingPrice}
            </span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
              /{service.pricingUnit.replace('per ', '')}
            </span>
          </div>
        </div>

        {/* Operational turnaround time or Action */}
        <div style={{ textAlign: 'right' }}>
          {service.metrics?.avgDeliveryTime && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-muted)',
                justifyContent: 'flex-end',
                marginBottom: '0.25rem',
              }}
            >
              <Clock size={12} />
              <span>{service.metrics.avgDeliveryTime}</span>
            </div>
          )}

          <div
            style={{
              fontSize: 'var(--text-button)',
              color: 'var(--color-brand-blue)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span>Explore Options</span>
            <ArrowUpRight size={15} />
          </div>
        </div>
      </div>
    </article>
  );
};
