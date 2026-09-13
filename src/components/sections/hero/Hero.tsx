import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Campus } from '../../../data/campuses';
import { HeroContent } from './HeroContent';
import { HeroVisual } from './HeroVisual';
import { Container } from '../../primitives/Container';

export interface HeroProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectService?: (serviceId: string) => void;
  onExploreServices?: () => void;
  onGetStarted?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Hero: React.FC<HeroProps> = ({
  selectedCampus,
  onCampusChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectService,
  onExploreServices,
  onGetStarted,
  className = '',
  style = {},
}) => {
  const handleScrollDown = () => {
    const el = document.getElementById('discovery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      aria-label="EaseHub Hero Experience"
      className={`easehub-hero-section ${className}`}
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(6.5rem, 10vw, 8.5rem)',
        paddingBottom: 'clamp(3.5rem, 6vw, 5rem)',
        backgroundColor: 'var(--color-bg-primary)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border-subtle)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* 1. Fine Technical Architectural Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 35%, #000000 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 35%, #000000 35%, transparent 85%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 2. Controlled Ambient Top Lighting (Proper Photographic Exposure & Luminescence) */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1080px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 40%, rgba(8, 10, 15, 0) 75%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Container variant="wide" style={{ position: 'relative', zIndex: 10 }}>
        {/* Editorial Headline & Search Content */}
        <HeroContent
          selectedCampus={selectedCampus}
          onCampusChange={onCampusChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onExploreServices={onExploreServices}
          onGetStarted={onGetStarted}
        />

        {/* Interactive 8-Service Ecosystem Visual Constellation */}
        <HeroVisual
          onSelectService={onSelectService}
        />

        {/* Minimal Scroll Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 'var(--space-8)',
          }}
        >
          <button
            type="button"
            onClick={handleScrollDown}
            aria-label="Scroll to explore campus services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              padding: '0.4rem 0.6rem',
              transition: 'color var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            <span>Scroll to Explore</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </Container>
    </section>
  );
};
