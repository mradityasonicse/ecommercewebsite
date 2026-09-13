import React from 'react';
import { Clock, Check } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  label?: string;
  isPopular?: boolean;
}

interface TimeSlotSelectorProps {
  selectedSlot?: string;
  onSlotChange: (slot: string) => void;
  label?: string;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-morning-1', time: '08:00 AM - 10:00 AM', label: 'Morning Campus Run' },
  { id: 'slot-morning-2', time: '10:00 AM - 12:00 PM', label: 'Midday Slot', isPopular: true },
  { id: 'slot-afternoon', time: '02:00 PM - 04:00 PM', label: 'Post-Lecture Window' },
  { id: 'slot-evening', time: '04:00 PM - 06:00 PM', label: 'Hostel Rush Window', isPopular: true },
  { id: 'slot-night', time: '07:00 PM - 09:00 PM', label: 'Evening Pickup' },
];

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedSlot,
  onSlotChange,
  label = 'Select Preferred Arrival Window',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-body-xs)',
          fontWeight: 700,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <Clock size={14} color="var(--color-brand-blue)" />
        <span>{label}</span>
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-2)',
        }}
      >
        {DEFAULT_TIME_SLOTS.map((slot) => {
          const isSelected = selectedSlot === slot.time;

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSlotChange(slot.time)}
              aria-pressed={isSelected}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected
                  ? '#f3fbf5'
                  : 'var(--color-surface-1)',
                border: isSelected
                  ? '2px solid var(--color-brand-blue)'
                  : '1px solid var(--color-border-subtle)',
                boxShadow: isSelected
                  ? '0 4px 14px rgba(15, 56, 44, 0.1)'
                  : 'var(--shadow-sm)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                  e.currentTarget.style.backgroundColor = '#f3fbf5';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-1)';
                }
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {slot.time}
                </div>
                {slot.label && (
                  <div style={{ fontSize: '0.72rem', color: isSelected ? 'var(--color-brand-blue)' : 'var(--color-text-muted)', fontWeight: isSelected ? 600 : 400 }}>
                    {slot.label}
                  </div>
                )}
              </div>

              {isSelected && (
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-brand-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={12} strokeWidth={3} color="#FFFFFF" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
