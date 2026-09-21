export interface Provider {
  id: string;
  name: string;
  serviceId: string;
  campusId: string;
  rating?: number;
  reviewsCount?: number;
  isVerified: boolean;
  verificationBadge: string;
  distanceFromCampus: string;
  priceHighlight: string;
  tags: string[];
  bio: string;
  responseTime: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: 'prov-rasoi-hub',
    name: 'Maa Ki Rasoi — Homely Student Kitchen',
    serviceId: 'food',
    campusId: 'campus-hub',
    isVerified: true,
    verificationBadge: 'EaseHub Gold Hygiene Audited',
    distanceFromCampus: '400m from Campus Gate 2',
    priceHighlight: '₹2,400 / month (2 meals/day)',
    tags: ['North Indian', 'Pure Veg', 'Fresh Roti', 'Tiffin Service'],
    bio: 'Serving nutritious, zero-soda home style meals to university students since 2018. Daily seasonal vegetable changes.',
    responseTime: '15 mins'
  },
  {
    id: 'prov-zenith-pg',
    name: 'Zenith Student Living — Block A',
    serviceId: 'stay',
    campusId: 'campus-hub',
    isVerified: true,
    verificationBadge: 'Legal Lease & Deposit Guarantee',
    distanceFromCampus: '650m from Main Academic Block',
    priceHighlight: '₹8,500 / month (Double Sharing + AC)',
    tags: ['Zero Brokerage', '300 Mbps Wi-Fi', '24/7 Power Backup', 'Biometric Entry'],
    bio: 'Premium student living with attached washrooms, ergonomic study desks, weekly housekeeping, and CCTV security.',
    responseTime: 'Instant booking'
  },
  {
    id: 'prov-press-express',
    name: 'SpinCraft Smart Wash Lab',
    serviceId: 'laundry',
    campusId: 'campus-hub',
    isVerified: true,
    verificationBadge: 'Antimicrobial Wash Certified',
    distanceFromCampus: 'Hostel Doorstep Pickup',
    priceHighlight: '₹39 / kg (Wash + Steam Press)',
    tags: ['Fabric Softener', 'Express 12h Option', 'Lost Item Insurance'],
    bio: 'Automated European washing machines with eco-friendly enzyme detergents and crisp steam ironing.',
    responseTime: 'Pickup in 30 mins'
  },
  {
    id: 'prov-iron-vault',
    name: 'Iron Vault Athletic Club',
    serviceId: 'fitness',
    campusId: 'campus-hub',
    isVerified: true,
    verificationBadge: 'EaseHub Campus Partner',
    distanceFromCampus: '300m from North Gate',
    priceHighlight: '₹899 / month (Unlimited Access)',
    tags: ['Olympic Barbells', 'AC Cardio Floor', 'Shower Facilities', 'Student Trainer Support'],
    bio: 'Dedicated student lifting facility open 5:30 AM to 11:30 PM with state-of-the-art strength equipment.',
    responseTime: 'Instant pass'
  },
  {
    id: 'prov-volt-shuttle',
    name: 'Volt Campus Shuttle Network',
    serviceId: 'transport',
    campusId: 'campus-hub',
    isVerified: true,
    verificationBadge: 'Campus Admin Recognized',
    distanceFromCampus: 'Station to Academic Block',
    priceHighlight: '₹499 / semester unlimited pass',
    tags: ['EV Fleet', 'Real-time GPS', 'Fixed Timetable', 'AC Coaches'],
    bio: 'Clean electric shuttles connecting transit stations directly to student residential gates.',
    responseTime: 'Runs every 5 mins'
  },
  {
    id: 'prov-fixit-pro',
    name: 'HostelFix Emergency Techs',
    serviceId: 'maintenance',
    campusId: 'campus-hub',
    isVerified: true,
    verificationBadge: 'Police & Skill Verified',
    distanceFromCampus: 'On-Call Campus Techs',
    priceHighlight: '₹149 visiting (waived if serviced)',
    tags: ['Electrician', 'Plumber', 'Laptop Charger Repair', 'Water Purifier'],
    bio: 'Emergency on-call technicians stationed at campus periphery. Fixed catalog rates with zero hidden charges.',
    responseTime: 'At door in 20 mins'
  }
];
