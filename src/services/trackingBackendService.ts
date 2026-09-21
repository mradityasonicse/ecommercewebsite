/**
 * EASEHUB CAMPUS TRACKING & FULFILLMENT BACKEND SERVICE
 * Full persistent reactive state machine with service-specific pipelines:
 * - PG Accommodation: Visit -> Token -> KYC & Agreement -> Key Handover -> Resident Checked In
 * - Daily Mess: Kitchen Cooking -> Thermal Packed -> Rider En Route -> Arrived at Gate -> Delivered
 * - Doorstep Laundry: Pickup -> Weigh & Tag -> Anti-Bacterial Wash -> Steam Press -> Delivery
 */

export type ServiceKind = 'pg' | 'mess' | 'laundry';

export type PgStage = 
  | 'visit_scheduled'
  | 'visit_completed'
  | 'token_paid'
  | 'kyc_verified'
  | 'keys_handed_over'
  | 'resident_active';

export type MessStage = 
  | 'kitchen_prep'
  | 'packed_thermal'
  | 'out_for_delivery'
  | 'arrived_at_gate'
  | 'delivered';

export type LaundryStage = 
  | 'pickup_scheduled'
  | 'picked_up'
  | 'in_wash'
  | 'steam_ironing'
  | 'out_for_delivery'
  | 'delivered';

