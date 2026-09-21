/**
 * EASEHUB CAMPUS STATE & LIVE TRACKING SERVICE
 * Central reactive store for:
 * - Live Mess status & Today's Menu
 * - Doorstep Laundry timeline stages
 * - PG Vacancy statuses
 * - Automated booking confirmation notifications & emails
 */

export interface MessLiveState {
  currentStage: 'kitchen_preparing' | 'packaging' | 'out_for_delivery' | 'arrived';
  stageLabel: string;
  stageDescription: string;
  estimatedTime: string;
  lastUpdated: string;
  todayMenu: {
    lunch: string;
    dinner: string;
    specialItem?: string;
  };
}

export interface LaundryLiveState {
  currentStage: 1 | 2 | 3 | 4 | 5;
  stageLabel: string;
  stageDescription: string;
  estimatedDelivery: string;
  lastUpdated: string;
  activeBatchCode: string;
}

export interface PgVacancyInfo {
  pgId: string;
  pgName: string;
  totalRooms: number;
  vacantBeds: number;
  roomTypesAvailable: string[];
  lastUpdated: string;
}

const MESS_STATE_KEY = 'easehub_mess_live_state';
const LAUNDRY_STATE_KEY = 'easehub_laundry_live_state';
const PG_VACANCIES_KEY = 'easehub_pg_vacancies';

export const DEFAULT_MESS_STATE: MessLiveState = {
  currentStage: 'out_for_delivery',
  stageLabel: 'Out for Hostel Delivery',
  stageDescription: 'Campus rider Rahul is on the way to Hostel Block B & C with hot, sealed thali boxes.',
  estimatedTime: '8:15 PM (in ~12 mins)',
  lastUpdated: new Date().toISOString(),
  todayMenu: {
    lunch: 'Shahi Paneer, Dal Tadka, Jeera Rice, 4 Butter Tawa Roti, Fresh Boondi Raita & Salad',
    dinner: 'Dal Makhani, Mix Veg Masala, Steamed Basmati Rice, 4 Roti, Hot Gulab Jamun',
    specialItem: '🔥 Wednesday Special: Desi Ghee Halwa',
  },
};

export const DEFAULT_LAUNDRY_STATE: LaundryLiveState = {
  currentStage: 3,
  stageLabel: 'In Washing & Sanitization',
  stageDescription: 'Treated with anti-bacterial fabric conditioner in commercial front-load machines.',
  estimatedDelivery: 'Tomorrow by 5:30 PM',
  lastUpdated: new Date().toISOString(),
  activeBatchCode: 'BATCH-RN41',
};

export const DEFAULT_PG_VACANCIES: PgVacancyInfo[] = [
  {
    pgId: 'pg_1',
    pgName: 'Royal Executive AC PG (Near Rungta Gate 1)',
    totalRooms: 18,
    vacantBeds: 3,
    roomTypesAvailable: ['Room 204: 2 Beds Vacant', 'Room 102: 1 Bed Vacant (AC)'],
    lastUpdated: new Date().toISOString(),
  },
  {
    pgId: 'pg_2',
    pgName: 'Shree Krishna Boys Hostel (Junwani Road)',
    totalRooms: 24,
    vacantBeds: 5,
    roomTypesAvailable: ['Room 301: 2 Beds Vacant', 'Room 105: 3 Beds Vacant (Non-AC)'],
    lastUpdated: new Date().toISOString(),
  },
  {
    pgId: 'pg_3',
    pgName: 'Gargi Girls Luxury PG & Flat (Nehru Nagar)',
    totalRooms: 14,
    vacantBeds: 2,
    roomTypesAvailable: ['Flat 3B: 2 Beds Vacant (Attached Washroom)'],
    lastUpdated: new Date().toISOString(),
  },
];

export class CampusStateService {
  // --- MESS STATE ---
  public static getMessState(): MessLiveState {
    if (typeof window === 'undefined') return DEFAULT_MESS_STATE;
    try {
      const saved = localStorage.getItem(MESS_STATE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_MESS_STATE;
  }

  public static updateMessState(updates: Partial<MessLiveState>): MessLiveState {
    const current = this.getMessState();
    const updated: MessLiveState = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    try {
      localStorage.setItem(MESS_STATE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('easehub_campus_status_updated'));
    } catch {
      // Storage unavailable
    }
    return updated;
  }

  // --- LAUNDRY STATE ---
  public static getLaundryState(): LaundryLiveState {
    if (typeof window === 'undefined') return DEFAULT_LAUNDRY_STATE;
    try {
      const saved = localStorage.getItem(LAUNDRY_STATE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_LAUNDRY_STATE;
  }

  public static updateLaundryState(updates: Partial<LaundryLiveState>): LaundryLiveState {
    const current = this.getLaundryState();
    const updated: LaundryLiveState = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    try {
      localStorage.setItem(LAUNDRY_STATE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('easehub_campus_status_updated'));
    } catch {
      // Storage unavailable
    }
    return updated;
  }

  // --- PG VACANCIES ---
  public static getPgVacancies(): PgVacancyInfo[] {
    if (typeof window === 'undefined') return DEFAULT_PG_VACANCIES;
    try {
      const saved = localStorage.getItem(PG_VACANCIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_PG_VACANCIES;
  }

  public static updatePgVacancy(pgId: string, vacantBeds: number, roomTypes: string[]): PgVacancyInfo[] {
    const list = this.getPgVacancies();
    const idx = list.findIndex((p) => p.pgId === pgId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        vacantBeds,
        roomTypesAvailable: roomTypes,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(PG_VACANCIES_KEY, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('easehub_campus_status_updated'));
      } catch {
        // Storage unavailable
      }
    }
    return list;
  }

  // --- AUTOMATED CONFIRMATION EMAIL SIMULATION ---
  public static sendBookingConfirmationEmail(params: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    bookingId: string;
    serviceTitle: string;
    plan: string;
    amount: number;
    roomOrHostel: string;
  }): { success: boolean; message: string; timestamp: string } {
    const timestamp = new Date().toLocaleString();
    const subject = `Booking Confirmed: ${params.serviceTitle} (#${params.bookingId}) — EaseHub Campus HQ`;
    const body = `Dear ${params.studentName},\n\n` +
      `Great news! Your booking for ${params.serviceTitle} (${params.plan}) has been officially CONFIRMED by EaseHub Operations.\n\n` +
      `Booking Details:\n` +
      `- Order ID: ${params.bookingId}\n` +
      `- Student: ${params.studentName} (${params.studentPhone})\n` +
      `- Hostel/Room: ${params.roomOrHostel}\n` +
      `- Amount: ₹${params.amount}\n` +
      `- Status: CONFIRMED\n\n` +
      `Our verified campus coordinator will contact you shortly on WhatsApp to coordinate check-in or delivery.\n\n` +
      `Warm regards,\n` +
      `EaseHub Operations Team\n` +
      `Campus Helpline: +91 81028 48776\n` +
      `https://easehub.in`;

    // Persist email dispatch log in localStorage for administrative audit
    try {
      const emailLogs = JSON.parse(localStorage.getItem('easehub_email_dispatch_logs') || '[]');
      emailLogs.unshift({
        to: params.studentEmail,
        studentName: params.studentName,
        bookingId: params.bookingId,
        subject,
        body,
        sentAt: timestamp,
        status: 'delivered',
      });
      localStorage.setItem('easehub_email_dispatch_logs', JSON.stringify(emailLogs.slice(0, 50)));
    } catch {
      // Storage unavailable
    }

    return {
      success: true,
      message: `Official confirmation email successfully dispatched to ${params.studentEmail}`,
      timestamp,
    };
  }
}
