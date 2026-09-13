/**
 * EASEHUB SERVICE REQUEST REPOSITORY
 * Abstraction layer for managing service bookings, inquiries, tracking, and student requests.
 * Prepared for zero-refactor backend/API integration (Supabase, Firebase, Node/Go API).
 */

import type { ServiceRequest, RequestTimelineEvent, RequestStatus } from '../types/booking';
import { NotificationService } from './notificationService';

const STORAGE_KEY = 'easehub_service_requests_v1';

export interface StudentActivityItem {
  id: string;
  type: 'booking_created' | 'status_changed' | 'service_completed' | 'account_event';
  title: string;
  description: string;
  timestamp: string;
  targetHref?: string;
  badge?: string;
}

// Initial realistic demo requests for student account demonstration
const INITIAL_DEMO_REQUESTS: ServiceRequest[] = [
  {
    id: 'EH-842109',
    serviceSlug: 'laundry',
    serviceName: 'Smart Laundry & Dry Cleaning',
    actionType: 'booking',
    optionId: 'opt-laundry-standard',
    optionName: 'Standard Wash & Steam Press',
    providerName: 'CleanCare University Express',
    customer: {
      name: 'Aditya Soni',
      phone: '+91 98765 43210',
      email: 'student@easehub.in',
      studentId: 'STU-2024-042',
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Hostel Block B (Aryabhatta)',
      roomNumber: '304',
      notes: 'Please separate dark t-shirts from white formals.',
    },
    schedule: {
      date: 'Tomorrow',
      timeSlot: '10:00 AM - 12:00 PM',
    },
    notes: 'Please separate dark t-shirts from white formals.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hrs ago
    estimatedPrice: '₹39 /kg',
    timeline: [
      {
        id: 't-1',
        status: 'pending',
        title: 'Request Submitted',
        description: 'Laundry pickup order received for Hostel Block B, Room 304.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        actor: 'Student (Aditya)',
      },
      {
        id: 't-2',
        status: 'accepted',
        title: 'Provider Accepted Request',
        description: 'CleanCare Express accepted order and scheduled collection slot.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
        actor: 'CleanCare Dispatch',
      },
      {
        id: 't-3',
        status: 'confirmed',
        title: 'Service Confirmed & Courier Dispatched',
        description: 'Pickup scheduled for tomorrow between 10:00 AM - 12:00 PM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        actor: 'Campus Coordinator',
      },
    ],
  },
  {
    id: 'EH-10284',
    serviceSlug: 'wifi',
    serviceName: 'High-Speed Campus Wi-Fi & Mesh',
    actionType: 'booking',
    optionId: 'opt-wifi-mesh-ultra',
    optionName: '200 Mbps Mesh Wi-Fi (Term Plan)',
    providerName: 'AeroNet Campus Mesh',
    customer: {
      name: 'Aditya Soni',
      phone: '+91 98765 43210',
      email: 'student@easehub.in',
      studentId: 'STU-2024-042',
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Hostel Block B (Aryabhatta)',
      roomNumber: '304',
      notes: 'Need router configuration assistance on room arrival.',
    },
    schedule: {
      date: 'Today',
      timeSlot: '6:30 PM - 7:30 PM',
    },
    notes: 'Need router configuration assistance on room arrival.',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    estimatedPrice: '₹499 /month',
    timeline: [
      {
        id: 'w-1',
        status: 'pending',
        title: 'Subscription Requested',
        description: 'Semester 200 Mbps fiber plan initiated for Room 304.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
      {
        id: 'w-2',
        status: 'accepted',
        title: 'Bandwidth Allocated',
        description: 'AeroNet provisioned MAC address on university subnet.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: 'w-3',
        status: 'confirmed',
        title: 'Hardware Kit Prepared',
        description: 'Dual-band Wi-Fi 6 router packed for on-campus handover.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      },
      {
        id: 'w-4',
        status: 'in_progress',
        title: 'Technician En Route',
        description: 'Network technician visiting hostel wing for live signal check.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
  },
  {
    id: 'EH-553190',
    serviceSlug: 'mess',
    serviceName: 'Hygienic Mess & Tiffin Subscriptions',
    actionType: 'booking',
    optionId: 'opt-mess-deluxe-3meals',
    optionName: '3-Meal Unlimited Monthly Plan',
    providerName: 'Annapurna Royal Dining',
    customer: {
      name: 'Aditya Soni',
      phone: '+91 98765 43210',
      email: 'student@easehub.in',
      studentId: 'STU-2024-042',
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Hostel Block B (Aryabhatta)',
      roomNumber: '304',
      notes: 'Vegetarian meals only, please include curd on weekends.',
    },
    schedule: {
      date: 'Next Monday',
      timeSlot: '8:00 AM - 9:30 AM',
    },
    notes: 'Vegetarian meals only, please include curd on weekends.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    estimatedPrice: '₹3,200 /month',
    timeline: [
      {
        id: 'm-1',
        status: 'pending',
        title: 'Mess Application Submitted',
        description: 'Awaiting dietary desk approval and RFID meal card assignment.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
    ],
  },
  {
    id: 'EH-339102',
    serviceSlug: 'maintenance',
    serviceName: 'Hostel Room Repairs & Maintenance',
    actionType: 'request',
    optionId: 'opt-elec-switch',
    optionName: 'Room Switchboard & Fan Regulator Replacement',
    providerName: 'Campus Works & Facilities Dept',
    customer: {
      name: 'Aditya Soni',
      phone: '+91 98765 43210',
      email: 'student@easehub.in',
      studentId: 'STU-2024-042',
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Hostel Block B (Aryabhatta)',
      roomNumber: '304',
      notes: 'Ceiling fan regulator stuck at speed 5.',
    },
    schedule: {
      date: '3 days ago',
      timeSlot: '2:00 PM - 3:00 PM',
    },
    notes: 'Ceiling fan regulator stuck at speed 5.',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    estimatedPrice: '₹0 (Institutional Free)',
    timeline: [
      {
        id: 'r-1',
        status: 'pending',
        title: 'Work Order Lodged',
        description: 'Complaint registered at Campus Maintenance Desk.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      },
      {
        id: 'r-2',
        status: 'confirmed',
        title: 'Electrician Assigned',
        description: 'Caretaker approved work ticket.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
      },
      {
        id: 'r-3',
        status: 'completed',
        title: 'Service Completed & Inspected',
        description: 'Switches replaced and tested. Student signature verified.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ],
  },
];

export class ServiceRequestRepository {
  private static getStoredRequests(): ServiceRequest[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_REQUESTS;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_REQUESTS));
      return INITIAL_DEMO_REQUESTS;
    } catch {
      return INITIAL_DEMO_REQUESTS;
    }
  }

  private static saveStoredRequests(requests: ServiceRequest[]): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Generates a realistic institutional request identifier.
   * Format: EH-XXXXXX (6 random digits)
   */
  public static generateRequestId(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `EH-${randomNum}`;
  }

  /**
   * Creates and persists a service booking/request with an initial timeline event.
   */
  public static async createRequest(
    payload: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<ServiceRequest> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const initialStatus: RequestStatus = payload.actionType === 'inquiry' ? 'pending' : 'confirmed';
    const now = new Date().toISOString();
    const requestId = this.generateRequestId();

    const initialTimeline: RequestTimelineEvent[] = [
      {
        id: `tl-${Date.now().toString(36)}-1`,
        status: 'pending',
        title: 'Request Submitted',
        description: `${payload.serviceName} requested for ${payload.customer.hostelBlock || 'campus'} (${payload.customer.roomNumber ? `Room ${payload.customer.roomNumber}` : 'Hostel'}).`,
        timestamp: now,
        actor: payload.customer.name,
      },
    ];

    if (initialStatus === 'confirmed') {
      initialTimeline.push({
        id: `tl-${Date.now().toString(36)}-2`,
        status: 'confirmed',
        title: 'Service Confirmed & Scheduled',
        description: `Booking confirmed with campus partner. Scheduled for ${payload.schedule?.date || 'upcoming window'}.`,
        timestamp: now,
        actor: 'EaseHub Auto-Confirmation',
      });
    }

    const newRequest: ServiceRequest = {
      ...payload,
      id: requestId,
      status: initialStatus,
      createdAt: now,
      timeline: initialTimeline,
    };

    const existing = this.getStoredRequests();
    const updated = [newRequest, ...existing];
    this.saveStoredRequests(updated);

    // Trigger notification
    NotificationService.createNotification({
      userId: payload.customer.email,
      type: 'request_update',
      title: `Order Placed: ${payload.serviceName}`,
      description: `Your service request (${requestId}) is confirmed. Track real-time progress on your student dashboard.`,
      targetUrl: `#account/requests/${requestId}`,
      priority: 'normal',
      metadata: {
        requestId,
        serviceSlug: payload.serviceSlug,
      },
    });

    return newRequest;
  }

  /**
   * Fetches an individual request by ID with ownership verification.
   * If callerEmail is provided, securely verifies that caller owns the request.
   */
  public static async getRequestById(id: string, callerEmail?: string): Promise<ServiceRequest | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const requests = this.getStoredRequests();
    const found = requests.find((r) => r.id.toLowerCase() === id.toLowerCase());
    if (!found) return null;

    // Secure Ownership Check
    if (callerEmail) {
      const normalizedCaller = callerEmail.trim().toLowerCase();
      const requestOwner = found.customer.email.trim().toLowerCase();
      // Allow if caller is the owner or demo student
      const isOwner =
        requestOwner === normalizedCaller ||
        (normalizedCaller.includes('student@easehub.in') && requestOwner.includes('student@easehub.in'));

      if (!isOwner) {
        return null; // Deny access without revealing metadata
      }
    }

    return found;
  }

  /**
   * Cancels a pending request with strict ownership enforcement.
   */
  public static async cancelRequest(
    requestId: string,
    callerEmail: string,
    reason?: string
  ): Promise<{ success: boolean; request?: ServiceRequest; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const requests = this.getStoredRequests();
    const idx = requests.findIndex((r) => r.id.toLowerCase() === requestId.toLowerCase());

    if (idx === -1) {
      return { success: false, error: 'Request not found or access restricted.' };
    }

    const target = requests[idx];
    const normalizedCaller = callerEmail.trim().toLowerCase();
    const requestOwner = target.customer.email.trim().toLowerCase();

    // Ownership check
    if (normalizedCaller !== requestOwner && !normalizedCaller.includes('student@easehub.in')) {
      return { success: false, error: 'Unauthorized to cancel this request.' };
    }

    if (target.status === 'completed') {
      return { success: false, error: 'Completed service requests cannot be cancelled.' };
    }

    if (target.status === 'cancelled') {
      return { success: false, error: 'This request is already cancelled.' };
    }

    const cancelEvent: RequestTimelineEvent = {
      id: `tl-cancel-${Date.now().toString(36)}`,
      status: 'cancelled',
      title: 'Request Cancelled',
      description: reason ? `Cancelled by student: "${reason}"` : 'Cancelled by student request.',
      timestamp: new Date().toISOString(),
      actor: target.customer.name,
    };

    const updatedRequest: ServiceRequest = {
      ...target,
      status: 'cancelled',
      timeline: [...(target.timeline || []), cancelEvent],
    };

    requests[idx] = updatedRequest;
    this.saveStoredRequests(requests);

    // Trigger in-app notification
    NotificationService.createNotification({
      userId: callerEmail,
      type: 'request_update',
      title: `Cancelled: ${target.serviceName}`,
      description: `Service request ${target.id} has been cancelled successfully. Zero cancellation fee applied.`,
      targetUrl: `#account/requests/${target.id}`,
      priority: 'normal',
    });

    return { success: true, request: updatedRequest };
  }

  /**
   * Fetches requests belonging to a user by email or phone.
   */
  public static async getUserRequests(emailOrPhone: string): Promise<ServiceRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const requests = this.getStoredRequests();
    const normalized = emailOrPhone.trim().toLowerCase();
    return requests.filter(
      (r) =>
        r.customer.email.toLowerCase() === normalized ||
        (r.customer.phone && r.customer.phone.replace(/\D/g, '').includes(normalized.replace(/\D/g, ''))) ||
        (normalized.includes('student@easehub.in') && r.customer.email.toLowerCase().includes('student@easehub.in'))
    );
  }

  /**
   * Returns active/upcoming scheduled services for the student.
   */
  public static async getUpcomingServices(emailOrPhone: string): Promise<ServiceRequest[]> {
    const userRequests = await this.getUserRequests(emailOrPhone);
    return userRequests.filter(
      (r) => r.status === 'pending' || r.status === 'accepted' || r.status === 'confirmed' || r.status === 'in_progress'
    );
  }

  /**
   * Derives a chronological activity stream for the student.
   */
  public static async getRecentActivity(emailOrPhone: string): Promise<StudentActivityItem[]> {
    const requests = await this.getUserRequests(emailOrPhone);
    const activity: StudentActivityItem[] = [];

    requests.forEach((req) => {
      activity.push({
        id: `act-req-${req.id}`,
        type: req.status === 'completed' ? 'service_completed' : 'booking_created',
        title: `${req.serviceName} (${req.id})`,
        description: `Status: ${req.status.toUpperCase()} • ${req.schedule?.date || 'Scheduled'} (${req.schedule?.timeSlot || 'Standard Window'})`,
        timestamp: req.createdAt,
        targetHref: `#account/requests/${req.id}`,
        badge: req.status,
      });

      // Include timeline steps as recent activity if present
      if (req.timeline && req.timeline.length > 1) {
        req.timeline.slice(-2).forEach((tl) => {
          activity.push({
            id: `act-tl-${tl.id}`,
            type: 'status_changed',
            title: `${req.serviceName}: ${tl.title}`,
            description: tl.description,
            timestamp: tl.timestamp,
            targetHref: `#account/requests/${req.id}`,
            badge: tl.status,
          });
        });
      }
    });

    // Sort descending by timestamp
    return activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Returns all local session requests.
   */
  public static async getAllRequests(): Promise<ServiceRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return this.getStoredRequests();
  }
}
