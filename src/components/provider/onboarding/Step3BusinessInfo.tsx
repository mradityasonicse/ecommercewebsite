import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { ProviderBusinessInfo } from '../../../types/provider';

interface Step3BusinessInfoProps {
  businessInfo: ProviderBusinessInfo;
  onChange: (info: Partial<ProviderBusinessInfo>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step3BusinessInfo: React.FC<Step3BusinessInfoProps> = ({
  businessInfo,
  onChange,
  onContinue,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!businessInfo.businessName?.trim()) {
      errs.businessName = 'Business or trading name is required.';
    } else if (businessInfo.businessName.trim().length < 3) {
      errs.businessName = 'Business name must be at least 3 characters.';
    }

    if (!businessInfo.description?.trim()) {
      errs.description = 'Please provide a brief description of your services.';
    } else if (businessInfo.description.trim().length < 20) {
      errs.description = 'Description must be at least 20 characters for student clarity.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onContinue();
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: 'var(--text-h3)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.5rem',
          }}
        >
          Tell Us About Your Business
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          This information will appear on your verified campus profile and student service cards.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          backgroundColor: 'var(--color-surface-1)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '2rem',
        }}
      >
        {/* Business Name */}
        <div>
          <label
            htmlFor="businessName"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.45rem',
            }}
          >
            <span>Trading / Business Name *</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Publicly visible</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="businessName"
              type="text"
              placeholder="e.g. Maa Ki Rasoi, SpinCraft Laundry, Zenith PG"
              value={businessInfo.businessName || ''}
              onChange={(e) => {
                onChange({ businessName: e.target.value });
                if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: errors.businessName
                  ? '1px solid var(--color-accent-red)'
                  : '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>
          {errors.businessName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
              <AlertCircle size={13} />
              <span>{errors.businessName}</span>
            </div>
          )}
        </div>

        {/* Legal Entity Name (Optional) */}
        <div>
          <label
            htmlFor="legalEntityName"
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.45rem',
            }}
          >
            Registered Legal Name (Optional)
          </label>
          <input
            id="legalEntityName"
            type="text"
            placeholder="e.g. Maa Ki Rasoi Foodworks LLP, SpinCraft Cleaners Pvt Ltd"
            value={businessInfo.legalEntityName || ''}
            onChange={(e) => onChange({ legalEntityName: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
            Used for institutional invoices and campus compliance.
          </span>
        </div>

        {/* Business Description */}
        <div>
          <label
            htmlFor="description"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.45rem',
            }}
          >
            <span>Business Description & Standards *</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Min 20 characters</span>
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your student offerings, hygiene/sanitation processes, turnaround commitment, or dietary standards..."
            value={businessInfo.description || ''}
            onChange={(e) => {
              onChange({ description: e.target.value });
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-surface-2)',
              border: errors.description
                ? '1px solid var(--color-accent-red)'
                : '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.5,
            }}
          />
          {errors.description && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
              <AlertCircle size={13} />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        {/* Two-column Row: Year Established & Regulatory Registration */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label
              htmlFor="yearEstablished"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.45rem',
              }}
            >
              Year Established (Optional)
            </label>
            <input
              id="yearEstablished"
              type="number"
              placeholder="e.g. 2019"
              min={1980}
              max={2026}
              value={businessInfo.yearEstablished || ''}
              onChange={(e) => onChange({ yearEstablished: parseInt(e.target.value, 10) || undefined })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="tradeLicenseOrFSSAI"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.45rem',
              }}
            >
              FSSAI / Trade License / GST (Optional)
            </label>
            <input
              id="tradeLicenseOrFSSAI"
              type="text"
              placeholder="e.g. 11522026000123 / 07AAACH..."
              value={businessInfo.tradeLicenseOrFSSAI || ''}
              onChange={(e) => onChange({ tradeLicenseOrFSSAI: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
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
        <Button variant="ghost" size="md" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back: Category
        </Button>
        <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />}>
          Continue: Contact Details
        </Button>
      </div>
    </div>
  );
};
