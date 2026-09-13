import React from 'react';

export interface CategoryTagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({
  children,
  active = false,
  count,
  icon,
  className = '',
  style = {},
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`easehub-category-tag ${active ? 'active' : ''} ${className}`}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-pill)',
        fontSize: 'var(--text-body-xs)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        backgroundColor: active ? 'var(--color-brand-blue)' : 'var(--color-surface-1)',
        color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
        border: active ? '1px solid var(--color-brand-blue)' : '1px solid var(--color-border-default)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--duration-fast) var(--ease-standard)',
        outline: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-1)';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.borderColor = 'var(--color-border-default)';
        }
      }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
      {typeof count === 'number' && (
        <span
          style={{
            fontSize: '0.7rem',
            padding: '0.05rem 0.35rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
            color: active ? '#FFFFFF' : 'var(--color-text-muted)',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
