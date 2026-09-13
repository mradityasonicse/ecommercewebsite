import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Building,
  User,
  MapPin,
  Clock,
  Tag,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import type { ProviderApplication } from '../../../types/provider';
import { CATEGORY_METADATA } from '../../../services/providerService';

interface Step8ReviewProps {
  applicationData: Omit<ProviderApplication, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'submittedAt'>;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

export const Step8Review: React.FC<Step8ReviewProps> = ({
  applicationData,
  onEditStep,
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const [agreedToStandards, setAgreedToStandards] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { businessInfo, contactInfo, services, location, availability } = applicationData;
  const cat = CATEGORY_METADATA[businessInfo.primaryCategory || 'food'];

  const handleSubmit = async () => {
    if (!agreedToStandards) {
      setSubmitError('You must agree to the EaseHub Campus Partner Compliance and Hygiene standards.');
      return;
    }
    setSubmitError('');
    try {
      await onSubmit();
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred submitting your application. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#10B981',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          <CheckCircle2 size={14} />
          <span>Final Step: Review & Confirm</span>
        </div>

        <h2
          style={{
            fontSize: 'var(--text-h3)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.5rem',
          }}
        >
          Review Your Partner Application
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Please verify all details below. You can click <strong>Edit</strong> on any section to make corrections before submitting.
        </p>
      </div>

      {submitError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(255, 43, 43, 0.12)',
            border: '1px solid rgba(255, 43, 43, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#FF7B72',
            fontSize: '0.84rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{submitError}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Section 1: Category & Business Info */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} color="var(--color-blue-light)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Business Details
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.35rem 0.65rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-blue-light)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Trading Name</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                {businessInfo.businessName}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Primary Category</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-blue-light)', marginTop: '2px' }}>
                {cat?.label}
              </div>
            </div>

            {businessInfo.legalEntityName && (
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Legal Entity</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  {businessInfo.legalEntityName}
                </div>
              </div>
            )}

            {businessInfo.tradeLicenseOrFSSAI && (
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>License / FSSAI / GST</span>
                <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  {businessInfo.tradeLicenseOrFSSAI}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Description & Standards</span>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginTop: '4px', margin: 0 }}>
              {businessInfo.description}
            </p>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--color-blue-light)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Contact & Communication
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.35rem 0.65rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-blue-light)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Contact Person</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                {contactInfo.contactPerson} {contactInfo.designation && `(${contactInfo.designation})`}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Mobile Phone</span>
              <div style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {contactInfo.phone}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Official Email</span>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {contactInfo.email}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>WhatsApp Order Dispatch</span>
              <div style={{ fontSize: '0.85rem', color: contactInfo.useWhatsappForAlerts ? '#10B981' : 'var(--color-text-muted)', marginTop: '2px', fontWeight: 600 }}>
                {contactInfo.useWhatsappForAlerts ? '✓ Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Services & Pricing */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={18} color="var(--color-blue-light)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Configured Services ({services.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.35rem 0.65rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-blue-light)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {services.map((s, idx) => (
              <div
                key={s.id || idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>{s.name}</div>
                  {s.description && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {s.description}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-blue-light)' }}>
                    ₹{s.price}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{s.pricingUnit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Location & Availability */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Location */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--color-blue-light)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Campus & Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(6)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--color-blue-light)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '0.35rem' }}>
              {location.campusName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              {location.facilityAddress}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              Landmark: {location.landmark} (Radius: {location.serviceRadiusKm} km)
            </div>
          </div>

          {/* Availability */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--color-blue-light)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Operating Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(7)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--color-blue-light)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
              {(availability.schedule || []).map((d) => (
                <span
                  key={d.day}
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.2rem 0.45rem',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: d.isOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: d.isOpen ? '#FFFFFF' : 'var(--color-text-muted)',
                    border: d.isOpen ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                  }}
                >
                  {d.label.slice(0, 3)}: {d.isOpen ? `${d.openTime}-${d.closeTime}` : 'Off'}
                </span>
              ))}
            </div>
            {availability.holidayNotice && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                Notice: {availability.holidayNotice}
              </div>
            )}
          </div>
        </div>

        {/* Terms of Compliance & Physical Audit Agreement */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={agreedToStandards}
            onChange={(e) => {
              setAgreedToStandards(e.target.checked);
              if (submitError) setSubmitError('');
            }}
            style={{ marginTop: '3px', accentColor: 'var(--color-brand-blue)', width: '18px', height: '18px' }}
          />
          <div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--color-blue-light)" />
              <span>Campus Partner Audit & Fair Pricing Declaration *</span>
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '4px 0 0 0' }}>
              I certify that the information provided is accurate and authentic. I agree to allow the EaseHub Campus Operations team to inspect our physical premises/equipment prior to student activation, and agree to maintain honest, student-first transparent pricing with zero undisclosed fees.
            </p>
          </div>
        </label>
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1.5rem',
        }}
      >
        <Button variant="ghost" size="md" onClick={onBack} disabled={isSubmitting} icon={<ArrowLeft size={16} />}>
          Back: Hours
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          icon={<CheckCircle2 size={18} />}
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application for Review'}
        </Button>
      </div>
    </div>
  );
};
