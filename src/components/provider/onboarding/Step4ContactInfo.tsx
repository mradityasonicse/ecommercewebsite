import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { ProviderContactInfo } from '../../../types/provider';

interface Step4ContactInfoProps {
  contactInfo: ProviderContactInfo;
  onChange: (info: Partial<ProviderContactInfo>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step4ContactInfo: React.FC<Step4ContactInfoProps> = ({
  contactInfo,
  onChange,
  onContinue,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!contactInfo.contactPerson?.trim()) {
      errs.contactPerson = 'Contact person name is required.';
    }

    const cleanPhone = (contactInfo.phone || '').replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Contact phone number is required.';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactInfo.email?.trim()) {
      errs.email = 'Official contact email is required.';
    } else if (!emailRegex.test(contactInfo.email.trim())) {
      errs.email = 'Please provide a valid email address.';
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
          Primary Contact & Communications
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Provide the direct contact details for the person managing campus operations and order fulfillment.
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
        {/* Contact Person Name & Designation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label
              htmlFor="contactPerson"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.45rem',
              }}
            >
              Contact Person Name *
            </label>
            <input
              id="contactPerson"
              type="text"
              placeholder="e.g. Rajesh Sharma, Sarita Devi"
              value={contactInfo.contactPerson || ''}
              onChange={(e) => {
                onChange({ contactPerson: e.target.value });
                if (errors.contactPerson) setErrors((prev) => ({ ...prev, contactPerson: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: errors.contactPerson
                  ? '1px solid var(--color-accent-red)'
                  : '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            {errors.contactPerson && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
                <AlertCircle size={13} />
                <span>{errors.contactPerson}</span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="designation"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.45rem',
              }}
            >
              Designation / Role (Optional)
            </label>
            <input
              id="designation"
              type="text"
              placeholder="e.g. Owner, Operations Lead, Manager"
              value={contactInfo.designation || ''}
              onChange={(e) => onChange({ designation: e.target.value })}
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

        {/* Mobile Phone & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label
              htmlFor="phone"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.45rem',
              }}
            >
              Mobile Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={contactInfo.phone || ''}
              onChange={(e) => {
                onChange({ phone: e.target.value });
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: errors.phone
                  ? '1px solid var(--color-accent-red)'
                  : '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            {errors.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
                <AlertCircle size={13} />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.45rem',
              }}
            >
              Official Email Address *
            </label>
            <input
              id="email"
              type="email"
              placeholder="partner@yourbusiness.com"
              value={contactInfo.email || ''}
              onChange={(e) => {
                onChange({ email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: errors.email
                  ? '1px solid var(--color-accent-red)'
                  : '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            {errors.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
                <AlertCircle size={13} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Mobile & Preferences */}
        <div>
          <label
            htmlFor="whatsappNumber"
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.45rem',
            }}
          >
            WhatsApp Business Number (Optional)
          </label>
          <input
            id="whatsappNumber"
            type="tel"
            placeholder="Leave blank if identical to primary phone"
            value={contactInfo.whatsappNumber || ''}
            onChange={(e) => onChange({ whatsappNumber: e.target.value })}
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

        {/* Checkbox: WhatsApp Order Dispatch Alerts */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={contactInfo.useWhatsappForAlerts}
            onChange={(e) => onChange({ useWhatsappForAlerts: e.target.checked })}
            style={{ marginTop: '3px', accentColor: 'var(--color-brand-blue)' }}
          />
          <div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
              Receive instant student service orders on WhatsApp
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
              EaseHub bot will dispatch urgent student bookings directly to your verified phone.
            </span>
          </div>
        </label>

        {/* Checkbox: Phone Number Privacy */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={!contactInfo.publicPhoneVisible}
            onChange={(e) => onChange({ publicPhoneVisible: !e.target.checked })}
            style={{ marginTop: '3px', accentColor: 'var(--color-brand-blue)' }}
          />
          <div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="var(--color-blue-light)" />
              <span>Mask personal phone number on public student listings</span>
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
              Students will reach you via EaseHub in-app messaging instead of your direct mobile number.
            </span>
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
        <Button variant="ghost" size="md" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back: Business Info
        </Button>
        <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />}>
          Continue: Services & Pricing
        </Button>
      </div>
    </div>
  );
};
