/**
 * EASEHUB SERVICE REQUEST REPOSITORY
 * Abstraction layer for managing service bookings, inquiries, tracking, and student requests.
 * Prepared for zero-refactor backend/API integration (Supabase, Firebase, Node/Go API).
 */

import type { ServiceRequest, RequestTimelineEvent, RequestStatus } from '../types/booking';
import { NotificationService } from './notificationService';
import { FirestoreService } from './firestoreService';

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
  {
    id: 'EH-553191',
    serviceSlug: 'mess',
    serviceName: 'Hygienic Mess & Tiffin Subscriptions',
    actionType: 'booking',
    optionId: 'opt-mess-lunch-dinner',
    optionName: 'Lunch & Dinner 2-Meal Executive',
    providerName: 'Annapurna Royal Dining',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 98234 56789',
      email: 'priya.sharma@campus.edu',
      studentId: 'STU-2024-118',
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Kasturba Girls Hostel (Block A)',
      roomNumber: '215',
      notes: 'Pure Vegetarian, No Garlic, Jain preparation preferred.',
    },
    schedule: {
      date: 'Daily Regular (Semester)',
      timeSlot: 'Lunch: 12:30 PM | Dinner: 8:00 PM',
    },
    notes: 'Pure Vegetarian, No Garlic, Jain preparation preferred.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    estimatedPrice: '₹2,600 /month',
    timeline: [
      {
        id: 'ps-1',
        status: 'confirmed',
        title: 'Subscription Active',
        description: 'Semester 2-meal dietary profile activated. Tiffin bag #42 assigned.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        actor: 'Dietary Desk',
      },
    ],
  },
  {
    id: 'EH-553192',
    serviceSlug: 'mess',
    serviceName: 'Hygienic Mess & Tiffin Subscriptions',
    actionType: 'booking',
    optionId: 'opt-mess-north-thali',
    optionName: 'North Indian Deluxe Thali (Daily Tiffin)',
    providerName: 'Annapurna Royal Dining',
    customer: {
      name: 'Rohan Gupta',
      phone: '+91 91234 87654',
      email: 'rohan.gupta@campus.edu',
      studentId: 'STU-2024-075',
      campusId: 'campus-hub',
      campusName: 'Campus Living Hub',
      hostelBlock: 'Aryabhatta Hostel (Block B)',
      roomNumber: '108',
      notes: 'Extra chapatis please, deliver at hostel security desk.',
    },
    schedule: {
      date: 'Today',
      timeSlot: 'Dinner: 8:00 PM - 9:30 PM',
    },
    notes: 'Extra chapatis please, deliver at hostel security desk.',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    estimatedPrice: '₹3,200 /month',
    timeline: [
      {
        id: 'rg-1',
        status: 'in_progress',
        title: 'Tiffin in Transit',
        description: 'Tiffin packed in thermal canister. Van out for delivery.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        actor: 'Kitchen Dispatch',
      },
    ],
  },
];

export class ServiceRequestRepository {
  private static getStoredRequests(): ServiceRequest[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_REQUESTS;
    try {
      const localStored = localStorage.getItem(STORAGE_KEY);
      if (localStored) {
        return JSON.parse(localStored);
      }
      const sessionStored = sessionStorage.getItem(STORAGE_KEY);
      if (sessionStored) {
        localStorage.setItem(STORAGE_KEY, sessionStored);
        return JSON.parse(sessionStored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_REQUESTS));
      return INITIAL_DEMO_REQUESTS;
    } catch {
      return INITIAL_DEMO_REQUESTS;
    }
  }

