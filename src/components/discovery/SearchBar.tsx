import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search services, providers, or categories...',
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current && !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <label htmlFor="discovery-search-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        Search services, providers, or categories
      </label>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '0 1rem',
          transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
        }}
        className="search-bar-container"
      >
        <Search
          size={18}
          color="var(--color-text-muted)"
          style={{ flexShrink: 0, marginRight: '0.75rem' }}
          aria-hidden="true"
        />

        <input
          id="discovery-search-input"
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
          }}
        />

        {value ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              transition: 'background-color var(--duration-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            <X size={14} />
          </button>
        ) : (
          <div
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-muted)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              userSelect: 'none',
              marginLeft: '0.5rem',
            }}
          >
            /
          </div>
        )}
      </div>

      <style>{`
        .search-bar-container:focus-within {
          border-color: #FFFFFF !important;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.18) !important;
        }
      `}</style>
    </div>
  );
};
