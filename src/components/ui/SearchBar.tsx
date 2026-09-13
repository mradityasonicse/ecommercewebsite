import React from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { CAMPUSES, type Campus } from '../../data/campuses';

export interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onSearchSubmit?: () => void;
  placeholder?: string;
  variant?: 'hero' | 'compact';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  selectedCampus,
  onCampusChange,
  onSearchSubmit,
  placeholder = 'Search "pure veg mess", "PG near Gate 2", "laundry express"...',
  variant = 'hero'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-hover)',
        borderRadius: variant === 'hero' ? 'var(--radius-lg)' : 'var(--radius-md)',
        padding: variant === 'hero' ? '0.5rem 0.6rem 0.5rem 1rem' : '0.35rem 0.5rem 0.35rem 0.75rem',
        boxShadow: variant === 'hero' ? '0 12px 36px rgba(0, 0, 0, 0.6)' : 'none',
        transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}
    >
      {/* Campus Selector Dropdown */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          paddingRight: '0.75rem',
          borderRight: '1px solid var(--color-border)',
          minWidth: '170px'
        }}
      >
        <MapPin size={16} color="var(--color-blue-light)" />
        <select
          value={selectedCampus.id}
          onChange={(e) => {
            const found = CAMPUSES.find(c => c.id === e.target.value);
            if (found) onCampusChange(found);
          }}
          style={{
            background: 'transparent',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            outline: 'none'
          }}
        >
          {CAMPUSES.map((c) => (
            <option key={c.id} value={c.id} style={{ backgroundColor: '#131720', color: '#fff' }}>
              {c.shortName}
            </option>
          ))}
        </select>
      </div>

      {/* Query Search Field */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '220px', gap: '0.5rem' }}>
        <Search size={18} color="var(--color-text-muted)" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit();
          }}
          style={{
            width: '100%',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-primary)',
            outline: 'none'
          }}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onSearchSubmit}
        className="easehub-btn easehub-btn-primary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: '#FFFFFF',
          color: '#05070B',
          padding: variant === 'hero' ? '0.65rem 1.35rem' : '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.01em',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          transition: 'all var(--duration-fast) var(--ease-spring)',
          boxShadow: '0 4px 16px rgba(255, 255, 255, 0.16), 0 1px 3px rgba(0, 0, 0, 0.5)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F8FAFC';
          e.currentTarget.style.transform = 'translateY(-1.5px)';
          e.currentTarget.style.boxShadow = '0 6px 22px rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 255, 255, 0.16), 0 1px 3px rgba(0, 0, 0, 0.5)';
        }}
      >
        <span>Explore</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
