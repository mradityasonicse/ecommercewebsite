import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, SlidersHorizontal, ArrowRight, RotateCcw } from 'lucide-react';
import type { Campus } from '../../data/campuses';
import { CAMPUSES } from '../../data/campuses';
import type { ServiceCategory, ServiceFilterParams } from '../../types/service';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  activeCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  filters: ServiceFilterParams;
  onFiltersChange: (filters: ServiceFilterParams) => void;
  onClearFilters: () => void;
  totalResultsCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  activeCampus,
  onCampusChange,
  filters,
  onFiltersChange,
  onClearFilters,
  totalResultsCount,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const pricePresets: Array<{ label: string; value: number | undefined }> = [
    { label: 'Any Price', value: undefined },
    { label: 'Under ₹200', value: 200 },
    { label: 'Under ₹500', value: 500 },
    { label: 'Under ₹1,500', value: 1500 },
    { label: 'Under ₹7,000', value: 7000 },
  ];

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter and Sort Services"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(5, 12, 28, 0.82)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer Sheet Container */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-surface-1)',
          borderTop: '1px solid var(--color-border-subtle)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -12px 36px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={18} color="var(--color-brand-blue)" />
            <h2
              style={{
                fontSize: 'var(--text-h3)',
                fontFamily: 'var(--font-family-h3)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              Filters & Discovery
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filter drawer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              minWidth: '36px',
              minHeight: '36px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* 1. University Campus / Area */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                fontFamily: 'var(--font-family-caption)',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-uppercase)',
                marginBottom: '0.65rem',
              }}
            >
              University Campus / Hub
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.45rem' }}>
              {CAMPUSES.map((c) => {
                const isSelected = c.id === activeCampus.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onCampusChange(c);
                      onFiltersChange({ ...filters, campusId: c.id });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                      border: isSelected ? '1px solid var(--color-brand-blue)' : '1px solid var(--color-border-subtle)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{c.name}</span>
                    {isSelected && <Check size={16} color="var(--color-brand-blue)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Service Category */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                fontFamily: 'var(--font-family-caption)',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-uppercase)',
                marginBottom: '0.65rem',
              }}
            >
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, category: 'all' })}
                style={{
                  padding: '0.45rem 0.95rem',
                  minHeight: '38px',
                  borderRadius: 'var(--radius-pill)',
                  border: !filters.category || filters.category === 'all'
                    ? '1px solid var(--color-brand-blue)'
                    : '1px solid var(--color-border-subtle)',
                  backgroundColor: !filters.category || filters.category === 'all'
                    ? 'var(--color-brand-blue)'
                    : 'var(--color-surface-2)',
                  color: !filters.category || filters.category === 'all'
                    ? '#FFFFFF'
                    : 'var(--color-text-secondary)',
                  fontSize: 'var(--text-body-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                All Services
              </button>

              {categories.map((cat) => {
                const isSelected = filters.category === cat.id || filters.category === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, category: cat.id })}
                    style={{
                      padding: '0.45rem 0.95rem',
                      minHeight: '38px',
                      borderRadius: 'var(--radius-pill)',
                      border: isSelected
                        ? '1px solid var(--color-brand-blue)'
                        : '1px solid var(--color-border-subtle)',
                      backgroundColor: isSelected
                        ? 'var(--color-brand-blue)'
                        : 'var(--color-surface-2)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-body-xs)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Availability Status */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                fontFamily: 'var(--font-family-caption)',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-uppercase)',
                marginBottom: '0.65rem',
              }}
            >
              Availability
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {[
                { id: 'all', label: 'All Statuses' },
                { id: 'available', label: 'Available Now' },
                { id: 'limited', label: 'Limited Slots' },
              ].map((st) => {
                const isSelected = (filters.availability || 'all') === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, availability: st.id as any })}
                    style={{
                      padding: '0.55rem 0.85rem',
                      minHeight: '40px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected
                        ? '1px solid var(--color-brand-blue)'
                        : '1px solid var(--color-border-subtle)',
                      backgroundColor: isSelected
                        ? 'var(--color-surface-3)'
                        : 'var(--color-surface-2)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-body-xs)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Price Presets */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                fontFamily: 'var(--font-family-caption)',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-uppercase)',
                marginBottom: '0.65rem',
              }}
            >
              Maximum Starting Price
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {pricePresets.map((preset, idx) => {
                const isSelected = filters.maxPrice === preset.value;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, maxPrice: preset.value })}
                    style={{
                      padding: '0.45rem 0.85rem',
                      minHeight: '36px',
                      borderRadius: 'var(--radius-pill)',
                      border: isSelected
                        ? '1px solid var(--color-brand-gold)'
                        : '1px solid var(--color-border-subtle)',
                      backgroundColor: isSelected
                        ? 'var(--color-surface-3)'
                        : 'var(--color-surface-2)',
                      color: isSelected ? 'var(--color-brand-gold)' : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-body-xs)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              minHeight: '44px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-brand-blue)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 'var(--text-button)',
              fontFamily: 'var(--font-family-button)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          >
            <span>Show {totalResultsCount} {totalResultsCount === 1 ? 'Service' : 'Services'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};
