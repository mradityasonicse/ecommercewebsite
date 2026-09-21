import React from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, 
  X, 
  MessageCircle, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import type { BookingSubmissionData } from '../../utils/whatsapp';
import { buildBookingWhatsAppUrl } from '../../utils/whatsapp';

interface ThankYouTrustModalProps {
  data: BookingSubmissionData | null;
  onClose: () => void;
  onOpenTracker?: (tab?: 'mess' | 'laundry' | 'pg', orderId?: string) => void;
}

export const ThankYouTrustModal: React.FC<ThankYouTrustModalProps> = ({
  data,
  onClose,
  onOpenTracker,
}) => {
  if (!data) return null;

  const detectedKind = (data.serviceName || '').toLowerCase().includes('pg')
    ? 'pg'
    : (data.serviceName || '').toLowerCase().includes('laundry')
    ? 'laundry'
    : 'mess';

  const whatsappUrl = buildBookingWhatsAppUrl(data);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid rgba(22, 163, 74, 0.25)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 24px 64px -8px rgba(22, 163, 74, 0.18), 0 4px 16px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          textAlign: 'center',
          padding: 'var(--space-8)',
          position: 'relative',
          animation: 'motionModalEntrance var(--duration-fast, 200ms) var(--ease-smooth)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close thank you modal"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Luminous Trust Icon Badge */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            border: '2px solid #2E7D32',
            boxShadow: '0 0 24px rgba(46, 125, 50, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4) auto',
          }}
        >
          <CheckCircle2 size={38} color="#2E7D32" />
        </div>

        {/* Heading */}
        <h3
          style={{
            margin: '0 0 var(--space-2) 0',
            fontSize: 'clamp(1.5rem, 3vw, 1.85rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}
        >
          Thank You for Your Trust! 🙏
        </h3>

        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '460px',
            margin: '0 auto var(--space-6) auto',
          }}
        >
          Your request for <strong style={{ color: 'var(--color-brand-blue)' }}>{data.optionName || data.serviceName}</strong> has been received. Our on-campus coordinator has received your details on WhatsApp and will confirm your slot within 15 minutes.
        </p>

        {/* Reference & Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-6)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#2E7D32', fontWeight: 700 }}>
              REFERENCE: {data.referenceId}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} color="var(--color-brand-blue)" />
              15-Min Campus SLA
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.86rem' }}>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Service</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>{data.serviceName}</div>
            </div>

            {data.price && (
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Total Price</div>
                <div style={{ color: 'var(--color-brand-blue)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>₹{Number(data.price).toLocaleString()} {data.period ? `/${data.period}` : ''}</div>
              </div>
            )}

            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Student</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{data.studentName}</div>
            </div>

            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Hostel / Room</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{data.addressOrRoom}</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {onOpenTracker && (
            <button
              type="button"
              onClick={() => onOpenTracker(detectedKind, data.referenceId)}
              style={{
                padding: '0.95rem 1.4rem',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 800,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
                cursor: 'pointer',
              }}
            >
              <Clock size={18} color="#FFFFFF" />
              <span>📡 Track Live Status Now (#{data.referenceId})</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.9rem 1.4rem',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: '#25D366',
              color: '#0A1633',
              fontSize: '0.95rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)',
            }}
          >
            <MessageCircle size={18} color="#0A1633" />
            <span>Open in WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.8rem 1.4rem',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-3)';
              e.currentTarget.style.borderColor = 'var(--color-border-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}
          >
            Continue Exploring
          </button>
        </div>

        <div style={{ marginTop: 'var(--space-4)', fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={13} color="#2E7D32" />
          <span>EaseHub Verified Escrow Guarantee • Zero Brokerage</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
