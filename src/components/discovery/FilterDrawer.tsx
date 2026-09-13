import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, SlidersHorizontal } from 'lucide-react';
import type { Campus } from '../../data/campuses';
import { CAMPUSES } from '../../data/campuses';
import type { ServiceCategory, ServiceFilterParams, ServiceSortOption } from '../../types/service';

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
          backgroundColor: 'rgba(15, 56, 44, 0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-bg-primary, #FBF9F1)',
          borderTop: '1px solid var(--color-border-subtle, #E8E4D5)',
          borderTopLeftRadius: 'var(--radius-2xl)',
          borderTopRightRadius: 'var(--radius-2xl)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(15, 56, 44, 0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border-subtle, #E8E4D5)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={18} color="var(--color-brand-blue, #0F382C)" />
            <h2 style={{ fontSize: '1.15rem', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', margin: 0 }}>
              Filters & Sorting
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 56, 44, 0.05)',
              border: 'none',
              color: 'var(--color-text-secondary, #414845)',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(15, 56, 44, 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(15, 56, 44, 0.05)')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* 1. Campus Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
              University Campus
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
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--color-brand-blue, #0F382C)' : '#FFFFFF',
                      border: isSelected ? '1px solid var(--color-brand-blue, #0F382C)' : '1px solid var(--color-border-subtle, #E8E4D5)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-primary, #151D1A)',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected ? '0 2px 8px rgba(15, 56, 44, 0.2)' : '0 1px 2px rgba(15, 56, 44, 0.03)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{c.name}</span>
                    {isSelected && <Check size={16} color="var(--color-accent-gold, #F8CE37)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Category Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
              Service Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, category: 'all' })}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  border: (!filters.category || filters.category === 'all') ? '1px solid var(--color-brand-blue, #0F382C)' : '1px solid var(--color-border-subtle, #E8E4D5)',
                  backgroundColor: (!filters.category || filters.category === 'all') ? 'var(--color-brand-blue, #0F382C)' : '#FFFFFF',
                  color: (!filters.category || filters.category === 'all') ? '#FFFFFF' : 'var(--color-text-secondary, #414845)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                All Categories
              </button>

              {categories.map((cat) => {
                const isSelected = filters.category === cat.id || filters.category === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, category: cat.id })}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      border: isSelected ? '1px solid var(--color-brand-blue, #0F382C)' : '1px solid var(--color-border-subtle, #E8E4D5)',
                      backgroundColor: isSelected ? 'var(--color-brand-blue, #0F382C)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary, #414845)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Availability Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
              Availability
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      border: isSelected ? '1px solid var(--color-brand-blue, #0F382C)' : '1px solid var(--color-border-subtle, #E8E4D5)',
                      backgroundColor: isSelected ? 'var(--color-brand-blue, #0F382C)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary, #414845)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
              Sort Order
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.45rem' }}>
              {[
                { id: 'recommended', label: 'Recommended' },
                { id: 'popular', label: 'Most Popular' },
                { id: 'rating', label: 'Highest Rated' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
              ].map((s) => {
                const isSelected = (filters.sort || 'recommended') === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, sort: s.id as ServiceSortOption })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--color-brand-blue, #0F382C)' : '#FFFFFF',
                      border: isSelected ? '1px solid var(--color-brand-blue, #0F382C)' : '1px solid var(--color-border-subtle, #E8E4D5)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-primary, #151D1A)',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected ? '0 2px 8px rgba(15, 56, 44, 0.2)' : '0 1px 2px rgba(15, 56, 44, 0.03)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{s.label}</span>
                    {isSelected && <Check size={16} color="var(--color-accent-gold, #F8CE37)" />}
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
            borderTop: '1px solid var(--color-border-subtle, #E8E4D5)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border-subtle, #E8E4D5)',
              color: 'var(--color-text-secondary, #414845)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-primary, #FBF9F1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            Clear Filters
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 2,
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent-gold, #F8CE37)',
              border: 'none',
              color: '#0F382C',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(248, 206, 55, 0.35)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Show {totalResultsCount} Results
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return content;
};
