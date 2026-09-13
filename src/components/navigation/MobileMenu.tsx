import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, MapPin, MessageCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../brand/BrandLogo';
import { PRIMARY_NAV_ITEMS, SERVICES_NAV_ITEMS } from '../../config/navigation';
import { CAMPUSES, type Campus } from '../../data/campuses';
import { ECOSYSTEM_SERVICES } from '../../data/services';
import { UserActions } from './UserActions';
import { SearchTrigger } from './SearchTrigger';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen: _onRequestCampusOpen,
  onPartnerOpen: _onPartnerOpen,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isServicesExpanded, setIsServicesExpanded] = useState<boolean>(true);
  const [isCampusPickerOpen, setIsCampusPickerOpen] = useState<boolean>(false);

  // Scroll lock and Escape listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = (href: string) => {
    onClose();
    const targetId = href.replace('#', '').split('?')[0];
    const el = document.getElementById(targetId);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.location.hash = href;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="easehub-mobile-menu-overlay mobile-nav-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Mobile Menu Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border-subtle)',
          flexShrink: 0,
        }}
      >
        <BrandLogo variant="mobile" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Toggle theme: currently ${theme === 'primary' ? 'Navy Blue' : 'Obsidian Black'}`}
            title={`Switch visual theme (${theme === 'primary' ? 'Navy Blue' : 'Obsidian Black'})`}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: theme === 'primary' ? '#132756' : '#0F121A',
              border: theme === 'primary' ? '1.5px solid #284D9E' : '1.5px solid #242B3D',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: theme === 'primary' ? '0 2px 10px rgba(18, 40, 90, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.6)',
              transition: 'all 0.2s ease',
            }}
          >
            {theme === 'primary' ? (
              <Sun size={20} color="#FAC908" />
            ) : (
              <Moon size={20} color="#A78BFA" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Mobile Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Search Bar */}
        <div>
          <SearchTrigger variant="desktop" onTrigger={onClose} style={{ width: '100%' }} />
        </div>

        {/* Dedicated Responsive Theme Switcher Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-default)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: theme === 'primary' ? '#132756' : '#0F121A',
                border: theme === 'primary' ? '1px solid #284D9E' : '1px solid #242B3D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'primary' ? <Sun size={16} color="#FAC908" /> : <Moon size={16} color="#A78BFA" />}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {theme === 'primary' ? 'Navy Blue Mode' : 'Pitch Black Mode'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                Visual appearance theme
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: theme === 'primary' ? 'rgba(250, 201, 8, 0.15)' : 'rgba(167, 139, 250, 0.15)',
              border: theme === 'primary' ? '1px solid rgba(250, 201, 8, 0.4)' : '1px solid rgba(167, 139, 250, 0.4)',
              color: theme === 'primary' ? '#FAC908' : '#A78BFA',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Switch Theme
          </button>
        </div>

        {/* University Campus Selector */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-default)',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setIsCampusPickerOpen(!isCampusPickerOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.85rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="var(--color-brand-blue)" />
              <span>Campus: {selectedCampus.shortName}</span>
            </div>
            <ChevronDown size={16} color="var(--color-text-muted)" style={{ transform: isCampusPickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {isCampusPickerOpen && (
            <div style={{ borderTop: '1px solid var(--color-border-subtle)', padding: '0.5rem' }}>
              {CAMPUSES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onCampusChange(c);
                    setIsCampusPickerOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: selectedCampus.id === c.id ? 'var(--color-blue-subtle)' : 'transparent',
                    color: selectedCampus.id === c.id ? 'var(--color-blue-light)' : 'var(--color-text-primary)',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 'var(--text-body-xs)',
                    fontWeight: selectedCampus.id === c.id ? 700 : 500,
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                >
                  <span>{c.name}</span>
                  {selectedCampus.id === c.id && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-brand-blue)' }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {PRIMARY_NAV_ITEMS.map((item) => {
            if (item.isMegaMenu) {
              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    type="button"
                    onClick={() => setIsServicesExpanded(!isServicesExpanded)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: 'var(--text-heading-sm)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      minHeight: '48px',
                    }}
                  >
                    <span>Services Ecosystem</span>
                    <ChevronDown size={18} color="var(--color-text-muted)" style={{ transform: isServicesExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Expandable 8-Service Grid for Mobile */}
                  {isServicesExpanded && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                        gap: '0.35rem',
                        paddingLeft: '0.75rem',
                        marginBottom: '0.75rem',
                        borderLeft: '2px solid var(--color-border-subtle)',
                      }}
                    >
                      {SERVICES_NAV_ITEMS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            onClose();
                            const matched = ECOSYSTEM_SERVICES.find((srv) => srv.id === s.id);
                            if (matched) {
                              window.location.hash = `#services/${matched.slug}`;
                            } else {
                              window.location.hash = 'catalog';
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-surface-1)',
                            border: '1px solid var(--color-border-subtle)',
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--text-body-xs)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            minHeight: '44px',
                          }}
                        >
                          <span>{s.name.split('&')[0].trim()}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-blue-light)' }}>from {s.startingPrice}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.href)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--text-heading-sm)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '48px',
                }}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'rgba(229, 36, 37, 0.15)',
                      color: '#FFA0A0',
                      border: '1px solid rgba(229, 36, 37, 0.3)',
                    }}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                )}
              </button>
            );
          })}
        </div>



        {/* Student Live Chat & WhatsApp Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid rgba(37, 211, 102, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginTop: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <MessageCircle size={18} strokeWidth={2.4} fill="currentColor" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                Need Help with Services?
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>
                ● Online on WhatsApp • &lt; 2m reply
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent('easehub:open-chat'));
            }}
            style={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Chat Now
          </button>
        </div>

        {/* User Authentication Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
          <UserActions
            variant="mobile"
            onSignIn={() => {
              onClose();
              window.location.hash = '#auth/sign-in';
            }}
            onGetStarted={() => {
              onClose();
              window.location.hash = '#auth/sign-up';
            }}
          />
        </div>
      </div>
    </div>
  );
};
