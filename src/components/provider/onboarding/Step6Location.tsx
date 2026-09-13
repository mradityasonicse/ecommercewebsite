import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { ProviderLocationInfo } from '../../../types/provider';
import { CAMPUSES } from '../../../data/campuses';

interface Step6LocationProps {
  location: ProviderLocationInfo;
  onChange: (info: Partial<ProviderLocationInfo>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step6Location: React.FC<Step6LocationProps> = ({
  location,
  onChange,
  onContinue,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!location.campusId) {
      errs.campusId = 'Please select your primary campus hub.';
    }
    if (!location.facilityAddress?.trim()) {
      errs.facilityAddress = 'Facility address or shop location is required.';
    }
    if (!location.landmark?.trim()) {
      errs.landmark = 'A prominent landmark or campus gate reference is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onContinue();
    }
  };

  const handleCampusChange = (campusId: string) => {
    const matched = CAMPUSES.find((c) => c.id === campusId);
    onChange({
      campusId,
      campusName: matched ? matched.name : '',
      city: matched ? matched.city : location.city,
      state: matched ? matched.state : location.state,
    });
    if (errors.campusId) setErrors((prev) => ({ ...prev, campusId: '' }));
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
          Campus Association & Service Location
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Specify your physical operations center and service coverage area around the university perimeter.
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
        {/* Primary University Campus Hub */}
        <div>
          <label
            htmlFor="campusSelect"
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.45rem',
            }}
          >
            Target University Campus *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="campusSelect"
              value={location.campusId || ''}
              onChange={(e) => handleCampusChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: errors.campusId
                  ? '1px solid var(--color-accent-red)'
                  : '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            >
              <option value="" disabled>Select campus hub...</option>
              {CAMPUSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.city}, {c.state}
                </option>
              ))}
            </select>
          </div>
          {errors.campusId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
              <AlertCircle size={13} />
              <span>{errors.campusId}</span>
            </div>
          )}
        </div>

        {/* Facility Address */}
        <div>
          <label
            htmlFor="facilityAddress"
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.45rem',
            }}
          >
            Physical Facility / Shop / Kitchen Address *
          </label>
          <input
            id="facilityAddress"
            type="text"
            placeholder="e.g. Shop 4, Gate 2 Market, Shahbad Daulatpur"
            value={location.facilityAddress || ''}
            onChange={(e) => {
              onChange({ facilityAddress: e.target.value });
              if (errors.facilityAddress) setErrors((prev) => ({ ...prev, facilityAddress: '' }));
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-surface-2)',
              border: errors.facilityAddress
                ? '1px solid var(--color-accent-red)'
                : '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
          {errors.facilityAddress && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
              <AlertCircle size={13} />
              <span>{errors.facilityAddress}</span>
            </div>
          )}
        </div>

        {/* Landmark & Radius */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label
              htmlFor="landmark"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.45rem',
              }}
            >
              Prominent Campus Landmark *
            </label>
            <input
              id="landmark"
              type="text"
              placeholder="e.g. Opposite Campus Gate 2, Near Student Hostel"
              value={location.landmark || ''}
              onChange={(e) => {
                onChange({ landmark: e.target.value });
                if (errors.landmark) setErrors((prev) => ({ ...prev, landmark: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                border: errors.landmark
                  ? '1px solid var(--color-accent-red)'
                  : '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            {errors.landmark && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem', color: '#FF7B72', fontSize: '0.75rem' }}>
                <AlertCircle size={13} />
                <span>{errors.landmark}</span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="serviceRadius"
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
              <span>Service Radius from Campus</span>
              <span style={{ color: 'var(--color-blue-light)', fontFamily: 'var(--font-mono)' }}>
                {location.serviceRadiusKm || 2.5} km
              </span>
            </label>
            <input
              id="serviceRadius"
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={location.serviceRadiusKm || 2.5}
              onChange={(e) => onChange({ serviceRadiusKm: parseFloat(e.target.value) })}
              style={{
                width: '100%',
                accentColor: 'var(--color-brand-blue)',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Hostels within this radius will see your service as available for doorstep delivery.
            </span>
          </div>
        </div>

        {/* City, State, Pincode */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              City
            </label>
            <input
              type="text"
              value={location.city || ''}
              onChange={(e) => onChange({ city: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              State
            </label>
            <input
              type="text"
              value={location.state || ''}
              onChange={(e) => onChange({ state: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Pincode
            </label>
            <input
              type="text"
              placeholder="110042"
              value={location.pincode || ''}
              onChange={(e) => onChange({ pincode: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
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
          Back: Services
        </Button>
        <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />}>
          Continue: Operating Hours
        </Button>
      </div>
    </div>
  );
};
