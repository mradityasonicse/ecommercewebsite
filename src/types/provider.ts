/**
 * EASEHUB PROVIDER / VENDOR ECOSYSTEM DATA TYPES
 * Phase 11: Provider / Vendor Foundation
 */

export type ProviderCategory =
  | 'food'
  | 'stay'
  | 'laundry'
  | 'fitness'
  | 'transport'
  | 'wifi'
  | 'cleaning'
  | 'maintenance'
  | 'other';

export type ProviderApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type ProviderServiceStatus = 'draft' | 'active' | 'paused' | 'unavailable';

export interface ProviderServiceItem {
  id: string;
  name: string;
  description: string;
  category: ProviderCategory;
  price: number;
  pricingUnit: string; // e.g. 'per month', 'per kg', 'per hour', 'per visit'
  turnaround?: string; // e.g. 'Within 2 hours', 'Next morning'
  status: ProviderServiceStatus;
  popularFeatures?: string[];
}

export interface DayAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  label: string;
  isOpen: boolean;
  openTime: string; // HH:mm format, e.g. '08:00'
  closeTime: string; // HH:mm format, e.g. '21:00'
}

export interface ProviderWeeklyAvailability {
  schedule: DayAvailability[];
  holidayNotice?: string;
  emergencySupport?: boolean;
}

export interface ProviderLocationInfo {
  campusId: string;
  campusName: string;
  facilityAddress: string;
  landmark: string;
  serviceRadiusKm: number; // in kilometers from campus gate
  city: string;
  state: string;
  pincode: string;
}

export interface ProviderContactInfo {
  contactPerson: string;
  designation?: string;
  phone: string;
  email: string;
  whatsappNumber?: string;
  useWhatsappForAlerts: boolean;
  publicPhoneVisible: boolean; // if false, masked behind EaseHub proxy
}

export interface ProviderBusinessInfo {
  businessName: string;
  legalEntityName?: string;
  description: string;
  primaryCategory: ProviderCategory;
  additionalCategories?: ProviderCategory[];
  yearEstablished?: number;
  gstin?: string;
  tradeLicenseOrFSSAI?: string;
  websiteUrl?: string;
}

export interface ProviderApplication {
  id: string; // e.g. 'EH-APP-92041'
  userId: string;
  currentStep: number; // 1 to 8
  status: ProviderApplicationStatus;
  businessInfo: ProviderBusinessInfo;
  contactInfo: ProviderContactInfo;
  services: ProviderServiceItem[];
  location: ProviderLocationInfo;
  availability: ProviderWeeklyAvailability;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  legalEntityName?: string;
  description: string;
  primaryCategory: ProviderCategory;
  logoUrl?: string;
  bannerUrl?: string;
  status: ProviderApplicationStatus;
  contact: ProviderContactInfo;
  location: ProviderLocationInfo;
  availability: ProviderWeeklyAvailability;
  services: ProviderServiceItem[];
  applicationId: string;
  verificationBadge?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderNotificationSettings {
  newOrderAlerts: boolean;
  applicationUpdates: boolean;
  dailyDigest: boolean;
  smsDispatch: boolean;
  whatsappUpdates: boolean;
}

export interface ProviderSettings {
  userId: string;
  providerId: string;
  notifications: ProviderNotificationSettings;
  autoAcceptOrders: boolean;
  instantBookingCapacity: number;
  hideContactBeforeBooking: boolean;
}
