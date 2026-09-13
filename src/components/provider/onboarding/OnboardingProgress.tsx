import React from 'react';
import { Check } from 'lucide-react';

export interface StepDef {
  number: number;
  label: string;
  shortLabel?: string;
  description?: string;
}

export const ONBOARDING_STEPS: StepDef[] = [
  { number: 1, label: 'Welcome', shortLabel: 'Start' },
  { number: 2, label: 'Provider Type', shortLabel: 'Category' },
  { number: 3, label: 'Business Details', shortLabel: 'Business' },
  { number: 4, label: 'Contact Details', shortLabel: 'Contact' },
  { number: 5, label: 'Services Offered', shortLabel: 'Services' },
  { number: 6, label: 'Campus & Location', shortLabel: 'Location' },
  { number: 7, label: 'Availability', shortLabel: 'Hours' },
  { number: 8, label: 'Review & Submit', shortLabel: 'Review' },
];

interface OnboardingProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  onStepClick,
  completedSteps = [],
}) => {
  const percentage = Math.round(((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100);

  return (
    <div
      className="easehub-onboarding-progress-container"
      style={{
        width: '100%',
        backgroundColor: 'var(--color-surface-1)',
        borderBottom: '1px solid var(--color-border-subtle)',
        paddingTop: 'calc(var(--navbar-height, 76px) + 1.25rem)',
        paddingBottom: '1.25rem',
      }}
    >
      <div className="container">
        {/* Mobile Header Bar (< 768px) */}
        <div
          className="onboarding-mobile-progress"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Step {currentStep} of {ONBOARDING_STEPS.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 700 }}>
              {ONBOARDING_STEPS[currentStep - 1]?.label}
            </span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-blue-light)' }}>
              {percentage}%
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: '4px',
              backgroundColor: 'var(--color-surface-3)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: 'var(--color-brand-blue)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Desktop Stepper Matrix (>= 768px) */}
        <div
          className="onboarding-desktop-stepper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Background Connecting Line */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '30px',
              right: '30px',
              height: '2px',
              backgroundColor: 'var(--color-surface-3)',
              zIndex: 1,
            }}
          />
          {/* Active Connecting Fill Line */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '30px',
              width: `calc(${percentage}% * 0.92)`,
              height: '2px',
              backgroundColor: 'var(--color-brand-blue)',
              boxShadow: '0 0 8px var(--color-blue-glow)',
              zIndex: 2,
              transition: 'width 0.3s ease',
            }}
          />

          {ONBOARDING_STEPS.map((step) => {
            const isCurrent = step.number === currentStep;
            const isCompleted = step.number < currentStep || completedSteps.includes(step.number);
            const isClickable = onStepClick && step.number < currentStep;

            return (
              <button
                key={step.number}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.number)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.45rem',
                  position: 'relative',
                  zIndex: 3,
                  background: 'none',
                  border: 'none',
                  cursor: isClickable ? 'pointer' : 'default',
                  padding: 0,
                  outline: 'none',
                }}
              >
                {/* Step Circle */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent
                      ? 'var(--color-brand-blue)'
                      : isCompleted
                      ? '#10B981'
                      : 'var(--color-surface-2)',
                    border: isCurrent
                      ? '2px solid #FFFFFF'
                      : isCompleted
                      ? '2px solid #10B981'
                      : '2px solid var(--color-border-default)',
                    color: isCurrent || isCompleted ? '#FFFFFF' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isCurrent ? '0 0 16px var(--color-blue-glow)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
                </div>

                {/* Step Text Label */}
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent
                      ? '#FFFFFF'
                      : isCompleted
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {step.shortLabel || step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
