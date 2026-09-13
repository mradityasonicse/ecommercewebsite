import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Building,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import type { User } from '../../types/auth';
import type { ServiceRequest } from '../../types/booking';
import { ServiceRequestRepository } from '../../services/serviceRequestRepository';
import { RequestStatusBadge } from './RequestStatusBadge';
import { RequestTimeline } from './RequestTimeline';
import { Button } from '../ui/Button';

interface RequestDetailPageProps {
  requestId: string;
  user: User;
  onBack: () => void;
  onNavigateToServices?: () => void;
}

export const RequestDetailPage: React.FC<RequestDetailPageProps> = ({
  requestId,
  user,
  onBack,
  onNavigateToServices,
}) => {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const fetchRequest = async () => {
    setIsLoading(true);
    try {
      // Validate ownership on fetch
      const found = await ServiceRequestRepository.getRequestById(requestId, user.email);
      setRequest(found);
    } catch {
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [requestId, user.email]);

  const handleConfirmCancel = async () => {
    if (!request) return;
    setIsCancelling(true);
    setCancelError(null);

    const res = await ServiceRequestRepository.cancelRequest(
      request.id,
      user.email,
      cancelReason.trim() || undefined
    );

    setIsCancelling(false);

    if (res.success && res.request) {
      setRequest(res.request);
      setIsCancelModalOpen(false);
    } else {
      setCancelError(res.error || 'Failed to cancel request.');
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div
        style={{
          padding: 'var(--space-12)',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-subtle)',
          color: 'var(--color-text-muted)',
        }}
      >
        <div style={{ fontSize: '0.95rem' }}>Loading service request #{requestId}...</div>
      </div>
    );
  }

  // 2. Not Found or Unauthorized Access
  if (!request) {
    return (
      <div
        style={{
          padding: 'var(--space-12)',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 43, 43, 0.1)',
            border: '1px solid rgba(255, 43, 43, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF7B72',
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
            Request Not Found or Access Restricted
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: 0 }}>
            We could not locate request #{requestId} associated with your verified student account ({user.email}).
          </p>
        </div>
        <Button variant="secondary" size="md" icon={<ArrowLeft size={14} />} onClick={onBack}>
          Return to My Requests
        </Button>
      </div>
    );
  }

  const isPending = request.status === 'pending';
  const isCancelled = request.status === 'cancelled';
  const isCompleted = request.status === 'completed';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Back Link & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
        >
          <ArrowLeft size={16} />
          <span>Back to Requests</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RequestStatusBadge status={request.status} size="lg" />
        </div>
      </div>

      {/* Main Request Summary Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {request.id}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Ordered on {new Date(request.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
              {request.serviceName}
            </h2>

            {request.optionName && (
              <p style={{ fontSize: '0.9rem', color: 'var(--color-blue-light)', margin: 0, fontWeight: 600 }}>
                Selected Tier: {request.optionName}
              </p>
            )}
          </div>

          {/* Rate card & Price */}
          {request.estimatedPrice && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                Estimated Price
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                {request.estimatedPrice}
              </div>
            </div>
          )}
        </div>

        {/* Schedule & Location Metadata Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          {/* Schedule Window */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <Calendar size={18} color="var(--color-brand-blue)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Scheduled Slot
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                {request.schedule?.date || 'Confirmed Window'}
              </div>
              {request.schedule?.timeSlot && (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {request.schedule.timeSlot}
                </div>
              )}
            </div>
          </div>

          {/* Delivery Location */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <MapPin size={18} color="var(--color-brand-blue)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Campus Delivery Node
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                {request.customer.hostelBlock || 'Hostel Campus'}
                {request.customer.roomNumber ? ` • Room ${request.customer.roomNumber}` : ''}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Building size={12} /> {request.customer.campusName || 'Main Campus'}
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <ShieldCheck size={18} color="#22C55E" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Fulfillment Partner
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                {request.providerName || 'EaseHub Verified Campus Partner'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#22C55E' }}>
                Institutional SLA Protected
              </div>
            </div>
          </div>
        </div>

        {/* Customer Instructions */}
        {request.notes && (
          <div
            style={{
              marginTop: 'var(--space-5)',
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
              Special Delivery Instructions
            </div>
            <p style={{ fontSize: '0.82rem', color: '#FFFFFF', fontStyle: 'italic', margin: 0 }}>
              "{request.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Progress Timeline Component */}
      <RequestTimeline
        events={request.timeline}
        currentStatus={request.status}
      />

      {/* State-Aware Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          padding: 'var(--space-4) var(--space-6)',
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
          <HelpCircle size={16} color="var(--color-brand-blue)" />
          <span>Need help with this request? Contact your hostel student representative or campus ops.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {isPending && (
            <Button
              variant="danger"
              size="md"
              icon={<XCircle size={14} />}
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel Request
            </Button>
          )}

          {isCancelled && onNavigateToServices && (
            <Button
              variant="primary"
              size="md"
              icon={<ExternalLink size={14} />}
              onClick={onNavigateToServices}
            >
              Re-Book Service
            </Button>
          )}

          {isCompleted && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => alert('Phase 15 Review Engine will enable direct ratings.')}
            >
              Rate & Review Partner
            </Button>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={() => window.print()}
          >
            Download Receipt (PDF)
          </Button>
        </div>
      </div>

      {/* Cancellation Confirmation Dialog Modal */}
      {isCancelModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 43, 43, 0.15)',
                  color: '#FF7B72',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <XCircle size={20} />
              </div>
              <h3 id="cancel-modal-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Cancel Service Request?
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to cancel request <strong>#{request.id}</strong> ({request.serviceName})? The assigned provider will be notified immediately.
            </p>

            {cancelError && (
              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'rgba(255,43,43,0.1)', border: '1px solid rgba(255,43,43,0.3)', color: '#FF7B72', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                {cancelError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                Reason for cancellation (optional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, placed by accident"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
              >
                Keep Request
              </Button>

              <Button
                variant="danger"
                size="md"
                loading={isCancelling}
                onClick={handleConfirmCancel}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
