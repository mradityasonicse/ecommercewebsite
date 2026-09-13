import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface BookingUnavailableProps {
  serviceName: string;
  onBackToServices?: () => void;
}

export const BookingUnavailable: React.FC<BookingUnavailableProps> = ({
  serviceName,
  onBackToServices,
}) => {
  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: 'var(--space-16) var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F59E0B',
          marginBottom: 'var(--space-6)',
        }}
      >
        <ShieldAlert size={32} />
      </div>

      <span
        style={{
          display: 'inline-block',
          padding: '0.2rem 0.65rem',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          backgroundColor: 'var(--color-surface-2)',
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: 'var(--space-3)',
        }}
      >
        Capacity Cap · Temporarily Inactive
      </span>

      <h1
        style={{
          fontSize: 'var(--text-2xl)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: '0 0 var(--space-3) 0',
        }}
      >
        Requests Currently Unavailable
      </h1>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-8)' }}>
        {serviceName} is operating at maximum capacity for your university today to guarantee turnaround times. New booking slots open at midnight.
      </p>

      <Button
        variant="secondary"
        size="lg"
        icon={<ArrowLeft size={16} />}
        iconPosition="left"
        onClick={() => {
          if (onBackToServices) onBackToServices();
          else window.location.hash = '#services';
        }}
      >
        Back to Services Catalog
      </Button>
    </div>
  );
};
