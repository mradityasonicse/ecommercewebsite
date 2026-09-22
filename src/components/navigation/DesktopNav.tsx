import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { type Campus } from '../../data/campuses';
import { UserActions } from './UserActions';
import { SearchTrigger } from './SearchTrigger';
import { DomainSwitcher } from './DomainSwitcher';
import { Container } from '../primitives/Container';

export interface DesktopNavProps {
  selectedCampus?: Campus;
  onCampusChange?: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
  onOpenTracker?: () => void;
}

interface NavItemDef {
  id: string;
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ onOpenTracker: _onOpenTracker }) => {
  const [activeRoute, setActiveRoute] = useState<string>('home');

  // Detect active route based on window.location.hash and window.location.pathname
  useEffect(() => {
    const updateActiveRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash.startsWith('#chat') || path.startsWith('/chat')) {
        setActiveRoute('chat');
      } else if (hash.startsWith('#admin') || path.startsWith('/admin')) {
        setActiveRoute('admin');
      } else if (hash.startsWith('#account/requests')) {
        setActiveRoute('requests');
      } else if (hash.startsWith('#account') || path.startsWith('/account')) {
        setActiveRoute('account');
      } else if (hash.startsWith('#provider') || path.startsWith('/provider')) {
        setActiveRoute('provider');
      } else if (hash.includes('bundle')) {
        setActiveRoute('bundles');
      } else if (hash.includes('trust')) {
        setActiveRoute('trust');
      } else if (hash.includes('contact')) {
        setActiveRoute('contact');
      } else if (
        hash.includes('service') ||
        hash.includes('catalog') ||
        path.includes('service') ||
        path.includes('catalog')
      ) {
        setActiveRoute('services');
      } else {
        setActiveRoute('home');
      }
    };

    updateActiveRoute();
    window.addEventListener('hashchange', updateActiveRoute);
    window.addEventListener('popstate', updateActiveRoute);
    return () => {
      window.removeEventListener('hashchange', updateActiveRoute);
      window.removeEventListener('popstate', updateActiveRoute);
    };
  }, []);

  const getNavItems = (): NavItemDef[] => {
    return [
      { id: 'home', label: 'Home', href: '#home' },
      { id: 'pg', label: 'PG & Hostels', href: '#pg' },
      { id: 'mess', label: 'Student Mess', href: '#mess' },
      { id: 'laundry', label: 'Laundry', href: '#laundry' },
      { id: 'extra', label: 'Extra Services', href: '#extra' },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (e: React.MouseEvent, item: NavItemDef) => {
    e.preventDefault();
    setActiveRoute(item.id);

    if (item.id === 'home') {
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (['pg', 'mess', 'laundry', 'extra'].includes(item.id)) {
      const categoryMap: { [key: string]: string } = {
        pg: 'pg',
        mess: 'mess',
        laundry: 'laundry',
        extra: 'extra',
      };
      const cat = categoryMap[item.id] || item.id;
      window.location.hash = `#${item.id}`;
      window.dispatchEvent(
        new CustomEvent('easehub:select-category', {
          detail: { category: cat },
        })
      );
      const el = document.getElementById('core-services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (item.href.startsWith('#')) {
      const targetId = item.href.replace('#', '').split('?')[0];
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = item.href;
      }
    } else {
      window.location.href = item.href;
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

          {/* 2. Center Editorial Navigation (Precise, non-pill architectural layout) */}
          <nav
            role="navigation"
            aria-label="Primary Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
              height: '100%',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeRoute === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`easehub-nav-item ${isActive ? 'is-active' : ''}`}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.25rem',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-brand-green)' : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color var(--duration-fast) var(--ease-standard)',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-brand-green)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {item.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: item.badgeColor || '#15803D',
                        color: '#FFFFFF',
                        border: 'none',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {/* Subtle active underline indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#15803D',
                        borderRadius: '2px',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* 3. Right Utility Actions (Domain Switcher + Search + Mobile View + Auth) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            <DomainSwitcher />
            <SearchTrigger variant="desktop" />

            {/* 1-Tap Mobile View Simulator Button */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('easehub:toggle-mobile-view', { detail: { enabled: true } }));
              }}
              title="One-Tap Mobile View Preview"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.38rem 0.75rem',
                backgroundColor: '#DCFCE7',
                border: '1.5px solid #86EFAC',
                borderRadius: '8px',
                color: '#15803D',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#BBF7D0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DCFCE7';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Smartphone size={14} />
              <span>Mobile View</span>
            </button>

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

