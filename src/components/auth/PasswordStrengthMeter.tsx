import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const criteria = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Contains special character (!@#$)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = criteria.filter((c) => c.met).length;

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong & Secure';
  };

  const getColor = () => {
    if (score <= 1) return '#EF4444';
    if (score === 2) return '#F59E0B';
    if (score === 3) return '#34D399';
    return '#10B981';
  };

  if (!password) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.35rem' }}>
      {/* Strength Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: step <= score ? getColor() : 'var(--color-surface-3)',
              transition: 'all var(--duration-fast)',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Password Security:</span>
        <span style={{ color: getColor(), fontWeight: 700 }}>{getStrengthLabel()}</span>
      </div>

      {/* Checklist (compact) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.5rem', marginTop: '0.2rem' }}>
        {criteria.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', color: c.met ? '#22C55E' : 'var(--color-text-muted)' }}>
            {c.met ? <Check size={11} strokeWidth={3} /> : <X size={11} />}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
