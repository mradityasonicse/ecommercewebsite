import React from 'react';
import { Check } from 'lucide-react';

export interface BookingStepDef {
  number: number;
  id: string;
  label: string;
}

interface BookingProgressProps {
  steps: BookingStepDef[];
  currentStepNumber: number;
  onStepClick?: (stepNumber: number) => void;
}

export const BookingProgress: React.FC<BookingProgressProps> = ({
  steps,
  currentStepNumber,
  onStepClick,
}) => {
  return (
    <nav
      aria-label="Booking progress"
      style={{
        padding: 'var(--space-4) 0 var(--space-8)',
        width: '100%',
      }}
    >
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gap: 'var(--space-2)',
        }}
      >
        {steps.map((step, idx) => {
          const isCompleted = currentStepNumber > step.number;
          const isCurrent = currentStepNumber === step.number;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.id}>
              {/* Connector line between steps */}
              {idx > 0 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: isCompleted
                      ? 'var(--color-brand-blue)'
                      : 'var(--color-border-subtle)',
                    transition: 'background-color var(--duration-normal)',
                  }}
                />
              )}

              <li style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (isClickable) onStepClick(step.number);
                  }}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'none',
                    border: 'none',
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                    cursor: isClickable ? 'pointer' : 'default',
                    color: isCurrent
                      ? 'var(--color-brand-blue)'
                      : isCompleted
                      ? 'var(--color-brand-blue)'
                      : 'var(--color-text-muted)',
                    backgroundColor: isCurrent
                      ? '#EDF6EF'
                      : 'transparent',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isCurrent
                      ? 'var(--color-brand-blue)'
                      : 'transparent',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    fontWeight: isCurrent ? 700 : 500,
                    transition: 'all var(--duration-fast)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                        backgroundColor: isCompleted
                        ? 'var(--color-semantic-success)'
                        : isCurrent
                        ? 'var(--color-brand-blue)'
                        : 'var(--color-surface-2)',
                      color: isCompleted
                        ? '#FFFFFF'
                        : isCurrent
                        ? '#FFFFFF'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : step.number}
                  </span>
                  <span>{step.label}</span>
                </button>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
