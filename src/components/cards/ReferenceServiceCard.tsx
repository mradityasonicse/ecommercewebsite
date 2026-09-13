import React, { useState } from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';
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
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: '16px',
        border: `1px solid ${isHovered ? 'var(--color-border-hover)' : 'var(--color-border-subtle)'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHovered
          ? '0 14px 32px -6px rgba(0, 0, 0, 0.55), 0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px -2px rgba(0, 0, 0, 0.35)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
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
          backgroundColor: 'var(--color-surface-2)',
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

        {/* Top-Right Pill Badge (MALE / FEMALE / UNISEX / VEG / NON-VEG) */}
        {item.badge && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'var(--color-surface-glass)',
              backdropFilter: 'blur(8px)',
              borderRadius: '9999px',
              padding: '4px 12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-display, sans-serif)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color:
                  item.badgeVariant === 'female'
                    ? '#F43F5E'
                    : item.badgeVariant === 'male'
                    ? 'var(--color-brand-blue)'
                    : 'var(--color-brand-gold)',
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
              fontSize: '1.15rem',
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: '0 0 0.5rem 0',
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
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
              color: 'var(--color-text-secondary)',
              fontSize: '0.86rem',
              lineHeight: 1.45,
              marginBottom: '0.75rem',
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
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '6px',
                    padding: '2px 7px',
                  }}
                >
                  <CheckCircle2 size={11} color="#58A940" />
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
            borderTop: '1px solid var(--color-border-subtle)',
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
                fontSize: '0.74rem',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                lineHeight: 1,
                marginBottom: '2px',
              }}
            >
              Starts from
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display, sans-serif)',
                  color: 'var(--color-brand-gold)',
                  lineHeight: 1.1,
                }}
              >
                {item.priceText}
              </span>
              {item.periodText && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 500,
                  }}
                >
                  {item.periodText.replace('per ', '/')}
                </span>
              )}
            </div>
          </div>

          {/* Right: Two Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {/* WhatsApp Outline Button */}
            <button
              type="button"
              onClick={handleWhatsApp}
              aria-label={`Inquire about ${item.name} on WhatsApp`}
              className="easehub-btn-tactile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: '1.5px solid #22C55E',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#22C55E',
                borderRadius: '8px',
                padding: '0.48rem 0.85rem',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.25)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0.5px) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
            >
              <span>WhatsApp</span>
            </button>

            {/* Book Now Solid Button */}
            <button
              type="button"
              onClick={() => onBookNow(item)}
              aria-label={`Book ${item.name} now`}
              className="easehub-btn-tactile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: 'none',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.52rem 0.95rem',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.25)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0.5px) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
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
