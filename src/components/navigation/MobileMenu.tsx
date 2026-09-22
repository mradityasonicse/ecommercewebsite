import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
  Package,
  LayoutDashboard,
  Shield,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { CAMPUSES, type Campus } from '../../data/campuses';
import { SearchTrigger } from './SearchTrigger';
import { DomainSwitcher } from './DomainSwitcher';
import { useAuth } from '../../context/AuthContext';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
}

interface NavItemDef {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen: _onRequestCampusOpen,
  onPartnerOpen: _onPartnerOpen,
}) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isCampusPickerOpen, setIsCampusPickerOpen] = useState<boolean>(false);
  const [activeHash, setActiveHash] = useState<string>('');

  // Track active hash for visual feedback
  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash.toLowerCase());
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

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

  const role = user?.role || 'student';

  const getNavItems = (): NavItemDef[] => {
    if (!isAuthenticated) {
      return [
        { id: 'services', label: 'Services', href: '#core-services' },
        { id: 'bundles', label: 'Student Bundles', href: '#bundles', badge: 'Save 15%' },
      ];
    }

    if (role === 'provider') {
      return [
        { id: 'provider', label: 'Provider Portal', href: '#provider' },
        { id: 'status', label: 'Verification Status', href: '#provider/status' },
        { id: 'contact', label: 'Partner Helpdesk', href: '#contact' },
      ];
    }

    if (role === 'admin') {
      return [
        { id: 'admin', label: 'Admin Console', href: '#admin' },
        { id: 'services', label: 'Services Ecosystem', href: '#core-services' },
        { id: 'account', label: 'Student Dashboard', href: '#account/dashboard' },
      ];
    }

    // Default: Authenticated Student
    return [
      { id: 'services', label: 'Services Catalog', href: '#core-services' },
      { id: 'tracking', label: 'Order Tracking', href: '#account/tracking' },
      { id: 'bundles', label: 'Living Bundles', href: '#bundles' },
      { id: 'requests', label: 'Order History', href: '#account/requests' },
    ];
  };

  const navItems = getNavItems();

  const handleLinkClick = (href: string) => {
    onClose();
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '').split('?')[0];
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        window.location.hash = href;
      }
    } else {
      window.location.href = href;
    }
  };

  const handleSignOut = () => {
    onClose();
    signOut();
    window.location.hash = '';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      id="mobile-nav-drawer"
      className="easehub-mobile-nav-drawer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999995,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* 1. Backdrop Overlay */}
      <div
        onClick={onClose}
        className="easehub-mobile-drawer-backdrop"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          animation: 'mobileBackdropFade 0.2s ease-out forwards',
        }}
      />

      {/* 2. Slide-In Drawer Panel */}
      <div
        className="easehub-mobile-drawer-panel"
        style={{
          position: 'relative',
          width: 'min(340px, 86vw)',
          height: '100%',
          backgroundColor: 'var(--color-surface, #FFFFFF)',
          borderLeft: '1px solid var(--color-border-subtle, #E2E8F0)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999996,
          animation: 'mobileDrawerSlide 0.25s var(--ease-smooth) forwards',
        }}
      >
        {/* Drawer Header (Clean, Never Clipped, High-Trust) */}
        <div
          className="easehub-mobile-drawer-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            borderBottom: '1px solid var(--color-border-subtle, #E2E8F0)',
            flexShrink: 0,
            height: '64px',
            minHeight: '64px',
            backgroundColor: 'var(--color-surface, #FFFFFF)',
          }}
        >
          <BrandLogo variant="mobile" href="#" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="easehub-spring-btn"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-surface-2, #F1F5F9)',
              border: '1px solid var(--color-border-subtle, #E2E8F0)',
              color: 'var(--color-text-primary, #0F172A)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              padding: 0,
              transition: 'all 0.15s ease',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.25rem calc(3rem + env(safe-area-inset-bottom, 20px)) 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Quick Search */}
          <div>
            <SearchTrigger
              variant="desktop"
              onTrigger={onClose}
              style={{ width: '100%', minWidth: '100%', padding: '0.55rem 0.85rem' }}
            />
          </div>

          {/* Domain Hub Switcher Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              Active Hub View:
            </span>
            <DomainSwitcher variant="compact" />
          </div>

          {/* Campus Selector Row */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
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
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: '44px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-brand-blue)" />
                <span>Hub: {selectedCampus.shortName}</span>
              </div>
              <ChevronDown
                size={16}
                color="var(--color-text-muted)"
                style={{
                  transform: isCampusPickerOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform var(--duration-fast)',
                }}
              />
            </button>

            {isCampusPickerOpen && (
              <div style={{ borderTop: '1px solid var(--color-border-subtle)', padding: '0.4rem' }}>
                {CAMPUSES.map((c) => {
                  const isSelected = selectedCampus.id === c.id;
                  return (
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
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                        color: isSelected ? 'var(--color-brand-blue)' : 'var(--color-text-primary)',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: 'var(--text-body-xs)',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        minHeight: '44px',
                      }}
                    >
                      <span>{c.name}</span>
                      {isSelected && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-brand-blue)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Primary Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span
              style={{
                fontSize: '0.70rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.25rem',
                paddingLeft: '0.5rem',
              }}
            >
              Navigation
            </span>

            {navItems.map((item) => {
              const isActive = activeHash.includes(item.href.replace('#', ''));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item.href)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--color-surface-2)' : 'transparent',
                    border: 'none',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    fontSize: '0.90rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: '46px',
                    transition: 'background-color var(--duration-fast), color var(--duration-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isActive && (
                      <span
                        style={{
                          width: '4px',
                          height: '16px',
                          borderRadius: '2px',
                          backgroundColor: 'var(--color-brand-blue)',
                        }}
                      />
                    )}
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-brand-red)',
                        color: '#FFFFFF',
                        fontWeight: 700,
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

          {/* User Account / Auth Section at Bottom */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            {isAuthenticated && user ? (
              <div
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {/* User Summary Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-brand-blue)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {user.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.60rem',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-sm)',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          backgroundColor:
                            role === 'admin'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(59, 130, 246, 0.2)',
                          color:
                            role === 'admin'
                              ? 'var(--color-brand-red)'
                              : 'var(--color-brand-blue)',
                        }}
                      >
                        {role}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--color-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Quick Account Links */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#account/dashboard')}
                    style={mobileQuickLinkStyle}
                  >
                    <LayoutDashboard size={14} color="var(--color-brand-blue)" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#account/requests')}
                    style={mobileQuickLinkStyle}
                  >
                    <Package size={14} color="var(--color-brand-blue)" />
                    <span>Requests</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#account/profile')}
                    style={mobileQuickLinkStyle}
                  >
                    <UserIcon size={14} color="var(--color-brand-blue)" />
                    <span>Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#account/settings')}
                    style={mobileQuickLinkStyle}
                  >
                    <Shield size={14} color="var(--color-brand-blue)" />
                    <span>Settings</span>
                  </button>
                </div>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-brand-red)',
                    fontSize: '0.80rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '40px',
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.hash = '#auth/sign-in';
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    minHeight: '44px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Login to EaseHub
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.hash = '#auth/sign-up';
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#16A34A',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    minHeight: '44px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Create Student Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mobileBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes mobileDrawerSlide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const mobileQuickLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.55rem 0.65rem',
  backgroundColor: 'var(--color-surface-1)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: 'var(--radius-sm)',
  color: '#FFFFFF',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
  minHeight: '40px',
};
