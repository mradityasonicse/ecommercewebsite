import React, { useId, useState } from 'react';
import { Search, X, Check, ChevronDown, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';

// --- Shared Form Field Shell ---
export interface FieldWrapperProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  required?: boolean;
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  helperText,
  errorMessage,
  successMessage,
  required,
  id,
  children,
  style = {},
  className = '',
}) => {
  return (
    <div className={`easehub-field-group ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-body-xs)',
            fontWeight: 600,
            color: errorMessage ? 'var(--color-semantic-error)' : 'var(--color-text-secondary)',
          }}
        >
          <span>{label}</span>
          {required && <span style={{ color: 'var(--color-brand-red)' }}>*</span>}
        </label>
      )}

      {children}

      {errorMessage && (
        <p
          id={`${id}-error`}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-semantic-error)',
            margin: 0,
          }}
        >
          <AlertCircle size={13} />
          <span>{errorMessage}</span>
        </p>
      )}

      {!errorMessage && successMessage && (
        <p
          id={`${id}-success`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-semantic-success)',
            margin: 0,
          }}
        >
          <CheckCircle2 size={13} />
          <span>{successMessage}</span>
        </p>
      )}

      {!errorMessage && !successMessage && helperText && (
        <p
          id={`${id}-helper`}
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

// --- Text Input ---
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorMessage,
  successMessage,
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = true,
  disabled,
  id: customId,
  className = '',
  style = {},
  ...props
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const [focused, setFocused] = useState(false);

  const getHeight = () => {
    switch (size) {
      case 'sm': return '34px';
      case 'lg': return '48px';
      case 'md': default: return '40px';
    }
  };

  const getBorderColor = () => {
    if (errorMessage) return 'var(--color-semantic-error)';
    if (successMessage) return 'var(--color-semantic-success)';
    if (focused) return 'var(--color-brand-blue)';
    return 'var(--color-border-default)';
  };

  return (
    <FieldWrapper
      id={id}
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      successMessage={successMessage}
      required={props.required}
      style={{ width: fullWidth ? '100%' : 'auto' }}
      className={className}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: disabled ? 'rgba(255, 255, 255, 0.02)' : 'var(--color-surface-1)',
          border: `1px solid ${getBorderColor()}`,
          borderRadius: 'var(--radius-sm)',
          height: getHeight(),
          padding: '0 0.75rem',
          gap: '0.5rem',
          boxShadow: focused ? (errorMessage ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : 'var(--shadow-focus)') : 'none',
          transition: 'all var(--duration-fast) var(--ease-standard)',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {iconLeft && <span style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}>{iconLeft}</span>}
        <input
          id={id}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text-primary)',
            fontSize: size === 'sm' ? 'var(--text-body-xs)' : 'var(--text-body-sm)',
            fontFamily: 'var(--font-body)',
            width: '100%',
            cursor: disabled ? 'not-allowed' : 'text',
            ...style,
          }}
          {...props}
        />
        {iconRight && <span style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}>{iconRight}</span>}
      </div>
    </FieldWrapper>
  );
};

// --- Search Input ---
export interface SearchInputProps extends Omit<InputProps, 'iconLeft'> {
  onClear?: () => void;
  shortcut?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onClear,
  shortcut = '⌘K',
  value,
  ...props
}) => {
  return (
    <Input
      type="search"
      iconLeft={<Search size={16} />}
      iconRight={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          )}
          {shortcut && (
            <kbd
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--color-text-secondary)',
                padding: '0.15rem 0.35rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              {shortcut}
            </kbd>
          )}
        </div>
      }
      value={value}
      {...props}
    />
  );
};

// --- Select Dropdown ---
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  errorMessage,
  options,
  size = 'md',
  fullWidth = true,
  disabled,
  id: customId,
  style = {},
  ...props
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const [focused, setFocused] = useState(false);

  const getHeight = () => {
    switch (size) {
      case 'sm': return '34px';
      case 'lg': return '48px';
      case 'md': default: return '40px';
    }
  };

  return (
    <FieldWrapper
      id={id}
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      required={props.required}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: disabled ? 'rgba(255, 255, 255, 0.02)' : 'var(--color-surface-1)',
          border: `1px solid ${errorMessage ? 'var(--color-semantic-error)' : focused ? 'var(--color-brand-blue)' : 'var(--color-border-default)'}`,
          borderRadius: 'var(--radius-sm)',
          height: getHeight(),
          boxShadow: focused ? 'var(--shadow-focus)' : 'none',
          transition: 'all var(--duration-fast) var(--ease-standard)',
        }}
      >
        <select
          id={id}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: '100%',
            padding: '0 2.25rem 0 0.85rem',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text-primary)',
            fontSize: size === 'sm' ? 'var(--text-body-xs)' : 'var(--text-body-sm)',
            fontFamily: 'var(--font-body)',
            appearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...style,
          }}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              style={{ backgroundColor: '#0D111A', color: '#F8FAFC' }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          style={{
            position: 'absolute',
            right: '0.75rem',
            pointerEvents: 'none',
            color: 'var(--color-text-muted)',
          }}
        />
      </div>
    </FieldWrapper>
  );
};

// --- Textarea ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  fullWidth?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  errorMessage,
  fullWidth = true,
  disabled,
  id: customId,
  style = {},
  rows = 4,
  ...props
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const [focused, setFocused] = useState(false);

  return (
    <FieldWrapper
      id={id}
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      required={props.required}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          backgroundColor: disabled ? 'rgba(255, 255, 255, 0.02)' : 'var(--color-surface-1)',
          border: `1px solid ${errorMessage ? 'var(--color-semantic-error)' : focused ? 'var(--color-brand-blue)' : 'var(--color-border-default)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 0.85rem',
          outline: 'none',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-body-sm)',
          fontFamily: 'var(--font-body)',
          resize: 'vertical',
          boxShadow: focused ? 'var(--shadow-focus)' : 'none',
          transition: 'all var(--duration-fast) var(--ease-standard)',
          cursor: disabled ? 'not-allowed' : 'text',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      />
    </FieldWrapper>
  );
};

// --- Checkbox ---
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  checked,
  disabled,
  onChange,
  id: customId,
  style = {},
  ...props
}) => {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: '0.65rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        ...style,
      }}
    >
      <div style={{ position: 'relative', marginTop: '2px' }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0,
          }}
          {...props}
        />
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: 'var(--radius-xs)',
            border: `1px solid ${checked ? 'var(--color-brand-blue)' : 'var(--color-border-strong)'}`,
            backgroundColor: checked ? 'var(--color-brand-blue)' : 'var(--color-surface-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--duration-fast) var(--ease-standard)',
          }}
        >
          {checked && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
        </div>
      </div>
      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {label && (
            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

// --- Switch / Toggle ---
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id: customId,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
      }}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '40px',
          height: '22px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: checked ? 'var(--color-brand-blue)' : 'var(--color-surface-3)',
          border: `1px solid ${checked ? 'var(--color-brand-blue)' : 'var(--color-border-default)'}`,
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: 0,
          outline: 'none',
          transition: 'background-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '20px' : '2px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
            transition: 'left var(--duration-fast) var(--ease-emphasized)',
          }}
        />
      </button>
      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && (
            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

// --- Quantity Selector ---
export interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  disabled = false,
}) => {
  const handleDec = () => {
    if (value - step >= min && !disabled) onChange(value - step);
  };
  const handleInc = () => {
    if (value + step <= max && !disabled) onChange(value + step);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.2rem',
        gap: '0.25rem',
      }}
    >
      <button
        type="button"
        onClick={handleDec}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        style={{
          width: '28px',
          height: '28px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          color: value <= min ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
          cursor: value <= min || disabled ? 'not-allowed' : 'pointer',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        <Minus size={14} />
      </button>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-body-sm)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          minWidth: '28px',
          textAlign: 'center',
        }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleInc}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        style={{
          width: '28px',
          height: '28px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          color: value >= max ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
          cursor: value >= max || disabled ? 'not-allowed' : 'pointer',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
