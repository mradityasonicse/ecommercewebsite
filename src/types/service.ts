/**
 * EASEHUB SERVICE TYPES & DATA MODELS
 * Strongly typed single source of truth for the EaseHub Service Ecosystem & Discovery Engine.
 */

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable' | 'coming_soon';

export type ServiceSortOption = 
  | 'recommended' 
  | 'popular' 
  | 'rating' 
  | 'price-asc' 
  | 'price-desc';

export interface ServiceCategory {
  id: string;
  slug: string;
  label: string;
  shortLabel?: string;
  iconName: string;
  description: string;
}

export interface ServiceMetrics {
  providersAvailable: number;
  avgDeliveryTime: string;
  studentSatisfaction: string;
  ratingScore?: number; // e.g. 4.8
  reviewCount?: number;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string; // matches ServiceCategory.id or slug
  iconName: 'Utensils' | 'Home' | 'Shirt' | 'Dumbbell' | 'Bike' | 'Wifi' | 'SprayCan' | 'Sparkles' | 'Wrench' | string;
  image?: string;
  badgeText: string;
  startingPrice: string;
  numericStartingPrice: number; // for deterministic price sorting
  pricingUnit: string;
  popularFeatures: string[];
  metrics: ServiceMetrics;
  accentColor: 'blue' | 'red' | 'default';
  available: boolean;
  availabilityStatus: AvailabilityStatus;
  campusIds?: string[]; // Campuses where service is currently operational
  tags: string[];
  isFeatured?: boolean;
  priorityOrder?: number;
}

export interface ServiceFilterParams {
  category?: string; // category id or 'all'
  campusId?: string; // campus id or 'all'
  search?: string;
  sort?: ServiceSortOption;
  availability?: AvailabilityStatus | 'all';
  maxPrice?: number;
}
