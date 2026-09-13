import React from 'react';
import type { Campus } from '../../../data/campuses';
import { SearchBar } from '../../ui/SearchBar';
import { HeroCTA } from './HeroCTA';

export interface HeroContentProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onExploreServices?: () => void;
  onGetStarted?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  selectedCampus,
  onCampusChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onExploreServices,
  onGetStarted,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`easehub-hero-content ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '920px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
        ...style,
      }}
    >
      {/* 1. Contextual Eyebrow */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-default)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-eyebrow)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-text-secondary)',
          }}
        >
          PG • LAUNDRY • MESS • &amp; MORE
        </span>
      </div>

      {/* 2. Dominant Editorial Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-display-lg)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-5) 0',
          maxWidth: '860px',
        }}
      >
        Everything Students Need.{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #0F382C 0%, #164E3E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          In One Place.
        </span>
      </h1>

      {/* 3. Concise Supporting Statement */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-lg)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.65,
          maxWidth: '680px',
          margin: '0 0 var(--space-8) 0',
          fontWeight: 400,
        }}
      >
        From verified mess food and zero-brokerage stays to smart laundry, gym passes, and campus transit — EaseHub unifies your everyday university life in one trusted ecosystem.
      </p>

      {/* 4. Real-time Campus Search Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          marginBottom: 'var(--space-6)',
        }}
      >
        <SearchBar
          query={searchQuery}
          onQueryChange={onSearchChange}
          selectedCampus={selectedCampus}
          onCampusChange={onCampusChange}
          onSearchSubmit={onSearchSubmit}
          variant="hero"
          placeholder={`Search verified food, PGs, laundry in ${selectedCampus.shortName}...`}
        />
      </div>

      {/* 5. CTAs & Status */}
      <HeroCTA
        selectedCampus={selectedCampus}
        onExploreServices={onExploreServices}
        onGetStarted={onGetStarted}
      />

      {/* 6. Instant Knowledge Value Strip — Fast Scannability */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          marginTop: 'var(--space-6)',
          padding: '0.65rem 1.25rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
          <span style={{ color: 'var(--color-semantic-success)', fontWeight: 800 }}>✓</span>
          <span>Zero Brokerage Stays</span>
        </div>
        <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--color-border-subtle)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
          <span style={{ color: 'var(--color-semantic-success)', fontWeight: 800 }}>✓</span>
          <span>Audited Daily Mess</span>
        </div>
        <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--color-border-subtle)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
          <span style={{ color: 'var(--color-semantic-success)', fontWeight: 800 }}>✓</span>
          <span>Doorstep Laundry</span>
        </div>
        <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--color-border-subtle)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
          <span style={{ color: 'var(--color-semantic-success)', fontWeight: 800 }}>✓</span>
          <span>100% Police & FSSAI Verified</span>
        </div>
      </div>
    </div>
  );
};
