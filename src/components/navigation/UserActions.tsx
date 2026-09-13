import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon,
  Bell,
  Package,
  Settings,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import type { UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationService } from '../../services/notificationService';

export interface UserActionsProps {
  role?: UserRole;
  onSignIn?: () => void;
  onGetStarted?: () => void;
  variant?: 'desktop' | 'mobile';
  className?: string;
  style?: React.CSSProperties;
}

export const UserActions: React.FC<UserActionsProps> = ({
  onSignIn,
  onGetStarted,
  variant = 'desktop',
  className = '',
  style = {},
}) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = variant === 'mobile';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync unread notifications count
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const fetchUnread = () => {
      NotificationService.getUnreadCount(user.email).then(setUnreadCount);
    };
    fetchUnread();
    const unsubscribe = NotificationService.subscribe(fetchUnread);
    return () => unsubscribe();
  }, [isAuthenticated, user]);

  // Dismiss dropdown on outside click or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      window.location.hash = '#auth/sign-in';
    }
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      window.location.hash = '#auth/sign-up';
    }
  };

  const handleNavigate = (hash: string) => {
    setIsDropdownOpen(false);
    window.location.hash = hash;
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    signOut();
    window.location.hash = '';
  };

  // 1. LOGGED OUT STATE
  if (!isAuthenticated || !user) {
    return (
      <div
        className={`easehub-user-actions ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '0.75rem' : '0.65rem',
          width: isMobile ? '100%' : 'auto',
          flexDirection: isMobile ? 'column' : 'row',
          ...style,
        }}
      >
        {/* Dark / Light Mode Toggle Button (Matching Reference Site) */}
        {/* Theme Switcher Button (Primary Brand Navy -> Pitch Black -> Crisp Light) */}
        {!isMobile && (
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Current Theme: ${theme === 'primary' ? 'Navy Blue' : 'Obsidian Black'}. Click to switch theme.`}
            title={`Current Theme: ${
              theme === 'primary'
                ? 'Brand Navy (Click for Pitch Black)'
                : 'Pitch Black (Click for Brand Navy)'
            }`}
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
              boxShadow:
                theme === 'primary'
                  ? '0 2px 10px rgba(18, 40, 90, 0.4)'
                  : '0 2px 10px rgba(0, 0, 0, 0.6)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {theme === 'primary' ? (
              // Brand Royal Navy Mode: Sunflower Gold Sun/Sparkle
              <Sun size={18} color="#FACA12" />
            ) : (
              // Midnight Black Mode: Cool Lunar Violet Moon
              <Moon size={18} color="#A78BFA" />
            )}
          </button>
        )}

        {/* Login Button (Reference Site Style: Crisp White with Border) */}
        <button
          type="button"
          onClick={handleSignIn}
          style={{
            padding: isMobile ? '0.75rem 1rem' : '0.45rem 1.15rem',
            width: isMobile ? '100%' : 'auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            color: '#0F172A',
            fontSize: '0.86rem',
            fontWeight: 600,
            fontFamily: 'var(--font-display, sans-serif)',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          Login
        </button>

        {/* Sign Up Button (Reference Site Style: Solid Brand Navy) */}
        <button
          type="button"
          onClick={handleGetStarted}
          style={{
            padding: isMobile ? '0.75rem 1rem' : '0.48rem 1.25rem',
            width: isMobile ? '100%' : 'auto',
            backgroundColor: '#12285A', // Official Brand Deep Navy
            border: 'none',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '0.86rem',
            fontWeight: 600,
            fontFamily: 'var(--font-display, sans-serif)',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(18, 40, 90, 0.2)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0D1E44';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#12285A';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Sign Up
        </button>
      </div>
    );
  }

  const role = user.role || 'student';

  // 2. MOBILE LOGGED-IN VIEW (in drawer)
  if (isMobile) {
    return (
      <div
        className={`easehub-user-actions-mobile-auth ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          ...style,
        }}
      >
        {/* User Card Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  backgroundColor: role === 'admin' ? 'rgba(229, 36, 37, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: role === 'admin' ? '#FF7B72' : '#FFFFFF',
                }}
              >
                {role}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={() => handleNavigate('#account/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LayoutDashboard size={14} color="var(--color-brand-blue)" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('#account/requests')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Package size={14} color="var(--color-brand-blue)" />
            <span>Requests</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('#account/notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={14} color="var(--color-brand-blue)" />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: '0.65rem',
                  backgroundColor: 'var(--color-accent-red)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.1rem 0.35rem',
                  fontWeight: 700,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('#account/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <UserIcon size={14} color="var(--color-brand-blue)" />
            <span>Profile</span>
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
            gap: '0.5rem',
            padding: '0.65rem',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 43, 43, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#FF7B72',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '0.25rem',
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  // 3. DESKTOP LOGGED-IN VIEW (Avatar with dropdown & quick notifications bell)
  return (
    <div
      ref={dropdownRef}
      className={`easehub-user-actions-auth ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
        ...style,
      }}
    >
      {/* Notifications Quick Trigger */}
      <button
        type="button"
        onClick={() => handleNavigate('#account/notifications')}
        aria-label={`Notifications (${unreadCount} unread)`}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border-default)',
          color: unreadCount > 0 ? 'var(--color-blue-light)' : 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-default)';
          e.currentTarget.style.color = unreadCount > 0 ? 'var(--color-blue-light)' : 'var(--color-text-secondary)';
        }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              minWidth: '16px',
              height: '16px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-brand-red)',
              color: '#FFFFFF',
              fontSize: '0.62rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              boxShadow: '0 0 6px var(--color-red-glow)',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* User Session Pill */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.65rem 0.35rem 0.4rem',
          backgroundColor: isDropdownOpen ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
          borderRadius: 'var(--radius-pill)',
          border: isDropdownOpen ? '1px solid var(--color-brand-blue)' : '1px solid var(--color-border-default)',
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'border-color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-blue-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand-blue)',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: 'var(--text-body-xs)', fontWeight: 600, color: '#FFFFFF', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown
          size={13}
          color="var(--color-text-muted)"
          style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {/* Authenticated Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="nav-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '240px',
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.5rem',
            zIndex: 9980,
          }}
        >
          {/* User Header */}
          <div style={{ padding: '0.5rem 0.65rem 0.65rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{user.name}</span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  backgroundColor: role === 'admin' ? 'rgba(229, 36, 37, 0.15)' : 'var(--color-blue-subtle)',
                  color: role === 'admin' ? '#FFA0A0' : 'var(--color-blue-light)',
                  border: role === 'admin' ? '1px solid rgba(229, 36, 37, 0.3)' : '1px solid rgba(11, 127, 194, 0.3)',
                }}
              >
                {role}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
              {user.email}
            </div>
          </div>

          {/* Links Section */}
          <div style={{ padding: '0.35rem 0' }}>
            {/* Student Role Actions */}
            {role === 'student' && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate('#account/dashboard')}
                  style={dropdownItemStyle}
                >
                  <LayoutDashboard size={14} color="var(--color-brand-blue)" />
                  <span>Student Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/requests')}
                  style={dropdownItemStyle}
                >
                  <Package size={14} color="var(--color-brand-blue)" />
                  <span>My Requests</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/notifications')}
                  style={dropdownItemStyle}
                >
                  <Bell size={14} color="var(--color-brand-blue)" />
                  <span style={{ flex: 1 }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        backgroundColor: 'var(--color-accent-red)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius-pill)',
                        padding: '0.1rem 0.35rem',
                        fontWeight: 700,
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/profile')}
                  style={dropdownItemStyle}
                >
                  <UserIcon size={14} color="var(--color-brand-blue)" />
                  <span>Profile & Campus Info</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/settings')}
                  style={dropdownItemStyle}
                >
                  <Settings size={14} color="var(--color-brand-blue)" />
                  <span>Settings & Preferences</span>
                </button>

              </>
            )}

            {/* Admin Role Actions */}
            {role === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate('#admin/dashboard')}
                  style={dropdownItemStyle}
                >
                  <Shield size={14} color="#FF7B72" />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('#account/dashboard')}
                  style={dropdownItemStyle}
                >
                  <LayoutDashboard size={14} color="var(--color-brand-blue)" />
                  <span>Student View</span>
                </button>
              </>
            )}
          </div>

          {/* Sign Out Action */}
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.35rem' }}>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                ...dropdownItemStyle,
                color: '#FF7B72',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  width: '100%',
  padding: '0.5rem 0.65rem',
  background: 'none',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-primary)',
  fontSize: '0.8rem',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.12s ease',
};