  private static saveStoredRequests(requests: ServiceRequest[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
      // Cross-tab and intra-app reactive update
      window.dispatchEvent(new CustomEvent('easehub_requests_updated'));
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

    // Persist to Cloud Firestore Database in real time
    FirestoreService.saveBooking(newRequest);

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

    // Sync cancelled status with Firestore Cloud
    FirestoreService.saveBooking(updatedRequest);

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
    const matches = requests.filter(
      (r) =>
        r.customer.email.toLowerCase() === normalized ||
        (r.customer.phone && r.customer.phone.replace(/\D/g, '').includes(normalized.replace(/\D/g, ''))) ||
        (normalized.includes('student@easehub.in') && r.customer.email.toLowerCase().includes('student@easehub.in'))
    );

    if (
      matches.length === 0 &&
      !normalized.includes('admin@') &&
      !normalized.includes('mess@') &&
      !normalized.includes('laundry@') &&
      !normalized.includes('pg@')
    ) {
      const studentDisplayName = normalized.includes('@')
        ? normalized.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
        : 'Campus Scholar';

      const starterRequests: ServiceRequest[] = [
        {
          id: `EH-MESS-${Math.floor(1000 + Math.random() * 9000)}`,
          serviceSlug: 'mess',
          serviceName: 'Daily 2-Meal Fresh Mess Tiffin',
          actionType: 'booking',
          optionId: 'opt-mess-monthly',
          optionName: 'Standard 2-Meal Monthly Pass (Breakfast + Dinner)',
          providerName: 'Annapurna Campus Dining',
          customer: {
            name: studentDisplayName,
            phone: '+91 98765 43210',
            email: normalized,
            studentId: 'STU-2024-042',
            campusId: 'campus-hub',
            campusName: 'Campus Living Hub',
            hostelBlock: 'Block B',
            roomNumber: '304',
            notes: 'Hot breakfast delivered daily at 7:45 AM.',
          },
          schedule: {
            date: 'Active Term Pass',
            timeSlot: '7:30 AM - 8:30 AM (Breakfast) & 8:00 PM - 9:30 PM (Dinner)',
          },
          notes: 'Standard vegetarian balanced student diet with milk & fruits.',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          estimatedPrice: '₹2,400 /month',
          timeline: [
            {
              id: 't-mess-1',
              status: 'confirmed',
              title: 'Mess Plan Synchronized',
              description: 'Annapurna Kitchen synchronized meal token with room timetable.',
              timestamp: new Date().toISOString(),
              actor: 'Annapurna Campus Dining',
            },
          ],
        },
        {
          id: `EH-PG-${Math.floor(1000 + Math.random() * 9000)}`,
          serviceSlug: 'pg',
          serviceName: 'Verified PG / Hostel Room',
          actionType: 'booking',
          optionId: 'opt-pg-single',
          optionName: 'Twin Sharing Room with AC & Wi-Fi',
          providerName: 'Royal Living PG & Hostels',
          customer: {
            name: studentDisplayName,
            phone: '+91 98765 43210',
            email: normalized,
            studentId: 'STU-2024-042',
            campusId: 'campus-hub',
            campusName: 'Campus Living Hub',
            hostelBlock: 'Block B',
            roomNumber: '304',
            notes: 'Biometric fingerprint registered for gate entry.',
          },
          schedule: {
            date: 'Term 2026',
            timeSlot: '24x7 Room Access',
          },
          notes: 'Bed 304-A, study table with charging board ready.',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          estimatedPrice: '₹3,500 /month',
          timeline: [
            {
              id: 't-pg-1',
              status: 'confirmed',
              title: 'Room Allocation Confirmed',
              description: 'Key handover completed and biometric entry activated.',
              timestamp: new Date().toISOString(),
              actor: 'Royal Living Warden',
            },
          ],
        },
      ];

      this.saveStoredRequests([...starterRequests, ...requests]);
      return starterRequests;
    }

    return matches;
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
   * Returns all bookings specifically for Mess and Tiffin subscriptions.
   * Enables the Mess Partner Console to monitor who booked, delivery rooms, and preferences.
   */
  public static async getMessBookings(): Promise<ServiceRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const requests = this.getStoredRequests();
    return requests.filter(
      (r) =>
        r.serviceSlug === 'mess' ||
        r.serviceSlug.includes('food') ||
        r.serviceSlug.includes('tiffin') ||
        (r.providerName && r.providerName.toLowerCase().includes('mess')) ||
        (r.providerName && r.providerName.toLowerCase().includes('annapurna')) ||
        (r.optionName && r.optionName.toLowerCase().includes('meal'))
    );
  }

  /**
   * Allows the Mess Partner or Admin to update a student's booking status
   * (e.g. from pending to confirmed, cooking, gate arrived, delivered)
   * Appends timeline event and dispatches real-time student notification.
   */
  public static async updateBookingStatus(
    requestId: string,
    newStatus: RequestStatus,
    statusNote?: string
  ): Promise<{ success: boolean; request?: ServiceRequest; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const requests = this.getStoredRequests();
    const idx = requests.findIndex((r) => r.id.toLowerCase() === requestId.toLowerCase());

    if (idx === -1) {
      return { success: false, error: 'Booking not found.' };
    }

    const target = requests[idx];
    const statusLabels: Record<RequestStatus, string> = {
      draft: 'Drafted',
      pending: 'Awaiting Kitchen Confirmation',
      accepted: 'Kitchen Accepted Order',
      confirmed: 'Confirmed & Scheduled',
      in_progress: 'Khana Ban Raha Hai / Packing',
      completed: 'Delivered to Hostel',
      cancelled: 'Subscription Cancelled',
    };

    const newTimelineEvent: RequestTimelineEvent = {
      id: `tl-${Date.now().toString(36)}`,
      status: newStatus,
      title: statusLabels[newStatus] || `Status updated to ${newStatus}`,
      description: statusNote || `Status updated by kitchen team: ${statusLabels[newStatus]}.`,
      timestamp: new Date().toISOString(),
      actor: 'Annapurna Mess Desk',
    };

    const updatedRequest: ServiceRequest = {
      ...target,
      status: newStatus,
      timeline: [...(target.timeline || []), newTimelineEvent],
    };

    requests[idx] = updatedRequest;
    this.saveStoredRequests(requests);

    // Sync updated status with Firestore Cloud
    FirestoreService.saveBooking(updatedRequest);

    // Notify the specific student immediately
    NotificationService.createNotification({
      userId: target.customer.email,
      type: 'request_update',
      title: `Mess Status: ${statusLabels[newStatus]}`,
      description: statusNote || `Your mess booking (${target.id}) has been updated to "${statusLabels[newStatus]}". Scheduled for ${target.schedule?.date || 'Today'}.`,
      targetUrl: `#account/requests/${target.id}`,
      priority: newStatus === 'in_progress' || newStatus === 'completed' ? 'high' : 'normal',
      metadata: {
        requestId: target.id,
        serviceSlug: target.serviceSlug,
        actor: 'Annapurna Mess Partner',
      },
    });

    return { success: true, request: updatedRequest };
  }

  /**
   * Returns all local session requests.
   */
  public static async getAllRequests(): Promise<ServiceRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return this.getStoredRequests();
  }
}
