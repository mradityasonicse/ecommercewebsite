import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { Campus } from '../../../data/campuses';

export interface HeroCTAProps {
  selectedCampus: Campus;
  onExploreServices?: () => void;
  onGetStarted?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({
  selectedCampus,
  onExploreServices,
  onGetStarted,
  className = '',
  style = {},
}) => {
  const handleExplore = () => {
    if (onExploreServices) {
      onExploreServices();
    } else {
      const el = document.getElementById('discovery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      const el = document.getElementById('bundles');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`easehub-hero-cta-group ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        width: '100%',
        ...style,
      }}
    >
      {/* Primary & Secondary CTAs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={handleExplore}
          icon={<ArrowRight size={18} />}
          style={{
            minWidth: '180px',
          }}
        >
          Explore Services
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleGetStarted}
          icon={<ChevronRight size={16} />}
          style={{
            minWidth: '160px',
          }}
        >
          Get Started
        </Button>
      </div>

      {/* Verified Live Campus Status Cue */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: 'var(--text-caption)',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-brand-red)',
            display: 'inline-block',
            boxShadow: '0 0 6px var(--color-brand-red)',
          }}
          className="animate-pulse-dot"
        />
        <span>
          <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedCampus.shortName} Hub</strong> is Live • {selectedCampus.activeProviders} Verified Local Partners
        </span>
      </div>
    </div>
  );
};
