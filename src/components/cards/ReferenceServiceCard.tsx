import React, { useState } from 'react';
import { MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import type { CatalogItem } from '../../data/referenceCatalog';

interface ReferenceServiceCardProps {
  item: CatalogItem;
  onBookNow: (item: CatalogItem) => void;
}

export const ReferenceServiceCard: React.FC<ReferenceServiceCardProps> = ({ item, onBookNow }) => {
  const [isHovered, setIsHovered] = useState(false);

  // WhatsApp concierge dispatch URL with pre-filled inquiry text
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = '918102848776';
    const message = `Hello EaseHub! 👋\nI am interested in:\n• Service: ${item.name}\n• Category: ${item.category.toUpperCase()}\n• Price: ${item.priceText} ${item.periodText || ''}\n• Location: ${item.address}, ${item.city}\n\nPlease share current vacancy status and booking details.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="easehub-reference-card easehub-card-interactive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: `1px solid ${isHovered ? '#16A34A' : 'rgba(22, 163, 74, 0.18)'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHovered
          ? '0 20px 40px -8px rgba(15, 81, 50, 0.15), 0 0 20px rgba(22, 163, 74, 0.12)'
          : '0 4px 18px -2px rgba(15, 81, 50, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s ease',
        position: 'relative',
        willChange: 'transform',
      }}
    >
      {/* 1. Header Image Container with Gender / Category Badge */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '215px',
          overflow: 'hidden',
          backgroundColor: '#F8FAF7',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
          }}
        />

        {/* Top-Right Badge (MALE / FEMALE / UNISEX / VEG / NON-VEG) */}
        {item.badge && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: item.badgeVariant === 'female' ? '#FFF1F2' : '#FEF9C3',
              borderRadius: '9999px',
              padding: '3px 11px',
              border: item.badgeVariant === 'female' ? '1px solid #FECDD3' : '1px solid #FDE047',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: item.badgeVariant === 'female' ? '#E11D48' : '#854D0E',
                textTransform: 'uppercase',
              }}
            >
              {item.badge}
            </span>
          </div>
        )}
      </div>

      {/* 2. Card Content Body */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Title */}
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
            {item.name}
          </h3>

          {/* Location Row with Red Pin */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.45rem',
              color: '#334155',
              fontSize: 'var(--text-body-sm)',
              fontFamily: 'var(--font-family-body-sm)',
              lineHeight: 'var(--leading-body-sm)',
              marginBottom: '0.5rem',
              fontWeight: 500,
            }}
          >
            <MapPin
              size={15}
              color="#EF4444"
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <span
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.address}
            </span>
          </div>

          {/* Ecosystem Connection Ribbon (Shows How Services Connect) */}
          <div style={{ marginBottom: '0.75rem' }}>
            {item.category === 'pg' ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#EFF5EC',
                  color: '#15803D',
                  border: '1px solid #86EFAC',
                  borderRadius: '6px',
                  padding: '2px 8px',
                }}
              >
                <span>⚡ Auto-paired with Daily Mess &amp; Doorstep Laundry</span>
              </span>
            ) : item.category === 'meals' ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#FEFCE8',
                  color: '#854D0E',
                  border: '1px solid #FDE047',
                  borderRadius: '6px',
                  padding: '2px 8px',
                }}
              >
                <span>⚡ Warm delivery direct to your PG / Hostel gate</span>
              </span>
            ) : item.category === 'laundry' ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#E0F2FE',
                  color: '#0369A1',
                  border: '1px solid #BAE6FD',
                  borderRadius: '6px',
                  padding: '2px 8px',
                }}
              >
                <span>⚡ Scheduled gate pickup synced with your hostel block</span>
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#F3E8FF',
                  color: '#6B21A8',
                  border: '1px solid #DDD6FE',
                  borderRadius: '6px',
                  padding: '2px 8px',
                }}
              >
                <span>⚡ Included in Campus Saver Bundles</span>
              </span>
            )}
          </div>

          {/* Optional Key Feature Badges */}
          {item.features && item.features.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.35rem',
                marginBottom: '1rem',
              }}
            >
              {item.features.slice(0, 3).map((feat, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#1E293B',
                    backgroundColor: '#F8FAF7',
                    border: '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 8px',
                    lineHeight: 'var(--leading-caption)',
                  }}
                >
                  <CheckCircle2 size={12} color="#16A34A" />
                  {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Bottom Action Row: Starts from Price & WhatsApp + Book Now */}
        <div
          style={{
            paddingTop: '0.9rem',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            rowGap: '0.65rem',
          }}
        >
          {/* Left: Price Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#475569',
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: '3px',
              }}
            >
              Starts from
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                {item.priceText}
              </span>
              {item.periodText && (
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#475569',
                    fontWeight: 600,
                  }}
                >
                  {item.periodText.replace('per ', '/')}
                </span>
              )}
            </div>
          </div>

          {/* Right: Unified Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* WhatsApp Icon Button */}
            <button
              type="button"
              className="easehub-spring-btn"
              onClick={handleWhatsApp}
              aria-label={`Inquire about ${item.name} on WhatsApp`}
              title="Chat with Verified Provider on WhatsApp"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid rgba(22, 163, 74, 0.28)',
                backgroundColor: 'rgba(22, 163, 74, 0.08)',
                color: '#15803D',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.16)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={18} />
            </button>

            {/* Book Now Primary Button */}
            <button
              type="button"
              className="easehub-spring-btn"
              onClick={() => onBookNow(item)}
              aria-label={`Book ${item.name} now`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                border: '1px solid rgba(22, 163, 74, 0.2)',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 22px rgba(22, 163, 74, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(22, 163, 74, 0.35)';
              }}
            >
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
