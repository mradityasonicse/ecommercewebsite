/**
 * SITE SETTINGS SERVICE
 * Centralized configuration service that enables administrators to customize
 * all public website details (branding, hero headlines, campus details,
 * support contact, broadcast banners) with instant real-time UI updates.
 */

export interface SiteSettings {
  brandName: string;
  badgeText: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  heroDescription: string;
  campusName: string;
  campusCity: string;
  supportPhone: string;
  supportEmail: string;
  supportWhatsApp: string;
  broadcastText: string;
  isBroadcastActive: boolean;
  upiId: string;
  payeeName: string;
  qrImageUrl: string;
}

const STORAGE_KEY = 'easehub_site_settings_v1';

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'EaseHub',
  badgeText: 'Verified Campus Living Network',
  headlinePrefix: 'The Operating System for',
  headlineHighlight: 'Collegiate Living.',
  headlineSuffix: '',
  heroDescription:
    'Geofenced living ecosystem connecting university scholars with verified mess subscriptions, zero-brokerage student hostels, and express laundry.',
  campusName: 'Campus Living Hub',
  campusCity: 'Bhilai / Durg & University Campuses',
  supportPhone: '+91 62016 14778',
  supportEmail: 'support@easehub.in',
  supportWhatsApp: '916201614778',
  broadcastText:
    '🔥 Exam Alert: 30-min late night mess deliveries & printouts active till 2:00 AM across all hostel blocks!',
  isBroadcastActive: true,
  upiId: '6201614778@ibl',
  payeeName: 'anshu kumar kedia',
  qrImageUrl: '/payment-qr.jpg',
};

export class SiteSettingsService {
  /**
   * Retrieves current site settings with localStorage fallback to defaults.
   */
  public static getSettings(): SiteSettings {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Storage unavailable
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Updates site settings and broadcasts an event across all active tabs.
   */
  public static saveSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated: SiteSettings = { ...current, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Cross-component and cross-tab reactive updates
      window.dispatchEvent(new CustomEvent('easehub_site_settings_updated', { detail: updated }));
    } catch {
      // Storage unavailable
    }
    return updated;
  }

  /**
   * Resets all website settings to original platform defaults.
   */
  public static resetToDefaults(): SiteSettings {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('easehub_site_settings_updated', { detail: DEFAULT_SETTINGS }));
    } catch {
      // Storage unavailable
    }
    return { ...DEFAULT_SETTINGS };
  }
}
