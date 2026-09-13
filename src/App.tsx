import { useState, useEffect } from 'react';
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
  isProviderRoute,
  getBookingHref,
  getServiceHref,
  getAuthHref,
  getAccountHref,
  getProviderHref,
} from './utils/routes';

// Auth Context Provider
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrandIntroSplash } from './components/intro/BrandIntroSplash';
import { LoginGateModal } from './components/modals/LoginGateModal';

// Global Layout Shell
import { AppShell } from './components/layout/AppShell';

// Storytelling Experience (Phase 4)
import {
  BundlesSection,
} from './components/sections/story';
import { CoreServicesSection, type BookingTargetPayload } from './components/sections/story/CoreServicesSection';
import { WhatsAppBookingModal } from './components/modals/WhatsAppBookingModal';
import { ThankYouTrustModal } from './components/modals/ThankYouTrustModal';
import type { BookingSubmissionData } from './utils/whatsapp';

// Dedicated Service Discovery Marketplace Page (Phase 5)
import { ServicesDiscoveryPage } from './pages/ServicesDiscoveryPage';

// Dedicated Service Detail Page (Phase 6)
import { ServiceDetailPage } from './pages/ServiceDetailPage';

// Service Booking & Request Page (Phase 7)
import { BookingPage } from './pages/BookingPage';

// Authentication Pages (Phase 8)
import { AuthPage } from './pages/AuthPage';

// Student Account Dashboard (Phase 8)
import { AccountPage } from './pages/AccountPage';

// Provider Ecosystem (Phase 11)
import { ProviderPage } from './pages/ProviderPage';

// Modals & Drawers
import { ProviderDetailModal } from './components/modals/ProviderDetailModal';
import { ServiceDetailModal } from './components/modals/ServiceDetailModal';
import { BundleDetailModal } from './components/modals/BundleDetailModal';
import { RequestCampusDrawer } from './components/drawers/RequestCampusDrawer';
import { PartnerOnboardingDrawer } from './components/drawers/PartnerOnboardingDrawer';

// Design System Showcase
import { DesignSystemPage } from './pages/DesignSystemPage';

