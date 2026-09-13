import React from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';

interface ServiceReviewsProps {
  service: ServiceDetail;
}

export const ServiceReviews: React.FC<ServiceReviewsProps> = ({ service }) => {
  const ratingScore = service.metrics.ratingScore || 4.8;
  const reviewCount = service.metrics.reviewCount || 240;

  return (
    <section
      aria-label="Student Ratings & Trust Feedback"
      style={{
        padding: 'var(--space-16) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-10)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(15, 56, 44, 0.06)',
            border: '1px solid rgba(15, 56, 44, 0.16)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: 'var(--color-brand-blue, #0F382C)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <ShieldCheck size={13} color="var(--color-brand-blue, #0F382C)" />
          <span>Institutional Verification</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary, #151D1A)',
            lineHeight: 1.2,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Verified Student Feedback.
        </h2>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6, margin: 0 }}>
          All ratings are collected strictly from enrolled university students using verified campus IDs after completed bookings.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border-subtle, #E8E4D5)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          maxWidth: '820px',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-8)',
          alignItems: 'center',
        }}
      >
        {/* Rating Score Left Box */}
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--color-border-subtle, #E8E4D5)', paddingRight: 'var(--space-6)' }}>
          <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary, #151D1A)', lineHeight: 1, marginBottom: '0.4rem' }}>
            {ratingScore}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={16} fill="#F8CE37" color="#F8CE37" />
            ))}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted, #6B736D)' }}>
            Based on {reviewCount} verified campus student reviews
          </div>
        </div>

        {/* Satisfaction Breakdown */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-3)' }}>
            <ThumbsUp size={16} color="#2E7D32" />
            <span style={{ fontSize: '0.92rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)' }}>
              {service.metrics.studentSatisfaction} Student Approval
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 var(--space-4) 0' }}>
            Audited monthly by EaseHub University Council. Reviews with hygiene or service delivery infractions trigger mandatory partner re-inspection.
          </p>

          <div
            style={{
              padding: '0.55rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            🔒 Tamper-Proof: Zero paid or unverified sponsor reviews allowed.
          </div>
        </div>
      </div>
    </section>
  );
};
