/**
 * EASEHUB ROUTE & NAVIGATION UTILITIES
 * Centralized helpers for generating canonical URLs, deep-links, and query strings.
 */

import type { ServiceFilterParams } from '../types/service';
import type { AuthViewMode } from '../types/auth';

/**
 * Returns canonical href for an individual service detail page.
 * Uses hash routing by default for flawless static/SPA hosting compatibility,
 * while supporting path-based routing seamlessly.
 */
export function getServiceHref(service: { slug: string } | string, useHash = true): string {
  const slug = typeof service === 'string' ? service : service.slug;
  return useHash ? `#services/${slug}` : `/services/${slug}`;
}

/**
 * Returns canonical href for service booking/request flow.
 */
export function getBookingHref(slug: string, optionId?: string, useHash = true): string {
  const base = useHash ? `#services/${slug}/book` : `/services/${slug}/book`;
  return optionId ? `${base}?option=${encodeURIComponent(optionId)}` : base;
}

/**
 * Extracts the booking route information from the current browser URL.
 * e.g. /services/laundry/book -> { slug: 'laundry' }, #services/mess/book?option=opt-1 -> { slug: 'mess', optionId: 'opt-1' }
 */
export function parseBookingSlugFromUrl(pathname: string, hash: string): { slug: string; optionId?: string } | null {
  const checkUrl = (url: string) => {
    const [pathPart, queryPart] = url.split('?');
    const parts = pathPart.split('/');
    if (parts[0] === 'services' && parts[1] && parts[2] === 'book') {
      const searchParams = new URLSearchParams(queryPart || '');
      const optionId = searchParams.get('option') || undefined;
      return { slug: parts[1], optionId };
    }
    return null;
  };

  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    const result = checkUrl(cleanHash);
    if (result) return result;
  }

  if (pathname) {
    const cleanPath = pathname.replace(/^\//, '');
    const result = checkUrl(cleanPath);
    if (result) return result;
  }

  return null;
}

/**
 * Extracts the service slug from the current browser URL (path or hash).
 * e.g. /services/laundry -> "laundry", #services/mess -> "mess"
 * (Ignores /book subpaths)
 */
export function parseServiceSlugFromUrl(pathname: string, hash: string): string | null {
  // If it's a booking subroute, don't return as detail slug
  if (parseBookingSlugFromUrl(pathname, hash)) {
    return null;
  }

  // 1. Check hash route: e.g. #services/laundry or #/services/laundry
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    const parts = cleanHash.split('?')[0].split('/');
    if (parts[0] === 'services' && parts[1] && parts[1] !== 'book') {
      return parts[1];
    }
  }

  // 2. Check path route: e.g. /services/laundry
  if (pathname) {
    const cleanPath = pathname.replace(/^\//, '');
    const parts = cleanPath.split('?')[0].split('/');
    if (parts[0] === 'services' && parts[1] && parts[1] !== 'book') {
      return parts[1];
    }
  }

  return null;
}

/**
 * Validates and sanitizes a return URL to prevent open redirect vulnerabilities.
 * Rejects external protocol schemes (http:, https:, javascript:, data:) and protocol-relative URLs (//).
 * Only internal relative paths (/... or #...) are accepted. Defaults to '#account'.
 */
export function validateSafeReturnUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '#account';
  }

  const trimmed = url.trim();

  // Reject empty or purely whitespace
  if (!trimmed) {
    return '#account';
  }

  // Reject protocol-relative URLs: //evil.com
  if (trimmed.startsWith('//')) {
    return '#account';
  }

  // Reject external schemes: http:, https:, javascript:, data:, vbscript:
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return '#account';
  }

  // Reject carriage returns / line feeds / null bytes (header injection prevention)
  if (/[\r\n\0]/.test(trimmed)) {
    return '#account';
  }

  // Only permit paths starting with / or #
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }

  return '#account';
}

/**
 * Returns canonical href for authentication pages.
 */
