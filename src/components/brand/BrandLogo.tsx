import React from 'react';
import easehubMark from '../../assets/easehub-mark.png';

export type BrandLogoVariant = 'default' | 'compact' | 'mobile' | 'footer' | 'full' | 'mark-only';

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  href?: string;
  showTagline?: boolean;
  showWordmark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'default',
  href = '#',
  showTagline = true,
  showWordmark = true,
  className = '',
  style = {},
}) => {
  const isMobile = variant === 'mobile';
  const isCompact = variant === 'compact';
  const isFooter = variant === 'footer';
  const isMarkOnly = variant === 'mark-only';

  // Sizing based on placement for crisp visibility of mark and typography
  const markHeight = isMobile ? 32 : isCompact ? 36 : isFooter ? 42 : 38;
  const showText = showWordmark && !isMarkOnly;
  const shouldShowTagline = showTagline && !isFooter && !isCompact && !isMobile && !isMarkOnly;

  return (
    <a
      href={href}
      onClick={(e) => {
        if (href === '#' || href === '' || href === '/') {
          e.preventDefault();
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className={`easehub-brand-logo easehub-brand-${variant} ${className}`}
      aria-label="EASEHUB — PG • LAUNDRY • MESS • & MORE"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '10px',
        textDecoration: 'none',
        outline: 'none',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'transform var(--duration-fast, 150ms) var(--ease-standard)',
        borderRadius: 'var(--radius-sm)',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.015)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Official Brand Logo Mark with Luminous Neon Glow */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            background: 'radial-gradient(circle, rgba(22, 163, 74, 0.3) 0%, rgba(22, 163, 74, 0) 70%)',
            filter: 'blur(6px)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <img
          src={easehubMark}
          alt="EaseHub Logo"
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + '/easehub-mark.png') {
              e.currentTarget.src = '/easehub-mark.png';
            }
          }}
          style={{
            position: 'relative',
            height: `${markHeight}px`,
            width: 'auto',
            display: 'block',
            objectFit: 'contain',
            filter: 'drop-shadow(0 3px 8px rgba(22, 163, 74, 0.2))',
          }}
        />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-0.04em',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '1.25rem' : isFooter ? '1.5rem' : '1.4rem',
              lineHeight: 1,
            }}
          >
            <span
              style={{
                color: '#0F172A',
              }}
            >
              EASE
            </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HUB
            </span>
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '5px',
                background: '#FEF08A',
                border: '1px solid #FDE047',
                color: '#854D0E',
                marginLeft: '6px',
                letterSpacing: '0.06em',
                lineHeight: 1.4,
              }}
            >
              HQ
            </span>
          </div>

          {shouldShowTagline && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '3px',
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  boxShadow: '0 0 6px rgba(22, 163, 74, 0.6)',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                CAMPUS SUPER-APP
              </span>
            </div>
          )}
        </div>
      )}
    </a>
  );
};
