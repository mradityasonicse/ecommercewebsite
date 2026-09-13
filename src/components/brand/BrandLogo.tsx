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
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Official Brand Logo Mark */}
      <img
        src={easehubMark}
        alt="EaseHub Logo"
        onError={(e) => {
          if (e.currentTarget.src !== window.location.origin + '/easehub-mark.png') {
            e.currentTarget.src = '/easehub-mark.png';
          }
        }}
        style={{
          height: `${markHeight}px`,
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.45)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35))',
        }}
      />

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
              letterSpacing: '-0.03em',
              fontWeight: 800,
              fontSize: isMobile ? '1.2rem' : isFooter ? '1.45rem' : '1.35rem',
              lineHeight: 1,
            }}
          >
            <span style={{ color: '#FFFFFF' }}>EASE</span>
            <span style={{ color: 'var(--color-brand-green, #59A83E)' }}>HUB</span>
          </div>

          {shouldShowTagline && (
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 700,
                letterSpacing: '0.09em',
                color: 'var(--color-brand-gold, #FAC908)',
                textTransform: 'uppercase',
                marginTop: '3px',
                lineHeight: 1,
              }}
            >
              PG • Laundry • Mess
            </span>
          )}
        </div>
      )}
    </a>
  );
};
