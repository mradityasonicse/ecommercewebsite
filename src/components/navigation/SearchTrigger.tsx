import React, { useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

export interface SearchTriggerProps {
  onTrigger?: () => void;
  variant?: 'desktop' | 'compact' | 'mobile';
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchTrigger: React.FC<SearchTriggerProps> = ({
  onTrigger,
  variant = 'desktop',
  placeholder = 'Search services, providers...',
  className = '',
  style = {},
}) => {
  const handleClick = useCallback(() => {
    if (onTrigger) {
      onTrigger();
    } else {
      const el = document.getElementById('discovery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onTrigger]);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClick]);

  if (variant === 'mobile' || variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Open search"
        className={`easehub-search-trigger-compact ${className}`}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-default)',
          color: 'var(--color-text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          ...style,
        }}
      >
        <Search size={16} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Search verified campus services"
      className={`easehub-search-trigger ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.45rem 0.85rem',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-pill)',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-body-xs)',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        outline: 'none',
        minWidth: '220px',
        ...style,
      }}
    >
      <Search size={14} color="var(--color-text-muted)" />
      <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {placeholder}
      </span>
      <kbd
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          color: 'var(--color-text-secondary)',
          padding: '0.1rem 0.35rem',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid var(--color-border-subtle)',
          flexShrink: 0,
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
};
