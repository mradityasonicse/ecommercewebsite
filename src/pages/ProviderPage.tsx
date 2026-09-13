import React, { useState, useEffect } from 'react';
import { ProviderLandingPage } from './provider/ProviderLandingPage';
import { ProviderOnboardingPage } from './provider/ProviderOnboardingPage';
import { ProviderProfilePage } from './provider/ProviderProfilePage';
import { ProviderSettingsPage } from './provider/ProviderSettingsPage';
import { ProviderStatusView } from '../components/provider/ProviderStatusView';
import type { ProviderSubpage } from '../utils/routes';
import { parseProviderRouteFromUrl, getProviderHref } from '../utils/routes';
import type { ProviderCategory, ProviderApplication } from '../types/provider';
import { ProviderService } from '../services/providerService';
import { useAuth } from '../context/AuthContext';

interface ProviderPageProps {
  onNavigateHome: () => void;
  onNavigateToAuth: (returnTo?: string) => void;
}

export const ProviderPage: React.FC<ProviderPageProps> = ({
  onNavigateHome,
  onNavigateToAuth,
}) => {
  const { user } = useAuth();

  const getSubpageFromUrl = (): ProviderSubpage => {
    if (typeof window === 'undefined') return 'landing';
    const parsed = parseProviderRouteFromUrl(window.location.pathname, window.location.hash);
    return parsed?.subpage || 'landing';
  };

  const [subpage, setSubpage] = useState<ProviderSubpage>(getSubpageFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory>('food');
  const [userApplication, setUserApplication] = useState<ProviderApplication | null>(null);

  // Sync with browser URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      setSubpage(getSubpageFromUrl());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Fetch application if user is authenticated
  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      ProviderService.getApplication(user.id).then((app) => {
        if (!isMounted) return;
        setUserApplication(app);
      });
    } else {
      setUserApplication(null);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const navigateTo = (newSubpage: ProviderSubpage) => {
    window.location.hash = getProviderHref(newSubpage);
    setSubpage(newSubpage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Landing page
  if (subpage === 'landing') {
    return (
      <ProviderLandingPage
        onStartOnboarding={() => navigateTo('onboarding')}
        onCheckStatus={() => navigateTo('status')}
        onNavigateHome={onNavigateHome}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />
    );
  }

  // 2. Multi-step onboarding
  if (subpage === 'onboarding') {
    return (
      <ProviderOnboardingPage
        initialCategory={selectedCategory}
        onNavigateToStatus={() => navigateTo('status')}
        onNavigateToLanding={() => navigateTo('landing')}
        onNavigateToAuth={() => onNavigateToAuth('#provider/onboarding')}
      />
    );
  }

  // 3. Application status
  if (subpage === 'status') {
    return (
      <div style={{ minHeight: '80vh', padding: 'calc(var(--navbar-height, 76px) + 2.5rem) 0 5rem' }}>
        <div className="container">
          <ProviderStatusView
            application={userApplication}
            onResumeDraft={() => navigateTo('onboarding')}
            onRefresh={() => {
              if (user?.id) {
                ProviderService.getApplication(user.id).then(setUserApplication);
              }
            }}
            onNavigateToProfile={() => navigateTo('profile')}
            onNavigateToSettings={() => navigateTo('settings')}
          />
        </div>
      </div>
    );
  }

  // 4. Provider profile
  if (subpage === 'profile') {
    return (
      <ProviderProfilePage
        onNavigateToSettings={() => navigateTo('settings')}
        onNavigateToOnboarding={() => navigateTo('onboarding')}
        onNavigateToAuth={() => onNavigateToAuth('#provider/profile')}
      />
    );
  }

  // 5. Provider settings
  if (subpage === 'settings') {
    return (
      <ProviderSettingsPage
        onNavigateToProfile={() => navigateTo('profile')}
        onNavigateToAuth={() => onNavigateToAuth('#provider/settings')}
      />
    );
  }

  return null;
};
