import React from 'react';
import { AlertCircle, ArrowLeft, Search, Compass, ShieldAlert } from 'lucide-react';
import { Button } from '../ui';

interface ServiceNotFoundProps {
  slug: string;
  onBackToServices?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const ServiceNotFound: React.FC<ServiceNotFoundProps> = ({
  slug,
  onBackToServices,
  onSelectCategory,
}) => {
  const suggestedPillars = [
    { name: 'Daily Mess & Nutrition', slug: 'mess' },
    { name: 'Hostel & Verified PG', slug: 'hostel-pg' },
    { name: 'Laundry & Fabric Care', slug: 'laundry' },
    { name: 'Campus Shuttle Transit', slug: 'transport' },
    { name: 'Gym & Fitness Access', slug: 'gym-fitness' },
    { name: 'High-Speed Mesh Wi-Fi', slug: 'wifi' },
  ];

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(var(--navbar-height, 72px) + 4rem) var(--space-6) var(--space-20)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      <div style={{ maxWidth: '580px', width: '100%', textAlign: 'center' }}>
        {/* Visual Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#F59E0B',
            marginBottom: 'var(--space-6)',
          }}
        >
          <AlertCircle size={32} />
        </div>

        {/* Status / Category tag */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            Status 404 · Unrecognized Service Slug
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-4)',
          }}
        >
          Service Not Found
        </h1>

        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-8)',
          }}
        >
          The requested service{' '}
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-brand-blue)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              padding: '0.2rem 0.45rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.85em',
            }}
          >
            /services/{slug}
          </code>{' '}
          does not exist in the EaseHub registry or may have been relocated.
        </p>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-10)',
          }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowLeft size={16} />}
            iconPosition="left"
            onClick={() => {
              if (onBackToServices) onBackToServices();
              else window.location.hash = '#services';
            }}
          >
            Back to All Services
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<Search size={16} />}
            iconPosition="left"
            onClick={() => {
              window.location.hash = '#services';
            }}
          >
            Open Discovery Catalog
          </Button>
        </div>

        {/* Suggested Pillars */}
        <div
          style={{
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <Compass size={14} color="var(--color-blue-light)" />
            <span>Explore Verified Essential Pillars</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {suggestedPillars.map((pillar) => (
              <button
                key={pillar.slug}
                type="button"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(pillar.slug);
                  } else {
                    window.location.hash = `#services/${pillar.slug}`;
                  }
                }}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'var(--color-blue-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                }}
              >
                {pillar.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ServiceUnavailableProps {
  serviceName: string;
  reason?: string;
  onBackToServices?: () => void;
}

export const ServiceUnavailable: React.FC<ServiceUnavailableProps> = ({
  serviceName,
  reason = 'This service is undergoing scheduled infrastructure updates for this campus.',
  onBackToServices,
}) => {
  return (
    <div
      style={{
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(var(--navbar-height, 72px) + 4rem) var(--space-6) var(--space-20)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#EF4444',
            marginBottom: 'var(--space-6)',
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            Service Notice · Temporarily Unavailable
          </span>
        </div>

        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-3)',
          }}
        >
          {serviceName} Currently Inactive
        </h1>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-8)',
          }}
        >
          {reason}
        </p>

        <Button
          variant="secondary"
          size="md"
          icon={<ArrowLeft size={16} />}
          iconPosition="left"
          onClick={() => {
            if (onBackToServices) onBackToServices();
            else window.location.hash = '#services';
          }}
        >
          Return to Service Catalog
        </Button>
      </div>
    </div>
  );
};

export const ServiceLoadingSkeleton: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 'calc(var(--navbar-height, 72px) + 2rem) var(--space-6) var(--space-20)',
        maxWidth: '1280px',
        margin: '0 auto',
        opacity: 0.7,
      }}
    >
      {/* Breadcrumb Skeleton */}
      <div
        style={{
          height: '20px',
          width: '240px',
          backgroundColor: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-8)',
        }}
      />

      {/* Hero Skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-16)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div
            style={{
              height: '24px',
              width: '120px',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-pill)',
            }}
          />
          <div
            style={{
              height: '48px',
              width: '85%',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <div
            style={{
              height: '20px',
              width: '95%',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <div
            style={{
              height: '20px',
              width: '70%',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-6)',
            }}
          >
            <div style={{ height: '72px', backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ height: '72px', backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ height: '72px', backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>

        <div>
          <div
            style={{
              height: '320px',
              width: '100%',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-xl)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
