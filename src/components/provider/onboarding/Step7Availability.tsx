import React from 'react';
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { ProviderWeeklyAvailability } from '../../../types/provider';
import { DEFAULT_WEEKLY_SCHEDULE } from '../../../services/providerService';

interface Step7AvailabilityProps {
  availability: ProviderWeeklyAvailability;
  onChange: (avail: Partial<ProviderWeeklyAvailability>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step7Availability: React.FC<Step7AvailabilityProps> = ({
  availability,
  onChange,
  onContinue,
  onBack,
}) => {
  const schedule = availability.schedule || DEFAULT_WEEKLY_SCHEDULE;

  const handleDayToggle = (index: number) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
    onChange({ schedule: updated });
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ schedule: updated });
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: 'var(--text-h3)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.5rem',
          }}
        >
          Operational Availability & Timings
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Students rely on accurate opening hours for hostel deliveries, laundry drop-offs, and dining meal windows.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          backgroundColor: 'var(--color-surface-1)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '2rem',
        }}
      >
        {/* Weekly Day Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {schedule.map((dayItem, index) => (
            <div
              key={dayItem.day}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: dayItem.isOpen ? 'var(--color-surface-2)' : 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                gap: '1rem',
              }}
            >
              {/* Day Label & Toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  minWidth: '130px',
                }}
              >
                <input
                  type="checkbox"
                  checked={dayItem.isOpen}
                  onChange={() => handleDayToggle(index)}
                  style={{ accentColor: 'var(--color-brand-blue)', width: '16px', height: '16px' }}
                />
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: dayItem.isOpen ? 700 : 500,
                    color: dayItem.isOpen ? '#FFFFFF' : 'var(--color-text-muted)',
                  }}
                >
                  {dayItem.label}
                </span>
              </label>

              {/* Operating Hours or Closed Indicator */}
              {dayItem.isOpen ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="time"
                    value={dayItem.openTime}
                    onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      backgroundColor: 'var(--color-surface-3)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-xs)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none',
                    }}
                  />
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>to</span>
                  <input
                    type="time"
                    value={dayItem.closeTime}
                    onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      backgroundColor: 'var(--color-surface-3)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-xs)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none',
                    }}
                  />
                </div>
              ) : (
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  Closed
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Holiday / Exam Season Special Note */}
        <div>
          <label
            htmlFor="holidayNotice"
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.45rem',
            }}
          >
            Special Notice / Exam Season Schedule (Optional)
          </label>
          <input
            id="holidayNotice"
            type="text"
            placeholder="e.g. Open until midnight during semester examinations; closed on Diwali"
            value={availability.holidayNotice || ''}
            onChange={(e) => onChange({ holidayNotice: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Emergency Support Toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={!!availability.emergencySupport}
            onChange={(e) => onChange({ emergencySupport: e.target.checked })}
            style={{ marginTop: '3px', accentColor: 'var(--color-brand-blue)' }}
          />
          <div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={15} color="#F59E0B" />
              <span>Available for on-call emergency campus requests outside standard hours</span>
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
              Recommended for electricians, plumbers, Wi-Fi outage technicians, and emergency medical transports.
            </span>
          </div>
        </label>
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1.5rem',
        }}
      >
        <Button variant="ghost" size="md" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back: Location
        </Button>
        <Button variant="primary" size="md" onClick={onContinue} icon={<ArrowRight size={16} />}>
          Continue: Review Application
        </Button>
      </div>
    </div>
  );
};
