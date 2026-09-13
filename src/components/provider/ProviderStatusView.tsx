import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  PhoneCall,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ProviderApplication, ProviderApplicationStatus } from '../../types/provider';
import { ProviderService } from '../../services/providerService';

interface ProviderStatusViewProps {
  application: ProviderApplication | null;
  onResumeDraft?: () => void;
  onRefresh?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
}

export const ProviderStatusView: React.FC<ProviderStatusViewProps> = ({
  application,
  onResumeDraft,
  onRefresh,
  onNavigateToProfile,
  onNavigateToSettings,
}) => {
  const [isSimulating, setIsSimulating] = React.useState(false);

  if (!application) {
    return (
      <div
        style={{
          maxWidth: '640px',
          margin: '3rem auto',
          padding: '2.5rem 1.5rem',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <Building size={26} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          No Active Provider Application
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          You have not submitted a partner onboarding application yet. Join EaseHub to start offering campus services directly to university students.
        </p>
        {onResumeDraft && (
          <Button variant="primary" size="md" onClick={onResumeDraft} icon={<ArrowRight size={16} />}>
            Start Provider Application
          </Button>
        )}
      </div>
    );
  }

  const { status, id: appId, businessInfo, submittedAt, reviewerNotes, rejectionReason } = application;

  // Development simulation of admin approvals/rejections (for testing Phase 13 integration)
  const handleSimulateStatus = async (newStatus: 'approved' | 'rejected' | 'under_review') => {
    setIsSimulating(true);
    try {
      await ProviderService.simulateAdminReview(
        appId,
        newStatus,
        newStatus === 'rejected'
          ? 'Physical audit found food preparation area does not meet FSSAI ventilation norms.'
          : 'Physical premise inspected and approved by Campus Operations Board.'
      );
      if (onRefresh) onRefresh();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          padding: '2rem',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Status Badge & Tracking Ref */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
              }}
            >
              APPLICATION #{appId}
            </span>
          </div>

          <StatusBadge status={status} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          {businessInfo?.businessName || 'Partner Application'}
        </h2>

        {/* Dynamic Status Narrative */}
        {status === 'draft' && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Your partner application is saved as a draft. Complete all sections to submit your business for campus auditing.
            </p>
            {onResumeDraft && (
              <Button variant="primary" size="md" onClick={onResumeDraft} icon={<ArrowRight size={16} />}>
                Resume Application (Step {application.currentStep || 1} of 8)
              </Button>
            )}
          </div>
        )}

        {(status === 'submitted' || status === 'under_review') && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Your application was submitted on{' '}
              <strong style={{ color: '#FFFFFF' }}>
                {submittedAt ? new Date(submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'recently'}
              </strong>
              . Our campus operations team is currently reviewing your business details and will schedule a physical inspection.
            </p>

            {reviewerNotes && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderLeft: '3px solid #FFFFFF',
                  borderRadius: '0 var(--radius-xs) var(--radius-xs) 0',
                  fontSize: '0.84rem',
                  color: '#CBD5E1',
                  marginBottom: '1rem',
                }}
              >
                <strong>Audit Note:</strong> {reviewerNotes}
              </div>
            )}
          </div>
        )}

        {status === 'approved' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10B981',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginBottom: '0.5rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>Congratulations! Your EaseHub Campus Partner Account is Approved.</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Your services are now verified and eligible to receive live student requests. You can manage your public storefront, operating hours, and catalog below.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {onNavigateToProfile && (
                <Button variant="primary" size="md" onClick={onNavigateToProfile}>
                  Manage Provider Profile
                </Button>
              )}
              {onNavigateToSettings && (
                <Button variant="outline" size="md" onClick={onNavigateToSettings}>
                  Provider Settings
                </Button>
              )}
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#FF7B72',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginBottom: '0.5rem',
              }}
            >
              <XCircle size={18} />
              <span>Application Not Approved</span>
            </div>
            {rejectionReason && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(255, 43, 43, 0.08)',
                  borderLeft: '3px solid var(--color-accent-red)',
                  borderRadius: '0 var(--radius-xs) var(--radius-xs) 0',
                  fontSize: '0.84rem',
                  color: '#FF7B72',
                  marginBottom: '1rem',
                }}
              >
                <strong>Reason:</strong> {rejectionReason}
              </div>
            )}
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              You may revise your application details and address the noted issues to request a re-audit.
            </p>
            {onResumeDraft && (
              <Button variant="primary" size="md" onClick={onResumeDraft} icon={<RefreshCw size={15} />}>
                Revise & Resubmit Application
              </Button>
            )}
          </div>
        )}

        {status === 'suspended' && (
          <div>
            <p style={{ fontSize: '0.88rem', color: '#FF7B72', lineHeight: 1.5, marginBottom: '1rem' }}>
              This provider account is temporarily suspended by campus administrative moderation. Please contact campus partner support.
            </p>
          </div>
        )}
      </div>

      {/* Application Timeline Stages */}
      <div
        style={{
          padding: '1.75rem',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
          Verification & Onboarding Milestones
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
          {/* Milestone 1 */}
          <TimelineItem
            stepNumber={1}
            title="Digital Application Submission"
            description="Business information, service pricing, campus location, and operating hours filed."
            isDone={status !== 'draft'}
            isCurrent={status === 'draft'}
          />

          {/* Milestone 2 */}
          <TimelineItem
            stepNumber={2}
            title="Document & Compliance Audit"
            description="Administrative check of registration, student health hygiene declarations, or trade permits."
            isDone={status === 'approved' || status === 'under_review'}
            isCurrent={status === 'under_review'}
          />

          {/* Milestone 3 */}
          <TimelineItem
            stepNumber={3}
            title="Physical Premise / Kitchen Inspection"
            description="On-ground campus operations team visits facility to audit equipment, hygiene, and cleanliness."
            isDone={status === 'approved'}
            isCurrent={status === 'under_review'}
          />

          {/* Milestone 4 */}
          <TimelineItem
            stepNumber={4}
            title="Marketplace Activation & Campus Badge"
            description="Provider storefront activated on EaseHub. Students can discover and book services."
            isDone={status === 'approved'}
            isCurrent={status === 'approved'}
          />
        </div>
      </div>

      {/* Campus Support Help Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
            Have questions regarding your verification audit?
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            Reach the EaseHub Campus Partner Operations Desk at partner-support@easehub.in
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('mailto:partner-support@easehub.in')}
          icon={<PhoneCall size={14} />}
        >
          Contact Partner Desk
        </Button>
      </div>

      {/* Developer / Demo Status Switcher (For testing Phase 11 & Phase 13 integration) */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <Info size={14} color="var(--color-text-muted)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Developer & Quality Assurance Test Harness (Phase 13 Admin Simulation)
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
          Simulate admin review outcomes to verify how the UI reacts to status transitions:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Button
            variant="ghost"
            size="sm"
            disabled={isSimulating || status === 'under_review'}
            onClick={() => handleSimulateStatus('under_review')}
          >
            Mark Under Review
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isSimulating || status === 'approved'}
            onClick={() => handleSimulateStatus('approved')}
            style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            Simulate Admin Approval
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isSimulating || status === 'rejected'}
            onClick={() => handleSimulateStatus('rejected')}
            style={{ color: '#FF7B72', borderColor: 'rgba(255, 43, 43, 0.3)' }}
          >
            Simulate Admin Rejection
          </Button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: ProviderApplicationStatus }> = ({ status }) => {
  const configs: Record<
    ProviderApplicationStatus,
    { label: string; bg: string; color: string; border: string; icon: React.ReactNode }
  > = {
    draft: {
      label: 'Draft Application',
      bg: 'rgba(255, 255, 255, 0.08)',
      color: 'var(--color-text-secondary)',
      border: 'rgba(255, 255, 255, 0.15)',
      icon: <Clock size={12} />,
    },
    submitted: {
      label: 'Submitted — Pending Review',
      bg: 'rgba(255, 255, 255, 0.1)',
      color: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.25)',
      icon: <Clock size={12} />,
    },
    under_review: {
      label: 'Campus Audit in Progress',
      bg: 'rgba(245, 158, 11, 0.15)',
      color: '#F59E0B',
      border: 'rgba(245, 158, 11, 0.35)',
      icon: <Clock size={12} />,
    },
    approved: {
      label: 'Verified & Approved Partner',
      bg: 'rgba(16, 185, 129, 0.15)',
      color: '#10B981',
      border: 'rgba(16, 185, 129, 0.35)',
      icon: <CheckCircle2 size={12} />,
    },
    rejected: {
      label: 'Application Not Approved',
      bg: 'rgba(255, 43, 43, 0.15)',
      color: '#FF7B72',
      border: 'rgba(255, 43, 43, 0.35)',
      icon: <XCircle size={12} />,
    },
    suspended: {
      label: 'Account Suspended',
      bg: 'rgba(255, 43, 43, 0.2)',
      color: '#FF2B2B',
      border: 'rgba(255, 43, 43, 0.5)',
      icon: <AlertTriangle size={12} />,
    },
  };

  const c = configs[status] || configs.draft;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '0.3rem 0.75rem',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontSize: '0.78rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    >
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
};

const TimelineItem: React.FC<{
  stepNumber: number;
  title: string;
  description: string;
  isDone: boolean;
  isCurrent: boolean;
}> = ({ stepNumber, title, description, isDone, isCurrent }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
    <div
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: isDone
          ? '#10B981'
          : isCurrent
          ? 'var(--color-brand-blue)'
          : 'var(--color-surface-3)',
        color: isDone || isCurrent ? '#FFFFFF' : 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        flexShrink: 0,
        marginTop: '2px',
      }}
    >
      {isDone ? '✓' : stepNumber}
    </div>
    <div>
      <div
        style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: isDone || isCurrent ? '#FFFFFF' : 'var(--color-text-secondary)',
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  </div>
);
