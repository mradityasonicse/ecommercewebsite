import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { PRIMARY_NAV_ITEMS, type NavItem } from '../../config/navigation';
import { type Campus } from '../../data/campuses';
import { UserActions } from './UserActions';
import { Container } from '../primitives/Container';

export interface DesktopNavProps {
  selectedCampus?: Campus;
  onCampusChange?: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = () => {
  const [activeItem, setActiveItem] = useState<string>('pg');

  // Sync active item when category is selected anywhere
  useEffect(() => {
    const handleCategoryEvent = (e: CustomEvent<{ category: string }>) => {
      if (e.detail?.category) {
        const cat = e.detail.category.toLowerCase();
        if (cat.includes('pg')) setActiveItem('pg');
        else if (cat.includes('meal') || cat.includes('mess')) setActiveItem('meals');
        else if (cat.includes('laundry')) setActiveItem('laundry');
        else if (cat.includes('extra')) setActiveItem('extra');
        else if (cat.includes('contact')) setActiveItem('contact');
      }
    };
    window.addEventListener('easehub:select-category' as any, handleCategoryEvent);
    return () => window.removeEventListener('easehub:select-category' as any, handleCategoryEvent);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setActiveItem(item.id);
    window.dispatchEvent(new CustomEvent('easehub:select-category', { detail: { category: item.id } }));
    const el = document.getElementById('core-services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="easehub-desktop-nav"
      style={{
        width: '100%',
      }}
    >
      <Container variant="wide">
        <div
          className="easehub-desktop-nav-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            position: 'relative',
          }}
        >
          {/* 1. Left Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <BrandLogo variant="compact" href="#" />
          </div>

          {/* 2. Center Navigation Links (Reference Site Style: Pill Bar) */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '9999px',
              padding: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              gap: '2px',
            }}
          >
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 1.05rem',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'var(--color-brand-navy)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-display, sans-serif)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                    boxShadow: isActive ? '0 2px 8px rgba(18, 40, 90, 0.3)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right Utility Actions (Sun Theme Toggle + Login + Sign Up) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <UserActions
              onSignIn={() => {
                window.location.hash = '#auth/sign-in';
              }}
              onGetStarted={() => {
                window.location.hash = '#auth/sign-up';
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};
