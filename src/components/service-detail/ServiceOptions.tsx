import React, { useState } from 'react';
import { ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import type { ServiceOption } from '../../types/serviceDetail';

interface ServiceOptionsProps {
  options: ServiceOption[];
  selectedOptionId?: string;
  onSelectOption: (option: ServiceOption) => void;
}

export const ServiceOptions: React.FC<ServiceOptionsProps> = ({
  options,
  selectedOptionId: controlledSelectedId,
  onSelectOption,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(() => {
    const popular = options.find(o => o.isPopular);
    return popular ? popular.id : (options[0]?.id || '');
  });

  const selectedOptionId = controlledSelectedId || internalSelectedId;

  if (!options || options.length === 0) return null;

  return (
    <section
      id="plans"
      aria-label="Service Plans and Tier Options"
      style={{
        padding: 'var(--space-16) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-12)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.16)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: 'var(--color-brand-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <Layers size={13} color="var(--color-brand-blue)" />
          <span>Flexible Formats</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Select Your Living Plan.
        </h2>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Choose a tier that matches your academic schedule. All plans include EaseHub quality auditing and cancellation flexibility.
        </p>
      </div>

      {/* Options Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => {
                setInternalSelectedId(opt.id);
                onSelectOption(opt);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setInternalSelectedId(opt.id);
                  onSelectOption(opt);
                }
              }}
              style={{
                backgroundColor: isSelected ? 'var(--color-surface-2)' : '#FFFFFF',
                border: isSelected ? '2px solid var(--color-brand-blue)' : '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--duration-fast)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }
              }}
            >
              {/* Popular Badge */}
              {opt.isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '24px',
                    backgroundColor: 'var(--color-brand-blue)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {opt.tag || 'Recommended Plan'}
                </div>
              )}

              <div>
                {!opt.isPopular && opt.tag && (
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-brand-blue)',
                        backgroundColor: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border-subtle)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {opt.tag}
                    </span>
                  </div>
                )}

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-serif, "Domine", serif)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 var(--space-2) 0',
                  }}
                >
                  {opt.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    margin: '0 0 var(--space-6) 0',
                  }}
                >
                  {opt.description}
                </p>

                {/* Price Display */}
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4) var(--space-5)',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                    <span style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {opt.price.currency}{opt.price.amount?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      /{opt.price.period?.replace('per ', '')}
                    </span>
                  </div>
                  {opt.price.billingNote && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                      {opt.price.billingNote}
                    </div>
                  )}
                </div>

                {/* Feature checklist */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6) 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {opt.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>
                      <CheckCircle2 size={15} color="#2E7D32" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--color-brand-blue)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                  border: isSelected ? 'none' : '1px solid var(--color-border-subtle)',
                  fontSize: '0.86rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <span>{isSelected ? 'Selected Plan' : 'Choose Plan'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
