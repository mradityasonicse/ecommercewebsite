import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { ServiceSortOption } from '../../types/service';

interface SortControlProps {
  value: ServiceSortOption;
  onChange: (sort: ServiceSortOption) => void;
}

export const SortControl: React.FC<SortControlProps> = ({ value, onChange }) => {
  const sortOptions: Array<{ id: ServiceSortOption; label: string }> = [
    { id: 'recommended', label: 'Sort: Recommended' },
    { id: 'popular', label: 'Sort: Most Popular' },
    { id: 'rating', label: 'Sort: Highest Rated' },
    { id: 'price-asc', label: 'Sort: Price: Low to High' },
    { id: 'price-desc', label: 'Sort: Price: High to Low' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <label htmlFor="service-sort-select" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        Sort services
      </label>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.45rem 0.85rem',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          transition: 'border-color var(--duration-fast)',
        }}
        className="sort-control-wrapper"
      >
        <ArrowUpDown size={14} color="var(--color-brand-blue)" />
        <select
          id="service-sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as ServiceSortOption)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            cursor: 'pointer',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            paddingRight: '1rem',
          }}
        >
          {sortOptions.map((opt) => (
            <option
              key={opt.id}
              value={opt.id}
              style={{
                backgroundColor: 'var(--color-surface-2)',
                color: '#FFFFFF',
              }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginLeft: '-0.75rem', pointerEvents: 'none' }}>
          ▼
        </span>
      </div>

      <style>{`
        .sort-control-wrapper:hover {
          border-color: rgba(255, 255, 255, 0.35);
        }
        .sort-control-wrapper:focus-within {
          border-color: #FFFFFF;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>
  );
};
