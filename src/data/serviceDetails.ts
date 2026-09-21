/**
 * EASEHUB SERVICE DETAILS REPOSITORY
 * Rich, authentic student living details for all 8 core campus verticals.
 */

import { ECOSYSTEM_SERVICES } from './services';
import type { ServiceDetail } from '../types/serviceDetail';

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  // 1. Food & Mess
  mess: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'food')!,
    tagline: 'Homely, hygienic meals with exam-night flexibility.',
    heroVisualBadge: 'FSSAI License #10021011000342 Audited',
    keyHighlights: [
      {
        number: '01',
        title: 'Weekly Hygiene Inspections',
        description: 'Every kitchen undergoes unannounced microbial surface swabs and oil quality index tests.',
      },
      {
        number: '02',
        title: 'Zero Midterm Lock-in',
        description: 'Pause your meal subscription with 1-tap during semester breaks, internships, or exam holidays.',
      },
      {
        number: '03',
        title: 'Exam Midnight Delivery',
        description: 'Hot nutritious snack boxes delivered right to your hostel reception up to 2:30 AM.',
      },
      {
        number: '04',
        title: 'Dietary Flexibility',
        description: 'Dedicated pure veg, Jain, high-protein gym, and standard North/South Indian menu rotations.',
      },
    ],
    inclusions: [
      'Freshly cooked hot meals delivered in insulated stainless steel tiffins',
      'Seasonal green vegetables, dal, steamed rice, and whole wheat rotis',
      'Weekend special treats (paneer / sweets / regional specialties)',
      'Free meal replacement if delayed past 30 minutes',
    ],
    exclusions: [
      'Disposable plastic cutlery (eco-friendly wooden or bring-your-own)',
      'Custom off-menu gourmet orders',
    ],
    options: [
      {
        id: 'opt-mess-standard-2meal',
        name: 'Standard 2-Meal Subscription',
        tag: 'Most Popular',
        description: 'Lunch & dinner delivery 6 days/week with daily menu rotation and Sunday feast.',
        price: {
          type: 'fixed',
          amount: 2400,
          currency: '₹',
          period: 'per month',
          billingNote: 'Billed monthly • Pause anytime',
        },
        features: [
          '4 Rotis + Rice + Dal + 2 Sabzis + Salad',
          'Doorstep hostel delivery before 1:15 PM & 8:30 PM',
          'Up to 5 pause days allowed per billing cycle',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-mess-full-3meal',
        name: 'All-Day 3-Meal Complete Pass',
        tag: 'Full Living Coverage',
        description: 'Breakfast, lunch, and dinner coverage designed for heavy academic schedules.',
        price: {
          type: 'fixed',
          amount: 3200,
          currency: '₹',
          period: 'per month',
          billingNote: 'Save 15% vs individual daily meals',
        },
        features: [
          'Wholesome breakfast (Poha, Paratha, Idli) with tea/milk',
          'Lunch & dinner tiffins',
          'Exam season midnight snack box voucher included',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-mess-flexi-coupons',
        name: 'Flexi Meal Coupon Book',
        tag: 'No Fixed Commitment',
        description: 'Pack of 30 meal tokens valid for 90 days. Ideal for off-campus students with irregular schedules.',
        price: {
          type: 'fixed',
          amount: 2250,
          currency: '₹',
          period: 'per 30 meals',
          billingNote: '₹75 per meal • Zero expiration in semester',
        },
        features: [
          'Redeem for any lunch or dinner on 2-hour notice',
          'Shareable with batchmates & roommates',
          'Rollover unused coupons to next term',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-rasoi-hub'],
    faqs: [
      {
        question: 'What happens if I go home for a long weekend or holidays?',
        answer: 'You can pause your subscription directly through the EaseHub student portal. Tap "Pause Meals", select your return date, and your billing will automatically credit those unused days toward next month.',
      },
      {
        question: 'How do you verify kitchen hygiene and oil quality?',
        answer: 'Every partner mess kitchen must submit valid FSSAI registration and undergo bi-weekly in-person audits by EaseHub Student Council food inspectors. We test oil polar compounds and surface cleanliness.',
      },
      {
        question: 'What if a meal arrives late or spills in transit?',
        answer: 'If your delivery exceeds 30 minutes from the scheduled meal window or packaging is compromised, tap "Report Issue" to receive an immediate replacement plus a 100% meal credit.',
      },
      {
        question: 'Can I switch between pure veg and non-veg options?',
        answer: 'Yes, menu preferences can be updated with 12 hours advance notice before the morning prep cycle starts.',
      },
    ],
    relatedSlugs: ['laundry', 'hostel', 'wifi'],
  },

  // 2. Hostel & PG
  hostel: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'stay')!,
    tagline: 'Verified student residences with zero broker fees and deposit escrow.',
    heroVisualBadge: 'Digital Lease & Legal Escrow Shield',
    keyHighlights: [
      {
        number: '01',
        title: 'Zero Brokerage Commission',
        description: 'Deal directly with verified property owners. Save ₹15,000+ compared to local property brokers.',
      },
      {
        number: '02',
        title: 'Security Deposit Escrow',
        description: 'Your security deposit is legally locked in EaseHub Escrow and returned within 48 hours of checkout.',
      },
      {
        number: '03',
        title: '1.5km Campus Perimeter',
        description: 'Every verified building is strictly within walking distance or direct shuttle range of university gates.',
      },
      {
        number: '04',
        title: 'Biometric Access & Security',
        description: 'CCTV surveillance, biometric fingerprint locks, warden support, and 24/7 power backup.',
      },
    ],
    inclusions: [
      'Standardized EaseHub digital lease agreement',
      'Fully furnished room (bed, ergonomic study desk, wardrobe)',
      'High-speed optical fiber Wi-Fi included',
      'Weekly room housekeeping and common area sanitization',
    ],
    exclusions: [
      'Personal electricity consumption (sub-metered at state domestic tariff)',
      'Private vehicle parking slots (nominal add-on where available)',
    ],
    options: [
      {
        id: 'opt-pg-double-ac',
        name: 'Premium Double Sharing (AC)',
        tag: 'Most Popular',
        description: 'Spacious shared room with roommate matching, split AC, study desks, and attached washroom.',
        price: {
          type: 'fixed',
          amount: 8500,
          currency: '₹',
          period: 'per month',
          billingNote: 'Zero brokerage • 1-month deposit',
        },
        features: [
          'Attached modern western washroom with geyser',
          'Individual study tables and book racks',
          'Weekly deep cleaning included',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-pg-single-private',
        name: 'Private Studio / Single Occupancy',
        tag: 'Maximum Focus',
        description: 'Private single room with balcony for students who require dedicated focus for competitive exams.',
        price: {
          type: 'fixed',
          amount: 14000,
          currency: '₹',
          period: 'per month',
          billingNote: 'Limited availability • Reserve early',
        },
        features: [
          '100% private living space and washroom',
          'High-speed dedicated router in-room',
          'Mini-refrigerator and microwave access',
        ],
        isPopular: false,
        availabilityStatus: 'limited',
      },
      {
        id: 'opt-pg-triple-budget',
        name: 'Budget Triple Sharing',
        tag: 'Student Value Choice',
        description: 'Economical, clean accommodations with power backup and communal lounge.',
        price: {
          type: 'fixed',
          amount: 6500,
          currency: '₹',
          period: 'per month',
          billingNote: 'All utilities included except AC',
        },
        features: [
          'Spacious ventilated room with lockers',
          '24/7 RO drinking water and solar hot water',
          'Common recreation lounge and TT table',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-mourya-pg', 'prov-saffron-pg', 'prov-zenith-pg'],
    faqs: [
      {
        question: 'How is my security deposit protected?',
        answer: 'Under EaseHub Escrow, landlords cannot arbitrarily deduct money for normal wear and tear. At move-out, a video condition report is verified and your deposit is refunded directly to your bank within 48 hours.',
      },
      {
        question: 'Can I visit the property before paying?',
        answer: 'Absolutely. You can schedule a physical visit or take an interactive 360° verified video tour guided by an on-campus EaseHub representative.',
      },
      {
        question: 'What are the curfew or gate timings?',
        answer: 'Curfew rules depend on individual campus hostels vs private PGs. All timings and guest policies are clearly stated upfront on the property profile before you sign.',
      },
    ],
    relatedSlugs: ['wifi', 'cleaning', 'laundry'],
  },

  // 3. Laundry
  laundry: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'laundry')!,
    tagline: 'Fresh clothes. Zero hostel scrubbing. Doorstep pickup.',
    heroVisualBadge: 'Antimicrobial Wash & Steam Press Certified',
    keyHighlights: [
      {
        number: '01',
        title: 'Hostel Doorstep Pickup & Drop',
        description: 'Riders collect your laundry bag directly from your hostel block entrance twice a week.',
      },
      {
        number: '02',
        title: '24-Hour Return Guarantee',
        description: 'Washed, dried, and crisply steam-ironed clothes returned to your room in 24 hours.',
      },
      {
        number: '03',
        title: 'Zero Color Bleed Technology',
        description: 'White garments and delicates are strictly separated and washed in temperature-controlled cycles.',
      },
      {
        number: '04',
        title: 'Lost Item Insurance Protection',
        description: 'Digital barcoding tracks every item from weigh-in to folding with up to ₹2,000 garment protection.',
      },
    ],
    inclusions: [
      'Eco-friendly enzyme wash and fabric conditioner',
      'Industrial steam ironing with wrinkle-free folding',
      'Reusable breathable EaseHub laundry carry bag',
      'Doorstep pickup and return tracking via SMS/App',
    ],
    exclusions: [
      'Heavy leather jackets and delicate silk dry clean (available as specialty add-on)',
      'Shoe restoration and deep canvas cleaning (separate tier)',
    ],
    options: [
      {
        id: 'opt-laundry-standard-perkg',
        name: 'Standard Wash & Steam Press',
        tag: 'Everyday Pay-As-You-Go',
        description: 'Hostel doorstep pickup with 24-hour delivery. Perfect for regular everyday wear.',
        price: {
          type: 'fixed',
          amount: 39,
          currency: '₹',
          period: 'per kg',
          billingNote: 'Minimum order 4 kg • Free pickup',
        },
        features: [
          'Wash, tumble dry, and steam press',
          'Separation of whites and colored clothes',
          'Barcoded garment tracking',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-laundry-monthly-pass',
        name: 'Semester Living Laundry Pass',
        tag: 'Best Student Value',
        description: '35 kg monthly laundry quota with 2 pickups weekly. Never worry about dirty clothes during midterms.',
        price: {
          type: 'fixed',
          amount: 1199,
          currency: '₹',
          period: 'per month',
          billingNote: 'Save 22% • Quota rolls over',
        },
        features: [
          'Up to 35 kg per month (approx. 70 garments)',
          'Priority 18-hour turnaround during exams',
          '2 free bedsheet and curtain washes included',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-laundry-express-12h',
        name: '12-Hour Express Rush',
        tag: 'Interview & Emergency',
        description: 'Need formal attire pressed for campus placements or presentations tomorrow morning?',
        price: {
          type: 'fixed',
          amount: 69,
          currency: '₹',
          period: 'per kg',
          billingNote: 'Guaranteed 12-hour return',
        },
        features: [
          'Immediate pickup slot allocation',
          'Delicate fabric handling & hanger delivery',
          'Formal suit and blazer pressing',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-press-express'],
    faqs: [
      {
        question: 'How do you prevent clothes from getting mixed up with other students?',
        answer: 'Each student receives a personalized barcoded EaseHub laundry bag. At the wash facility, individual loads are processed separately in dedicated European wash drums.',
      },
      {
        question: 'What if a garment gets damaged or lost?',
        answer: 'We carry full digital item check-in. In the rare event of damage or loss, EaseHub pays direct compensation up to ₹2,000 per garment within 7 business days.',
      },
      {
        question: 'When are the hostel pickup times?',
        answer: 'Standard morning pickup runs from 7:30 AM to 9:30 AM, and evening drop-off runs from 6:00 PM to 8:30 PM outside your hostel block reception.',
      },
    ],
    relatedSlugs: ['mess', 'cleaning', 'hostel'],
  },

  // 4. Fitness
  fitness: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'fitness')!,
    tagline: 'Flexible student gym passes without locked annual contracts.',
    heroVisualBadge: 'Certified Trainers & Sanitized Equipment',
    keyHighlights: [
      {
        number: '01',
        title: 'Multi-Gym Campus Pass',
        description: 'One single pass gives you access to 4 premium partner gyms surrounding campus gates.',
      },
      {
        number: '02',
        title: 'Zero Lock-in Commitment',
        description: 'Pay semester-by-semester or month-by-month. No automatic recurring credit card deductions.',
      },
      {
        number: '03',
        title: 'Extended Student Hours',
        description: 'Open from 5:30 AM to 11:00 PM to fit before morning lectures or after late lab sessions.',
      },
      {
        number: '04',
        title: 'Free Trainer Induction',
        description: 'Every student gets a complimentary body composition analysis and beginner workout regimen.',
      },
    ],
    inclusions: [
      'Unrestricted cardio and Olympic free-weight zones',
      'Locker rooms, showers, and filtered drinking water',
      'Weekly cross-training and yoga group classes',
      'Discounts on certified nutrition and whey protein',
    ],
    exclusions: [
      'Personal 1-on-1 dedicated training sessions (nominal add-on)',
      'Steam sauna / spa services',
    ],
    options: [
      {
        id: 'opt-fit-monthly-pass',
        name: 'Standard Monthly Pass',
        tag: 'Flexible',
        description: 'Full access to weights, machines, and cardio zones with zero annual lock-in.',
        price: {
          type: 'fixed',
          amount: 799,
          currency: '₹',
          period: 'per month',
          billingNote: 'No registration fees for students',
        },
        features: [
          'Full gym floor access',
          'Free trainer induction and form check',
          'Locker & shower facilities',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-fit-semester-allaccess',
        name: 'Semester 4-Month Power Pass',
        tag: 'Most Popular Value',
        description: 'Covers your entire semester with multi-gym access and group fitness classes.',
        price: {
          type: 'fixed',
          amount: 2499,
          currency: '₹',
          period: 'per semester (4 mo)',
          billingNote: 'Save 25% vs monthly billing',
        },
        features: [
          'Multi-gym pass (access 4 partner facilities)',
          'Weekly HIIT, Yoga, and Strength group classes',
          'Free gym shaker and student workout guide',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-iron-fitness'],
    faqs: [
      {
        question: 'Do I need to carry my university ID card?',
        answer: 'Yes, your university ID card or digital EaseHub student badge is required for biometric check-in at all partner gym gates.',
      },
      {
        question: 'Can I freeze my membership during midterms or vacations?',
        answer: 'Semester passes can be paused for up to 21 days during mid-semester breaks and university exams.',
      },
    ],
    relatedSlugs: ['mess', 'transport', 'cleaning'],
  },

  // 5. Transport
  transport: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'transport')!,
    tagline: 'Reliable campus shuttles and shared electric micro-mobility.',
    heroVisualBadge: 'Live GPS Fleet & Zero Surge Pricing',
    keyHighlights: [
      {
        number: '01',
        title: 'Scheduled Campus Shuttles',
        description: 'Air-conditioned minibuses running every 10 minutes between hostels, metro stations, and lecture halls.',
      },
      {
        number: '02',
        title: 'Zero Surge Pricing Guaranteed',
        description: 'Fixed student fares even during heavy monsoon downpours or morning rush hours.',
      },
      {
        number: '03',
        title: 'Electric E-Scooter Rental Docks',
        description: 'Unlock smart micro-mobility scooters positioned at major campus gates with your phone.',
      },
      {
        number: '04',
        title: 'Night Escort Route Safety',
        description: 'Dedicated evening shuttle loops operating until 1:00 AM with GPS safety monitoring.',
      },
    ],
    inclusions: [
      'Guaranteed seat reservations on morning exam shuttles',
      'Live GPS shuttle arrival countdown',
      'Direct UPI or semester transit pass tap-and-go',
    ],
    exclusions: [
      'Private outstation inter-city cab hire',
      'Personal helmet rental (bring your own or purchase at hub)',
    ],
    options: [
      {
        id: 'opt-trans-per-ride',
        name: 'Single Ride Micro-Mobility',
        tag: 'Pay As You Go',
        description: 'E-scooter unlock or single campus shuttle hop across campus gates.',
        price: {
          type: 'fixed',
          amount: 12,
          currency: '₹',
          period: 'per ride',
          billingNote: 'Fixed fare • Zero surge',
        },
        features: [
          'Instant QR unlock at dock stations',
          'Covers up to 3.5 km intra-campus distance',
          'Digital receipt for hostel gate permission',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-trans-semester-pass',
        name: 'Semester Transit Unlimited Pass',
        tag: 'Save 40%',
        description: 'Unlimited rides on campus shuttles and 60 complimentary e-scooter rides per term.',
        price: {
          type: 'fixed',
          amount: 999,
          currency: '₹',
          period: 'per semester',
          billingNote: 'Unlimited shuttle access',
        },
        features: [
          'Unlimited shuttle trips between metro and campus',
          '60 e-mobility unlocks included',
          'Priority morning exam shuttle boarding',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-campus-hop'],
    faqs: [
      {
        question: 'Where are the shuttle stops located?',
        answer: 'Designated stops are located at Main Campus Gate, East Academic Block, Boys Hostel 4, Girls Hostel 2, and the nearest Metro Station.',
      },
      {
        question: 'What if a shuttle is full during peak hours?',
        answer: 'During peak 8:00 AM–9:30 AM hours, shuttle frequency automatically doubles to 5-minute intervals.',
      },
    ],
    relatedSlugs: ['hostel', 'mess', 'fitness'],
  },

  // 6. Wi-Fi
  wifi: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'wifi')!,
    tagline: 'Gigabit fiber connections built for coding, gaming, and remote classes.',
    heroVisualBadge: 'Sub-15ms Latency • 99.9% Uptime SLA',
    keyHighlights: [
      {
        number: '01',
        title: 'Dedicated Optical Fiber Line',
        description: 'Direct fiber link to your room without shared hostel bandwidth throttling.',
      },
      {
        number: '02',
        title: 'Sub-15ms Gaming Latency',
        description: 'Optimized routing for gaming servers, video conferencing, and low-latency cloud development.',
      },
      {
        number: '03',
        title: 'Same-Day 4-Hour Installation',
        description: 'Local optical technician arrives at your PG or private hostel with router hardware within 4 hours.',
      },
      {
        number: '04',
        title: 'Zero Hardware Deposit',
        description: 'Dual-band Wi-Fi 6 router provided at ₹0 security deposit with any semester subscription.',
      },
    ],
    inclusions: [
      'Unlimited high-speed symmetric data without FUP caps',
      'Dual-band 2.4 GHz + 5 GHz Wi-Fi 6 router included',
      'Dedicated local campus line technician on call',
      'Instant billing pause during summer holidays',
    ],
    exclusions: [
      'Static IP address allocation (available upon academic request)',
    ],
    options: [
      {
        id: 'opt-wifi-100mbps',
        name: 'Student Fiber Starter (100 Mbps)',
        tag: 'Academic Focus',
        description: 'Perfect for Zoom classes, YouTube lectures, and software development.',
        price: {
          type: 'fixed',
          amount: 449,
          currency: '₹',
          period: 'per month',
          billingNote: 'Unlimited data • No speed drops',
        },
        features: [
          'Up to 100 Mbps upload & download',
          'Supports up to 4 simultaneous devices',
          'Dual-band router included at ₹0 deposit',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-wifi-300mbps',
        name: 'Pro Gaming & Coding Line (300 Mbps)',
        tag: 'Ultra Low Latency',
        description: 'Sub-12ms ping for competitive gaming, large dataset downloads, and 4K streaming.',
        price: {
          type: 'fixed',
          amount: 699,
          currency: '₹',
          period: 'per month',
          billingNote: 'Free installation with semester plan',
        },
        features: [
          'Up to 300 Mbps symmetric fiber line',
          'Sub-12ms ping routing to major cloud clusters',
          'Priority 1-hour hardware replacement SLA',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-campus-broadband'],
    faqs: [
      {
        question: 'Can I install this in my private PG or rented flat?',
        answer: 'Yes! We have pre-approved fiber routing permissions with all verified landlords and PGs listed on EaseHub.',
      },
      {
        question: 'What happens if the fiber line gets cut?',
        answer: 'Our dedicated campus line technicians are stationed within 1.5 km and resolve 94% of cable faults in under 45 minutes.',
      },
    ],
    relatedSlugs: ['hostel', 'maintenance', 'cleaning'],
  },

  // 7. Cleaning
  cleaning: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'cleaning')!,
    tagline: 'Deep sanitization and scrub for messy hostel rooms and student flats.',
    heroVisualBadge: 'Background Verified Crews & Eco Disinfectants',
    keyHighlights: [
      {
        number: '01',
        title: '45-Minute Deep Scrub Cycle',
        description: 'Industrial vacuuming, floor scrubbing, desk sanitization, and washroom descaling.',
      },
      {
        number: '02',
        title: 'Police Verified Crews',
        description: '100% background-checked and uniformed housekeeping professionals trained for student environments.',
      },
      {
        number: '03',
        title: 'Eco-Safe Non-Toxic Cleaners',
        description: 'Hospital-grade biodegradable disinfectants that leave rooms fresh without harsh chemical fumes.',
      },
      {
        number: '04',
        title: 'Sunday Morning Slots',
        description: 'Flexible scheduling available on weekends, exam breaks, or move-out inspection days.',
      },
    ],
    inclusions: [
      'Complete floor sweeping, mopping, and vacuuming',
      'Washroom tile descaling, toilet scrubbing, and mirror polish',
      'Balcony washing and dust cobweb removal',
      'Dusting of ceiling fans, AC filters, and window sills',
    ],
    exclusions: [
      'Washing personal dirty utensils/dishes left in sink',
      'Folding personal private clothing',
    ],
    options: [
      {
        id: 'opt-clean-room-scrub',
        name: 'Single Room Deep Scrub',
        tag: 'Quick Refresh',
        description: '45-minute complete room dusting, vacuuming, and floor mopping.',
        price: {
          type: 'fixed',
          amount: 199,
          currency: '₹',
          period: 'per session',
          billingNote: 'Eco disinfectants included',
        },
        features: [
          'Full room vacuuming & fan dusting',
          'Desk sanitization & floor scrubbing',
          'Instant re-clean guarantee if dissatisfied',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-clean-washroom-deep',
        name: 'Room + Attached Washroom Deep Clean',
        tag: 'Most Popular',
        description: 'Full sanitization including tile limescale removal, commode descaling, and geyser dusting.',
        price: {
          type: 'fixed',
          amount: 349,
          currency: '₹',
          period: 'per session',
          billingNote: 'Takes approx. 65 minutes',
        },
        features: [
          'Room deep scrub + washroom descaling',
          'Mirror polish and drain deodorization',
          'Hospital-grade antibacterial spray',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-sparkle-crew'],
    faqs: [
      {
        question: 'Do I need to be in the room during the cleaning session?',
        answer: 'Yes, we recommend being present or having your roommate present to inspect the room upon completion.',
      },
      {
        question: 'What if I am not satisfied with the cleaning quality?',
        answer: 'EaseHub offers a 100% Instant Re-Clean Guarantee. If any spot is missed, the team re-scrubs it immediately at no extra charge.',
      },
    ],
    relatedSlugs: ['hostel', 'maintenance', 'laundry'],
  },

  // 8. Maintenance
  maintenance: {
    ...ECOSYSTEM_SERVICES.find(s => s.id === 'maintenance')!,
    tagline: '30-minute rapid response electricians, plumbers, and hardware repairs.',
    heroVisualBadge: '30-Min Campus Rapid Response & 30-Day Work Warranty',
    keyHighlights: [
      {
        number: '01',
        title: '30-Minute Gate Arrival',
        description: 'Stationed electricians and plumbers reach your hostel gate or PG room within half an hour.',
      },
      {
        number: '02',
        title: 'Transparent Rate Card',
        description: 'Fixed visiting and labor charges. Zero student gouging when late-night midterms are interrupted.',
      },
      {
        number: '03',
        title: '30-Day Repair Warranty',
        description: 'If the repaired switch, tap, or circuit breaker trips again within 30 days, we fix it free.',
      },
      {
        number: '04',
        title: 'Genuine Replacement Spares',
        description: 'Technicians carry standardized ISI-marked electrical and plumbing hardware spares at MRP.',
      },
    ],
    inclusions: [
      'Comprehensive fault diagnosis and minor repair labor',
      'Testing of electrical sockets, geysers, and switches',
      'Plumbing leak arrest and tap washer replacement',
      'Digital payment invoice for landlord reimbursement',
    ],
    exclusions: [
      'Cost of physical spare parts (billed at exact transparent retail MRP)',
      'Major structural civil construction',
    ],
    options: [
      {
        id: 'opt-maint-visiting',
        name: 'Standard Rapid Visit & Fix',
        tag: 'Fastest Response',
        description: 'Electrician or plumber arrives in 30 minutes to diagnose and resolve single repairs.',
        price: {
          type: 'fixed',
          amount: 149,
          currency: '₹',
          period: 'visiting charge',
          billingNote: 'Includes first 30 mins labor',
        },
        features: [
          'Arrival under 30 minutes guaranteed',
          'Covers switch, socket, or tap leak fix',
          '30-day warranty on completed job',
        ],
        isPopular: true,
        availabilityStatus: 'available',
      },
      {
        id: 'opt-maint-geyser-ac',
        name: 'Appliance Diagnosis (Geyser / AC / Cooler)',
        tag: 'Specialized Tech',
        description: 'Certified HVAC & heating technician for winter geyser failures or summer cooler/AC repairs.',
        price: {
          type: 'fixed',
          amount: 299,
          currency: '₹',
          period: 'per appliance',
          billingNote: 'Comprehensive electrical safety check',
        },
        features: [
          'Thermostat and heating coil diagnostics',
          'Gas leak check and capacitor replacement',
          'Digital diagnostic receipt',
        ],
        isPopular: false,
        availabilityStatus: 'available',
      },
    ],
    providerIds: ['prov-campus-repairs'],
    faqs: [
      {
        question: 'Will my landlord reimburse this repair cost?',
        answer: 'Yes. EaseHub generates a standardized digital GST invoice with technician notes that can be submitted to your landlord or hostel warden for reimbursement.',
      },
      {
        question: 'What if the technician cannot fix the problem today?',
        answer: 'If parts need to be sourced from the market, we provide a temporary safety bypass and return the next morning at ₹0 additional visiting fee.',
      },
    ],
    relatedSlugs: ['hostel', 'wifi', 'cleaning'],
  },
};
