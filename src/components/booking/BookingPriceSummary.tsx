import React from 'react';
import { ShieldCheck, Tag, Info } from 'lucide-react';
import type { ServiceDetail, ServiceOption } from '../../types/serviceDetail';

interface BookingPriceSummaryProps {
  service: ServiceDetail;
  selectedOption?: ServiceOption;
}

export const BookingPriceSummary: React.FC<BookingPriceSummaryProps> = ({
  service,
  selectedOption,
}) => {
  const price = selectedOption?.price;

  return (
    <div
      style={{
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        position: 'sticky',
        top: 'calc(var(--navbar-height, 72px) + 2rem)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-3)' }}>
        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Request Summary
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#2E7D32',
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
            border: '1px solid rgba(46, 125, 50, 0.25)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          <Tag size={10} color="#2E7D32" /> Verified Student Rate
        </span>
      </div>

      {/* Service & Option Info */}
      <div>
        <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {service.name}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-brand-blue)', fontWeight: 600, marginTop: '0.15rem' }}>
          {selectedOption?.name || 'Standard Plan'}
        </div>
      </div>

      {/* Line item pricing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
          <span>Plan Base Rate</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            {price ? `${price.currency}${price.amount}` : service.startingPrice}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
          <span>Convenience / Platform Fee</span>
          <span style={{ color: '#2E7D32', fontWeight: 600 }}>₹0 (Subsidized)</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
          <span>Hostel Doorstep Delivery</span>
          <span style={{ color: '#2E7D32', fontWeight: 600 }}>Included</span>
        </div>

        {price?.billingNote && (
          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--color-text-secondary)',
              backgroundColor: '#f3fbf5',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <Info size={12} color="var(--color-brand-blue)" style={{ display: 'inline', marginRight: '0.25rem' }} />
            {price.billingNote}
          </div>
        )}
      </div>

      {/* Total line */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-3)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
            Payable Amount
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-brand-blue)', fontWeight: 600 }}>
            Post-service / on arrival
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-blue)' }}>
            {price ? `${price.currency}${price.amount}` : service.startingPrice}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            {price?.period || service.pricingUnit}
          </div>
        </div>
      </div>

      {/* Trust safeguard note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.72rem',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-surface-2)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <ShieldCheck size={14} color="#2E7D32" />
        <span>Rate locked under EaseHub Campus Agreement. Zero unexpected surges.</span>
      </div>
    </div>
  );
};
