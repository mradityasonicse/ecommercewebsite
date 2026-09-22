import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type DomainId,
  type DomainConfig,
  DOMAIN_CONFIGS,
  resolveDomain,
} from '../config/domainConfig';

interface DomainContextType {
  currentDomain: DomainId;
  domainConfig: DomainConfig;
  setDomain: (domainId: DomainId) => void;
  allDomains: DomainConfig[];
  isSpecificDomain: boolean;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domainConfig, setDomainConfig] = useState<DomainConfig>(() => resolveDomain());

  useEffect(() => {
    const handleUrlChange = () => {
      const resolved = resolveDomain();
      setDomainConfig(resolved);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Update document title and metadata whenever domain changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = domainConfig.title;
    }
  }, [domainConfig]);

  const setDomain = (domainId: DomainId) => {
    const config = DOMAIN_CONFIGS[domainId] || DOMAIN_CONFIGS.unified;
    setDomainConfig(config);

    try {
      localStorage.setItem('easehub_preferred_domain', domainId);
    } catch {}

    // Update URL parameter cleanly without reloading
    const url = new URL(window.location.href);
    if (domainId === 'unified') {
      url.searchParams.delete('domain');
    } else {
      url.searchParams.set('domain', domainId);
    }
    window.history.replaceState({}, '', url.toString());

    // Notify listeners
    window.dispatchEvent(new CustomEvent('easehub:domain-changed', { detail: { domainId } }));
  };

  const allDomains = Object.values(DOMAIN_CONFIGS);
  const isSpecificDomain = domainConfig.id !== 'unified';

  return (
    <DomainContext.Provider
      value={{
        currentDomain: domainConfig.id,
        domainConfig,
        setDomain,
        allDomains,
        isSpecificDomain,
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = (): DomainContextType => {
  const context = useContext(DomainContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      currentDomain: 'unified',
      domainConfig: DOMAIN_CONFIGS.unified,
      setDomain: () => {},
      allDomains: Object.values(DOMAIN_CONFIGS),
      isSpecificDomain: false,
    };
  }
  return context;
};