export interface BaseOrder {
  id: string; // e.g. "EH-8492"
  kind: ServiceKind;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  hostelRoom: string;
  serviceTitle: string;
  packageName: string;
  amount: number;
  paymentStatus: 'verified' | 'pending_utr';
  utrNumber: string;
  customNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PgOrder extends BaseOrder {
  kind: 'pg';
  currentStage: PgStage;
  visitDate: string;
  coordinatorName: string;
  coordinatorPhone: string;
  roomAllocated?: string;
  securityDepositPaid?: boolean;
  kycDocumentStatus?: 'verified' | 'pending';
  wifiCredentials?: { ssid: string; pass: string };
  wardenPhone?: string;
}

export interface MessOrder extends BaseOrder {
  kind: 'mess';
  currentStage: MessStage;
  mealType: 'Lunch' | 'Dinner' | 'Daily Subscription';
  riderName: string;
  riderPhone: string;
  riderVehicle: string;
  etaMinutes: number;
  deliverySlot: string;
  menuSummary: {
    lunch: string;
    dinner: string;
    special?: string;
  };
}

export interface LaundryOrder extends BaseOrder {
  kind: 'laundry';
  currentStage: LaundryStage;
  weightKg: number;
  itemCount: number;
  batchCode: string;
  pickupTime: string;
  estimatedDelivery: string;
  riderName: string;
  riderPhone: string;
}

export type TrackableOrder = PgOrder | MessOrder | LaundryOrder;

const ORDERS_KEY = 'easehub_trackable_orders_v2';

const SEED_TRACKABLE_ORDERS: TrackableOrder[] = [
  {
    id: 'EH-8492',
    kind: 'mess',
    studentName: 'Aryan Deshmukh',
    studentPhone: '+91 98271 23456',
    studentEmail: 'aryan.d@rungta.ac.in',
    hostelRoom: 'Hostel Block B, Room 204',
    serviceTitle: 'Annapurna Homely Student Mess',
    packageName: 'Full Deluxe Thali (30 Days)',
    amount: 2800,
    paymentStatus: 'verified',
    utrNumber: '425918274019',
    currentStage: 'out_for_delivery',
    mealType: 'Dinner',
    riderName: 'Rahul Sharma (Pilot #402)',
    riderPhone: '+91 81028 48776',
    riderVehicle: 'Honda Activa (CG-07-AB-4921)',
    etaMinutes: 11,
    deliverySlot: '08:15 PM',
    menuSummary: {
      lunch: 'Shahi Paneer, Dal Tadka, Jeera Rice, 4 Butter Roti, Fresh Boondi Raita',
      dinner: 'Dal Makhani, Mix Veg Masala, Steamed Basmati Rice, 4 Roti, Hot Gulab Jamun',
      special: 'Wednesday Special: Desi Ghee Halwa',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'EH-5102',
    kind: 'laundry',
    studentName: 'Vivek Kashyap',
    studentPhone: '+91 91112 34567',
    studentEmail: 'vivek.k@rungta.ac.in',
    hostelRoom: 'Hostel Block C, Room 202',
    serviceTitle: 'Doorstep Steam Iron & Express Wash',
    packageName: 'Bi-Weekly 15kg Wash & Fold',
    amount: 599,
    paymentStatus: 'verified',
    utrNumber: '425781290345',
    currentStage: 'steam_ironing',
    weightKg: 4.8,
    itemCount: 14,
    batchCode: 'BATCH-RN41',
    pickupTime: 'Today, 11:30 AM',
    estimatedDelivery: 'Today by 06:45 PM',
    riderName: 'Karan Verma (Campus Logistics)',
    riderPhone: '+91 94251 98765',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'EH-3914',
    kind: 'pg',
    studentName: 'Priya Sharma',
    studentPhone: '+91 94251 98765',
    studentEmail: 'priya.s@rungta.ac.in',
    hostelRoom: 'Near Rungta Gate 1, Kurud Rd',
    serviceTitle: 'Royal Executive AC Double Sharing PG',
    packageName: 'AC Double Sharing (Food + WiFi)',
    amount: 6500,
    paymentStatus: 'verified',
    utrNumber: '425890123984',
    currentStage: 'kyc_verified',
    visitDate: 'Completed Yesterday (Room 204)',
    coordinatorName: 'Manish Sahu (Campus Coordinator)',
    coordinatorPhone: '+91 81028 48776',
    roomAllocated: 'Room 204 (Attached Balcony & Washroom)',
    securityDepositPaid: true,
    kycDocumentStatus: 'verified',
    wifiCredentials: { ssid: 'RoyalExecutive_5G_Ext', pass: 'CampusStay#2026' },
    wardenPhone: '+91 98270 11223',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class TrackingBackendService {
  /**
   * Retrieves all orders and automatically syncs any newly placed bookings from localStorage.
   */
  public static getAllOrders(): TrackableOrder[] {
    if (typeof window === 'undefined') return SEED_TRACKABLE_ORDERS;

    let orders: TrackableOrder[] = [];
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      if (saved) {
        orders = JSON.parse(saved);
      } else {
        orders = SEED_TRACKABLE_ORDERS;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_TRACKABLE_ORDERS));
      }
    } catch {
      orders = SEED_TRACKABLE_ORDERS;
    }

    // Auto-sync with recent student bookings from easehub_admin_bookings
    try {
      const adminBookings = JSON.parse(localStorage.getItem('easehub_admin_bookings') || '[]');
      adminBookings.forEach((b: any) => {
        const existing = orders.find((o) => o.id === b.id);
        if (!existing) {
          const kind: ServiceKind = (b.category || '').includes('pg')
            ? 'pg'
            : (b.category || '').includes('laundry')
            ? 'laundry'
            : 'mess';

          if (kind === 'pg') {
            orders.unshift({
              id: b.id,
              kind: 'pg',
              studentName: b.studentName,
              studentPhone: b.studentPhone,
              studentEmail: b.studentEmail || `${b.studentPhone}@easehub.in`,
              hostelRoom: b.roomOrHostel,
              serviceTitle: b.serviceTitle,
              packageName: b.planOrOption,
              amount: b.amount,
              paymentStatus: b.utrNumber ? 'verified' : 'pending_utr',
              utrNumber: b.utrNumber || 'UPI-QR-DIRECT',
              currentStage: b.status === 'confirmed' ? 'token_paid' : 'visit_scheduled',
              visitDate: 'Today between 4:00 PM - 6:00 PM',
              coordinatorName: 'Manish Sahu (Campus Field Executive)',
              coordinatorPhone: '+91 81028 48776',
              roomAllocated: 'Room 204 (Under Final Allotment)',
              createdAt: b.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else if (kind === 'laundry') {
            orders.unshift({
              id: b.id,
              kind: 'laundry',
              studentName: b.studentName,
              studentPhone: b.studentPhone,
              studentEmail: b.studentEmail || `${b.studentPhone}@easehub.in`,
              hostelRoom: b.roomOrHostel,
              serviceTitle: b.serviceTitle,
              packageName: b.planOrOption,
              amount: b.amount,
              paymentStatus: b.utrNumber ? 'verified' : 'pending_utr',
              utrNumber: b.utrNumber || 'UPI-QR-DIRECT',
              currentStage: b.status === 'confirmed' ? 'in_wash' : 'pickup_scheduled',
              weightKg: 4.2,
              itemCount: 12,
              batchCode: 'BATCH-RN41',
              pickupTime: 'Today, 11:30 AM',
              estimatedDelivery: 'Tomorrow by 05:30 PM',
              riderName: 'Rahul Sharma (Campus Pilot)',
              riderPhone: '+91 81028 48776',
              createdAt: b.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            orders.unshift({
              id: b.id,
              kind: 'mess',
              studentName: b.studentName,
              studentPhone: b.studentPhone,
              studentEmail: b.studentEmail || `${b.studentPhone}@easehub.in`,
              hostelRoom: b.roomOrHostel,
              serviceTitle: b.serviceTitle,
              packageName: b.planOrOption,
              amount: b.amount,
              paymentStatus: b.utrNumber ? 'verified' : 'pending_utr',
              utrNumber: b.utrNumber || 'UPI-QR-DIRECT',
              currentStage: b.status === 'confirmed' ? 'out_for_delivery' : 'kitchen_prep',
              mealType: 'Dinner',
              riderName: 'Rahul Sharma (Pilot #402)',
              riderPhone: '+91 81028 48776',
              riderVehicle: 'Honda Activa (CG-07-AB-4921)',
              etaMinutes: 11,
              deliverySlot: '08:15 PM',
              menuSummary: {
                lunch: 'Shahi Paneer, Dal Tadka, Jeera Rice, 4 Butter Roti, Fresh Boondi Raita',
                dinner: 'Dal Makhani, Mix Veg Masala, Steamed Basmati Rice, 4 Roti, Hot Gulab Jamun',
                special: 'Wednesday Special: Desi Ghee Halwa',
              },
              createdAt: b.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      });
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // Storage unavailable
    }

    return orders;
  }

  public static getOrderById(orderId: string): TrackableOrder | null {
    const orders = this.getAllOrders();
    return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase()) || null;
  }

  public static updateOrderStatus(
    orderId: string,
    stage: PgStage | MessStage | LaundryStage,
    customNotes?: string
  ): TrackableOrder | null {
    const orders = this.getAllOrders();
    const idx = orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());
    if (idx === -1) return null;

    orders[idx] = {
      ...orders[idx],
      currentStage: stage as any,
      updatedAt: new Date().toISOString(),
      ...(customNotes !== undefined ? { customNotes } : {}),
    };

    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('easehub_order_status_updated', { detail: { orderId, stage } }));
      window.dispatchEvent(new CustomEvent('easehub_campus_status_updated'));
    } catch {
      // Storage unavailable
    }

    return orders[idx];
  }
}
