export type DomainId = 'unified' | 'dining' | 'housing' | 'laundry' | 'campus';

export interface DomainCategoryShortcut {
  name: string;
  category: string;
  iconName: 'home' | 'utensils' | 'shirt' | 'zap' | 'wifi' | 'bus';
}

export interface DomainConfig {
  id: DomainId;
  label: string;
  brandName: string;
  subdomains: string[];
  title: string;
  badge: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  description: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  primaryCategory: 'all' | 'pg' | 'meals' | 'laundry' | 'extra';
  heroHighlights: string[];
  quickActions: Array<{
    id: string;
    label: string;
    category?: 'all' | 'pg' | 'meals' | 'laundry' | 'extra';
    action?: 'category' | 'mess-menu' | 'canteen' | 'booking';
  }>;
  seoDescription: string;
}

export const DOMAIN_CONFIGS: Record<DomainId, DomainConfig> = {
  unified: {
    id: 'unified',
    label: 'Unified Living OS',
    brandName: 'EaseHub',
    subdomains: ['app', 'www', 'hub'],
    title: 'EaseHub — The Operating System for Collegiate Living',
    badge: 'Verified Campus Living Network',
    headlinePrefix: 'The Operating System for',
    headlineHighlight: 'Collegiate Living.',
    headlineSuffix: '',
    description:
      'Curated student hostels, fresh mess subscriptions, same-day laundry, and midnight exam canteen deliveries — coordinated with zero brokerage in one unified interface.',
    accentColor: '#16A34A',
    accentBg: '#EFF5EC',
    accentBorder: 'rgba(22, 163, 74, 0.28)',
    primaryCategory: 'all',
    heroHighlights: [
      'Zero-brokerage verified hostel rooms',
      'Daily live mess menu & gate arrival alerts',
      'Doorstep laundry pickup & wash progress',
      'Night owl exam deliveries to campus gate',
    ],
    quickActions: [
      { id: 'pg', label: 'Verified PGs & Hostels', category: 'pg', action: 'category' },
      { id: 'mess', label: 'Daily Mess Subscriptions', action: 'mess-menu' },
      { id: 'laundry', label: 'Doorstep Laundry Care', category: 'laundry', action: 'category' },
      { id: 'canteen', label: '2 AM Midnight Canteen', action: 'canteen' },
    ],
    seoDescription:
      'Zero-brokerage campus housing, daily university dining, doorstep laundry care, and student delivery network.',
  },

  dining: {
    id: 'dining',
    label: 'Dining & Mess Hub',
    brandName: 'EaseHub Dining',
    subdomains: ['mess', 'food', 'dining', 'canteen'],
    title: 'EaseHub Dining — University Mess Subscriptions & Midnight Canteen',
    badge: 'FSSAI Certified Student Kitchens',
    headlinePrefix: 'Fresh Campus Meals &',
    headlineHighlight: 'Daily Mess Subscriptions.',
    headlineSuffix: '',
    description:
      'Transparent daily Breakfast, Lunch, and Dinner menus, flexible student meal passes, hygienic FSSAI kitchens, and hot midnight snack drops straight to your hostel gate.',
    accentColor: '#D97706',
    accentBg: '#FFFBEB',
    accentBorder: 'rgba(217, 119, 6, 0.32)',
    primaryCategory: 'meals',
    heroHighlights: [
      'Daily 4-slot rotating meal menu (Breakfast, Lunch, Snacks, Dinner)',
      '1-Tap meal pause & refund rollover for weekend visits',
      'Hot hostel gate arrival notifications via WhatsApp',
      'Midnight Canteen active until 3:30 AM every night',
    ],
    quickActions: [
      { id: 'mess-menu', label: "Today's Live Mess Board", action: 'mess-menu' },
      { id: 'canteen', label: 'Order Midnight Snacks', action: 'canteen' },
      { id: 'meals', label: 'Monthly Meal Subscriptions', category: 'meals', action: 'category' },
      { id: 'tracking', label: 'Live Meal Arrival', category: 'meals', action: 'category' },
    ],
    seoDescription:
      'Daily university mess subscriptions, hot breakfast and dinner delivery, and midnight canteen for college students.',
  },

  housing: {
    id: 'housing',
    label: 'Hostels & PGs',
    brandName: 'EaseHub Stays',
    subdomains: ['pg', 'stay', 'housing', 'hostel', 'rooms'],
    title: 'EaseHub Stays — 100% Verified Student PGs & Zero Brokerage Hostels',
    badge: 'Zero-Brokerage Verified Living',
    headlinePrefix: 'Curated Student PGs &',
    headlineHighlight: 'Zero-Brokerage Hostels.',
    headlineSuffix: '',
    description:
      'Verified student rooms within 1.5 km of campus gates. High-speed Wi-Fi, power backup, study desks, zero deposit scams, and warden-verified safety protocols.',
    accentColor: '#1D4ED8',
    accentBg: '#EFF6FF',
    accentBorder: 'rgba(29, 78, 216, 0.32)',
    primaryCategory: 'pg',
    heroHighlights: [
      'Strictly zero brokerage & direct owner agreements',
      'Guaranteed 100 Mbps Wi-Fi & 24/7 power backup',
      'In-person room inspections & 360° video verification',
      'Biometric entry, CCTV & institutional warden accreditation',
    ],
    quickActions: [
      { id: 'pg', label: 'Explore Verified Rooms', category: 'pg', action: 'category' },
      { id: 'visit', label: 'Schedule Physical Visit', category: 'pg', action: 'category' },
      { id: 'girls-pg', label: 'Women-Only Verified PGs', category: 'pg', action: 'category' },
      { id: 'single-room', label: 'Single Occupancy Stays', category: 'pg', action: 'category' },
    ],
    seoDescription:
      'Find verified student PGs and hostels near university with zero brokerage, high-speed Wi-Fi, and warden verification.',
  },

  laundry: {
    id: 'laundry',
    label: 'Laundry Care Hub',
    brandName: 'EaseHub Laundry',
    subdomains: ['laundry', 'wash', 'clean', 'dryclean'],
    title: 'EaseHub Laundry — Doorstep Hostel Wash, Steam Press & Bag Tracking',
    badge: 'Same-Day Hostel Fabric Care',
    headlinePrefix: 'Hostel Doorstep Wash &',
    headlineHighlight: 'Precision Fabric Care.',
    headlineSuffix: '',
    description:
      'Scheduled room pickups, per-kg student pricing, antimicrobial wash cycles, crisp steam press, and direct hostel gate delivery within 24–48 hours.',
    accentColor: '#7C3AED',
    accentBg: '#F5F3FF',
    accentBorder: 'rgba(124, 58, 237, 0.32)',
    primaryCategory: 'laundry',
    heroHighlights: [
      'Doorstep hostel pickup from your room door',
      'Weight-verified bag logging with student secure PIN',
      '5-stage wash pipeline (Wash, Rinse, Spin, Steam, Fold)',
      'Subsidized student semester laundry passes from ₹39',
    ],
    quickActions: [
      { id: 'laundry', label: 'Book Pickup Today', category: 'laundry', action: 'category' },
      { id: 'steam-press', label: 'Steam Press & Formals', category: 'laundry', action: 'category' },
      { id: 'wash-fold', label: 'Weight-Based Wash & Fold', category: 'laundry', action: 'category' },
      { id: 'tracker', label: 'Track Wash Status', category: 'laundry', action: 'category' },
    ],
    seoDescription:
      'Fast doorstep college laundry, steam pressing, and antimicrobial wash care with transparent bag weight tracking.',
  },

  campus: {
    id: 'campus',
    label: 'Campus Geofence Hub',
    brandName: 'EaseHub Campus',
    subdomains: ['campus', 'uni', 'college', 'bits', 'vit', 'srm'],
    title: 'EaseHub Campus — Geofenced University Living Network',
    badge: 'Accredited Campus Living Hub',
    headlinePrefix: 'Geofenced Living Network for',
    headlineHighlight: 'Campus Scholars.',
    headlineSuffix: '',
    description:
      'All campus-approved mess partners, hostel wardens, laundry kiosks, and transit shuttles operating within your university zone.',
    accentColor: '#0F766E',
    accentBg: '#F0FDFA',
    accentBorder: 'rgba(15, 118, 110, 0.32)',
    primaryCategory: 'all',
    heroHighlights: [
      'Official campus living accreditation & student ID sync',
      'Campus gate delivery checkpoints & authorized courier access',
      'Subsidized institutional living passes',
      'Direct contact with university campus operations desk',
    ],
    quickActions: [
      { id: 'all-services', label: 'Explore Campus Desk', category: 'all', action: 'category' },
      { id: 'mess-menu', label: 'Hostel Mess Schedule', action: 'mess-menu' },
      { id: 'pg', label: 'Walk-to-Gate Hostels', category: 'pg', action: 'category' },
      { id: 'canteen', label: 'Exam Night Food Desk', action: 'canteen' },
    ],
    seoDescription:
      'Unified campus living ecosystem for university students with verified local operators and institutional support.',
  },
};

