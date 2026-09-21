import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, X, Home, Utensils, Shirt, Layers, Phone, ArrowRight, MapPin } from 'lucide-react';
import {
  type CatalogItem,
  REFERENCE_PGS,
  REFERENCE_MEALS,
  REFERENCE_LAUNDRY,
  REFERENCE_EXTRA_SERVICES,
} from '../../data/referenceCatalog';

export interface HomepageSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSelectCategory: (category: 'pg' | 'meals' | 'laundry' | 'extra' | 'contact') => void;
  onSelectItem?: (item: CatalogItem) => void;
  selectedCategory: 'pg' | 'meals' | 'laundry' | 'extra' | 'contact';
  className?: string;
  style?: React.CSSProperties;
}

interface CategoryMatch {
  id: 'pg' | 'meals' | 'laundry' | 'extra' | 'contact';
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  count: number;
}

// Supported real categories with exact catalog counts
const SUPPORTED_CATEGORIES: Array<{
  id: 'pg' | 'meals' | 'laundry' | 'extra' | 'contact';
  label: string;
  keywords: string[];
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  count: number;
}> = [
  {
    id: 'pg',
    label: 'Hostel & PG',
    keywords: ['pg', 'hostel', 'room', 'rooms', 'flat', 'stay', 'accommodation', 'boys', 'girls', 'male', 'female'],
    icon: Home,
    count: REFERENCE_PGS.length,
  },
  {
    id: 'meals',
    label: 'Meals & Mess',
    keywords: ['meal', 'meals', 'mess', 'food', 'tiffin', 'breakfast', 'lunch', 'dinner', 'veg', 'non-veg', 'thali'],
    icon: Utensils,
    count: REFERENCE_MEALS.length,
  },
  {
    id: 'laundry',
    label: 'Doorstep Laundry',
    keywords: ['laundry', 'wash', 'cloth', 'clothes', 'iron', 'dry clean', 'pressing', 'fabric'],
    icon: Shirt,
    count: REFERENCE_LAUNDRY.length,
  },
  {
    id: 'extra',
    label: 'Extra Services',
    keywords: ['extra', 'cleaning', 'clean', 'room cleaning', 'wifi', 'wi-fi', 'internet', 'relocation', 'moving', 'luggage', 'electrician', 'plumber'],
    icon: Layers,
    count: REFERENCE_EXTRA_SERVICES.length,
  },
  {
    id: 'contact',
    label: 'Helpline & Concierge',
    keywords: ['contact', 'help', 'call', 'support', 'desk', 'concierge', 'whatsapp', 'inquiry'],
    icon: Phone,
    count: 1,
  },
];

