import React from 'react';
import { SlidersHorizontal, X, School } from 'lucide-react';
import type { Campus } from '../../data/campuses';
import { CAMPUSES } from '../../data/campuses';
import type { ServiceFilterParams, ServiceSortOption, ServiceCategory } from '../../types/service';
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
  categories?: ServiceCategory[];
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
  categories = [],
}) => {
  const activeCategoryObj = categories.find(
    (c) => c.id === filters.category || c.slug === filters.category
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        paddingTop: 'var(--space-4)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Primary Row: Count, Campus Hub, Reset, and Sort */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        {/* Dynamic Count & Campus Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 'var(--text-body)',
              fontFamily: 'var(--font-family-body)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
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
                const camp = CAMPUSES.find((c) => c.id === e.target.value);
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
                color: 'var(--color-brand-blue)',
                fontSize: 'var(--text-body-sm)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {CAMPUSES.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-primary)' }}
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
                padding: '0.2rem 0.6rem',
                minHeight: '28px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-brand-red)',
                fontSize: 'var(--text-caption)',
                fontFamily: 'var(--font-family-label)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color var(--duration-fast)',
              }}
            >
              <X size={12} />
              <span>Reset All</span>
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
              padding: '0.5rem 0.95rem',
              minHeight: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: hasActiveFilters ? 'var(--color-surface-2)' : 'var(--color-surface-1)',
              border: hasActiveFilters ? '1px solid var(--color-brand-blue)' : '1px solid var(--color-border-subtle)',
              color: hasActiveFilters ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
              fontSize: 'var(--text-button)',
              fontFamily: 'var(--font-family-button)',
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
                  width: '7px',
                  height: '7px',
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
      </div>

      {/* Active Filter Chips (If active) */}
      {hasActiveFilters && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap',
            paddingTop: '0.25rem',
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-uppercase)',
              fontWeight: 600,
            }}
          >
            Applied:
          </span>

          {filters.category && filters.category !== 'all' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-primary)',
              }}
            >
              <span>Category: {activeCategoryObj ? activeCategoryObj.label : filters.category}</span>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, category: 'all' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                aria-label="Remove category filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.availability && filters.availability !== 'all' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-primary)',
              }}
            >
              <span>
                Status:{' '}
                {filters.availability === 'available'
                  ? 'Available Now'
                  : filters.availability === 'limited'
                  ? 'Limited Slots'
                  : 'Coming Soon'}
              </span>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, availability: 'all' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                aria-label="Remove availability filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.maxPrice !== undefined && filters.maxPrice > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-primary)',
              }}
            >
              <span>Under ₹{filters.maxPrice}</span>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, maxPrice: undefined })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                aria-label="Remove price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.search && filters.search.trim() && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-primary)',
              }}
            >
              <span>Search: "{filters.search}"</span>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, search: '' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                aria-label="Clear search filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

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
