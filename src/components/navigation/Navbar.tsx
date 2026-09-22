import React, { useState, useEffect } from 'react';
import { type Campus } from '../../data/campuses';
import { BrandLogo } from '../brand/BrandLogo';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { SearchTrigger } from './SearchTrigger';

export interface NavbarProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
  onOpenTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen,
  onPartnerOpen,
  onOpenTracker,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled((prev) => {
            const next = window.scrollY > 20;
            return prev === next ? prev : next;
          });
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
            onOpenTracker={onOpenTracker}
          />
        </div>

        {/* Mobile Navigation Header (Rendered on < 1024px) */}
        {/* Mobile Navigation Header (Rendered on < 1024px) */}
        <div className="easehub-nav-mobile-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '60px',
              padding: '0 1rem',
            }}
          >
            {/* Left: Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BrandLogo variant="mobile" href="#" />
            </div>

            {/* Right: Quick Search & Animated Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SearchTrigger variant="compact" />

              {/* Animated Hamburger Button (Morphs to X) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                className="easehub-hamburger-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: 0,
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '2px',
                    backgroundColor: 'var(--color-text-primary, #0F172A)',
                    borderRadius: '2px',
                    transition: 'transform var(--duration-fast) var(--ease-smooth), opacity var(--duration-fast)',
                    transform: isMobileMenuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  style={{
                    width: '18px',
                    height: '2px',
                    backgroundColor: 'var(--color-text-primary, #0F172A)',
                    borderRadius: '2px',
                    transition: 'opacity var(--duration-fast)',
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    width: '18px',
                    height: '2px',
                    backgroundColor: 'var(--color-text-primary, #0F172A)',
                    borderRadius: '2px',
                    transition: 'transform var(--duration-fast) var(--ease-smooth), opacity var(--duration-fast)',
                    transform: isMobileMenuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                  }}
                />
              </button>
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
              display: none !important;
            }
            .easehub-nav-mobile-container {
              display: block !important;
            }
          }

          /* Force Mobile Header in 1-Tap Mobile Simulator */
          body.mobile-preview-active .easehub-nav-desktop-container {
            display: none !important;
          }
          body.mobile-preview-active .easehub-nav-mobile-container {
            display: block !important;
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
