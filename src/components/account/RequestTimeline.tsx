import React from 'react';
import { Check, Clock, PlayCircle, XCircle } from 'lucide-react';
import type { RequestTimelineEvent, RequestStatus } from '../../types/booking';

interface RequestTimelineProps {
  events?: RequestTimelineEvent[];
  currentStatus: RequestStatus;
}

export const RequestTimeline: React.FC<RequestTimelineProps> = ({
  events = [],
  currentStatus,
}) => {
  // Canonical milestone definitions
  const standardMilestones: { status: RequestStatus; title: string; defaultDesc: string }[] = [
    { status: 'pending', title: 'Request Submitted', defaultDesc: 'Booking order placed by student' },
    { status: 'accepted', title: 'Provider Accepted', defaultDesc: 'Verified campus partner approved service request' },
    { status: 'confirmed', title: 'Service Confirmed', defaultDesc: 'Schedule slot locked in and technician/courier assigned' },
    { status: 'in_progress', title: 'Service in Progress', defaultDesc: 'Work actively ongoing or courier en route' },
    { status: 'completed', title: 'Service Completed', defaultDesc: 'Service fulfilled and verified' },
  ];

  const isCancelled = currentStatus === 'cancelled';

  // Determine which steps are achieved based on current status
  const statusRank: Record<RequestStatus, number> = {
    draft: 0,
    pending: 1,
    accepted: 2,
    confirmed: 3,
    in_progress: 4,
    completed: 5,
    cancelled: -1,
  };

  const currentRank = statusRank[currentStatus] || 1;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
      }}
    >
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
          Service Fulfillment Timeline
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Live chronological progress milestones verified by EaseHub campus operations.
        </p>
      </div>

      {isCancelled ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-4)',
            padding: 'var(--space-4)',
            backgroundColor: 'rgba(255, 43, 43, 0.08)',
            border: '1px solid rgba(255, 43, 43, 0.25)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 43, 43, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF7B72',
              flexShrink: 0,
            }}
          >
            <XCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
              Service Cancelled
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0 0' }}>
              This request was cancelled. Any pre-authorized charges or credits have been released to your campus wallet.
            </p>
            {events.find((e) => e.status === 'cancelled') && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                {new Date(events.find((e) => e.status === 'cancelled')!.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {standardMilestones.map((milestone, idx) => {
            const milestoneRank = statusRank[milestone.status];
            const isCompleted = currentRank > milestoneRank || (currentStatus === 'completed' && milestone.status === 'completed');
            const isCurrent = currentRank === milestoneRank && currentStatus !== 'completed';
            const isPending = currentRank < milestoneRank;

            // Find matching event for specific timestamp and custom description
            const matchedEvent = events.find((e) => e.status === milestone.status);
            const title = matchedEvent?.title || milestone.title;
            const description = matchedEvent?.description || milestone.defaultDesc;
            const timestamp = matchedEvent?.timestamp;
            const actor = matchedEvent?.actor;

            const isLast = idx === standardMilestones.length - 1;

            return (
              <div
                key={milestone.status}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-4)',
                  position: 'relative',
                }}
              >
                {/* Connecting Vertical Line */}
                {!isLast && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '32px',
                      left: '15px',
                      bottom: '-24px',
                      width: '2px',
                      backgroundColor: isCompleted ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                )}

                {/* Node Icon */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted
                      ? '#10B981'
                      : isCurrent
                      ? '#FFFFFF'
                      : 'var(--color-surface-2)',
                    border: isCompleted
                      ? '2px solid #10B981'
                      : isCurrent
                      ? '2px solid #FFFFFF'
                      : '2px solid var(--color-border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted
                      ? '#FFFFFF'
                      : isCurrent
                      ? '#080A0F'
                      : 'var(--color-text-muted)',
                    boxShadow: isCurrent ? '0 0 12px rgba(255, 255, 255, 0.25)' : 'none',
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : isCurrent ? (
                    <PlayCircle size={16} />
                  ) : (
                    <Clock size={14} />
                  )}
                </div>

                {/* Event Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: isCurrent || isCompleted ? 700 : 500,
                          color: isCurrent ? '#FFFFFF' : isCompleted ? '#FFFFFF' : 'var(--color-text-muted)',
                        }}
                      >
                        {title}
                      </span>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-mono)',
                            color: '#FFFFFF',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: 'var(--radius-pill)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          Active Stage
                        </span>
                      )}
                    </div>

                    {timestamp && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: isPending ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                      margin: '0.25rem 0 0 0',
                      lineHeight: 1.5,
                    }}
                  >
                    {description}
                  </p>

                  {actor && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-blue-light)', marginTop: '0.25rem' }}>
                      Operator: {actor}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
