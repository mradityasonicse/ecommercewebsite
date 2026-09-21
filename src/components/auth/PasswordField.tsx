import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  errorMessage?: string | null;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  value,
  onChange,
  label = 'Password',
  placeholder = '••••••••••••',
  required = true,
  autoComplete = 'current-password',
  errorMessage,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: errorMessage ? '#DC2626' : '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <Lock size={16} />
        </div>

        <input
          id={id}
          name={name || id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          style={{
            width: '100%',
            padding: '0.75rem 2.75rem 0.75rem 2.6rem',
            backgroundColor: '#FFFFFF',
            border: `1.5px solid ${errorMessage ? '#DC2626' : '#CBD5E1'}`,
            borderRadius: '10px',
            color: '#0F172A',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            opacity: disabled ? 0.6 : 1,
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#16A34A';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errorMessage ? '#DC2626' : '#CBD5E1';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {errorMessage && (
        <span
          id={`${id}-error`}
          role="alert"
          style={{
            fontSize: '0.75rem',
            color: '#DC2626',
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
