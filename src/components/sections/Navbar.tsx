import React, { useState, useEffect } from 'react';
import { Menu, MapPin, ChevronDown, Compass, Building2 } from 'lucide-react';
import { SITE_CONFIG } from '../../data/site-config';
import { CAMPUSES, type Campus } from '../../data/campuses';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';

interface NavbarProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen: () => void;
  onPartnerOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen,
  onPartnerOpen
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9900,
          transition: 'all var(--duration-normal) var(--ease-smooth)',
          backgroundColor: isScrolled ? 'rgba(251, 249, 241, 0.92)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
          padding: isScrolled ? '0.75rem 0' : '1.25rem 0'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            
            {/* Brand Logo Lockup */}
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '14px',
                    height: '14px',
                    backgroundColor: 'var(--color-brand-blue)',
                    transform: 'rotate(45deg)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-accent-gold, #F8CE37)'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif, "Domine", serif)',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1
                  }}
                >
                  Ease<span style={{ color: 'var(--color-brand-blue)' }}>Hub</span>
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginTop: '2px'
                  }}
                >
                  Student Ecosystem
                </span>
              </div>
            </a>

            {/* Campus Switcher Pill (Desktop) */}
            <div style={{ position: 'relative' }} className="campus-switcher-desktop">
              <button
                onClick={() => setIsCampusDropdownOpen(!isCampusDropdownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-secondary)',
                  transition: 'all var(--duration-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                  e.currentTarget.style.color = 'var(--color-brand-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                <MapPin size={13} color="var(--color-brand-blue)" />
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{selectedCampus.shortName}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>• {selectedCampus.city}</span>
                <ChevronDown size={12} />
              </button>

              {isCampusDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: '300px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 16px 40px rgba(59, 130, 246, 0.15)',
                    padding: '0.5rem',
                    zIndex: 9999
                  }}
                >
                  <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Select University Hub
                  </div>
                  {CAMPUSES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onCampusChange(c);
                        setIsCampusDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: c.id === selectedCampus.id ? 'var(--color-surface-2)' : 'transparent',
                        border: c.id === selectedCampus.id ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        cursor: 'pointer',
                        transition: 'background-color var(--duration-fast)'
                      }}
                      onMouseEnter={(e) => {
                        if (c.id !== selectedCampus.id) e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
                      }}
                      onMouseLeave={(e) => {
                        if (c.id !== selectedCampus.id) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: c.id === selectedCampus.id ? 'var(--color-brand-blue)' : 'var(--color-text-primary)' }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {c.city} • {c.activeProviders} Verified Providers
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsCampusDropdownOpen(false);
                      onRequestCampusOpen();
                    }}
                    style={{
                      width: '100%',
                      marginTop: '0.4rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--color-surface-2)',
                      border: '1px dashed var(--color-border-subtle)',
                      fontSize: '0.75rem',
                      color: 'var(--color-brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Building2 size={13} />
                    <span>+ Request Your Campus Hub</span>
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-links-desktop">
              {SITE_CONFIG.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    transition: 'color var(--duration-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand-blue)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="nav-ctas-desktop">
              <button
                onClick={onPartnerOpen}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand-blue)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              >
                For Providers
              </button>
              <Button
                variant="accent"
                size="sm"
                icon={<Compass size={14} />}
                onClick={() => {
                  const el = document.getElementById('discovery');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Hub
              </Button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              style={{
                display: 'none',
                padding: '0.5rem',
                color: 'var(--color-brand-blue)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(59, 130, 246, 0.06)',
                border: 'none',
                cursor: 'pointer'
              }}
              className="mobile-menu-trigger"
            >
              <Menu size={22} />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="EaseHub Menu"
        position="right"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Campus Indicator */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
              Active University Hub
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-brand-blue)', fontWeight: 700 }}>
              <MapPin size={16} color="var(--color-brand-blue)" />
              <span>{selectedCampus.name}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {selectedCampus.activeProviders} Verified Partners Active
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {SITE_CONFIG.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: '1.1rem',
                  fontFamily: 'Domine, serif',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--color-border-subtle)'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <Button
              variant="accent"
              fullWidth
              onClick={() => {
                setIsMobileMenuOpen(false);
                const el = document.getElementById('discovery');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Services
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsMobileMenuOpen(false);
                onPartnerOpen();
              }}
            >
              Partner as a Provider
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setIsMobileMenuOpen(false);
                onRequestCampusOpen();
              }}
            >
              + Request Your Campus Hub
            </Button>
          </div>
        </div>
      </Drawer>

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop,
          .nav-ctas-desktop,
          .campus-switcher-desktop {
            display: none !important;
          }
          .mobile-menu-trigger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
