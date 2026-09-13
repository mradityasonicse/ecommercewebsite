import React from 'react';
import { CheckCircle2, Calendar, Clock, MapPin, ArrowRight, Home, Copy, Check } from 'lucide-react';
import type { ServiceRequest } from '../../types/booking';
import { Button } from '../ui/Button';

interface BookingConfirmationProps {
  request: ServiceRequest;
  onViewAccountRequests?: () => void;
  onBackToServices?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  request,
  onViewAccountRequests,
  onBackToServices,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(request.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isBooking = request.actionType === 'booking';

  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-4) var(--space-20)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Animated Success Badge */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
          border: '1.5px solid rgba(34, 197, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22C55E',
          marginBottom: 'var(--space-5)',
          boxShadow: '0 0 32px rgba(34, 197, 94, 0.2)',
        }}
      >
        <CheckCircle2 size={40} />
      </div>

      <div style={{ marginBottom: 'var(--space-2)' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            color: '#2E7D32',
            border: '1px solid rgba(46, 125, 50, 0.25)',
          }}
        >
          {isBooking ? 'Booking Confirmed · Provider Notified' : 'Inquiry Logged · Coordinator Assigned'}
        </span>
      </div>

      <h1
        style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-3) 0',
        }}
      >
        {isBooking ? 'Your Service Is Booked!' : 'Inquiry Successfully Submitted!'}
      </h1>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '540px', marginBottom: 'var(--space-6)' }}>
        {isBooking
          ? `Your ${request.serviceName} request has been dispatched to verified on-ground operators. We've sent a verification SMS to ${request.customer.phone}.`
          : `Your residence inquiry for ${request.serviceName} has been routed to our campus housing team. Expect visit coordination details via WhatsApp/SMS shortly.`}
      </p>

      {/* Request ID Banner with 1-click copy */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          Request Reference:
        </span>
        <span style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-brand-blue)', letterSpacing: '0.05em' }}>
          {request.id}
        </span>
        <button
          type="button"
          onClick={handleCopyId}
          aria-label="Copy request ID"
          style={{
            background: 'none',
            border: 'none',
            color: copied ? '#2E7D32' : 'var(--color-brand-blue)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {copied ? <Check size={14} color="#2E7D32" /> : <Copy size={14} color="var(--color-brand-blue)" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Structured Details Card */}
      <div
        style={{
          width: '100%',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'left',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-4)', letterSpacing: '0.06em' }}>
          Confirmed Booking Details
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Service & Option</span>
            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>{request.serviceName}</span>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-brand-blue)', fontWeight: 600 }}>
              {request.optionName || 'Standard Tier'}
            </div>
          </div>

          {request.schedule?.date && (
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Scheduled Arrival</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.88rem' }}>
                <Calendar size={14} color="var(--color-brand-blue)" />
                <span>{new Date(request.schedule.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              {request.schedule.timeSlot && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary)', fontSize: '0.78rem' }}>
                  <Clock size={13} color="var(--color-brand-blue)" />
                  <span>{request.schedule.timeSlot}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Delivery Location</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.88rem' }}>
              <MapPin size={14} color="var(--color-brand-blue)" />
              <span>
                {request.customer.hostelBlock ? `${request.customer.hostelBlock}, ` : ''}
                {request.customer.roomNumber ? `Room ${request.customer.roomNumber}` : request.customer.campusName || 'Main Campus'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Recipient: {request.customer.name}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          width: '100%',
        }}
      >
        <Button
          variant="primary"
          size="lg"
          icon={<ArrowRight size={16} />}
          onClick={() => {
            if (onViewAccountRequests) onViewAccountRequests();
            else window.location.hash = '#account';
          }}
        >
          Track in Student Account
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={<Home size={16} />}
          iconPosition="left"
          onClick={() => {
            if (onBackToServices) onBackToServices();
            else window.location.hash = '#services';
          }}
        >
          Return to Service Catalog
        </Button>
      </div>
    </div>
  );
};