/**
 * Resolves active domain based on hostname, query params (?domain=...), hash, or storage.
 * Gracefully defaults to 'unified' without redirect loops or errors.
 */
export function resolveDomain(): DomainConfig {
  if (typeof window === 'undefined') {
    return DOMAIN_CONFIGS.unified;
  }

  // 1. Explicit query parameter override (e.g. ?domain=dining or ?domain=mess)
  const urlParams = new URLSearchParams(window.location.search);
  const paramDomain = urlParams.get('domain')?.toLowerCase();
  if (paramDomain) {
    const matched = findDomainByKeyword(paramDomain);
    if (matched) return matched;
  }

  // 2. Hash parameter override (e.g. #domain=housing)
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('domain=')) {
    const hashDomain = hash.split('domain=')[1]?.split('&')[0]?.split('?')[0];
    if (hashDomain) {
      const matched = findDomainByKeyword(hashDomain);
      if (matched) return matched;
    }
  }

  // 3. Subdomain / Hostname detection (e.g. mess.easehub.in, pg.easehub.in)
  const hostname = window.location.hostname.toLowerCase();
  const subparts = hostname.split('.');
  if (subparts.length > 2) {
    const firstSub = subparts[0];
    const matched = findDomainByKeyword(firstSub);
    if (matched) return matched;
  }

  // 4. LocalStorage preference
  try {
    const stored = localStorage.getItem('easehub_preferred_domain')?.toLowerCase();
    if (stored) {
      const matched = findDomainByKeyword(stored);
      if (matched) return matched;
    }
  } catch {}

  // 5. Safe Default
  return DOMAIN_CONFIGS.unified;
}

function findDomainByKeyword(keyword: string): DomainConfig | null {
  const normalized = keyword.trim().toLowerCase();

  // Exact ID match
  if (DOMAIN_CONFIGS[normalized as DomainId]) {
    return DOMAIN_CONFIGS[normalized as DomainId];
  }

  // Subdomain alias match
  for (const config of Object.values(DOMAIN_CONFIGS)) {
    if (config.subdomains.includes(normalized)) {
      return config;
    }
  }

  // Keyword fuzzy mapping
  if (normalized.includes('mess') || normalized.includes('food') || normalized.includes('meal') || normalized.includes('canteen')) {
    return DOMAIN_CONFIGS.dining;
  }
  if (normalized.includes('pg') || normalized.includes('hostel') || normalized.includes('stay') || normalized.includes('room')) {
    return DOMAIN_CONFIGS.housing;
  }
  if (normalized.includes('laundry') || normalized.includes('wash') || normalized.includes('cloth')) {
    return DOMAIN_CONFIGS.laundry;
  }
  if (normalized.includes('campus') || normalized.includes('uni')) {
    return DOMAIN_CONFIGS.campus;
  }

  return null;
}
