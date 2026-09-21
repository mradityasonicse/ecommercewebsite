import { useState, useEffect, lazy, Suspense } from 'react';
import { CAMPUSES, type Campus } from './data/campuses';
import type { Provider } from './data/providers';
import { ECOSYSTEM_SERVICES, type EcosystemService } from './data/services';
import type { Bundle } from './data/bundles';
import type { AuthViewMode } from './types/auth';
import {
  parseServiceSlugFromUrl,
  parseBookingSlugFromUrl,
  parseAuthRouteFromUrl,
  isAccountRoute,
  isChatRoute,
  isAdminRoute,
  getBookingHref,
  getServiceHref,
  getAuthHref,
  getAccountHref,
} from './utils/routes';

// Auth Context Provider
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrandIntroSplash } from './components/intro/BrandIntroSplash';
import { LoginGateModal } from './components/modals/LoginGateModal';
import { RoleLoginGateModal, type UserPersona } from './components/auth/RoleLoginGateModal';
import { RoleLoginPage } from './pages/RoleLoginPage';

// Code-split heavy secondary portals for instant initial load
const PgOwnerPortal = lazy(() => import('./components/portals/PgOwnerPortal').then(m => ({ default: m.PgOwnerPortal })));
const MessPartnerPortal = lazy(() => import('./components/portals/MessPartnerPortal').then(m => ({ default: m.MessPartnerPortal })));
const LaundryPartnerPortal = lazy(() => import('./components/portals/LaundryPartnerPortal').then(m => ({ default: m.LaundryPartnerPortal })));

// Global Layout Shell
import { AppShell } from './components/layout/AppShell';

// Storytelling Experience (Phase 4)
import {
  BundlesSection,
  ConnectedCampusPipeline,
} from './components/sections/story';
import { CoreServicesSection, type BookingTargetPayload } from './components/sections/story/CoreServicesSection';
import { CampusBentoSection } from './components/sections/story/CampusBentoSection';
import { WhatsAppBookingModal } from './components/modals/WhatsAppBookingModal';
import { ThankYouTrustModal } from './components/modals/ThankYouTrustModal';
import { OrderTrackerModal } from './components/modals/OrderTrackerModal';
import { MidnightCanteenModal } from './components/canteen/MidnightCanteenModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { PrizeWinningHero } from './components/sections/hero/PrizeWinningHero';
import { DailyMessMenuModal } from './components/mess/DailyMessMenuModal';
import { DailyMessMenuSection } from './components/sections/mess/DailyMessMenuSection';
import type { BookingSubmissionData } from './utils/whatsapp';

// Storytelling Experience (Phase 4)

// Code-split secondary pages for instant initial load
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage').then(m => ({ default: m.DesignSystemPage })));

// Modals & Drawers
import { ProviderDetailModal } from './components/modals/ProviderDetailModal';
import { ServiceDetailModal } from './components/modals/ServiceDetailModal';
import { BundleDetailModal } from './components/modals/BundleDetailModal';
import { RequestCampusDrawer } from './components/drawers/RequestCampusDrawer';
import { NotificationCenterDrawer } from './components/modals/NotificationCenterDrawer';
import { MobilePreviewContainer } from './components/layout/MobilePreviewContainer';

export type AppViewMode =
  | 'app'
  | 'services'
  | 'service-detail'
  | 'service-booking'
  | 'auth'
  | 'account'
  | 'design-system'
  | 'chat'
  | 'admin'
  | 'pg-portal'
  | 'mess-portal'
  | 'laundry-portal'
  | 'login';

interface RouteState {
  view: AppViewMode;
  serviceSlug: string;
  optionId?: string;
  authMode?: AuthViewMode;
  returnTo?: string;
  token?: string;
  errorCode?: string;
}