export type AppViewMode =
  | 'app'
  | 'services'
  | 'service-detail'
  | 'service-booking'
  | 'auth'
  | 'account'
  | 'provider'
  | 'design-system';

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
  const { user } = useAuth();
  const [selectedCampus, setSelectedCampus] = useState<Campus>(CAMPUSES[0]);

  // Brand Intro & First-Visit Login Gate State
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('easehub_intro_seen');
  });
  const [isLoginGateOpen, setIsLoginGateOpen] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('easehub_intro_seen', 'true');
    } catch {
      // Storage unavailable
    }
    // Automatically display the login gate after the intro if not authenticated
    if (!user) {
      setIsLoginGateOpen(true);
    }
  };

  // Modals & Drawers state
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedService, setSelectedService] = useState<EcosystemService | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [isRequestCampusOpen, setIsRequestCampusOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [activeBookingPayload, setActiveBookingPayload] = useState<BookingTargetPayload | null>(null);
  const [thankYouBookingData, setThankYouBookingData] = useState<BookingSubmissionData | null>(null);

  // Parse route state from current browser URL
  const getRouteStateFromUrl = (): RouteState => {
    if (typeof window === 'undefined') return { view: 'app', serviceSlug: '' };
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    // 1. Design System Showcase
    if (hash === '#design-system' || path === '/design-system') {
      return { view: 'design-system', serviceSlug: '' };
    }

    // 2. Booking / Service Request Flow (/services/[slug]/book)
    const bookingMatch = parseBookingSlugFromUrl(window.location.pathname, window.location.hash);
    if (bookingMatch) {
      return {
        view: 'service-booking',
        serviceSlug: bookingMatch.slug,
        optionId: bookingMatch.optionId,
      };
    }

    // 3. Auth Views (#auth/sign-in, #auth/sign-up, #auth/forgot-password, #auth/reset-password, #auth/verify-email, #auth/error)
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

    // 4. Provider Ecosystem (#provider)
    if (isProviderRoute(window.location.pathname, window.location.hash)) {
      return { view: 'provider', serviceSlug: '' };
    }

    // 5. Student Account Dashboard (#account)
    if (isAccountRoute(window.location.pathname, window.location.hash)) {
      return { view: 'account', serviceSlug: '' };
    }

    // 6. Individual Service Detail (#services/[slug])
    const serviceSlug = parseServiceSlugFromUrl(window.location.pathname, window.location.hash);
    if (serviceSlug) {
      return { view: 'service-detail', serviceSlug };
    }

    // 7. Services Standalone Marketplace/Catalog (#catalog, #services-catalog, #marketplace, /catalog)
    if (
      hash === '#catalog' ||
      hash.startsWith('#catalog?') ||
      hash === '#services-catalog' ||
      hash === '#marketplace' ||
      path.startsWith('/catalog')
    ) {
      return { view: 'services', serviceSlug: '' };
    }

    // 8. Default Unified Storytelling Homepage
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
        'provider',
        'account',
        'auth',
        'design-system',
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

  const navigateTo = (
    mode: AppViewMode,
    slug?: string,
    optionId?: string,
    authMode?: AuthViewMode,
    returnTo?: string
  ) => {
    if (mode === 'design-system') {
      window.location.hash = 'design-system';
    } else if (mode === 'service-booking' && slug) {
      window.location.hash = getBookingHref(slug, optionId);
    } else if (mode === 'service-detail' && slug) {
      window.location.hash = getServiceHref(slug);
    } else if (mode === 'auth') {
      window.location.hash = getAuthHref(authMode || 'sign-in', returnTo);
    } else if (mode === 'account') {
      window.location.hash = getAccountHref();
    } else if (mode === 'provider') {
      window.location.hash = getProviderHref();
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
    );
  }

  // Standalone Auth Layout View
  if (routeState.view === 'auth') {
    return (
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
    );
  }

  return (
    <AppShell
      selectedCampus={selectedCampus}
      onCampusChange={setSelectedCampus}
      onRequestCampusOpen={() => setIsRequestCampusOpen(true)}
      onPartnerOpen={() => navigateTo('provider')}
    >
      {routeState.view === 'service-booking' ? (
        /* PHASE 7: BOOKING & SERVICE REQUEST FLOW */
        <BookingPage
          slug={routeState.serviceSlug}
          selectedCampus={selectedCampus}
          preselectedOptionId={routeState.optionId}
          onBackToService={() => navigateTo('service-detail', routeState.serviceSlug)}
          onNavigateToAccount={() => navigateTo('account')}
          onNavigateToServices={() => navigateTo('services')}
        />
      ) : routeState.view === 'provider' ? (
        /* PHASE 11: PROVIDER / VENDOR ECOSYSTEM */
        <ProviderPage
          onNavigateHome={() => navigateTo('app')}
          onNavigateToAuth={(returnTo) => navigateTo('auth', undefined, undefined, 'sign-in', returnTo || '#provider')}
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
      ) : routeState.view === 'services' ? (
        /* DEDICATED SERVICE DISCOVERY EXPERIENCE (Phase 5) */
        <ServicesDiscoveryPage
          selectedCampus={selectedCampus}
          onCampusChange={setSelectedCampus}
          onRequestCampusOpen={() => setIsRequestCampusOpen(true)}
          onSelectService={(service) => navigateTo('service-detail', service.slug)}
          onNavigateHome={() => navigateTo('app')}
        />
      ) : (
        /* HOMEPAGE REFERENCE EXPERIENCE (Matching https://luminous-baklava-6113b3.netlify.app/) */
        <>
          {/* 1. Core Services & Card Catalog (Primary Focus: PG, Mess, Laundry, Extra Services, Contact) */}
          <CoreServicesSection
            selectedCampus={selectedCampus}
            onOpenBooking={(payload) => setActiveBookingPayload(payload)}
          />

          {/* 2. Simplification & Smart Living Bundles */}
          <BundlesSection
            onSelectBundle={setSelectedBundle}
          />
        </>
      )}

      {/* Global Interactive Modals & Drawers */}
      <ProviderDetailModal
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onBookService={(category) => {
          setSelectedProvider(null);
          const s = ECOSYSTEM_SERVICES.find((srv) => srv.category === category || srv.slug === category);
          navigateTo('service-booking', s ? s.slug : 'mess');
        }}
      />

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

      <BundleDetailModal
        bundle={selectedBundle}
        onClose={() => setSelectedBundle(null)}
        onViewPass={() => {
          setSelectedBundle(null);
          navigateTo('account');
        }}
      />

      <RequestCampusDrawer
        isOpen={isRequestCampusOpen}
        onClose={() => setIsRequestCampusOpen(false)}
      />

      <PartnerOnboardingDrawer
        isOpen={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
      />

      {/* Direct Interactive WhatsApp Booking Form Modal */}
      <WhatsAppBookingModal
        payload={activeBookingPayload}
        selectedCampus={selectedCampus}
        onClose={() => setActiveBookingPayload(null)}
        onBookingSubmitted={(data) => {
          setActiveBookingPayload(null);
          setThankYouBookingData(data);
        }}
      />

      {/* Thank You for Your Trust! Confirmation Modal */}
      <ThankYouTrustModal
        data={thankYouBookingData}
        onClose={() => setThankYouBookingData(null)}
      />

      {/* 1. Cinematic Brand Intro Splash Animation on Launch */}
      {showIntro && <BrandIntroSplash onComplete={handleIntroComplete} />}

      {/* 2. Above-Image Login Gate with Direct Google and Mobile/Mail OTP */}
      <LoginGateModal
        isOpen={isLoginGateOpen}
        onClose={() => setIsLoginGateOpen(false)}
        onSuccess={() => {
          setIsLoginGateOpen(false);
        }}
      />
    </AppShell>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
