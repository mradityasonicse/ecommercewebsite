import React from 'react';
import {
  Utensils,
  Home,
  Shirt,
  Dumbbell,
  Bike,
  Wifi,
  SprayCan,
  Wrench,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import type { EcosystemService } from '../../../data/services';

export interface HeroServiceNodeProps {
  service: EcosystemService;
  onClick?: (serviceId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const HeroServiceNode: React.FC<HeroServiceNodeProps> = ({
  service,
  onClick,
  className = '',
  style = {},
}) => {
  const renderIcon = (iconName: string) => {
    const iconProps = { size: 18, color: 'var(--color-brand-blue)' };
    switch (iconName) {
      case 'Utensils': return <Utensils {...iconProps} />;
      case 'Home': return <Home {...iconProps} />;
      case 'Shirt': return <Shirt {...iconProps} />;
      case 'Dumbbell': return <Dumbbell {...iconProps} />;
      case 'Bike': return <Bike {...iconProps} />;
      case 'Wifi': return <Wifi {...iconProps} />;
      case 'SprayCan':
      case 'Sparkles': return <SprayCan {...iconProps} />;
      case 'Wrench': return <Wrench {...iconProps} />;
      default: return <ShieldCheck {...iconProps} />;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(service.id);
    } else {
      const el = document.getElementById('discovery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Explore ${service.name}`}
      className={`easehub-hero-service-node ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 0.95rem',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--color-text-primary)',
        cursor: 'pointer',
        textAlign: 'left',
        outline: 'none',
        position: 'relative',
        transition: 'transform var(--duration-fast) var(--ease-emphasized), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), background-color var(--duration-fast)',
        userSelect: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border-default)';
        e.currentTarget.style.backgroundColor = 'var(--color-surface-1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Icon Chip */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {renderIcon(service.iconName)}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-body-xs)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
            }}
          >
            {service.name.split('&')[0].trim()}
          </span>
          <ArrowUpRight size={13} color="var(--color-text-muted)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-brand-blue)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
            }}
          >
            from {service.startingPrice}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>•</span>
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px',
            }}
          >
            {service.badgeText.split('+')[0].trim()}
          </span>
        </div>
      </div>
    </button>
  );
};
