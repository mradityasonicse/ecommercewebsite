import React from 'react';
import { AlertCircle, CheckCircle2, FileQuestion, Ban, RefreshCw } from 'lucide-react';
import { Spinner } from './Feedback';
import { Button } from './Button';

export interface StateVisualProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 1. LoadingState - Clear, restrained loading presentation with optional action.
 */
export const LoadingState: React.FC<StateVisualProps & { spinnerSize?: 'sm' | 'md' | 'lg' }> = ({
  title = 'Loading...',
  description,
  spinnerSize = 'md',
  actionText,
  onAction,
  className = '',
  style = {},
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`easehub-state-loading ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        ...style,
      }}
    >
      <Spinner size={spinnerSize} color="var(--color-brand-blue)" />
      <h4
        style={{
          marginTop: 'var(--space-4)',
          marginBottom: 'var(--space-2)',
          fontSize: 'var(--text-h4)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '420px',
            margin: '0 0 var(--space-4) 0',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="ghost" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

/**
 * 2. EmptyState - Human, helpful empty state when no items or results exist.
 */
export const EmptyState: React.FC<StateVisualProps & { icon?: React.ReactNode }> = ({
  title = 'No records found',
  description = 'There are currently no items to display. Try adjusting your filters or search terms.',
  icon,
  actionText,
  onAction,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`easehub-state-empty ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border-default)',
        ...style,
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
          color: 'var(--color-text-muted)',
        }}
      >
        {icon || <FileQuestion size={22} />}
      </div>
      <h4
        style={{
          margin: '0 0 var(--space-2) 0',
          fontSize: 'var(--text-h4)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '420px',
            margin: '0 0 var(--space-5) 0',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

/**
 * 3. ErrorState - Clear feedback when an action or fetch fails with retry action.
 */
export const ErrorState: React.FC<StateVisualProps & { onRetry?: () => void }> = ({
  title = 'Something went wrong',
  description = 'We encountered an error while processing your request. Please try again.',
  actionText = 'Try Again',
  onAction,
  onRetry,
  className = '',
  style = {},
}) => {
  const handleAction = onRetry || onAction;

  return (
    <div
      role="alert"
      className={`easehub-state-error ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-semantic-error)',
        ...style,
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
          color: 'var(--color-semantic-error)',
        }}
      >
        <AlertCircle size={22} />
      </div>
      <h4
        style={{
          margin: '0 0 var(--space-2) 0',
          fontSize: 'var(--text-h4)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '420px',
            margin: '0 0 var(--space-5) 0',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {handleAction && (
        <Button variant="secondary" size="sm" onClick={handleAction} icon={<RefreshCw size={14} />}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

/**
 * 4. SuccessState - Positive visual confirmation for submitted forms and completed bookings.
 */
export const SuccessState: React.FC<StateVisualProps> = ({
  title = 'Action Completed Successfully',
  description,
  actionText,
  onAction,
  className = '',
  style = {},
}) => {
  return (
    <div
      role="status"
      className={`easehub-state-success ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-semantic-success)',
        ...style,
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
          color: 'var(--color-semantic-success)',
        }}
      >
        <CheckCircle2 size={22} />
      </div>
      <h4
        style={{
          margin: '0 0 var(--space-2) 0',
          fontSize: 'var(--text-h4)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '420px',
            margin: '0 0 var(--space-5) 0',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

/**
 * 5. UnavailableState - Clean presentation for out-of-stock or unserviced locations.
 */
export const UnavailableState: React.FC<StateVisualProps> = ({
  title = 'Service Currently Unavailable',
  description = 'This service is currently fully booked or not yet active in your selected campus hub.',
  actionText = 'Request Notification',
  onAction,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`easehub-state-unavailable ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-default)',
        ...style,
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
          color: 'var(--color-text-muted)',
        }}
      >
        <Ban size={22} />
      </div>
      <h4
        style={{
          margin: '0 0 var(--space-2) 0',
          fontSize: 'var(--text-h4)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '420px',
            margin: '0 0 var(--space-5) 0',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
