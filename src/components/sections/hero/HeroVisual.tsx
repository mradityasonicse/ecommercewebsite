import React, { useState, useEffect, useRef } from 'react';
import { ECOSYSTEM_SERVICES } from '../../../data/services';
import { HeroServiceNode } from './HeroServiceNode';

export interface HeroVisualProps {
  onSelectService?: (serviceId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({
  onSelectService,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Subtle, restrained desktop cursor parallax (max 6px)
  useEffect(() => {
    let animFrame: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || window.innerWidth < 1024) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Clamped to [-6, 6] pixels
      const clampedX = Math.max(-6, Math.min(6, deltaX * 6));
      const clampedY = Math.max(-6, Math.min(6, deltaY * 6));

      animFrame = requestAnimationFrame(() => {
        setMouseOffset({ x: clampedX, y: clampedY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`easehub-hero-visual ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1180px',
        margin: 'var(--space-12) auto 0 auto',
        padding: 'var(--space-6) var(--space-4)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Subtle Background Radial Aura */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '540px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.05) 0%, rgba(5, 5, 5, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Central EaseHub Focal Beacon (Desktop View) */}
      <div
        className="easehub-central-core"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${mouseOffset.x * 0.4}px), calc(-50% + ${mouseOffset.y * 0.4}px))`,
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.65rem 1.1rem',
          backgroundColor: '#0F382C',
          border: '1px solid #164E3E',
          borderRadius: 'var(--radius-pill)',
          boxShadow: '0 8px 32px rgba(15, 56, 44, 0.25)',
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.7)',
            }}
            className="animate-pulse-dot"
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-body-xs)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
            }}
          >
            EaseHub Core Platform
          </span>
        </div>
        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
          8 Verified Service Signals Active
        </span>
      </div>

      {/* Desktop & Tablet Constellation Grid (8 Service Nodes) */}
      <div
        className="easehub-service-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 'var(--space-4)',
          position: 'relative',
          zIndex: 3,
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {ECOSYSTEM_SERVICES.map((service) => (
          <HeroServiceNode
            key={service.id}
            service={service}
            onClick={onSelectService}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .easehub-central-core {
            display: none !important;
          }
          .easehub-service-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            transform: none !important;
          }
        }

        @media (max-width: 639px) {
          .easehub-service-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            gap: var(--space-3) !important;
          }
        }
      `}</style>
    </div>
  );
};
