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
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: errorMessage ? 'var(--color-accent-red)' : 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label} {required && <span style={{ color: 'var(--color-brand-red)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
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
            backgroundColor: 'var(--color-surface-2)',
            border: `1px solid ${errorMessage ? 'var(--color-accent-red)' : 'var(--color-border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            color: '#FFFFFF',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color var(--duration-fast)',
            opacity: disabled ? 0.6 : 1,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errorMessage
              ? 'var(--color-accent-red)'
              : 'var(--color-border-subtle)';
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
            color: 'var(--color-text-muted)',
            cursor: disabled ? 'not-allowed' : 'pointer',
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
            fontSize: '0.72rem',
            color: 'var(--color-accent-red)',
            marginTop: '0.15rem',
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
