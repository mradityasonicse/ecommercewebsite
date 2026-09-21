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
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import type { UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
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
  const { toggleCart, itemCount } = useCart();
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
    window.dispatchEvent(new CustomEvent('easehub_open_role_gate'));
    if (onSignIn) {
      onSignIn();
    }
  };

  const handleGetStarted = () => {
    window.dispatchEvent(new CustomEvent('easehub_open_role_gate'));
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleNavigate = (hash: string) => {
    setIsDropdownOpen(false);
    window.location.hash = hash;
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    signOut();
    localStorage.removeItem('easehub_current_role');
    localStorage.removeItem('easehub_user_role');
    window.location.hash = '';
  };

  // 1. LOGGED OUT STATE (Figma & Awwwards Grade Minimal Header Actions)
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
        {/* Clean Sign In Text Button */}
        <button
          type="button"
          onClick={handleSignIn}
          className="easehub-spring-btn"
          style={{
            padding: isMobile ? '0.65rem 1rem' : '0.42rem 0.85rem',
            width: isMobile ? '100%' : 'auto',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-primary, #334155)',
            fontSize: '0.84rem',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'color 0.15s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#15803D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary, #334155)';
          }}
        >
          Sign In
        </button>

        {/* Primary Get Started Button */}
        <button
          type="button"
          onClick={handleGetStarted}
          className="easehub-spring-btn"
          style={{
            padding: isMobile ? '0.65rem 1.15rem' : '0.42rem 1.15rem',
            width: isMobile ? '100%' : 'auto',
            backgroundColor: '#16A34A',
            border: 'none',
            borderRadius: '9999px',
            color: '#FFFFFF',
            fontSize: '0.82rem',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(22, 163, 74, 0.25)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#15803D';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(22, 163, 74, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#16A34A';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(22, 163, 74, 0.25)';
          }}
        >
          Get Started
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
          color: unreadCount > 0 ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
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
          e.currentTarget.style.color = unreadCount > 0 ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)';
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
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-brand-red)',
              color: '#FFFFFF',
              fontSize: '0.62rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
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
                  backgroundColor: role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-blue-subtle)',
                  color: role === 'admin' ? 'var(--color-brand-red)' : 'var(--color-brand-blue)',
                  border: role === 'admin' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
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
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <LayoutDashboard size={14} color="var(--color-brand-blue)" />
                  <span>Student Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/services')}
                  className="nav-dropdown-item"
                  style={{ ...dropdownItemStyle, color: '#16A34A', fontWeight: 700 }}
                >
                  <Sparkles size={14} color="#16A34A" />
                  <span>My Services (Active Hub)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    toggleCart();
                  }}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <ShoppingBag size={14} color="var(--color-brand-blue)" />
                  <span>Campus Cart ({itemCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/requests')}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <Package size={14} color="var(--color-brand-blue)" />
                  <span>Order History</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/notifications')}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <Bell size={14} color="var(--color-brand-blue)" />
                  <span style={{ flex: 1 }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        backgroundColor: 'var(--color-brand-red)',
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
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <UserIcon size={14} color="var(--color-brand-blue)" />
                  <span>Profile & Campus Info</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('#account/settings')}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <Settings size={14} color="var(--color-brand-blue)" />
                  <span>Settings & Preferences</span>
                </button>
              </>
            )}

            {/* Provider Role Actions */}
            {role === 'provider' && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate('#provider')}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <LayoutDashboard size={14} color="var(--color-brand-blue)" />
                  <span>Provider Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('#provider/status')}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <Shield size={14} color="var(--color-brand-blue)" />
                  <span>Verification Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('#provider/profile')}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <UserIcon size={14} color="var(--color-brand-blue)" />
                  <span>Provider Profile</span>
                </button>
              </>
            )}

            {/* Admin Role Actions */}
            {role === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate('#admin/dashboard')}
                  className="nav-dropdown-item"
                  style={dropdownItemStyle}
                >
                  <Shield size={14} color="var(--color-brand-red)" />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('#account/dashboard')}
                  className="nav-dropdown-item"
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
              className="nav-dropdown-item"
              style={{
                ...dropdownItemStyle,
                color: 'var(--color-brand-red)',
              }}
            >
              <LogOut size={14} color="var(--color-brand-red)" />
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
