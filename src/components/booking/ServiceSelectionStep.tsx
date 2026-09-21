import React from 'react';
import { Check, Flame } from 'lucide-react';
import type { ServiceDetail, ServiceOption } from '../../types/serviceDetail';

interface ServiceSelectionStepProps {
  service: ServiceDetail;
  selectedOptionId: string;
  onOptionSelect: (optionId: string) => void;
}

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  service,
  selectedOptionId,
  onOptionSelect,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%' }}>
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--color-brand-blue)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span>{service.category.replace('-', ' ')}</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-2) 0',
          }}
        >
          Choose Your {service.name} Plan
        </h2>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {service.tagline}
        </p>
      </div>

      {/* Options Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {service.options.map((opt: ServiceOption) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => onOptionSelect(opt.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onOptionSelect(opt.id);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isSelected
                  ? 'var(--color-surface-2)'
                  : 'var(--color-surface-1)',
                border: isSelected
                  ? '2px solid var(--color-brand-blue)'
                  : '1px solid var(--color-border-subtle)',
                boxShadow: isSelected
                  ? '0 4px 16px -2px rgba(59, 130, 246, 0.12)'
                  : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
                outline: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected
                        ? '6px solid var(--color-brand-blue)'
                        : '2px solid var(--color-border-default)',
                      backgroundColor: 'var(--color-surface-1)',
                      transition: 'all var(--duration-fast)',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {opt.name}
                      </span>
                      {opt.isPopular && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'rgba(248, 206, 55, 0.2)',
                            color: '#7C5E00',
                            border: '1px solid rgba(248, 206, 55, 0.5)',
                          }}
                        >
                          <Flame size={10} color="#7C5E00" /> Popular
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0 0' }}>
                      {opt.description}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-blue)' }}>
                    {opt.price.currency}{opt.price.amount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {opt.price.period}
                  </div>
                </div>
              </div>

              {/* Inclusions bullets */}
              {opt.features && opt.features.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem 1rem',
                    paddingTop: 'var(--space-2)',
                    borderTop: '1px solid var(--color-border-subtle)',
                  }}
                >
                  {opt.features.slice(0, 3).map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <Check size={13} color="#2E7D32" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