export const HomepageSearch: React.FC<HomepageSearchProps> = ({
  query,
  onQueryChange,
  onSelectCategory,
  onSelectItem,
  selectedCategory,
  className = '',
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the query for suggestion computation (150ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Combine real catalog items into a flat indexed list
  const allCatalogItems = useMemo<CatalogItem[]>(() => {
    return [
      ...REFERENCE_PGS,
      ...REFERENCE_MEALS,
      ...REFERENCE_LAUNDRY,
      ...REFERENCE_EXTRA_SERVICES,
    ];
  }, []);

  // Compute matching categories based strictly on query keywords
  const matchedCategories = useMemo<CategoryMatch[]>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return SUPPORTED_CATEGORIES.filter((cat) => {
      if (cat.label.toLowerCase().includes(q)) return true;
      return cat.keywords.some((kw) => kw.includes(q) || q.includes(kw));
    }).map((cat) => ({
      id: cat.id,
      label: cat.label,
      icon: cat.icon,
      count: cat.count,
    }));
  }, [debouncedQuery]);

  // Compute matching real catalog items (max 6 for scannable suggestion list)
  const matchedItems = useMemo<CatalogItem[]>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return allCatalogItems
      .filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const addressMatch = item.address.toLowerCase().includes(q);
        const cityMatch = item.city.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const priceMatch = item.priceText ? item.priceText.toLowerCase().includes(q) : String(item.price).includes(q);
        const badgeMatch = item.badge ? item.badge.toLowerCase().includes(q) : false;

        return nameMatch || addressMatch || cityMatch || descMatch || priceMatch || badgeMatch;
      })
      .slice(0, 6);
  }, [debouncedQuery, allCatalogItems]);

  // Total navigable suggestion entries
  const totalEntries = matchedCategories.length + matchedItems.length;

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Navigation: ArrowUp, ArrowDown, Enter, Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (!isOpen || totalEntries === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < totalEntries - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalEntries - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < matchedCategories.length) {
        // Select category
        const cat = matchedCategories[highlightedIndex];
        onSelectCategory(cat.id);
        setIsOpen(false);
      } else if (highlightedIndex >= matchedCategories.length && highlightedIndex < totalEntries) {
        // Select item
        const itemIdx = highlightedIndex - matchedCategories.length;
        const item = matchedItems[itemIdx];
        if (onSelectItem) {
          onSelectItem(item);
        } else {
          onSelectCategory(item.category);
          onQueryChange(item.name);
        }
        setIsOpen(false);
      } else {
        // Submit raw query
        setIsOpen(false);
      }
    }
  };

  const handleClear = useCallback(() => {
    onQueryChange('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onQueryChange]);

  const handleSelectCategoryShortcut = (catId: 'pg' | 'meals' | 'laundry' | 'extra' | 'contact') => {
    onSelectCategory(catId);
    setIsOpen(false);
  };

  const handleSelectItemSuggestion = (item: CatalogItem) => {
    if (onSelectItem) {
      onSelectItem(item);
    } else {
      onSelectCategory(item.category);
      onQueryChange(item.name);
    }
    setIsOpen(false);
  };

  const hasSuggestions = debouncedQuery.trim().length >= 2;

  return (
    <div
      ref={containerRef}
      className={`easehub-homepage-search ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '680px',
        marginInline: 'auto',
        ...style,
      }}
    >
      {/* Accessible Label (Screen Readers) */}
      <label htmlFor="homepage-marketplace-search" className="sr-only">
        Search verified services, accommodations, meals, or locations
      </label>

      {/* Main Search Input Field */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-1)',
          border: isOpen
            ? '1px solid var(--color-brand-blue)'
            : '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: isOpen
            ? '0 0 0 3px var(--color-blue-subtle, rgba(59, 130, 246, 0.25)), 0 8px 24px -4px rgba(0, 0, 0, 0.45)'
            : '0 4px 16px -2px rgba(0, 0, 0, 0.35)',
          transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text-muted)',
            flexShrink: 0,
          }}
        >
          <Search size={20} />
        </div>

        <input
          ref={inputRef}
          id="homepage-marketplace-search"
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="homepage-search-suggestions"
          aria-activedescendant={
            highlightedIndex >= 0 ? `search-suggestion-${highlightedIndex}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          placeholder={
            selectedCategory === 'pg'
              ? 'Search PGs by name, Kurud Rd, Kohka, Shivaji Nagar, rent...'
              : selectedCategory === 'meals'
              ? 'Search meal plans, daily tiffin, veg, breakfast, dinner...'
              : selectedCategory === 'laundry'
              ? 'Search laundry, per-kg, monthly unlimited, steam press...'
              : selectedCategory === 'extra'
              ? 'Search extra services, Wi-Fi setup, cleaning, relocation...'
              : 'Search all verified student services in Bhilai...'
          }
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            if (!isOpen && e.target.value.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            height: '52px',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-input)',
            fontFamily: 'var(--font-family-input)',
            lineHeight: 'var(--leading-input)',
            paddingRight: query ? '3rem' : '1.25rem',
            boxSizing: 'border-box',
          }}
        />

        {/* Clear Search Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            style={{
              position: 'absolute',
              right: '0.65rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
              minWidth: '36px',
              minHeight: '36px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'background-color var(--duration-fast), color var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-3)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Autocomplete / Suggestions Dropdown Menu */}
      {isOpen && hasSuggestions && (
        <div
          id="homepage-search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px var(--color-border-subtle)',
            overflow: 'hidden',
            maxHeight: '440px',
            overflowY: 'auto',
          }}
        >
          {totalEntries === 0 ? (
            <div
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-body-sm)',
              }}
            >
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                No direct match for "{debouncedQuery}"
              </p>
              <p style={{ margin: 0, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
                Press Enter to filter catalog, or select a category below.
              </p>
            </div>
          ) : (
            <div>
              {/* 1. Category Matching Shortcuts */}
              {matchedCategories.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <div
                    style={{
                      padding: '0.65rem 1rem 0.35rem 1rem',
                      fontSize: 'var(--text-caption)',
                      fontFamily: 'var(--font-family-caption)',
                      fontWeight: 'var(--weight-label)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-uppercase)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    Matching Categories
                  </div>
                  {matchedCategories.map((cat, idx) => {
                    const isHighlighted = highlightedIndex === idx;
                    const IconComponent = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        id={`search-suggestion-${idx}`}
                        role="option"
                        aria-selected={isHighlighted}
                        onClick={() => handleSelectCategoryShortcut(cat.id)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 1rem',
                          minHeight: '44px',
                          cursor: 'pointer',
                          backgroundColor: isHighlighted ? 'var(--color-surface-2)' : 'transparent',
                          borderLeft: isHighlighted
                            ? '3px solid var(--color-brand-blue)'
                            : '3px solid transparent',
                          transition: 'background-color var(--duration-fast)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(59, 130, 246, 0.12)',
                              color: 'var(--color-brand-blue)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconComponent size={15} />
                          </div>
                          <span
                            style={{
                              fontSize: 'var(--text-body)',
                              color: 'var(--color-text-primary)',
                              fontWeight: 600,
                            }}
                          >
                            Explore {cat.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              fontSize: 'var(--text-caption)',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            {cat.count} listings
                          </span>
                          <ArrowRight size={14} color="var(--color-text-muted)" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. Real Catalog Item Matches */}
              {matchedItems.length > 0 && (
                <div>
                  <div
                    style={{
                      padding: '0.65rem 1rem 0.35rem 1rem',
                      fontSize: 'var(--text-caption)',
                      fontFamily: 'var(--font-family-caption)',
                      fontWeight: 'var(--weight-label)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-uppercase)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    Matching Services & Accommodations
                  </div>
                  {matchedItems.map((item, itemIdx) => {
                    const globalIdx = matchedCategories.length + itemIdx;
                    const isHighlighted = highlightedIndex === globalIdx;
                    return (
                      <div
                        key={item.id}
                        id={`search-suggestion-${globalIdx}`}
                        role="option"
                        aria-selected={isHighlighted}
                        onClick={() => handleSelectItemSuggestion(item)}
                        onMouseEnter={() => setHighlightedIndex(globalIdx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          minHeight: '48px',
                          cursor: 'pointer',
                          backgroundColor: isHighlighted ? 'var(--color-surface-2)' : 'transparent',
                          borderLeft: isHighlighted
                            ? '3px solid var(--color-brand-blue)'
                            : '3px solid transparent',
                          transition: 'background-color var(--duration-fast)',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                fontSize: 'var(--text-body-sm)',
                                color: 'var(--color-text-primary)',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.name}
                            </span>
                            {item.badge && (
                              <span
                                style={{
                                  fontSize: 'var(--text-status)',
                                  fontFamily: 'var(--font-family-status)',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '1px 6px',
                                  borderRadius: 'var(--radius-xs)',
                                  backgroundColor: 'var(--color-surface-3)',
                                  color:
                                    item.badgeVariant === 'female'
                                      ? '#F43F5E'
                                      : item.badgeVariant === 'male'
                                      ? 'var(--color-brand-blue)'
                                      : 'var(--color-brand-gold)',
                                  flexShrink: 0,
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.category !== 'pg' && item.address ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: 'var(--text-caption)',
                                color: 'var(--color-text-muted)',
                                marginTop: '2px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              <MapPin size={12} color="#EF4444" style={{ flexShrink: 0 }} />
                              <span>{item.address}</span>
                            </div>
                          ) : null}
                        </div>

                        {item.category !== 'pg' && (item.priceText || item.price > 0) ? (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span
                              style={{
                                fontSize: 'var(--text-body-sm)',
                                fontWeight: 700,
                                color: 'var(--color-brand-gold)',
                              }}
                            >
                              {item.priceText || `₹${item.price}`}
                            </span>
                            {item.periodText && (
                              <span
                                style={{
                                  fontSize: 'var(--text-caption)',
                                  color: 'var(--color-text-muted)',
                                  marginLeft: '2px',
                                }}
                              >
                                {item.periodText}
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Keyboard Navigation Hint */}
              <div
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-surface-2)',
                  borderTop: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <span>
                  Use <kbd style={{ padding: '1px 4px', backgroundColor: 'var(--color-surface-1)', borderRadius: '2px' }}>↑</kbd>{' '}
                  <kbd style={{ padding: '1px 4px', backgroundColor: 'var(--color-surface-1)', borderRadius: '2px' }}>↓</kbd> to navigate, <kbd style={{ padding: '1px 4px', backgroundColor: 'var(--color-surface-1)', borderRadius: '2px' }}>Enter</kbd> to select
                </span>
                <span>
                  <kbd style={{ padding: '1px 4px', backgroundColor: 'var(--color-surface-1)', borderRadius: '2px' }}>Esc</kbd> to close
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