export function getAuthHref(
  mode: AuthViewMode = 'sign-in',
  returnTo?: string,
  extraParams?: Record<string, string>,
  useHash = true
): string {
  const base = useHash ? `#auth/${mode}` : `/auth/${mode}`;
  const params = new URLSearchParams();
  if (returnTo) {
    params.set('returnTo', validateSafeReturnUrl(returnTo));
  }
  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export interface ParsedAuthRoute {
  mode: AuthViewMode;
  returnTo?: string;
  token?: string;
  error?: string;
}

/**
 * Extracts authentication view details from URL (hash or pathname).
 * Supports sign-in, sign-up, forgot-password, reset-password, verify-email, error.
 */
export function parseAuthRouteFromUrl(pathname: string, hash: string): ParsedAuthRoute | null {
  const checkUrl = (url: string): ParsedAuthRoute | null => {
    const [pathPart, queryPart] = url.split('?');
    const parts = pathPart.split('/');
    if (parts[0] === 'auth') {
      const rawMode = parts[1] || 'sign-in';
      const validModes: AuthViewMode[] = [
        'sign-in',
        'sign-up',
        'forgot-password',
        'reset-password',
        'verify-email',
        'error',
      ];
      const mode: AuthViewMode = validModes.includes(rawMode as AuthViewMode)
        ? (rawMode as AuthViewMode)
        : 'sign-in';

      const searchParams = new URLSearchParams(queryPart || '');
      const rawReturnTo = searchParams.get('returnTo');
      const returnTo = rawReturnTo ? validateSafeReturnUrl(rawReturnTo) : undefined;
      const token = searchParams.get('token') || undefined;
      const error = searchParams.get('error') || undefined;

      return { mode, returnTo, token, error };
    }
    return null;
  };

  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    const res = checkUrl(cleanHash);
    if (res) return res;
  }

  if (pathname) {
    const cleanPath = pathname.replace(/^\//, '');
    const res = checkUrl(cleanPath);
    if (res) return res;
  }

  return null;
}

export type AccountSubpage =
  | 'overview'
  | 'requests'
  | 'request-detail'
  | 'profile'
  | 'notifications'
  | 'settings';

export interface ParsedAccountRoute {
  subpage: AccountSubpage;
  requestId?: string;
}

/**
 * Returns canonical href for student account portal.
 */
export function getAccountHref(subtab?: string, useHash = true): string {
  const base = useHash ? '#account' : '/account';
  return subtab ? `${base}/${subtab}` : base;
}

/**
 * Returns canonical href for individual request detail.
 */
export function getRequestDetailHref(requestId: string, useHash = true): string {
  return useHash ? `#account/requests/${encodeURIComponent(requestId)}` : `/account/requests/${encodeURIComponent(requestId)}`;
}

/**
 * Parses detailed account subroute from URL (hash or pathname).
 */
export function parseAccountRouteFromUrl(pathname: string, hash: string): ParsedAccountRoute | null {
  const checkUrl = (url: string): ParsedAccountRoute | null => {
    const [pathPart] = url.split('?');
    const parts = pathPart.split('/');
    if (parts[0] === 'account') {
      const seg1 = parts[1];
      const seg2 = parts[2];

      if (!seg1 || seg1 === 'dashboard' || seg1 === 'overview') {
        return { subpage: 'overview' };
      }
      if (seg1 === 'requests') {
        if (seg2) {
          return { subpage: 'request-detail', requestId: seg2 };
        }
        return { subpage: 'requests' };
      }
      if (seg1 === 'profile') {
        return { subpage: 'profile' };
      }
      if (seg1 === 'notifications') {
        return { subpage: 'notifications' };
      }
      if (seg1 === 'settings' || seg1 === 'security') {
        return { subpage: 'settings' };
      }
      return { subpage: 'overview' };
    }
    return null;
  };

  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    const res = checkUrl(cleanHash);
    if (res) return res;
  }
  if (pathname) {
    const cleanPath = pathname.replace(/^\//, '');
    const res = checkUrl(cleanPath);
    if (res) return res;
  }
  return null;
}

/**
 * Checks if the current URL points to the student account dashboard.
 */
export function isAccountRoute(pathname: string, hash: string): boolean {
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '').split('?')[0];
    if (cleanHash === 'account' || cleanHash.startsWith('account/')) return true;
  }
  if (pathname) {
    const cleanPath = pathname.replace(/^\//, '').split('?')[0];
    if (cleanPath === 'account' || cleanPath.startsWith('account/')) return true;
  }
  return false;
}

/**
 * Returns canonical href for the services discovery marketplace.
 * Supports deep linking with filter parameters.
 */
export function getServicesDiscoveryHref(params?: Partial<ServiceFilterParams>, useHash = true): string {
  const base = useHash ? '#services' : '/services';
  if (!params) return base;

  const query = serializeFilterParamsToUrl(params);
  return query ? `${base}?${query}` : base;
}

