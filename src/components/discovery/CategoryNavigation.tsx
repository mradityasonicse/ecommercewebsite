import React from 'react';
import { 
  LayoutGrid, 
  Utensils, 
  Home, 
  Shirt, 
  Dumbbell, 
  Wifi, 
  Bike, 
  SprayCan, 
  Wrench 
} from 'lucide-react';
import type { ServiceCategory } from '../../types/service';

interface CategoryNavigationProps {
  categories: ServiceCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  categoryCounts = {},
}) => {
  const getCategoryIcon = (iconName: string, size = 16) => {
    switch (iconName) {
      case 'Utensils': return <Utensils size={size} />;
      case 'Home': return <Home size={size} />;
      case 'Shirt': return <Shirt size={size} />;
      case 'Dumbbell': return <Dumbbell size={size} />;
      case 'Wifi': return <Wifi size={size} />;
      case 'Bike': return <Bike size={size} />;
      case 'SprayCan':
      case 'Sparkles': return <SprayCan size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      default: return <LayoutGrid size={size} />;
    }
  };

  const allItemsCount = Object.values(categoryCounts).reduce((acc, count) => acc + count, 0);

  return (
    <nav
      aria-label="Service categories navigation"
      style={{
        position: 'relative',
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingBottom: '0.25rem',
      }}
      className="category-nav-container"
    >
      <div
        role="tablist"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          minWidth: 'max-content',
          padding: '0.25rem 0',
        }}
      >
        {/* "All" Category Pill */}
        <button
          role="tab"
          aria-selected={activeCategoryId === 'all'}
          onClick={() => onSelectCategory('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.95rem',
            borderRadius: 'var(--radius-pill)',
            border: activeCategoryId === 'all'
              ? '1px solid #FFFFFF'
              : '1px solid var(--color-border-subtle)',
            backgroundColor: activeCategoryId === 'all'
              ? '#FFFFFF'
              : 'var(--color-surface-1)',
            color: activeCategoryId === 'all'
              ? '#080A0F'
              : 'var(--color-text-secondary)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-display)',
            fontWeight: activeCategoryId === 'all' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all var(--duration-fast)',
            outline: 'none',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (activeCategoryId !== 'all') {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              e.currentTarget.style.color = '#FFFFFF';
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategoryId !== 'all') {
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }
          }}
        >
          <LayoutGrid size={15} color={activeCategoryId === 'all' ? '#080A0F' : 'var(--color-text-muted)'} />
          <span>All Services</span>
          {allItemsCount > 0 && (
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: activeCategoryId === 'all' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                color: activeCategoryId === 'all' ? '#080A0F' : 'var(--color-text-muted)',
              }}
            >
              {allItemsCount}
            </span>
          )}
        </button>

        {/* Dynamic Service Categories */}
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id || activeCategoryId === category.slug;
          const count = categoryCounts[category.id] || categoryCounts[category.slug] || 0;

          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(category.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-pill)',
                border: isActive
                  ? '1px solid #FFFFFF'
                  : '1px solid var(--color-border-subtle)',
                backgroundColor: isActive
                  ? '#FFFFFF'
                  : 'var(--color-surface-1)',
                color: isActive
                  ? '#080A0F'
                  : 'var(--color-text-secondary)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <span style={{ display: 'flex', color: isActive ? '#080A0F' : 'var(--color-text-muted)' }}>
                {getCategoryIcon(category.iconName, 15)}
              </span>
              <span>{category.label}</span>
              {count > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#080A0F' : 'var(--color-text-muted)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .category-nav-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
};
