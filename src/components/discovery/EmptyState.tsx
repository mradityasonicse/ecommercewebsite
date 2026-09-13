import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
  searchQuery?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, searchQuery }) => {
  return (
    <div
      role="status"
      style={{
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--color-border-subtle)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <SearchX size={32} />
      </div>

      <h3
        style={{
          fontSize: '1.4rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: '0 0 var(--space-2) 0',
        }}
      >
        No services found
      </h3>

      <p
        style={{
          fontSize: '0.92rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          margin: '0 0 var(--space-6) 0',
        }}
      >
        {searchQuery ? (
          <>
            Nothing matched <strong style={{ color: '#FFFFFF' }}>"{searchQuery}"</strong> with the selected filters.
          </>
        ) : (
          'No services match your active combination of campus and category filters.'
        )}
      </p>

      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-6)',
          textAlign: 'left',
          fontSize: '0.84rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
          Suggested adjustments:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.5 }}>
          <li>Try broad keywords like "mess", "laundry", or "wifi"</li>
          <li>Switch category to "All Services"</li>
          <li>Check for typos or extra symbols</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        style={{
          padding: '0.75rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#FFFFFF',
          color: '#080A0F',
          border: 'none',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
          transition: 'transform var(--duration-fast)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
      >
        <RotateCcw size={15} />
        <span>Clear All Filters</span>
      </button>
    </div>
  );
};