/**
 * Serializes filter state into a clean, human-readable URL query string.
 */
export function serializeFilterParamsToUrl(params: ServiceFilterParams): string {
  const searchParams = new URLSearchParams();

  if (params.category && params.category !== 'all') {
    searchParams.set('category', params.category);
  }
  if (params.campusId && params.campusId !== 'all') {
    searchParams.set('campus', params.campusId);
  }
  if (params.search && params.search.trim()) {
    searchParams.set('search', params.search.trim());
  }
  if (params.sort && params.sort !== 'recommended') {
    searchParams.set('sort', params.sort);
  }
  if (params.availability && params.availability !== 'all') {
    searchParams.set('availability', params.availability);
  }
  if (params.maxPrice !== undefined && params.maxPrice > 0) {
    searchParams.set('maxPrice', params.maxPrice.toString());
  }

  return searchParams.toString();
}

/**
 * Parses URL query parameters into strongly-typed filter arguments.
 */
export function parseFilterParamsFromUrl(searchString: string): ServiceFilterParams {
  const searchParams = new URLSearchParams(searchString.startsWith('?') ? searchString : `?${searchString}`);
  const params: ServiceFilterParams = {};

  const category = searchParams.get('category');
  if (category) params.category = category;

  const campus = searchParams.get('campus');
  if (campus) params.campusId = campus;

  const search = searchParams.get('search');
  if (search) params.search = search;

  const sort = searchParams.get('sort');
  if (sort && ['recommended', 'popular', 'rating', 'price-asc', 'price-desc'].includes(sort)) {
    params.sort = sort as ServiceFilterParams['sort'];
  }

  const availability = searchParams.get('availability');
  if (availability && ['available', 'limited', 'unavailable', 'coming_soon'].includes(availability)) {
    params.availability = availability as ServiceFilterParams['availability'];
  }

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) {
    const parsed = parseInt(maxPrice, 10);
    if (!isNaN(parsed) && parsed > 0) {
      params.maxPrice = parsed;
    }
  }

  return params;
}

export type ProviderSubpage = 'landing' | 'onboarding' | 'status' | 'profile' | 'settings';

export interface ParsedProviderRoute {
  subpage: ProviderSubpage;
  step?: number;
}

/**
 * Returns canonical href for provider ecosystem pages.
 */
export function getProviderHref(subpage: ProviderSubpage = 'landing', useHash = true): string {
  const base = useHash ? '#provider' : '/provider';
  if (subpage === 'landing') return base;
  return `${base}/${subpage}`;
}

/**
 * Parses provider routes from current browser URL.
 * e.g. #provider -> 'landing'
 *      #provider/onboarding -> 'onboarding'
 *      #provider/status -> 'status'
 *      #provider/profile -> 'profile'
 *      #provider/settings -> 'settings'
 */
export function parseProviderRouteFromUrl(pathname: string, hash: string): ParsedProviderRoute | null {
  const checkUrl = (url: string): ParsedProviderRoute | null => {
    const [pathPart, queryPart] = url.split('?');
    const parts = pathPart.split('/');
    if (parts[0] === 'provider') {
      const seg1 = parts[1];
      const validSubpages: ProviderSubpage[] = ['landing', 'onboarding', 'status', 'profile', 'settings'];

      if (!seg1) {
        return { subpage: 'landing' };
      }

      if (validSubpages.includes(seg1 as ProviderSubpage)) {
        const searchParams = new URLSearchParams(queryPart || '');
        const step = searchParams.get('step') ? parseInt(searchParams.get('step')!, 10) : undefined;
        return { subpage: seg1 as ProviderSubpage, step: step && !isNaN(step) ? step : undefined };
      }

      return { subpage: 'landing' };
    }
    return null;
  };

  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    const res = checkUrl(cleanHash);
    if (res) return res;
  }
  if (pathname) {
    const cleanPath = pathname.replace(/^\//, '');
    const res = checkUrl(cleanPath);
    if (res) return res;
  }
  return null;
}

/**
 * Checks if current URL is any provider route.
 */
export function isProviderRoute(pathname: string, hash: string): boolean {
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '').split('?')[0];
    if (cleanHash === 'provider' || cleanHash.startsWith('provider/')) return true;
  }
  if (pathname) {
    const cleanPath = pathname.replace(/^\//, '').split('?')[0];
    if (cleanPath === 'provider' || cleanPath.startsWith('provider/')) return true;
  }
  return false;
}
