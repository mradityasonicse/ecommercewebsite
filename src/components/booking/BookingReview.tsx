import React from 'react';
import { Calendar, Clock, MapPin, ShieldCheck, Edit3 } from 'lucide-react';
import type { BookingState } from '../../types/booking';
import type { ServiceDetail, ServiceOption } from '../../types/serviceDetail';

interface BookingReviewProps {
  state: BookingState;
  service: ServiceDetail;
  selectedOption?: ServiceOption;
  onEditStep: (stepNumber: number) => void;
}

export const BookingReview: React.FC<BookingReviewProps> = ({
  state,
  service,
  selectedOption,
  onEditStep,
}) => {
  const requiresSchedule = service.actionConfig?.requiresDate !== false;

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
          <ShieldCheck size={13} color="var(--color-brand-blue)" /> Final Review Before Confirmation
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
          Review Your Request
        </h2>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Verify your arrival schedule, room delivery details, and rate card before submitting.
        </p>
      </div>

      {/* Review Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* 1. Service & Selected Option */}
        <div
          style={{
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Service & Plan
            </span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-brand-blue)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={13} /> Edit
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {service.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-brand-blue)', fontWeight: 600 }}>
                {selectedOption?.name || 'Standard Service'}
              </div>
            </div>

            {selectedOption && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-blue)' }}>
                  {selectedOption.price.currency}{selectedOption.price.amount}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {selectedOption.price.period}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Schedule Window (If applicable) */}
        {requiresSchedule && (
          <div
            style={{
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Schedule & Arrival Window
              </span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-brand-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Edit3 size={13} /> Edit
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--color-brand-blue)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {state.schedule.date
                    ? new Date(state.schedule.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Date selected'}
                </span>
              </div>

              {state.schedule.timeSlot && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="var(--color-brand-blue)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {state.schedule.timeSlot}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Student Details & Delivery Location */}
        <div
          style={{
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Recipient & Delivery Location
            </span>
            <button
              type="button"
              onClick={() => onEditStep(requiresSchedule ? 3 : 2)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-brand-blue)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={13} /> Edit
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Student Name & Mobile</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {state.customer.name} · {state.customer.phone}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {state.customer.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Campus & Room</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="var(--color-brand-blue)" />
                <span>
                  {state.customer.hostelBlock ? `${state.customer.hostelBlock}, ` : ''}
                  {state.customer.roomNumber ? `Room ${state.customer.roomNumber}` : state.customer.campusName || 'Main Campus'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {state.customer.campusName || 'Campus Living Hub'}
              </div>
            </div>
          </div>

          {state.customer.notes && (
            <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Special Instructions:</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0 0 0' }}>
                "{state.customer.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Safeguard badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
            border: '1px solid rgba(46, 125, 50, 0.22)',
          }}
        >
          <ShieldCheck size={18} color="#2E7D32" />
          <span style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600 }}>
            EaseHub Student Safeguard: Zero upfront hidden charges. Full cancellation allowed prior to dispatch.
          </span>
        </div>
      </div>
    </div>
  );
};
