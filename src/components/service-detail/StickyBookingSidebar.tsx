import React from 'react';
import { ArrowRight, ShieldCheck, MapPin, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { ServiceDetail, ServiceOption } from '../../types/serviceDetail';
import type { Campus } from '../../data/campuses';

interface StickyBookingSidebarProps {
  service: ServiceDetail;
  selectedOption: ServiceOption | null;
  activeCampus: Campus;
  onBook: () => void;
  onScrollToPlans: () => void;
}

export const StickyBookingSidebar: React.FC<StickyBookingSidebarProps> = ({
  service,
  selectedOption,
  activeCampus,
  onBook,
  onScrollToPlans,
}) => {
  const isAvailable = service.availabilityStatus !== 'unavailable';

  // Use selected option pricing if available, otherwise base service pricing
  const displayPrice = selectedOption
    ? `${selectedOption.price.currency}${selectedOption.price.amount?.toLocaleString() ?? service.startingPrice}`
    : service.startingPrice;

  const displayPeriod = selectedOption
    ? selectedOption.price.period
    : service.pricingUnit;

  const billingNote = selectedOption?.price.billingNote || 'Transparent student rate card';

  const snapshotFeatures = selectedOption?.features?.slice(0, 3) || service.inclusions?.slice(0, 3) || [];

  return (
    <aside
      aria-label="Request and Booking Summary"
      className="desktop-sticky-booking-sidebar"
      style={{
        position: 'sticky',
        top: 'calc(var(--navbar-height, 72px) + 1.5rem)',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      {/* Top Meta: Selected Plan / Tier */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-brand-blue)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {selectedOption?.tag || 'Verified Rate'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: isAvailable ? '#2E7D32' : '#D97706', fontWeight: 600 }}>
            {isAvailable ? (
              <>
                <ShieldCheck size={14} color="#2E7D32" />
                <span>Available</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} color="#D97706" />
                <span>At Capacity</span>
              </>
            )}
          </div>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-1) 0',
            lineHeight: 1.3,
          }}
        >
          {selectedOption ? selectedOption.name : service.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <MapPin size={13} color="var(--color-brand-blue)" />
          <span>Serving around <strong>{activeCampus.shortName}</strong></span>
        </div>
      </div>

      {/* Price Block */}
      <div
        style={{
          backgroundColor: '#f8faf9',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-5)',
        }}
      >
        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Student Rate Card
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', margin: '0.2rem 0' }}>
          <span
            style={{
              fontSize: '1.85rem',
              fontFamily: 'var(--font-serif, "Domine", serif)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
            }}
          >
            {displayPrice}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            /{displayPeriod?.replace('per ', '')}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          {billingNote}
        </div>
      </div>

      {/* Inclusions Snapshot */}
      {snapshotFeatures.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            Plan Highlights
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {snapshotFeatures.map((feat, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                <CheckCircle2 size={14} color="#2E7D32" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Primary Booking Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <button
          type="button"
          onClick={onBook}
          disabled={!isAvailable}
          style={{
            width: '100%',
            padding: '0.9rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isAvailable ? 'var(--color-brand-blue)' : '#9CA3AF',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            boxShadow: isAvailable ? 'var(--shadow-sm)' : 'none',
            transition: 'all var(--duration-fast)',
          }}
          onMouseEnter={(e) => {
            if (isAvailable) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }
          }}
          onMouseLeave={(e) => {
            if (isAvailable) {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }
          }}
        >
          <span>{isAvailable ? 'Request This Service' : 'Service Capacity Reached'}</span>
          {isAvailable && <ArrowRight size={16} />}
        </button>

        {service.options && service.options.length > 1 && (
          <button
            type="button"
            onClick={onScrollToPlans}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              color: 'var(--color-brand-blue)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}
          >
            Compare All {service.options.length} Plans
          </button>
        )}
      </div>

      {/* Student Safeguard Reassurance */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          fontSize: '0.76rem',
          color: 'var(--color-text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={13} color="var(--color-brand-blue)" />
          <span>Exam break 1-tap pause available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={13} color="#2E7D32" />
          <span>Direct billing • Zero hidden broker charges</span>
        </div>
      </div>
    </aside>
  );
};
