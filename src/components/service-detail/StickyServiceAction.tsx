import React from 'react';
import { ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ServiceDetail, ServiceOption } from '../../types/serviceDetail';

interface StickyServiceActionProps {
  service: ServiceDetail;
  selectedOption?: ServiceOption | null;
  onActionClick: () => void;
}

export const StickyServiceAction: React.FC<StickyServiceActionProps> = ({
  service,
  selectedOption,
  onActionClick,
}) => {
  const isAvailable = service.availabilityStatus !== 'unavailable';

  const displayPrice = selectedOption
    ? `${selectedOption.price.currency}${selectedOption.price.amount?.toLocaleString() ?? service.startingPrice}`
    : service.startingPrice;

  const displayPeriod = selectedOption
    ? selectedOption.price.period
    : service.pricingUnit;

  return (
    <>
      {/* Mobile Sticky Bottom CTA Bar (< 1024px) */}
      <div
        className="mobile-sticky-cta"
        role="region"
        aria-label="Mobile booking action"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-border-subtle)',
          padding: '0.75rem 1.25rem calc(0.75rem + env(safe-area-inset-bottom, 0px)) 1.25rem',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 -4px 16px rgba(59, 130, 246, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {selectedOption ? selectedOption.name : 'Student Rate'}
            </span>
            {isAvailable ? (
              <ShieldCheck size={11} color="#2E7D32" />
            ) : (
              <AlertTriangle size={11} color="#D97706" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
              {displayPrice}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              /{displayPeriod?.replace('per ', '')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onActionClick}
          disabled={!isAvailable}
          style={{
            flex: 1,
            maxWidth: '220px',
            minHeight: '48px',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: isAvailable ? 'var(--color-brand-blue)' : '#9CA3AF',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            boxShadow: isAvailable ? 'var(--shadow-sm)' : 'none',
          }}
        >
          <span>{isAvailable ? (selectedOption ? 'Request Plan' : 'Select Plan') : 'At Capacity'}</span>
          {isAvailable && <ArrowRight size={15} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-sticky-cta {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