function MainApp() {
  const { user: _user } = useAuth();
  const [selectedCampus, setSelectedCampus] = useState<Campus>(CAMPUSES[0]);

  // Brand Cinematic Intro & Open-Out Animation State
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [isLoginGateOpen, setIsLoginGateOpen] = useState(false);
  const [isRoleGateOpen, setIsRoleGateOpen] = useState(false);

  // User Persona Session Role: 'student' | 'pg_owner' | 'mess_partner' | 'laundry_partner' | 'admin' | null
  // User mandate: "login page vagera ko proper fix karo sabse pahle login page aanachaiye then website usk according open hoga"
  // If not logged in in this session, the login page is displayed FIRST!
  const [currentUserRole, setCurrentUserRole] = useState<UserPersona | null>(() => {
    if (typeof window === 'undefined') return null;
    const currentHash = window.location.hash.toLowerCase();

    // Explicit login or select-role hash
    if (currentHash === '#login' || currentHash === '#select-role') return null;

    // Direct portal deep links
    if (currentHash === '#pg-portal') return 'pg_owner';
    if (currentHash === '#mess-portal') return 'mess_partner';
    if (currentHash === '#laundry-portal') return 'laundry_partner';
    if (currentHash === '#admin') return 'admin';

    // Session check: has user explicitly logged in during this session?
    const isSessionLoggedIn = sessionStorage.getItem('easehub_session_logged_in');
    if (isSessionLoggedIn === 'true') {
      return (localStorage.getItem('easehub_current_role') as UserPersona) || 'student';
    }

    // Default on initial load: No role yet -> Login page comes first!
    return null;
  });

  const handleSelectPersona = (role: UserPersona) => {
    try {
      sessionStorage.setItem('easehub_session_logged_in', 'true');
      localStorage.setItem('easehub_current_role', role);
      localStorage.setItem('easehub_user_role', role);
      if (role === 'admin') {
        sessionStorage.setItem('easehub_admin_auth', 'true');
      }
    } catch {}

    setCurrentUserRole(role);
    setIsRoleGateOpen(false);

    if (role === 'pg_owner') {
      navigateTo('pg-portal');
    } else if (role === 'mess_partner') {
      navigateTo('mess-portal');
    } else if (role === 'laundry_partner') {
      navigateTo('laundry-portal');
    } else if (role === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('app');
    }
  };

  const handleRoleLogout = () => {
    try {
      sessionStorage.removeItem('easehub_session_logged_in');
      sessionStorage.removeItem('easehub_admin_auth');
      localStorage.removeItem('easehub_current_role');
      localStorage.removeItem('easehub_user_role');
    } catch {}
    setCurrentUserRole(null);
    navigateTo('login');
  };

  useEffect(() => {
    const handleOpenRoleGate = () => {
      handleRoleLogout();
    };
    window.addEventListener('easehub_open_role_gate', handleOpenRoleGate);
    return () => window.removeEventListener('easehub_open_role_gate', handleOpenRoleGate);
  }, []);

  useEffect(() => {
    const handleCheckLoginHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#login' || h === '#select-role') {
        setCurrentUserRole(null);
      }
    };
    window.addEventListener('hashchange', handleCheckLoginHash);
    return () => window.removeEventListener('hashchange', handleCheckLoginHash);
  }, []);

  useEffect(() => {
    const handleCheckIntro = () => {
      const isHashIntro = window.location.hash === '#intro';
      const isPathIntro = window.location.pathname === '/intro' || window.location.pathname.endsWith('/intro');
      if (isHashIntro || isPathIntro) {
        setShowIntro(true);
      }
    };
    const handleOpenIntroEvent = () => setShowIntro(true);

    window.addEventListener('hashchange', handleCheckIntro);
    window.addEventListener('popstate', handleCheckIntro);
    window.addEventListener('easehub:open-intro', handleOpenIntroEvent);
    handleCheckIntro();

    return () => {
      window.removeEventListener('hashchange', handleCheckIntro);
      window.removeEventListener('popstate', handleCheckIntro);
      window.removeEventListener('easehub:open-intro', handleOpenIntroEvent);
    };
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    if (window.location.hash === '#intro') {
      window.location.hash = '#home';
    }
    if (window.location.pathname === '/intro' || window.location.pathname.endsWith('/intro')) {
      window.history.replaceState({}, '', window.location.hash || '/#home');
    }
  };

  // Modals & Drawers state
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedService, setSelectedService] = useState<EcosystemService | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [isRequestCampusOpen, setIsRequestCampusOpen] = useState(false);
  const [activeBookingPayload, setActiveBookingPayload] = useState<BookingTargetPayload | null>(null);
  const [thankYouBookingData, setThankYouBookingData] = useState<BookingSubmissionData | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [trackerTab, setTrackerTab] = useState<'mess' | 'laundry' | 'pg'>('mess');
  const [trackerOrderId, setTrackerOrderId] = useState<string | undefined>(undefined);
  const [isCanteenOpen, setIsCanteenOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMessMenuOpen, setIsMessMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Parse route state from current browser URL
  const getRouteStateFromUrl = (): RouteState => {
    if (typeof window === 'undefined') return { view: 'app', serviceSlug: '' };
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    // 0. Explicit Login Gate (#login, /login, #select-role)
    if (hash === '#login' || path === '/login' || hash === '#select-role') {
      return { view: 'login', serviceSlug: '' };
    }

    // 0. Operations / Admin Management Console (#admin, /admin)
    if (isAdminRoute(window.location.pathname, window.location.hash)) {
      return { view: 'admin', serviceSlug: '' };
    }

    // 0.1 PG Owner Portal (#pg-portal, /pg-portal)
    if (hash === '#pg-portal' || path === '/pg-portal' || hash.startsWith('#pg-portal?')) {
      return { view: 'pg-portal', serviceSlug: '' };
    }

    // 0.2 Mess Partner Portal (#mess-portal, /mess-portal)
    if (hash === '#mess-portal' || path === '/mess-portal' || hash.startsWith('#mess-portal?')) {
      return { view: 'mess-portal', serviceSlug: '' };
    }

    // 0.3 Laundry Partner Portal (#laundry-portal, /laundry-portal)
    if (hash === '#laundry-portal' || path === '/laundry-portal' || hash.startsWith('#laundry-portal?')) {
      return { view: 'laundry-portal', serviceSlug: '' };
    }

    // 2. Campus In-App Negotiation & Chats (#chat, #chats, /chat) - Redirect to home app
    if (isChatRoute(window.location.pathname, window.location.hash)) {
      return { view: 'app', serviceSlug: '' };
    }

    // 3. Design System Showcase
    if (hash === '#design-system' || path === '/design-system') {
      return { view: 'design-system', serviceSlug: '' };
    }

    // 4. Booking / Service Request Flow (/services/[slug]/book)
    const bookingMatch = parseBookingSlugFromUrl(window.location.pathname, window.location.hash);
    if (bookingMatch) {
      return {
        view: 'service-booking',
        serviceSlug: bookingMatch.slug,
        optionId: bookingMatch.optionId,
      };
    }

    // 5. Auth Views (#auth/sign-in, #auth/sign-up, #auth/forgot-password, #auth/reset-password, #auth/verify-email, #auth/error)
    const authMatch = parseAuthRouteFromUrl(window.location.pathname, window.location.hash);
    if (authMatch) {
      return {
        view: 'auth',
        serviceSlug: '',
        authMode: authMatch.mode,
        returnTo: authMatch.returnTo,
        token: authMatch.token,
        errorCode: authMatch.error,
      };
    }

    // 6. Student Account Dashboard (#account)
    if (isAccountRoute(window.location.pathname, window.location.hash)) {
      return { view: 'account', serviceSlug: '' };
    }

    // 7. Individual Service Detail (#services/[slug])
    const serviceSlug = parseServiceSlugFromUrl(window.location.pathname, window.location.hash);
    if (serviceSlug) {
      return { view: 'service-detail', serviceSlug };
    }

    // 8. Normalize #catalog, #services-catalog, #marketplace, or query parameters to main homepage
    if (
      hash === '#catalog' ||
      hash.startsWith('#catalog?') ||
      hash === '#services-catalog' ||
      hash === '#marketplace' ||
      hash.startsWith('#services?') ||
      path.startsWith('/catalog')
    ) {
      let targetCategory = 'pg';
      if (hash.includes('maintenance') || hash.includes('repair') || hash.includes('cleaning') || hash.includes('extra')) {
        targetCategory = 'extra';
      } else if (hash.includes('food') || hash.includes('mess') || hash.includes('meal')) {
        targetCategory = 'meals';
      } else if (hash.includes('laundry')) {
        targetCategory = 'laundry';
      } else if (hash.includes('hostel') || hash.includes('pg')) {
        targetCategory = 'pg';
      }

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('easehub:select-category', { detail: { category: targetCategory } }));
        const el = document.getElementById('core-services');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);

      return { view: 'app', serviceSlug: '' };
    }

    // 9. Default Unified Storytelling Homepage
    return { view: 'app', serviceSlug: '' };
  };

  const [routeState, setRouteState] = useState<RouteState>(getRouteStateFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      const newState = getRouteStateFromUrl();
      setRouteState(newState);
      if (window.location.hash) {
        const id = window.location.hash.replace('#', '').split('?')[0];
        const nonSectionRoutes = [
          'catalog',
          'marketplace',
          'services-catalog',
          'provider',
          'account',
          'auth',
          'design-system',
          'chat',
          'chats',
          'admin',
        ];
        if (!nonSectionRoutes.includes(id) && !id.startsWith('services/')) {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 80);
        }
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Handle direct hash on initial mount
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '').split('?')[0];
      const nonSectionRoutes = [
        'catalog',
        'marketplace',
        'services-catalog',
        'account',
        'auth',
        'design-system',
        'bazaar',
        'chat',
        'chats',
        'admin',
      ];
      if (!nonSectionRoutes.includes(id) && !id.startsWith('services/')) {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  }, []);

  // Listen for Live Tracker modal requests across components
  useEffect(() => {
    const handleOpenTracker = (e: any) => {
      if (e?.detail?.tab) setTrackerTab(e.detail.tab);
      if (e?.detail?.orderId) setTrackerOrderId(e.detail.orderId);
      setIsOrderTrackerOpen(true);
    };
    window.addEventListener('easehub_open_order_tracker', handleOpenTracker as any);

    const checkTrackHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#track' || h === '#tracker' || h.startsWith('#track?')) {
        if (h.includes('kind=pg') || h.includes('tab=pg')) setTrackerTab('pg');
        else if (h.includes('kind=laundry') || h.includes('tab=laundry')) setTrackerTab('laundry');
        else if (h.includes('kind=mess') || h.includes('tab=mess')) setTrackerTab('mess');
        setIsOrderTrackerOpen(true);
      }
    };

    checkTrackHash();
    window.addEventListener('hashchange', checkTrackHash);

    return () => {
      window.removeEventListener('easehub_open_order_tracker', handleOpenTracker as any);
      window.removeEventListener('hashchange', checkTrackHash);
    };
  }, []);

  // Listen for Command Palette events & keyboard shortcuts
  useEffect(() => {
    const handleOpenCommandPalette = () => setIsCommandPaletteOpen(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('easehub_open_command_palette', handleOpenCommandPalette);
    window.addEventListener('keydown', handleKeyDown);

    const handleOpenMessMenu = () => setIsMessMenuOpen(true);
    window.addEventListener('easehub_open_mess_menu', handleOpenMessMenu);

    const handleOpenNotifs = () => setIsNotificationCenterOpen(true);
    window.addEventListener('easehub_open_notifications', handleOpenNotifs);

    const checkHashEvents = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#mess-menu') {
        setIsMessMenuOpen(true);
      } else if (h === '#notifications' || h === '#alerts') {
        setIsNotificationCenterOpen(true);
      } else {
        // Automatically dismiss popups when navigating to account, services, or home
        setIsMessMenuOpen(false);
      }
    };
    checkHashEvents();
    window.addEventListener('hashchange', checkHashEvents);

    return () => {
      window.removeEventListener('easehub_open_command_palette', handleOpenCommandPalette);
      window.removeEventListener('easehub_open_mess_menu', handleOpenMessMenu);
      window.removeEventListener('easehub_open_notifications', handleOpenNotifs);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHashEvents);
    };
  }, []);

  // Close all floating overlays whenever leaving main app view
  useEffect(() => {
    if (routeState.view !== 'app') {
      setIsMessMenuOpen(false);
      setIsCanteenOpen(false);
      setIsCommandPaletteOpen(false);
    }
  }, [routeState.view]);

  const navigateTo = (
    mode: AppViewMode,
    slug?: string,
    optionId?: string,
    authMode?: AuthViewMode,
    returnTo?: string
  ) => {
    if (mode === 'login') {
      window.location.hash = 'login';
    } else if (mode === 'admin') {
      window.location.hash = 'admin';
    } else if (mode === 'pg-portal') {
      window.location.hash = 'pg-portal';
    } else if (mode === 'mess-portal') {
      window.location.hash = 'mess-portal';
    } else if (mode === 'laundry-portal') {
      window.location.hash = 'laundry-portal';
    } else if (mode === 'chat') {
      window.location.hash = 'chat';
    } else if (mode === 'design-system') {
      window.location.hash = 'design-system';
    } else if (mode === 'service-booking' && slug) {
      window.location.hash = getBookingHref(slug, optionId);
    } else if (mode === 'service-detail' && slug) {
      window.location.hash = getServiceHref(slug);
    } else if (mode === 'auth') {
      window.location.hash = getAuthHref(authMode || 'sign-in', returnTo);
    } else if (mode === 'account') {
      window.location.hash = getAccountHref();
    } else if (mode === 'services') {
      window.location.hash = 'catalog';
    } else {
      window.location.hash = '';
    }

    setRouteState({
      view: mode,
      serviceSlug: slug || '',
      optionId,
      authMode,
      returnTo,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Standalone Design System View
  if (routeState.view === 'design-system') {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <div className="easehub-root" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
          <DesignSystemPage />
          <button
            onClick={() => navigateTo('app')}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              transition: 'transform var(--duration-fast), background-color var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.backgroundColor = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.backgroundColor = '#1E293B';
            }}
          >
            <span>🏠 Return to Homepage</span>
          </button>
        </div>
      </Suspense>
    );
  }

  // Dedicated Role Login Screen: Shown FIRST before website opens, or when visiting #login
  if (!currentUserRole || routeState.view === 'login') {
    return (
      <RoleLoginPage
        onLogin={(role) => {
          handleSelectPersona(role);
        }}
      />
    );
  }

  // Standalone Auth Layout View
  if (routeState.view === 'auth') {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <AuthPage
          initialMode={routeState.authMode || 'sign-in'}
          returnTo={routeState.returnTo}
          token={routeState.token}
          errorCode={routeState.errorCode}
          onBackToApp={() => navigateTo('app')}
          onAuthSuccess={() => {
            if (routeState.returnTo) {
              window.location.href = routeState.returnTo.startsWith('#')
                ? routeState.returnTo
                : `#${routeState.returnTo}`;
            } else {
              navigateTo('account');
            }
          }}
        />
      </Suspense>
    );
  }

  return (
    <AppShell
      selectedCampus={selectedCampus}
      onCampusChange={setSelectedCampus}
      onRequestCampusOpen={() => setIsRequestCampusOpen(true)}
      onOpenTracker={() => setIsOrderTrackerOpen(true)}
      onOpenNotifications={() => setIsNotificationCenterOpen(true)}
      onNavigateHome={() => navigateTo('app')}
      onNavigateServices={() => navigateTo('services')}
      onNavigateAccount={() => navigateTo('account')}
    >
      <Suspense fallback={<div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', fontWeight: 600 }}>Loading...</div>}>
      {routeState.view === 'admin' ? (
        /* ENTERPRISE ADMIN OPERATIONS CONSOLE */
        <AdminPage />
      ) : routeState.view === 'pg-portal' ? (
        /* PG OWNER ROOM VACANCY & AVAILABILITY PORTAL */
        <PgOwnerPortal
          onBackToApp={() => navigateTo('app')}
          onSwitchRole={handleRoleLogout}
        />
      ) : routeState.view === 'mess-portal' ? (
        /* MESS PARTNER KITCHEN & ARRIVAL PIPELINE PORTAL */
        <MessPartnerPortal
          onBackToApp={() => navigateTo('app')}
          onSwitchRole={handleRoleLogout}
        />
      ) : routeState.view === 'laundry-portal' ? (
        /* LAUNDRY PARTNER SCHEDULED PICKUP & WASH QUEUE PORTAL */
        <LaundryPartnerPortal
          onBackToApp={() => navigateTo('app')}
          onSwitchRole={handleRoleLogout}
        />
      ) : routeState.view === 'chat' ? (
        /* REAL-TIME IN-APP NEGOTIATION & CHAT HUB */
        <ChatPage />
      ) : routeState.view === 'service-booking' ? (
        /* PHASE 7: BOOKING & SERVICE REQUEST FLOW */
        <BookingPage
          slug={routeState.serviceSlug}
          selectedCampus={selectedCampus}
          preselectedOptionId={routeState.optionId}
          onBackToService={() => navigateTo('service-detail', routeState.serviceSlug)}
          onNavigateToAccount={() => navigateTo('account')}
          onNavigateToServices={() => navigateTo('services')}
        />
      ) : routeState.view === 'account' ? (
        /* PHASE 8: STUDENT ACCOUNT DASHBOARD */
        <AccountPage
          onNavigateToAuth={(m) => navigateTo('auth', undefined, undefined, m, '/account')}
          onNavigateToServices={() => navigateTo('services')}
        />
      ) : routeState.view === 'service-detail' ? (
        /* DEDICATED INDIVIDUAL SERVICE DETAIL EXPERIENCE (Phase 6) */
        <ServiceDetailPage
          slug={routeState.serviceSlug}
          selectedCampus={selectedCampus}
          onNavigateToService={(slug) => navigateTo('service-detail', slug)}
          onBackToCatalog={() => navigateTo('services')}
          onSelectOption={(opt) => navigateTo('service-booking', routeState.serviceSlug, opt.id)}
          onSelectProvider={(p) => setSelectedProvider(p)}
        />
      ) : (
        /* HOMEPAGE REFERENCE EXPERIENCE (Unified Storefront) */
        <>
          {/* 0. Prize-Winning Cinematic Hero Section */}
          <PrizeWinningHero
            selectedCampus={selectedCampus}
            onOpenQuickCategory={(cat) => {
              window.dispatchEvent(
                new CustomEvent('easehub:select-category', { detail: { category: cat } })
              );
              const el = document.getElementById('core-services');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onOpenCanteen={() => setIsCanteenOpen(true)}
            onOpenTracker={() => setIsOrderTrackerOpen(true)}
            onOpenSearch={() => setIsCommandPaletteOpen(true)}
          />

          {/* 0.5 Connected Campus Pipeline (How EaseHub Seamlessly Connects Stay, Mess, Laundry & Canteen) */}
          <ConnectedCampusPipeline
            onExploreBundles={() => {
              const el = document.getElementById('bundles');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenMessMenu={() => setIsMessMenuOpen(true)}
            onOpenTracker={() => setIsOrderTrackerOpen(true)}
          />

          {/* 1. Core Services & Card Catalog (Primary Focus: PG, Mess, Laundry, Extra Services, Contact) */}
          <CoreServicesSection
            selectedCampus={selectedCampus}
            onOpenBooking={(payload) => setActiveBookingPayload(payload)}
          />

          {/* 1.5 Live Daily Mess Menu Board (Breakfast, Lunch, Dinner) */}
          <DailyMessMenuSection onOpenFullMenu={() => setIsMessMenuOpen(true)} />

          {/* 2. Curated Campus Intelligence Bento Grid */}
          <CampusBentoSection
            selectedCampus={selectedCampus}
            onOpenTracker={() => setIsOrderTrackerOpen(true)}
            onOpenCanteen={() => setIsCanteenOpen(true)}
            onOpenBooking={(category) => {
              const s = ECOSYSTEM_SERVICES.find((srv) => srv.category === category || srv.slug === category);
              navigateTo('service-booking', s ? s.slug : category);
            }}
          />

          {/* 3. Simplification & Smart Living Bundles */}
          <BundlesSection
            onSelectBundle={setSelectedBundle}
          />
        </>
      )}
      </Suspense>

      {/* Global Interactive Modals & Drawers - Rendered only when active */}
      {selectedProvider && (
        <ProviderDetailModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onBookService={(category) => {
            setSelectedProvider(null);
            const s = ECOSYSTEM_SERVICES.find((srv) => srv.category === category || srv.slug === category);
            navigateTo('service-booking', s ? s.slug : 'mess');
          }}
        />
      )}

      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onExploreProviders={() => {
            setSelectedService(null);
            navigateTo('services');
          }}
          onBookService={(slug) => {
            setSelectedService(null);
            navigateTo('service-booking', slug);
          }}
        />
      )}

      {selectedBundle && (
        <BundleDetailModal
          bundle={selectedBundle}
          onClose={() => setSelectedBundle(null)}
          onViewPass={() => {
            setSelectedBundle(null);
            navigateTo('account');
          }}
        />
      )}

      {isRequestCampusOpen && (
        <RequestCampusDrawer
          isOpen={isRequestCampusOpen}
          onClose={() => setIsRequestCampusOpen(false)}
        />
      )}

      {/* Direct Interactive WhatsApp Booking Form Modal */}
      {activeBookingPayload && (
        <WhatsAppBookingModal
          payload={activeBookingPayload}
          selectedCampus={selectedCampus}
          onClose={() => setActiveBookingPayload(null)}
          onBookingSubmitted={(data) => {
            setActiveBookingPayload(null);
            setThankYouBookingData(data);
          }}
        />
      )}

      {/* Thank You for Your Trust! Confirmation Modal */}
      {thankYouBookingData && (
        <ThankYouTrustModal
          data={thankYouBookingData}
          onClose={() => setThankYouBookingData(null)}
          onOpenTracker={(tab, orderId) => {
            setThankYouBookingData(null);
            if (tab) setTrackerTab(tab);
            if (orderId) setTrackerOrderId(orderId);
            setIsOrderTrackerOpen(true);
          }}
        />
      )}

      {/* 24h Order and Laundry Status Tracker Modal */}
      {isOrderTrackerOpen && (
        <OrderTrackerModal
          isOpen={isOrderTrackerOpen}
          onClose={() => setIsOrderTrackerOpen(false)}
          defaultTab={trackerTab}
          orderId={trackerOrderId}
        />
      )}

      {/* 🔔 Campus Notifications Center Drawer */}
      {isNotificationCenterOpen && (
        <NotificationCenterDrawer
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          onOpenTracker={(orderId) => {
            if (orderId) setTrackerOrderId(orderId);
            setIsOrderTrackerOpen(true);
          }}
          onNavigateAccount={() => navigateTo('account')}
        />
      )}

      {/* 🌙 "Night Owl" Midnight Canteen & Exam Deliveries Modal */}
      {isCanteenOpen && (
        <MidnightCanteenModal
          isOpen={isCanteenOpen}
          onClose={() => setIsCanteenOpen(false)}
          selectedCampus={selectedCampus}
        />
      )}

      {/* 🍲 Live Campus Daily Mess Menu Board (Breakfast, Lunch, Dinner) */}
      {isMessMenuOpen && (
        <DailyMessMenuModal
          isOpen={isMessMenuOpen}
          onClose={() => setIsMessMenuOpen(false)}
        />
      )}

      {/* 1. Cinematic Brand Intro Splash Animation on Launch */}
      {showIntro && <BrandIntroSplash onComplete={handleIntroComplete} />}

      {/* 2. Above-Image Login Gate with Direct Google and Mobile/Mail OTP */}
      {isLoginGateOpen && (
        <LoginGateModal
          isOpen={isLoginGateOpen}
          onClose={() => setIsLoginGateOpen(false)}
          onSuccess={() => {
            setIsLoginGateOpen(false);
          }}
        />
      )}

      {/* 2.5 Multi-Role Campus Access Gate (Student, PG, Mess, Laundry, Admin) */}
      {isRoleGateOpen && (
        <RoleLoginGateModal
          isOpen={isRoleGateOpen}
          onClose={() => setIsRoleGateOpen(false)}
          onSelectRole={handleSelectPersona}
        />
      )}

      {/* ⌘K Global Spotlight Command Palette */}
      {isCommandPaletteOpen && (
        <CommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectAction={(actionId, payload) => {
            if (actionId === 'tracker') {
              setIsOrderTrackerOpen(true);
            } else if (actionId === 'canteen') {
              setIsCanteenOpen(true);
            } else if (actionId === 'mess-menu') {
              setIsMessMenuOpen(true);
            } else if (actionId === 'account') {
              navigateTo('account');
            } else if (actionId === 'service-booking' && payload) {
              navigateTo('service-booking', payload);
            }
          }}
        />
      )}
      {/* Floating 1-Tap Mobile View Trigger */}
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('easehub:toggle-mobile-view'));
        }}
        className="easehub-floating-mobile-trigger"
        style={{
          position: 'fixed',
          bottom: '22px',
          left: '22px',
          zIndex: 9940,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.55rem 1rem',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          border: '1.5px solid #334155',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          transition: 'transform 0.15s ease, background-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1E293B';
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0F172A';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <span style={{ fontSize: '1rem' }}>📱</span>
        <span>1-Tap Mobile View</span>
      </button>
    </AppShell>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MobilePreviewContainer>
        <MainApp />
      </MobilePreviewContainer>
    </AuthProvider>
  );
}

export default App;
