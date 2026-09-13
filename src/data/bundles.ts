export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  isPopular: boolean;
  servicesIncluded: string[]; // service names or IDs
  originalPrice: number;
  bundlePrice: number;
  billingPeriod: string;
  savingsPercentage: number;
  perks: string[];
}

export const BUNDLES: Bundle[] = [
  {
    id: 'freshman-starter',
    name: 'Freshman Essentials Pass',
    tagline: 'The friction-free start for new university entrants.',
    badge: 'Most Popular for 1st Years',
    isPopular: true,
    servicesIncluded: ['Stay Assistance & Lease Shield', 'Weekly Doorstep Laundry (40kg/mo)', '300 Mbps Dedicated Room Wi-Fi', 'Free Emergency Maintenance Visits'],
    originalPrice: 3499,
    bundlePrice: 2299,
    billingPeriod: 'per month',
    savingsPercentage: 34,
    perks: [
      'Priority room move-in concierge',
      'Doorstep dirty laundry pickup 2x/week',
      'Router hardware included at ₹0 deposit',
      'Campus buddy guide booklet'
    ]
  },
  {
    id: 'semester-all-in',
    name: 'The 360° Campus Living Suite',
    tagline: 'Complete student lifestyle coverage from breakfast to midnight bedtime.',
    badge: 'Ultimate Value',
    isPopular: false,
    servicesIncluded: [
      'Nutritious 2-Meal Tiffin Plan',
      'Doorstep Laundry & Steam Ironing',
      'Campus Gym All-Access Pass',
      'Daily Shuttle Pass',
      'Bi-Weekly Room Deep Cleaning'
    ],
    originalPrice: 6800,
    bundlePrice: 4499,
    billingPeriod: 'per month',
    savingsPercentage: 33,
    perks: [
      'Single consolidated monthly invoice',
      'Pause anytime during holiday vacations',
      'Dedicated EaseHub Student Care Concierge',
      'Zero cancellation penalties'
    ]
  },
  {
    id: 'exam-crunch-pack',
    name: 'Exam Crunch Sprint Pack',
    tagline: '30-day intensive focus mode so you study without household distractions.',
    badge: 'Exam Season Favorite',
    isPopular: false,
    servicesIncluded: [
      'Midnight Exam Meal Box Delivery',
      'Express 12-Hour Laundry Wash & Press',
      'Room Deep Clean 2x This Month',
      'Priority Wi-Fi Bandwidth Boost'
    ],
    originalPrice: 2900,
    bundlePrice: 1899,
    billingPeriod: 'one-time (30 days)',
    savingsPercentage: 35,
    perks: [
      'Midnight food delivery up to 3:00 AM',
      'Same-day laundry return during exam week',
      '1 Gbps burst line for lecture video downloads',
      'Emergency room repair within 20 mins'
    ]
  }
];
