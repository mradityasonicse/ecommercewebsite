import React from 'react';
import { SearchX, RotateCcw, MessageCircle } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
  searchQuery?: string;
  activeCategory?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onClearFilters,
  searchQuery,
  activeCategory,
}) => {
  const handleWhatsAppHelp = () => {
    const phone = '918102848776';
    const queryText = searchQuery ? `"${searchQuery}"` : 'a specific campus service';
    const message = `Hello EaseHub! 👋\nI was browsing the services catalog and searched for ${queryText}${activeCategory && activeCategory !== 'all' ? ` under ${activeCategory}` : ''}, but found no matching services.\n\nCould you please help me find a verified provider or let me know if this service can be arranged?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="status"
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-subtle)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          marginBottom: '1.25rem',
        }}
      >
        <SearchX size={28} />
      </div>

      <h3
        style={{
          fontSize: 'var(--text-h3)',
          fontFamily: 'var(--font-family-h3)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 0.5rem 0',
        }}
      >
        No matching services found
      </h3>

      <p
        style={{
          fontSize: 'var(--text-body-sm)',
          fontFamily: 'var(--font-family-body-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          margin: '0 0 1.5rem 0',
        }}
      >
        {searchQuery ? (
          <>
            Nothing matched <strong style={{ color: 'var(--color-text-primary)' }}>"{searchQuery}"</strong> with your active filters.
          </>
        ) : (
          'No verified services match your active combination of campus, category, and price filters.'
        )}
      </p>

      {/* Suggested Steps */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          textAlign: 'left',
          fontSize: 'var(--text-body-xs)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
          Suggested steps:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.6 }}>
          <li>Try broad search terms like "mess", "laundry", or "cleaning"</li>
          <li>Reset price range or switch category to "All Services"</li>
          <li>Check for typos or spelling variations</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            padding: '0.65rem 1.25rem',
            minHeight: '44px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-subtle)',
            fontSize: 'var(--text-button)',
            fontFamily: 'var(--font-family-button)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            transition: 'background-color var(--duration-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
          }}
        >
          <RotateCcw size={14} />
          <span>Reset All Filters</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppHelp}
          style={{
            padding: '0.65rem 1.25rem',
            minHeight: '44px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-brand-green, #10B981)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 'var(--text-button)',
            fontFamily: 'var(--font-family-button)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          }}
        >
          <MessageCircle size={15} />
          <span>Ask Concierge on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
