import React, { useState, useEffect } from 'react';
import {
  Home,
  Grid3X3,
  ShoppingBag,
  Bell,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { NotificationService } from '../../services/notificationService';

export interface MobileBottomBarProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onOpenTracker?: () => void;
  onOpenNotifications?: () => void;
  onNavigateAccount?: () => void;
  className?: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onNavigateHome,
  onNavigateServices,
  onOpenTracker: _onOpenTracker,
  onOpenNotifications,
  onNavigateAccount,
  className = '',
}) => {
  const { user } = useAuth();
  const { toggleCart, itemCount } = useCart();
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'orders' | 'notifications' | 'account'>('home');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Sync unread notifications count in real time
  useEffect(() => {
    const fetchUnread = () => {
      NotificationService.getUnreadCount(user?.email).then(setUnreadCount);
    };
    fetchUnread();
    const unsubscribe = NotificationService.subscribe(fetchUnread);
    return () => unsubscribe();
  }, [user?.email]);

  // Track active route based on window hash/pathname
  useEffect(() => {
    const handleLocation = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('tracking') || hash.includes('/orders') || hash.includes('#orders')) {
        setActiveTab('orders');
      } else if (hash.includes('services') || hash.includes('catalog')) {
        setActiveTab('services');
      } else if (hash.includes('account') || hash.includes('dashboard')) {
        setActiveTab('account');
      } else {
        setActiveTab('home');
      }
    };

    handleLocation();
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  const handleTabClick = (
    tab: 'home' | 'services' | 'orders' | 'notifications' | 'account',
    action?: () => void,
    defaultHref?: string
  ) => {
    setActiveTab(tab);
    if (action) {
      action();
    } else if (defaultHref) {
      window.location.hash = defaultHref;
    }
  };

  return (
    <>
      <nav
        aria-label="Mobile Navigation Bar"
        className={`easehub-mobile-bottom-bar ${className}`}
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9998,
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(22, 163, 74, 0.28)',
          boxShadow: '0 12px 36px -4px rgba(15, 81, 50, 0.18), 0 2px 10px rgba(0, 0, 0, 0.06)',
          padding: '6px 8px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: 'calc(100% - 24px)',
          maxWidth: '440px',
          margin: '0 auto',
        }}
      >
        {/* 1. Home Tab */}
        <button
          type="button"
          onClick={() => handleTabClick('home', onNavigateHome, '')}
          className="easehub-tab-btn"
          aria-label="Go to Home"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 8px',
            background: 'none',
            border: 'none',
            color: activeTab === 'home' ? '#15803D' : '#64748B',
            cursor: 'pointer',
            transition: 'color 0.2s ease, transform 0.2s ease',
            flex: 1,
            gap: '3px',
          }}
        >
          {activeTab === 'home' && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                width: '16px',
                height: '3px',
                borderRadius: '3px',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)',
              }}
            />
          )}
          <span className={activeTab === 'home' ? 'easehub-tab-pop' : ''} style={{ display: 'inline-flex' }}>
            <Home size={19} strokeWidth={activeTab === 'home' ? 2.5 : 2} color={activeTab === 'home' ? '#15803D' : '#64748B'} />
          </span>
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'home' ? 800 : 600, letterSpacing: '0.02em', color: activeTab === 'home' ? '#15803D' : '#64748B' }}>
            Home
          </span>
        </button>

        {/* 2. Services Tab */}
        <button
          type="button"
          onClick={() => handleTabClick('services', onNavigateServices, '#core-services')}
          className="easehub-tab-btn"
          aria-label="Browse Services"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 8px',
            background: 'none',
            border: 'none',
            color: activeTab === 'services' ? '#15803D' : '#64748B',
            cursor: 'pointer',
            transition: 'color 0.2s ease, transform 0.2s ease',
            flex: 1,
            gap: '3px',
          }}
        >
          {activeTab === 'services' && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                width: '16px',
                height: '3px',
                borderRadius: '3px',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)',
              }}
            />
          )}
          <span className={activeTab === 'services' ? 'easehub-tab-pop' : ''} style={{ display: 'inline-flex' }}>
            <Grid3X3 size={19} strokeWidth={activeTab === 'services' ? 2.5 : 2} color={activeTab === 'services' ? '#15803D' : '#64748B'} />
          </span>
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'services' ? 800 : 600, letterSpacing: '0.02em', color: activeTab === 'services' ? '#15803D' : '#64748B' }}>
            Services
          </span>
        </button>

        {/* 3. Orders / Tracking Tab */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('orders');
            if (itemCount > 0) {
              toggleCart();
            } else {
              window.location.hash = '#account/tracking';
              if (onNavigateAccount) onNavigateAccount();
            }
          }}
          className="easehub-tab-btn"
          aria-label={`View Orders & Tracking (${itemCount} items)`}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 8px',
            background: 'none',
            border: 'none',
            color: activeTab === 'orders' ? '#15803D' : '#64748B',
            cursor: 'pointer',
            transition: 'color 0.2s ease, transform 0.2s ease',
            flex: 1,
            gap: '3px',
          }}
        >
          {activeTab === 'orders' && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                width: '16px',
                height: '3px',
                borderRadius: '3px',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)',
              }}
            />
          )}
          <div style={{ position: 'relative' }}>
            <span className={itemCount > 0 ? 'easehub-tab-pop' : ''} style={{ display: 'inline-flex' }}>
              <ShoppingBag size={19} strokeWidth={activeTab === 'orders' ? 2.5 : 2} color={activeTab === 'orders' ? '#15803D' : '#64748B'} />
            </span>
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 900,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF',
                  boxShadow: '0 1px 4px rgba(22, 163, 74, 0.4)',
                }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'orders' ? 800 : 600, letterSpacing: '0.02em', color: activeTab === 'orders' ? '#15803D' : '#64748B' }}>
            {itemCount > 0 ? 'Cart' : 'Orders'}
          </span>
        </button>

        {/* 4. Notification Tab (Alerts) */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('notifications');
            if (onOpenNotifications) {
              onOpenNotifications();
            } else {
              window.dispatchEvent(new CustomEvent('easehub_open_notifications'));
            }
          }}
          className="easehub-tab-btn"
          aria-label="View Campus Notifications"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 8px',
            background: 'none',
            border: 'none',
            color: activeTab === 'notifications' ? '#15803D' : '#64748B',
            cursor: 'pointer',
            transition: 'color 0.2s ease, transform 0.2s ease',
            flex: 1,
            gap: '3px',
          }}
        >
          {activeTab === 'notifications' && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                width: '16px',
                height: '3px',
                borderRadius: '3px',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)',
              }}
            />
          )}
          <div style={{ position: 'relative' }}>
            <span className={unreadCount > 0 ? 'easehub-bell-alert' : activeTab === 'notifications' ? 'easehub-tab-pop' : ''} style={{ display: 'inline-flex' }}>
              <Bell size={19} strokeWidth={activeTab === 'notifications' ? 2.5 : 2} color={activeTab === 'notifications' ? '#15803D' : '#64748B'} />
            </span>
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 900,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF',
                  boxShadow: '0 1px 4px rgba(239, 68, 68, 0.4)',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'notifications' ? 800 : 600, letterSpacing: '0.02em', color: activeTab === 'notifications' ? '#15803D' : '#64748B' }}>
            Alerts
          </span>
        </button>

        {/* 5. Account / Profile Tab */}
        <button
          type="button"
          onClick={() => handleTabClick('account', onNavigateAccount, '#account')}
          className="easehub-tab-btn"
          aria-label="View Student Account"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 8px',
            background: 'none',
            border: 'none',
            color: activeTab === 'account' ? '#15803D' : '#64748B',
            cursor: 'pointer',
            transition: 'color 0.2s ease, transform 0.2s ease',
            flex: 1,
            gap: '3px',
          }}
        >
          {activeTab === 'account' && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                width: '16px',
                height: '3px',
                borderRadius: '3px',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)',
              }}
            />
          )}
          <span className={activeTab === 'account' ? 'easehub-tab-pop' : ''} style={{ display: 'inline-flex' }}>
            <UserIcon size={19} strokeWidth={activeTab === 'account' ? 2.5 : 2} color={activeTab === 'account' ? '#15803D' : '#64748B'} />
          </span>
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'account' ? 800 : 600, letterSpacing: '0.02em', color: activeTab === 'account' ? '#15803D' : '#64748B' }}>
            Profile
          </span>
        </button>
      </nav>

      {/* Global Responsive & Simulator CSS Rules */}
      <style>{`
        /* Permanently floating bottom dock across all screen sizes */
        .easehub-mobile-bottom-bar {
          display: flex !important;
          position: fixed !important;
          bottom: 16px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: calc(100% - 24px) !important;
          max-width: 440px !important;
          z-index: 9998 !important;
          pointer-events: auto !important;
        }

        .easehub-floating-tracker-btn {
          display: none !important;
        }

        .easehub-chat-floating-root {
          bottom: calc(env(safe-area-inset-bottom, 0px) + 84px) !important;
          right: 16px !important;
        }

        .easehub-global-footer {
          padding-bottom: calc(96px + env(safe-area-inset-bottom, 16px)) !important;
        }

        body {
          padding-bottom: 84px !important;
        }

        /* In Mobile Simulator, lock to the bottom of the phone chassis frame */
        body.mobile-preview-active .easehub-mobile-bottom-bar {
          display: flex !important;
          position: fixed !important;
          bottom: 14px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: calc(100% - 24px) !important;
          max-width: 380px !important;
          z-index: 99990 !important;
        }

        body.mobile-preview-active .easehub-floating-tracker-btn {
          display: none !important;
        }

        .easehub-tab-btn:active {
          transform: scale(0.92);
        }
      `}</style>
    </>
  );
};
