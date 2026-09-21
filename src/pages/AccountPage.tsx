import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  User as UserIcon,
  Bell,
  Settings,
  Shield,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  AccountHeader,
  AccountProfileTab,
  AccountRequestsTab,
  AccountSecurityTab,
  AccountSettingsTab,
  AccountNotificationsTab,
  RequestDetailPage,
  StudentDashboardOverview,
  AccountServicesTab,
} from '../components/account';
import { parseAccountRouteFromUrl, type AccountSubpage } from '../utils/routes';
import { NotificationService } from '../services/notificationService';
import { Sparkles } from 'lucide-react';

interface AccountPageProps {
  onNavigateToAuth?: (mode?: 'sign-in' | 'sign-up') => void;
  onNavigateToServices?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigateToAuth,
  onNavigateToServices,
}) => {
  const { user, signOut, isAuthenticated, updateUser } = useAuth();

  // Helper to extract state from URL
  const getSubpageFromUrl = (): { subpage: AccountSubpage; requestId?: string } => {
    if (typeof window === 'undefined') return { subpage: 'overview' };
    const parsed = parseAccountRouteFromUrl(window.location.pathname, window.location.hash);
    if (parsed) return parsed;

    const hash = window.location.hash.toLowerCase();
    if (hash.includes('/services') || hash.includes('/my-services')) return { subpage: 'services' };
    if (hash.includes('/notifications')) return { subpage: 'notifications' };
    if (hash.includes('/profile')) return { subpage: 'profile' };
    if (hash.includes('/settings')) return { subpage: 'settings' };
    if (hash.includes('/requests')) return { subpage: 'requests' };
    return { subpage: 'overview' };
  };

  const [routeInfo, setRouteInfo] = useState(getSubpageFromUrl);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Synchronize route state with browser history & URL
  useEffect(() => {
    const handleUrlChange = () => {
      setRouteInfo(getSubpageFromUrl());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Fetch and subscribe to unread notification count
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const updateCount = () => {
      NotificationService.getUnreadCount(user.email).then(setUnreadNotificationsCount);
    };
    updateCount();
    const unsub = NotificationService.subscribe(updateCount);
    return () => unsub();
  }, [isAuthenticated, user]);

  const navigateToTab = (tab: AccountSubpage, requestId?: string) => {
    if (tab === 'request-detail' && requestId) {
      window.location.hash = `#account/requests/${requestId}`;
    } else if (tab === 'overview') {
      window.location.hash = '#account/dashboard';
    } else {
      window.location.hash = `#account/${tab}`;
    }
    setRouteInfo({ subpage: tab, requestId });
  };

  // If user is not authenticated, present an elegant prompt to sign in
  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: 'calc(var(--navbar-height, 72px) + 3rem) var(--space-6) var(--space-20)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803D',
            marginBottom: 'var(--space-2)',
          }}
        >
          <Lock size={28} />
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          Student Account Access
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Sign in with your campus student credentials to monitor live request tracking, hostel deliveries, and booking history.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            onClick={() => {
              if (onNavigateToAuth) onNavigateToAuth('sign-in');
              else window.location.hash = '#auth/sign-in?returnTo=/account';
            }}
          >
            Sign In Now
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              if (onNavigateToAuth) onNavigateToAuth('sign-up');
              else window.location.hash = '#auth/sign-up?returnTo=/account';
            }}
          >
            Create Student Account
          </Button>
        </div>
      </div>
    );
  }

  const activeTab = routeInfo.subpage;

  return (
    <div
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: 'calc(var(--navbar-height, 72px) + 2rem) var(--space-6) var(--space-24)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
      }}
    >
      {/* Account User Header Card */}
      <AccountHeader
        user={user}
        onSignOut={() => {
          signOut();
          window.location.hash = '';
        }}
      />

      {/* Account Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Student Account Navigation"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          borderBottom: '1px solid var(--color-border-subtle)',
          paddingBottom: 'var(--space-2)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Overview Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => navigateToTab('overview')}
          style={getTabStyle(activeTab === 'overview')}
        >
          <LayoutDashboard size={16} color={activeTab === 'overview' ? '#15803D' : undefined} />
          <span>Dashboard Overview</span>
        </button>

        {/* My Services Hub Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'services'}
          onClick={() => navigateToTab('services')}
          style={getTabStyle(activeTab === 'services')}
        >
          <Sparkles size={16} color={activeTab === 'services' ? '#15803D' : '#16A34A'} />
          <span style={{ fontWeight: 800 }}>My Services</span>
          <span
            style={{
              fontSize: '0.66rem',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '0.1rem 0.45rem',
              fontWeight: 800,
            }}
          >
            LIVE
          </span>
        </button>

        {/* Requests Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'requests' || activeTab === 'request-detail'}
          onClick={() => navigateToTab('requests')}
          style={getTabStyle(activeTab === 'requests' || activeTab === 'request-detail')}
        >
          <Package size={16} color={activeTab === 'requests' || activeTab === 'request-detail' ? '#15803D' : undefined} />
          <span>Order History</span>
        </button>

        {/* Notifications Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'notifications'}
          onClick={() => navigateToTab('notifications')}
          style={getTabStyle(activeTab === 'notifications')}
        >
          <Bell size={16} color={activeTab === 'notifications' ? '#15803D' : undefined} />
          <span>Notifications</span>
          {unreadNotificationsCount > 0 && (
            <span
              style={{
                fontSize: '0.65rem',
                backgroundColor: 'var(--color-accent-red)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-pill)',
                padding: '0.1rem 0.4rem',
                fontWeight: 800,
              }}
            >
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Profile Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          onClick={() => navigateToTab('profile')}
          style={getTabStyle(activeTab === 'profile')}
        >
          <UserIcon size={16} color={activeTab === 'profile' ? '#15803D' : undefined} />
          <span>Profile & Campus</span>
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'settings'}
          onClick={() => navigateToTab('settings')}
          style={getTabStyle(activeTab === 'settings')}
        >
          <Settings size={16} color={activeTab === 'settings' ? '#15803D' : undefined} />
          <span>Settings & Security</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {/* My Services Hub */}
        {activeTab === 'services' && (
          <AccountServicesTab
            user={user}
            onNavigateToServices={onNavigateToServices}
          />
        )}

        {/* Phase 9: Dashboard Overview */}
        {activeTab === 'overview' && (
          <StudentDashboardOverview
            user={user}
            onNavigateToTab={(tab, reqId) => {
              if (reqId) {
                navigateToTab('request-detail', reqId);
              } else {
                navigateToTab(tab as AccountSubpage);
              }
            }}
            onNavigateToServices={onNavigateToServices}
          />
        )}

        {/* Phase 9: Individual Request Detail View */}
        {activeTab === 'request-detail' && routeInfo.requestId && (
          <RequestDetailPage
            requestId={routeInfo.requestId}
            user={user}
            onBack={() => navigateToTab('requests')}
            onNavigateToServices={onNavigateToServices}
          />
        )}

        {/* Phase 9: Requests List Tab */}
        {activeTab === 'requests' && (
          <AccountRequestsTab
            user={user}
            onNavigateToServices={onNavigateToServices}
          />
        )}

        {/* Phase 10: Notification Center */}
        {activeTab === 'notifications' && (
          <AccountNotificationsTab
            user={user}
            onNavigateToRequest={(reqId) => navigateToTab('request-detail', reqId)}
          />
        )}

        {/* Phase 10: Profile & Campus Tab */}
        {activeTab === 'profile' && (
          <AccountProfileTab
            user={user}
            onUpdateUser={updateUser}
          />
        )}

        {/* Phase 10: Settings & Security Tab */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <AccountSettingsTab
              user={user}
            />

            {/* Embedded Security Section */}
            <div style={{ marginTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-4)' }}>
                <Shield size={18} color="#15803D" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Password & Active Session Credentials
                </h3>
              </div>
              <AccountSecurityTab
                user={user}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getTabStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.1rem',
    borderRadius: 'var(--radius-md)',
    border: isActive ? '1px solid #86EFAC' : '1px solid transparent',
    backgroundColor: isActive ? '#DCFCE7' : 'transparent',
    color: isActive ? '#15803D' : '#475569',
    fontWeight: isActive ? 800 : 500,
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    outline: 'none',
  };
}
