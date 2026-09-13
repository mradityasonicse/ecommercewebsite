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
  Users, 
  ShieldCheck
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
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#4ADE80',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
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
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#FBBF24',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FBBF24' }} />
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
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--color-brand-red)',
              backgroundColor: 'rgba(255, 43, 43, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  const isFeatured = service.isFeatured;

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
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: isFeatured ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
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
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = isFeatured ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-border-subtle)';
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
            marginBottom: 'var(--space-4)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isFeatured ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: service.accentColor === 'red' ? 'var(--color-brand-red)' : '#FFFFFF',
            }}
          >
            {getIcon(service.iconName, 20)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {renderAvailabilityBadge(service.availabilityStatus)}
            {isFeatured && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                }}
              >
                ★ Featured
              </span>
            )}
          </div>
        </div>

        {/* Badge & Title */}
        <div
          style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)',
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <ShieldCheck size={13} color="var(--color-brand-blue)" />
          <span>{service.badgeText}</span>
        </div>

        <h3
          style={{
            fontSize: '1.2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 var(--space-2) 0',
            lineHeight: 1.25,
          }}
        >
          {service.name}
        </h3>

        <p
          style={{
            fontSize: '0.86rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            margin: '0 0 var(--space-4) 0',
          }}
        >
          {service.shortDescription}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: 'var(--space-4)' }}>
          {service.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Pricing */}
        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>Student Rate</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF' }}>
              {service.startingPrice}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              /{service.pricingUnit.replace('per ', '')}
            </span>
          </div>
        </div>

        {/* Metrics & CTA */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', justifyContent: 'flex-end', marginBottom: '0.2rem' }}>
            <Users size={12} />
            <span>{service.metrics.providersAvailable} providers</span>
          </div>

          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-blue-light)',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <span>Explore Options</span>
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </article>
  );
};
