import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface BookingErrorProps {
  errorMessage?: string;
  onRetry: () => void;
  onBack: () => void;
}

export const BookingError: React.FC<BookingErrorProps> = ({
  errorMessage = 'Something went wrong while communicating with campus operators. Your form data is saved.',
  onRetry,
  onBack,
}) => {
  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: 'var(--space-12) var(--space-4)',
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
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EF4444',
          marginBottom: 'var(--space-6)',
        }}
      >
        <AlertCircle size={32} />
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
        Submission Interrupted
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
        Request Wasn't Submitted
      </h1>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-8)' }}>
        {errorMessage}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
        <Button
          variant="primary"
          size="lg"
          icon={<RefreshCw size={16} />}
          iconPosition="left"
          onClick={onRetry}
        >
          Try Again
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={<ArrowLeft size={16} />}
          iconPosition="left"
          onClick={onBack}
        >
          Review Information
        </Button>
      </div>
    </div>
  );
};
