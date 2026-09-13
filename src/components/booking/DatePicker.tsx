import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  selectedDate?: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  minDate?: string;
  maxDaysAhead?: number;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  maxDaysAhead = 14,
  label = 'Select Service Date',
}) => {
  // Generate next N available dates starting from tomorrow (or today if current time allows)
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < maxDaysAhead; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const isoString = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const isToday = i === 0;

      dates.push({
        iso: isoString,
        dayName,
        dayNum,
        monthName,
        isToday,
      });
    }
    return dates;
  }, [maxDaysAhead]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-body-xs)',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <CalendarIcon size={14} color="var(--color-brand-blue)" />
          <span>{label}</span>
        </label>

        {selectedDate && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-blue)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Selected: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Touch-scrolling horizontal day picker */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: 'var(--space-2)',
          maxHeight: '260px',
          overflowY: 'auto',
          padding: '2px',
        }}
      >
        {availableDates.map((item) => {
          const isSelected = selectedDate === item.iso;

          return (
            <button
              key={item.iso}
              type="button"
              onClick={() => onDateChange(item.iso)}
              aria-pressed={isSelected}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 0.5rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isSelected
                  ? 'var(--color-brand-blue)'
                  : 'var(--color-surface-1)',
                border: isSelected
                  ? '2px solid var(--color-brand-blue)'
                  : '1px solid var(--color-border-subtle)',
                color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
                boxShadow: isSelected ? '0 4px 14px rgba(15, 56, 44, 0.25)' : 'var(--shadow-sm)',
                position: 'relative',
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
              {item.isToday && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    fontSize: '0.58rem',
                    fontFamily: 'var(--font-mono)',
                    color: isSelected ? 'var(--color-accent-gold)' : 'var(--color-brand-blue)',
                    fontWeight: 700,
                  }}
                >
                  TODAY
                </span>
              )}

              <span
                style={{
                  fontSize: '0.72rem',
                  color: isSelected ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {item.dayName}
              </span>

              <span
                style={{
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginTop: '0.15rem',
                }}
              >
                {item.dayNum}
              </span>

              <span
                style={{
                  fontSize: '0.68rem',
                  color: isSelected ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-text-muted)',
                }}
              >
                {item.monthName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
