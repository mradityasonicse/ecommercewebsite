import React from 'react';

interface LoadingStateProps {
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 6 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <div
      aria-label="Loading available services..."
      aria-busy="true"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--space-6)',
        paddingTop: 'var(--space-6)',
        paddingBottom: 'var(--space-12)',
      }}
    >
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          className="skeleton-card"
        >
          <div>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} className="skeleton-pulse" />
              <div style={{ width: '80px', height: '20px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} className="skeleton-pulse" />
            </div>

            {/* Badge bar */}
            <div style={{ width: '120px', height: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.04)', marginBottom: '0.6rem' }} className="skeleton-pulse" />

            {/* Title */}
            <div style={{ width: '80%', height: '24px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.06)', marginBottom: '0.8rem' }} className="skeleton-pulse" />

            {/* Description lines */}
            <div style={{ width: '100%', height: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.04)', marginBottom: '0.4rem' }} className="skeleton-pulse" />
            <div style={{ width: '65%', height: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.04)', marginBottom: 'var(--space-4)' }} className="skeleton-pulse" />

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: '50px', height: '18px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.03)' }} className="skeleton-pulse" />
              <div style={{ width: '60px', height: '18px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.03)' }} className="skeleton-pulse" />
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '70px', height: '24px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} className="skeleton-pulse" />
            <div style={{ width: '90px', height: '20px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} className="skeleton-pulse" />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes pulseSkeleton {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .skeleton-pulse {
          animation: pulseSkeleton 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
