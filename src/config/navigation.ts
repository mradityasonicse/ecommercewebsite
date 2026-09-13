/**
 * EASEHUB GLOBAL NAVIGATION CONFIGURATION
 * Single source of truth for all navbar links, mega-menus, footer columns, and role-based actions.
 */

import { ECOSYSTEM_SERVICES } from '../data/services';

export type UserRole = 'guest' | 'student' | 'provider' | 'partner' | 'admin';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  badge?: string;
  isMegaMenu?: boolean;
  external?: boolean;
}

export interface ServiceNavItem {
  id: string;
  name: string;
  shortDesc: string;
  href: string;
  iconName: string;
  badgeText: string;
  startingPrice: string;
  pricingUnit: string;
  accentColor: 'blue' | 'red' | 'default';
}

export interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
    badge?: string;
    external?: boolean;
  }>;
}

export interface SocialLink {
  platform: 'instagram' | 'linkedin' | 'x' | 'youtube' | 'email';
  label: string;
  href: string;
}

// 1. Primary Desktop Navigation Links
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: 'pg',
    label: 'PG/Hostel',
    href: '#services/pg',
  },
  {
    id: 'meals',
    label: 'Meals',
    href: '#services/mess',
  },
  {
    id: 'laundry',
    label: 'Laundry',
    href: '#services/laundry',
  },
  {
    id: 'extra',
    label: 'Extra Services',
    href: '#services/room-cleaning',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#contact',
  },
];

// 2. Services Mega-Menu Items (Mapped directly from ECOSYSTEM_SERVICES with category deep links)
export const SERVICES_NAV_ITEMS: ServiceNavItem[] = ECOSYSTEM_SERVICES.map((s) => ({
  id: s.id,
  name: s.name,
  shortDesc: s.shortDesc,
  href: `#services?category=${s.category}`,
  iconName: s.iconName,
  badgeText: s.badgeText,
  startingPrice: s.startingPrice,
  pricingUnit: s.pricingUnit,
  accentColor: s.accentColor,
}));

// 3. Structured Multi-Column Footer Configuration
export const FOOTER_SECTIONS: FooterColumn[] = [
  {
    title: 'Services Ecosystem',
    links: [
      { label: 'Food & Daily Mess', href: '#services?category=food-mess' },
      { label: 'Student Housing & PGs', href: '#services?category=hostel-pg' },
      { label: 'Doorstep Laundry & Iron', href: '#services?category=laundry' },
      { label: 'Gym & Fitness Passes', href: '#services?category=gym-fitness' },
      { label: 'Campus Transit & Shuttles', href: '#services?category=transport' },
      { label: 'Dedicated Fiber Wi-Fi', href: '#services?category=wifi' },
      { label: 'Room Deep Cleaning', href: '#services?category=cleaning' },
      { label: 'Emergency Repairs', href: '#services?category=maintenance' },
    ],
  },
  {
    title: 'Student Life',
    links: [
      { label: 'Smart Living Bundles', href: '#bundles', badge: 'Popular' },
      { label: 'Student Living Discovery', href: '#core-services' },
      { label: 'Verified Trust Shield', href: '#trust' },
      { label: 'How EaseHub Works', href: '#how-it-works' },
      { label: 'Help & Contact Support', href: '#contact' },
    ],
  },
  {
    title: 'Partners & Universities',
    links: [
      { label: 'Become a Campus Provider', href: '#provider' },
      { label: 'Provider Audit Standards', href: '#trust' },
      { label: 'University Administration', href: '#provider' },
      { label: 'Partner Guidelines & SLA', href: '#trust' },
    ],
  },
  {
    title: 'Company & Security',
    links: [
      { label: 'About EaseHub', href: '#solution' },
      { label: 'Student Trust & Escrow', href: '#trust' },
      { label: 'Student Support Helpline', href: '#cta' },
      { label: 'Privacy & Student Data', href: '#trust' },
    ],
  },
];

// 4. Social Links
export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'instagram', label: 'Instagram', href: 'https://instagram.com/easehub' },
  { platform: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/easehub' },
  { platform: 'x', label: 'X (Twitter)', href: 'https://x.com/easehub_app' },
  { platform: 'youtube', label: 'YouTube', href: 'https://youtube.com/@easehub' },
  { platform: 'email', label: 'Contact Support', href: 'mailto:care@easehub.in' },
];
