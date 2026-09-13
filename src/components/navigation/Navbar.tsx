import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { type Campus } from '../../data/campuses';
import { BrandLogo } from '../brand/BrandLogo';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { SearchTrigger } from './SearchTrigger';
import { Button } from '../ui/Button';

export interface NavbarProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen,
  onPartnerOpen,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        role="banner"
        className={`easehub-global-navbar ${isScrolled ? 'glass-nav-scrolled' : 'glass-nav'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9900,
        }}
      >
        {/* Desktop Navigation (Rendered on >= 1024px) */}
        <div className="easehub-nav-desktop-container">
          <DesktopNav
            selectedCampus={selectedCampus}
            onCampusChange={onCampusChange}
            onRequestCampusOpen={onRequestCampusOpen}
            onPartnerOpen={onPartnerOpen}
          />
        </div>

        {/* Mobile Navigation Header (Rendered on < 1024px) */}
        <div className="easehub-nav-mobile-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
              padding: '0 1rem',
            }}
          >
            {/* Left: Hamburger Menu Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile navigation menu"
                aria-expanded={isMobileMenuOpen}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-default)',
                  color: 'var(--color-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <Menu size={20} />
              </button>

              <BrandLogo variant="mobile" href="#" />
            </div>

            {/* Right: Quick Search, Theme Toggle & CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Toggle theme: currently ${theme === 'primary' ? 'Navy Blue' : 'Obsidian Black'}`}
                title={`Switch visual theme (${theme === 'primary' ? 'Navy Blue' : 'Obsidian Black'})`}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9999px',
                  backgroundColor: theme === 'primary' ? '#132756' : '#0F121A',
                  border: theme === 'primary' ? '1.5px solid #284D9E' : '1.5px solid #242B3D',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: theme === 'primary' ? '0 2px 8px rgba(19, 39, 86, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.6)',
                  padding: 0,
                }}
              >
                {theme === 'primary' ? (
                  <Sun size={17} color="#FAC908" />
                ) : (
                  <Moon size={17} color="#A78BFA" />
                )}
              </button>

              <SearchTrigger variant="compact" />
              <Button
                variant="primary"
                size="sm"
                className="easehub-nav-mobile-cta"
                onClick={() => {
                  window.location.hash = '#auth/sign-up';
                }}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        <style>{`
          .easehub-nav-desktop-container {
            display: block;
          }
          .easehub-nav-mobile-container {
            display: none;
          }

          @media (max-width: 1023px) {
            .easehub-nav-desktop-container {
              display: none;
            }
            .easehub-nav-mobile-container {
              display: block;
            }
          }

          @media (max-width: 375px) {
            .easehub-nav-mobile-cta {
              display: none !important;
            }
          }
        `}</style>
      </header>

      {/* Structured Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        selectedCampus={selectedCampus}
        onCampusChange={onCampusChange}
        onRequestCampusOpen={onRequestCampusOpen}
        onPartnerOpen={onPartnerOpen}
      />
    </>
  );
};
