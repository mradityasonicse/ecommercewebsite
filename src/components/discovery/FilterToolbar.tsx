import React from 'react';
import { SlidersHorizontal, X, School } from 'lucide-react';
import type { Campus } from '../../data/campuses';
import { CAMPUSES } from '../../data/campuses';
import type { ServiceFilterParams, ServiceSortOption } from '../../types/service';
import { SortControl } from './SortControl';

interface FilterToolbarProps {
  totalCount: number;
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  filters: ServiceFilterParams;
  onFiltersChange: (filters: ServiceFilterParams) => void;
  onOpenMobileFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  totalCount,
  selectedCampus,
  onCampusChange,
  filters,
  onFiltersChange,
  onOpenMobileFilters,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        paddingTop: 'var(--space-4)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Dynamic Count & Campus Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '0.95rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {totalCount} {totalCount === 1 ? 'service' : 'services'} available
        </span>

        <span style={{ color: 'var(--color-text-muted)' }}>•</span>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <School size={14} color="var(--color-brand-blue)" />
          <select
            value={selectedCampus.id}
            onChange={(e) => {
              const camp = CAMPUSES.find(c => c.id === e.target.value);
              if (camp) {
                onCampusChange(camp);
                onFiltersChange({ ...filters, campusId: camp.id });
              }
            }}
            aria-label="Filter by university campus"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-blue-light)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {CAMPUSES.map((c) => (
              <option
                key={c.id}
                value={c.id}
                style={{ backgroundColor: 'var(--color-surface-2)', color: '#FFFFFF' }}
              >
                {c.shortName}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 43, 43, 0.1)',
              border: '1px solid rgba(255, 43, 43, 0.25)',
              color: 'var(--color-brand-red)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <X size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Desktop & Mobile Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: hasActiveFilters ? '#FFFFFF' : 'var(--color-surface-1)',
            border: hasActiveFilters ? '1px solid #FFFFFF' : '1px solid var(--color-border-subtle)',
            color: hasActiveFilters ? '#080A0F' : 'var(--color-text-secondary)',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          className="mobile-filter-trigger"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-blue)',
              }}
            />
          )}
        </button>

        {/* Sort Control */}
        <SortControl
          value={filters.sort || 'recommended'}
          onChange={(newSort: ServiceSortOption) => onFiltersChange({ ...filters, sort: newSort })}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-filter-trigger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};
