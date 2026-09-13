import React from 'react';
import { ShieldCheck, Users, Banknote, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';

interface Step1WelcomeProps {
  onContinue: () => void;
  onCheckStatus?: () => void;
  onBackToLanding?: () => void;
  hasExistingDraft?: boolean;
}

export const Step1Welcome: React.FC<Step1WelcomeProps> = ({
  onContinue,
  onCheckStatus,
  onBackToLanding,
  hasExistingDraft,
}) => {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Editorial Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '1rem',
          }}
        >
          <ShieldCheck size={14} />
          <span>EaseHub Partner Ecosystem</span>
        </div>

        <h1
          style={{
            fontSize: 'var(--text-h2)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: '0.75rem',
          }}
        >
          Grow Your Campus Business with EaseHub
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Connect directly with thousands of verified university hostelers. Manage orders seamlessly, eliminate intermediary broker fees, and receive prompt, guaranteed payouts.
        </p>
      </div>

      {/* 4 Value Proposition Pillars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
            }}
          >
            <Users size={20} />
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Direct Student Reach
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Immediate visibility across student dorms, campus gates, and academic departments.
          </p>
        </div>

        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
            }}
          >
            <Banknote size={20} />
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Zero Brokerage & Timely Payouts
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Retain 100% of standard service pricing with transparent weekly automated settlement cycles.
          </p>
        </div>

        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 43, 43, 0.15)',
              color: '#FF7B72',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Campus Trust Badge
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Earn EaseHub Verified Partner accreditation after our physical premise and hygiene inspection.
          </p>
        </div>

        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
            }}
          >
            <Clock size={20} />
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Quick 10-Min Application
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Simple guided questionnaire. Your progress saves automatically so you can resume at any time.
          </p>
        </div>
      </div>

      {/* Required Information Checklist Box */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-default)',
          marginBottom: '2.5rem',
        }}
      >
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="var(--color-brand-blue)" />
          <span>What You Will Need for Onboarding:</span>
        </h4>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.65rem', margin: 0, paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
          <li>Official business or trading name</li>
          <li>Primary service category and standard rates</li>
          <li>Active contact person phone & email</li>
          <li>Campus-adjacent facility address & landmark</li>
          <li>Weekly operating schedule and service timings</li>
          <li>Business registration / FSSAI / GST (if applicable)</li>
        </ul>
      </div>

      {/* Action CTA Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          icon={<ArrowRight size={16} />}
        >
          {hasExistingDraft ? 'Continue Application Draft' : 'Start Provider Application'}
        </Button>

        {onCheckStatus && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onCheckStatus}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Check Existing Application Status
          </Button>
        )}

        {onBackToLanding && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onBackToLanding}
            style={{ color: 'var(--color-text-muted)' }}
          >
            ← Return to Provider Overview
          </Button>
        )}
      </div>
    </div>
  );
};
