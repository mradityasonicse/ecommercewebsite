/**
 * EASEHUB SERVICE DETAIL TYPES
 * Strongly typed models for the individual service detail experience (/services/[slug]).
 */

import type { Service, AvailabilityStatus } from './service';
import type { ServiceActionConfig } from './booking';

export interface PricingData {
  type: 'fixed' | 'range' | 'starting_from' | 'contact';
  amount?: number;
  min?: number;
  max?: number;
  currency: string;
  period?: 'per meal' | 'per month' | 'per kg' | 'per ride' | 'per session' | 'visiting charge' | string;
  billingNote?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  tag?: string;
  description: string;
  price: PricingData;
  features: string[];
  isPopular?: boolean;
  availabilityStatus: AvailabilityStatus;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
  category?: string;
}

export interface ServiceLocationData {
  campusId: string;
  campusName: string;
  hubLocation: string;
  serviceRadius: string;
  coverageZones: string[];
  estimatedTransitTime: string;
}

export interface ServiceHighlight {
  number: string;
  title: string;
  description: string;
}

export interface ServiceDetail extends Service {
  tagline: string;
  heroVisualBadge: string;
  keyHighlights: ServiceHighlight[];
  inclusions: string[];
  exclusions: string[];
  options: ServiceOption[];
  locationContext?: ServiceLocationData;
  providerIds: string[];
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
  actionConfig?: ServiceActionConfig;
}
