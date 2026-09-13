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
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SERVICES_NAV_ITEMS, type ServiceNavItem } from '../../config/navigation';

export interface ServicesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (serviceId: string) => void;
}

export const ServicesMenu: React.FC<ServicesMenuProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string) => {
    const props = { size: 18, color: 'var(--color-brand-blue)' };
    switch (iconName) {
      case 'Utensils': return <Utensils {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Shirt': return <Shirt {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Bike': return <Bike {...props} />;
      case 'Wifi': return <Wifi {...props} />;
      case 'SprayCan':
      case 'Sparkles': return <SprayCan {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      default: return <ShieldCheck {...props} />;
    }
  };

  const handleItemClick = (service: ServiceNavItem) => {
    onClose();
    if (onSelectService) {
      onSelectService(service.id);
    } else {
      const el = document.getElementById('services') || document.getElementById('discovery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      role="region"
      aria-label="Campus Services Menu"
      className="easehub-services-menu"
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '680px',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-5)',
        zIndex: 9950,
      }}
      onMouseLeave={onClose}
    >
      {/* Header Eyebrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--space-3)',
          borderBottom: '1px solid var(--color-border-subtle)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-eyebrow)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-brand-blue)',
          }}
        >
          Verified Campus Ecosystem
        </span>
        <span
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-muted)',
          }}
        >
          All 8 Living Pillars Integrated
        </span>
      </div>

      {/* 2-Column Scannable Grid of 8 Services */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 'var(--space-2)',
        }}
      >
        {SERVICES_NAV_ITEMS.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => handleItemClick(service)}
            className="services-menu-item"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-3)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              {renderIcon(service.iconName)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-body-xs)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {service.name.split('&')[0].trim()}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-blue-light)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}
                >
                  from {service.startingPrice}
                </span>
              </div>
              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.35,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {service.shortDesc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Explorer Bar */}
      <div
        style={{
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
          Fixed student rate cards • Zero deposit brokerage
        </span>
        <button
          type="button"
          onClick={() => {
            onClose();
            const el = document.getElementById('services');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.hash = 'catalog';
            }
          }}
          className="easehub-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-brand-blue)',
            fontSize: 'var(--text-body-xs)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '2px 4px',
          }}
        >
          <span>Explore all 8 pillars</span>
          <span className="easehub-btn-icon-right"><ArrowRight size={13} /></span>
        </button>
      </div>
    </div>
  );
};
