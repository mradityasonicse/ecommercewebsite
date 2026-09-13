/**
 * EASEHUB PROVIDER SERVICE & REPOSITORY LAYER
 * Phase 11: Provider / Vendor Foundation
 *
 * Implements strict tenant isolation, role verification,
 * draft persistence, application lifecycle transitions,
 * and integration with the EaseHub notification engine.
 */

import type {
  ProviderApplication,
  ProviderProfile,
  ProviderSettings,
  ProviderCategory,
  DayAvailability,
} from '../types/provider';
import { NotificationService } from './notificationService';

const PROVIDER_APPLICATIONS_KEY = 'easehub_provider_applications_v1';
const PROVIDER_PROFILES_KEY = 'easehub_provider_profiles_v1';
const PROVIDER_SETTINGS_KEY = 'easehub_provider_settings_v1';

export const DEFAULT_WEEKLY_SCHEDULE: DayAvailability[] = [
  { day: 'monday', label: 'Monday', isOpen: true, openTime: '08:00', closeTime: '21:00' },
  { day: 'tuesday', label: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '21:00' },
  { day: 'wednesday', label: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '21:00' },
  { day: 'thursday', label: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '21:00' },
  { day: 'friday', label: 'Friday', isOpen: true, openTime: '08:00', closeTime: '21:00' },
  { day: 'saturday', label: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { day: 'sunday', label: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '18:00' },
];

export const CATEGORY_METADATA: Record<
  ProviderCategory,
  { label: string; icon: string; description: string; sampleService: string; sampleUnit: string; samplePrice: number }
> = {
  food: {
    label: 'Mess & Food Subscriptions',
    icon: 'Utensils',
    description: 'Hygienic tiffins, hostel meal subscriptions & student cafeterias.',
    sampleService: 'Monthly 2-Meal Plan (Lunch & Dinner)',
    sampleUnit: 'per month',
    samplePrice: 2800,
  },
  stay: {
    label: 'Hostel & PG Accommodations',
    icon: 'Home',
    description: 'Verified student hostels, PGs, flatshares & single studio rooms.',
    sampleService: 'Double Sharing AC Room with Attached Washroom',
    sampleUnit: 'per month',
    samplePrice: 8500,
  },
  laundry: {
    label: 'Doorstep Laundry & Dry Cleaning',
    icon: 'Shirt',
    description: 'Hostel pickup, wash & fold, steam pressing & shoe dry-cleaning.',
    sampleService: 'Wash + Steam Press Regular Bundle (Up to 6kg)',
    sampleUnit: 'per bag',
    samplePrice: 249,
  },
  fitness: {
    label: 'Gym & Fitness Centers',
    icon: 'Dumbbell',
    description: 'Campus-perimeter weight rooms, cardio zones & personal training.',
    sampleService: 'Unlimited Student Semester Pass',
    sampleUnit: 'per semester',
    samplePrice: 2499,
  },
  transport: {
    label: 'Campus Shuttles & Transport',
    icon: 'Bike',
    description: 'Metro-to-gate electric shuttles, bicycle rentals & cabs.',
    sampleService: 'Monthly Unlimited Metro Shuttles Pass',
    sampleUnit: 'per month',
    samplePrice: 499,
  },
  wifi: {
    label: 'Wi-Fi & High-Speed Internet',
    icon: 'Wifi',
    description: 'Dedicated student fiber broadband with low-ping hostel connections.',
    sampleService: '200 Mbps Dedicated Hostel Bandwidth',
    sampleUnit: 'per month',
    samplePrice: 599,
  },
  cleaning: {
    label: 'Room Cleaning & Housekeeping',
    icon: 'SprayCan',
    description: 'Hostel room deep-cleaning, bathroom sanitation & dust removal.',
    sampleService: 'Hostel Room Deep Cleaning & Disinfection',
    sampleUnit: 'per session',
    samplePrice: 349,
  },
  maintenance: {
    label: 'Repairs & Electrician/Plumbing',
    icon: 'Wrench',
    description: 'Emergency switchboard repair, geyser fixes, cooler servicing & plumbing.',
    sampleService: 'Emergency Electrical / Switchboard Repair',
    sampleUnit: 'per visit',
    samplePrice: 199,
  },
  other: {
    label: 'Other Campus Services',
    icon: 'Briefcase',
    description: 'Printing, book binding, stationary delivery & bicycle servicing.',
    sampleService: 'Custom Campus Service Offering',
    sampleUnit: 'per service',
    samplePrice: 150,
  },
};

// Seed demo provider profile (approved vendor for testing)
const SEED_APPROVED_PROVIDER: ProviderProfile = {
  id: 'prov-rasoi-hub',
  userId: 'usr-demo-provider-1',
  businessName: 'Maa Ki Rasoi — Homely Student Kitchen',
  legalEntityName: 'Maa Ki Rasoi Foodworks LLP',
  description: 'Serving nutritious, zero-soda home style meals to university students since 2018. Daily seasonal vegetable rotation.',
  primaryCategory: 'food',
  status: 'approved',
  verificationBadge: 'EaseHub Gold Hygiene Audited',
  rating: 4.9,
  reviewsCount: 420,
  applicationId: 'EH-APP-10023',
  contact: {
    contactPerson: 'Smt. Sarita Devi',
    designation: 'Head Chef & Managing Partner',
    phone: '+91 98112 34567',
    email: 'rasoi.hub@easehub.in',
    whatsappNumber: '+91 98112 34567',
    useWhatsappForAlerts: true,
    publicPhoneVisible: true,
  },
  location: {
    campusId: 'campus-hub',
    campusName: 'Campus Living Hub',
    facilityAddress: 'Shop 4, Campus Gate 2 Market',
    landmark: 'Opposite Campus North Gate',
    serviceRadiusKm: 3.5,
    city: 'Student Area',
    state: '',
    pincode: '110001',
  },
  availability: {
    schedule: DEFAULT_WEEKLY_SCHEDULE,
    holidayNotice: 'Open all days during exam weeks.',
    emergencySupport: false,
  },
  services: [
    {
      id: 'srv-rasoi-full',
      name: 'Full Month Unlimited Lunch & Dinner',
      description: '4 Rotis + Rice + Dal Makhani/Tadka + Seasonal Subzi + Salad + Curd/Sweet.',
      category: 'food',
      price: 2800,
      pricingUnit: 'per month',
      turnaround: 'Lunch 12:30–14:30 | Dinner 19:30–22:00',
      status: 'active',
      popularFeatures: ['Zero Soda Guarantee', 'Free Hostel Gate Delivery', 'Dietary Customization'],
    },
    {
      id: 'srv-rasoi-single',
      name: 'Single Tiffin Meal Trial',
      description: 'Single meal box with disposable packaging delivered to campus gate.',
      category: 'food',
      price: 110,
      pricingUnit: 'per meal',
      turnaround: 'Within 25 minutes',
      status: 'active',
      popularFeatures: ['Fresh & Hot', 'Eco-friendly packing'],
    },
  ],
  createdAt: '2026-06-01T10:00:00.000Z',
  updatedAt: '2026-08-15T12:00:00.000Z',
};

// Seed demo submitted application (under review)
const SEED_UNDER_REVIEW_APP: ProviderApplication = {
  id: 'EH-APP-88412',
  userId: 'usr-student-aditya', // Demo user can inspect this if testing review state
  currentStep: 8,
  status: 'under_review',
  businessInfo: {
    businessName: 'SpinCraft Smart Wash Lab',
    legalEntityName: 'SpinCraft Cleaners Pvt Ltd',
    description: 'Automated European washing machines with eco-friendly enzyme detergents and crisp steam ironing.',
    primaryCategory: 'laundry',
    yearEstablished: 2021,
    tradeLicenseOrFSSAI: 'DL-MCD-2023-9941',
  },
  contactInfo: {
    contactPerson: 'Karan Malhotra',
    designation: 'Operations Director',
    phone: '+91 98223 44556',
    email: 'karan@spincraft.in',
    whatsappNumber: '+91 98223 44556',
    useWhatsappForAlerts: true,
    publicPhoneVisible: false,
  },
  services: [
    {
      id: 'app-srv-1',
      name: 'Standard Student Wash & Steam Press (6kg)',
      category: 'laundry',
      description: 'Mixed clothes wash, tumble dry, and steam pressing delivered in eco laundry bag.',
      price: 249,
      pricingUnit: 'per bag',
      turnaround: '24 Hours Doorstep Delivery',
      status: 'active',
    },
  ],
  location: {
    campusId: 'campus-hub',
    campusName: 'Campus Living Hub',
    facilityAddress: 'Basement 1, Student Commercial Complex, Sector 17',
    landmark: 'Behind Campus Sports Complex',
    serviceRadiusKm: 2.0,
    city: 'Student Area',
    state: '',
    pincode: '110001',
  },
  availability: {
    schedule: DEFAULT_WEEKLY_SCHEDULE,
    holidayNotice: 'Sunday morning pickup only.',
  },
  submittedAt: '2026-09-08T14:30:00.000Z',
  reviewerNotes: 'Document verification in progress by Campus Operations team.',
  createdAt: '2026-09-08T10:00:00.000Z',
  updatedAt: '2026-09-08T14:30:00.000Z',
};

export class ProviderService {
  // 1. Applications Storage
  private static getStoredApplications(): ProviderApplication[] {
    if (typeof window === 'undefined') return [SEED_UNDER_REVIEW_APP];
    try {
      const data = localStorage.getItem(PROVIDER_APPLICATIONS_KEY);
      if (!data) {
        localStorage.setItem(PROVIDER_APPLICATIONS_KEY, JSON.stringify([SEED_UNDER_REVIEW_APP]));
        return [SEED_UNDER_REVIEW_APP];
      }
      return JSON.parse(data);
    } catch {
      return [SEED_UNDER_REVIEW_APP];
    }
  }

  private static saveApplications(apps: ProviderApplication[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROVIDER_APPLICATIONS_KEY, JSON.stringify(apps));
    } catch {
      // storage unavailable
    }
  }

  // 2. Profiles Storage
  private static getStoredProfiles(): ProviderProfile[] {
    if (typeof window === 'undefined') return [SEED_APPROVED_PROVIDER];
    try {
      const data = localStorage.getItem(PROVIDER_PROFILES_KEY);
      if (!data) {
        localStorage.setItem(PROVIDER_PROFILES_KEY, JSON.stringify([SEED_APPROVED_PROVIDER]));
        return [SEED_APPROVED_PROVIDER];
      }
      return JSON.parse(data);
    } catch {
      return [SEED_APPROVED_PROVIDER];
    }
  }

  private static saveProfiles(profiles: ProviderProfile[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROVIDER_PROFILES_KEY, JSON.stringify(profiles));
    } catch {
      // storage unavailable
    }
  }

  // 3. Settings Storage
  private static getStoredSettings(userId: string): ProviderSettings {
    const defaultSettings: ProviderSettings = {
      userId,
      providerId: `prov-${userId}`,
      notifications: {
        newOrderAlerts: true,
        applicationUpdates: true,
        dailyDigest: true,
        smsDispatch: true,
        whatsappUpdates: true,
      },
      autoAcceptOrders: false,
      instantBookingCapacity: 10,
      hideContactBeforeBooking: true,
    };

    if (typeof window === 'undefined') return defaultSettings;
    try {
      const data = localStorage.getItem(`${PROVIDER_SETTINGS_KEY}_${userId}`);
      return data ? JSON.parse(data) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  // ==========================================
  // PUBLIC API WITH STRICT TENANT ISOLATION
  // ==========================================

  /**
   * Fetches the current user's provider application (if exists).
   * Enforces that requesting user ONLY gets their own application.
   */
  public static async getApplication(userId: string): Promise<ProviderApplication | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (!userId) return null;

    const apps = this.getStoredApplications();
    const app = apps.find((a) => a.userId === userId);
    return app || null;
  }

  /**
   * Saves or updates an in-progress onboarding draft for a specific user.
   */
  public static async saveDraft(
    userId: string,
    draftData: Partial<ProviderApplication>
  ): Promise<ProviderApplication> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!userId) throw new Error('Unauthorized: User ID is required to save application draft.');

    const apps = this.getStoredApplications();
    const existingIndex = apps.findIndex((a) => a.userId === userId);

    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      const existing = apps[existingIndex];
      // Do not allow draft overwrite if application is already under_review or approved
      if (existing.status === 'under_review' || existing.status === 'approved') {
        return existing;
      }

      const updated: ProviderApplication = {
        ...existing,
        ...draftData,
        userId,
        status: existing.status === 'rejected' ? 'draft' : existing.status,
        updatedAt: now,
      };

      apps[existingIndex] = updated;
      this.saveApplications(apps);
      return updated;
    }

    // Create fresh draft
    const newApp: ProviderApplication = {
      id: `EH-APP-${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      currentStep: draftData.currentStep || 1,
      status: 'draft',
      businessInfo: draftData.businessInfo || {
        businessName: '',
        description: '',
        primaryCategory: 'food',
      },
      contactInfo: draftData.contactInfo || {
        contactPerson: '',
        phone: '',
        email: '',
        useWhatsappForAlerts: true,
        publicPhoneVisible: false,
      },
      services: draftData.services || [],
      location: draftData.location || {
        campusId: 'campus-hub',
        campusName: 'Campus Living Hub',
        facilityAddress: '',
        landmark: '',
        serviceRadiusKm: 2.5,
        city: 'Student Area',
        state: '',
        pincode: '110001',
      },
      availability: draftData.availability || {
        schedule: DEFAULT_WEEKLY_SCHEDULE,
      },
      createdAt: now,
      updatedAt: now,
    };

    apps.push(newApp);
    this.saveApplications(apps);
    return newApp;
  }

  /**
   * Finalizes and submits the provider application.
   * Changes status to 'submitted' / 'under_review'.
   * Never automatically approves.
   */
  public static async submitApplication(
    userId: string,
    applicationData: Omit<ProviderApplication, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'submittedAt'>
  ): Promise<ProviderApplication> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!userId) throw new Error('Unauthorized: Authentication required to submit application.');

    // Validate minimum required fields
    if (!applicationData.businessInfo?.businessName?.trim()) {
      throw new Error('Business name is required.');
    }
    if (!applicationData.contactInfo?.contactPerson?.trim() || !applicationData.contactInfo?.phone?.trim()) {
      throw new Error('Contact person and phone number are required.');
    }
    if (!applicationData.location?.facilityAddress?.trim()) {
      throw new Error('Facility address is required.');
    }

    const apps = this.getStoredApplications();
    const existingIndex = apps.findIndex((a) => a.userId === userId);
    const now = new Date().toISOString();
    const appId = existingIndex !== -1 ? apps[existingIndex].id : `EH-APP-${Math.floor(10000 + Math.random() * 90000)}`;

    const submittedApp: ProviderApplication = {
      ...applicationData,
      id: appId,
      userId,
      currentStep: 8,
      status: 'under_review', // Submitted into review queue
      submittedAt: now,
      reviewerNotes: 'Application received. Pending administrative background and hygiene audit.',
      createdAt: existingIndex !== -1 ? apps[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex !== -1) {
      apps[existingIndex] = submittedApp;
    } else {
      apps.push(submittedApp);
    }

    this.saveApplications(apps);

    // Dispatch notification to user's email
    try {
      await NotificationService.createNotification({
        userId,
        title: 'Provider Application Received',
        description: `Your partner application (${appId}) for "${submittedApp.businessInfo.businessName}" is now under review by the campus audit board.`,
        type: 'service_alert',
        targetUrl: '#provider/status',
      });
    } catch {
      // notifications non-blocking
    }

    return submittedApp;
  }

  /**
   * Retrieves provider profile for an approved provider.
   * Strictly verifies that the requesting user owns the profile.
   */
  public static async getProviderProfile(userId: string): Promise<ProviderProfile | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (!userId) return null;

    const profiles = this.getStoredProfiles();
    const matched = profiles.find((p) => p.userId === userId);
    return matched || null;
  }

  /**
   * Updates provider profile details (business name, description, services, operating hours).
   * Enforces tenant ownership check.
   */
  public static async updateProviderProfile(
    userId: string,
    updates: Partial<ProviderProfile>
  ): Promise<ProviderProfile> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (!userId) throw new Error('Unauthorized');

    const profiles = this.getStoredProfiles();
    const idx = profiles.findIndex((p) => p.userId === userId);

    if (idx === -1) {
      throw new Error('Provider profile not found or user is not authorized.');
    }

    // Prevent client from mutating security fields
    const safeUpdates = { ...updates };
    delete (safeUpdates as any).status;
    delete (safeUpdates as any).id;
    delete (safeUpdates as any).userId;
    delete (safeUpdates as any).applicationId;

    const existing = profiles[idx];
    const updated: ProviderProfile = {
      ...existing,
      ...safeUpdates,
      updatedAt: new Date().toISOString(),
    };

    profiles[idx] = updated;
    this.saveProfiles(profiles);
    return updated;
  }

  /**
   * Retrieves provider settings.
   */
  public static async getSettings(userId: string): Promise<ProviderSettings> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.getStoredSettings(userId);
  }

  /**
   * Updates provider settings.
   */
  public static async updateSettings(userId: string, updates: Partial<ProviderSettings>): Promise<ProviderSettings> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const current = this.getStoredSettings(userId);
    const updated: ProviderSettings = {
      ...current,
      ...updates,
      userId, // guarantee ownership immutability
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${PROVIDER_SETTINGS_KEY}_${userId}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return updated;
  }

  /**
   * Administrative simulation hook for Phase 13 testing.
   * Allows transitioning an application status for demonstration/test scenarios.
   */
  public static async simulateAdminReview(
    applicationId: string,
    status: 'approved' | 'rejected' | 'under_review',
    notes?: string
  ): Promise<ProviderApplication> {
    const apps = this.getStoredApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const now = new Date().toISOString();
    app.status = status;
    app.reviewedAt = now;
    app.reviewedBy = 'Campus Operations Admin (simulated)';
    if (status === 'rejected') {
      app.rejectionReason = notes || 'Documentation could not be verified with campus regulatory standards.';
    } else {
      app.reviewerNotes = notes || 'Approved following premise hygiene audit.';
    }
    app.updatedAt = now;

    this.saveApplications(apps);

    // If approved, create or update active provider profile
    if (status === 'approved') {
      const profiles = this.getStoredProfiles();
      const existingProf = profiles.find((p) => p.userId === app.userId);
      if (!existingProf) {
        const newProfile: ProviderProfile = {
          id: `prov-${app.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          userId: app.userId,
          businessName: app.businessInfo.businessName,
          legalEntityName: app.businessInfo.legalEntityName,
          description: app.businessInfo.description,
          primaryCategory: app.businessInfo.primaryCategory,
          status: 'approved',
          verificationBadge: 'EaseHub Inspected Campus Partner',
          rating: 5.0,
          reviewsCount: 1,
          applicationId: app.id,
          contact: app.contactInfo,
          location: app.location,
          availability: app.availability,
          services: app.services.map((s) => ({ ...s, status: 'active' })),
          createdAt: now,
          updatedAt: now,
        };
        profiles.push(newProfile);
        this.saveProfiles(profiles);
      }
    }

    return app;
  }
}
