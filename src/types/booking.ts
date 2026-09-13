/**
 * EASEHUB SERVICE BOOKING & REQUEST TYPES
 * Strongly typed models for Phase 7 Booking & Service Request UX flows.
 */

export type ServiceActionType = 'booking' | 'request' | 'inquiry';

export interface ServiceActionConfig {
  actionType: ServiceActionType;
  requiresDate?: boolean;
  requiresTime?: boolean;
  requiresHostelRoom?: boolean;
  requiresNotes?: boolean;
  requiresOption?: boolean;
  submitButtonText?: string;
  successTitle?: string;
  successMessage?: string;
}

export interface ScheduleDetails {
  date?: string;
  timeSlot?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  studentId?: string;
  campusId?: string;
  campusName?: string;
  hostelBlock?: string;
  roomNumber?: string;
  notes?: string;
}

export type RequestStatus =
  | 'draft'
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface RequestTimelineEvent {
  id: string;
  status: RequestStatus;
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
}

export interface ServiceRequest {
  id: string; // e.g. "EH-839214"
  serviceSlug: string;
  serviceName: string;
  actionType: ServiceActionType;
  optionId?: string;
  optionName?: string;
  providerName?: string;
  customer: CustomerDetails;
  schedule?: ScheduleDetails;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  estimatedPrice?: string;
  timeline?: RequestTimelineEvent[];
}

export interface BookingState {
  step: number; // 1: Option, 2: Schedule, 3: Details, 4: Review, 5: Confirmation
  serviceSlug: string;
  selectedOptionId: string;
  schedule: ScheduleDetails;
  customer: CustomerDetails;
  notes: string;
  isSubmitting: boolean;
  submitError: string | null;
  completedRequest: ServiceRequest | null;
}
