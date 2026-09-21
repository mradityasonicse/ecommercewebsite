import React from 'react';
import { ShieldCheck, MessageSquare, CheckCircle, Lock } from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';

interface ServiceReviewsProps {
  service: ServiceDetail;
}

export const ServiceReviews: React.FC<ServiceReviewsProps> = ({ service }) => {
  return (
    <section
      aria-label="Student Ratings and Review Policy"
      style={{
        padding: 'var(--space-12) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-8)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.16)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: 'var(--color-brand-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <ShieldCheck size={13} color="var(--color-brand-blue)" />
          <span>Trust & Review Standard</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.25,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Verified Student Reviews
        </h2>

        <p style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          EaseHub enforces an authentic review policy: reviews are submitted exclusively by enrolled campus students with verified student IDs after completing a booking.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          maxWidth: '820px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-6)',
            alignItems: 'center',
          }}
        >
          {/* Honest Status Block */}
          <div
            style={{
              padding: 'var(--space-6)',
              backgroundColor: '#f8faf9',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-3)',
                color: 'var(--color-brand-blue)',
              }}
            >
              <MessageSquare size={22} />
            </div>

            <div
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif, "Domine", serif)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-1)',
              }}
            >
              No Public Reviews Yet
            </div>

            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              This {service.name.toLowerCase()} catalog is active for campus requests. Reviews appear once completed requests receive student evaluations.
            </p>
          </div>

          {/* Tamper-Proof Safeguards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <CheckCircle size={18} color="#2E7D32" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Completed Requests Only
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Only students with confirmed fulfilled bookings receive review invites.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <Lock size={18} color="var(--color-brand-blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Zero Fake or Sponsored Ratings
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Unverified third-party ratings, self-reviews by providers, and paid placements are blocked.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <ShieldCheck size={18} color="var(--color-brand-blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  1 Review Per Completed Request
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Enforced at the database layer to prevent spam or duplicate submissions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
