import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  message = "We couldn't load campus services right now.",
}) => {
  return (
    <div
      role="alert"
      style={{
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'rgba(255, 43, 43, 0.1)',
          border: '1px solid rgba(255, 43, 43, 0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-brand-red)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <AlertCircle size={32} />
      </div>

      <h3
        style={{
          fontSize: '1.4rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: '0 0 var(--space-2) 0',
        }}
      >
        Service Catalog Temporarily Unavailable
      </h3>

      <p
        style={{
          fontSize: '0.92rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          margin: '0 0 var(--space-6) 0',
        }}
      >
        {message} Please verify your connection or refresh to reload the marketplace.
      </p>

      <button
        type="button"
        onClick={onRetry}
        style={{
          padding: '0.75rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-2)',
          color: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          cursor: 'pointer',
          transition: 'all var(--duration-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
          e.currentTarget.style.color = 'var(--color-blue-light)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
          e.currentTarget.style.color = '#FFFFFF';
        }}
      >
        <RotateCcw size={15} />
        <span>Try Again</span>
      </button>
    </div>
  );
};
