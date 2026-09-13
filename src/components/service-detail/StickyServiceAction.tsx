import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';

interface StickyServiceActionProps {
  service: ServiceDetail;
  onActionClick: () => void;
}

export const StickyServiceAction: React.FC<StickyServiceActionProps> = ({
  service,
  onActionClick,
}) => {
  return (
    <>
      {/* Mobile Sticky Bottom CTA Bar */}
      <div
        className="mobile-sticky-cta"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: 'rgba(251, 249, 241, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--color-border-subtle, #E8E4D5)',
          padding: '0.75rem 1.25rem',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 -4px 16px rgba(15, 56, 44, 0.08)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #6B736D)', display: 'block' }}>Student Rate</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary, #151D1A)' }}>
              {service.startingPrice}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted, #6B736D)' }}>
              /{service.pricingUnit.replace('per ', '')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onActionClick}
          style={{
            flex: 1,
            padding: '0.75rem 1.4rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-brand-blue, #0F382C)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.88rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span>Choose Plan</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-sticky-cta {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
