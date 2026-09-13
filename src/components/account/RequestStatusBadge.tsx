import React from 'react';
import {
  Clock3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
  CheckCheck,
} from 'lucide-react';
import type { RequestStatus } from '../../types/booking';

interface RequestStatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({
  status,
  size = 'md',
  showDescription = false,
}) => {
  const getConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Review',
          description: 'Waiting for campus provider confirmation',
          icon: Clock3,
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'accepted':
        return {
          label: 'Accepted',
          description: 'Provider accepted your request',
          icon: CheckCircle2,
          color: '#E2E8F0',
          bg: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.2)',
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          description: 'Service scheduled and locked in',
          icon: CheckCircle2,
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          description: 'Service currently being delivered on campus',
          icon: PlayCircle,
          color: '#FFFFFF',
          bg: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.3)',
        };
      case 'completed':
        return {
          label: 'Completed',
          description: 'Service successfully delivered',
          icon: CheckCheck,
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          description: 'Request was cancelled',
          icon: XCircle,
          color: '#FF7B72',
          bg: 'rgba(255, 43, 43, 0.12)',
          border: 'rgba(255, 43, 43, 0.3)',
        };
      case 'draft':
      default:
        return {
          label: 'Draft',
          description: 'Booking not yet finalized',
          icon: AlertCircle,
          color: 'var(--color-text-secondary)',
          bg: 'var(--color-surface-3)',
          border: 'var(--color-border-subtle)',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const fontSizes = {
    sm: '0.68rem',
    md: '0.75rem',
    lg: '0.82rem',
  };

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 15,
  };

  const paddings = {
    sm: '0.15rem 0.45rem',
    md: '0.2rem 0.6rem',
    lg: '0.3rem 0.75rem',
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px' }}>
      <span
        role="status"
        aria-label={`Status: ${config.label}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: config.bg,
          border: `1px solid ${config.border}`,
          color: config.color,
          fontSize: fontSizes[size],
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          padding: paddings[size],
          borderRadius: 'var(--radius-pill)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        <Icon size={iconSizes[size]} />
        <span>{config.label}</span>
      </span>
      {showDescription && (
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
          {config.description}
        </span>
      )}
    </div>
  );
};
