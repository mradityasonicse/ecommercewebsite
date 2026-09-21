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
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || '');

  const handleClick = useCallback(() => {
    if (onTrigger) {
      onTrigger();
      return;
    }
    window.dispatchEvent(new CustomEvent('easehub_open_command_palette'));
  }, [onTrigger]);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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
        aria-label="Open search (Ctrl+K or ⌘K)"
        className={`easehub-search-trigger-compact ${className}`}
        style={{
          width: '38px',
          height: '38px',
          minWidth: '38px',
          minHeight: '38px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-default)',
          color: 'var(--color-text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
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
      aria-keyshortcuts="Control+K Meta+K"
      title={`Search catalog (${isMac ? '⌘K' : 'Ctrl+K'})`}
      className={`easehub-search-trigger ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.42rem 0.85rem',
        backgroundColor: 'var(--color-surface-2)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-body-xs)',
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        outline: 'none',
        minWidth: '210px',
        transition: 'border-color var(--duration-fast), background-color var(--duration-fast)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        e.currentTarget.style.backgroundColor = 'var(--color-surface-1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
        e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
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
          userSelect: 'none',
        }}
      >
        {isMac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  );
};
