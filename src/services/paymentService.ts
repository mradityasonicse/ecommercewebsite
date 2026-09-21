import type { PaymentTransaction, GatewaySettings, PaymentStatus } from '../types/payment';

const TRANSACTIONS_KEY = 'easehub_payment_transactions';
const GATEWAY_SETTINGS_KEY = 'easehub_gateway_settings';

export const DEFAULT_GATEWAY_SETTINGS: GatewaySettings = {
  adminUpiId: 'easehub@okhdfcbank',
  payeeName: 'EaseHub Campus Services',
  merchantCode: 'EASEHUB_RUNGTA',
  isManualUpiEnabled: true,
  isCodEnabled: true,
  supportPhone: '+91 91790 60786',
  announcementText: '🔥 New: Intra-Campus 30-min delivery active for all Hostel Blocks!',
  isEscrowProtectionActive: true,
};

const SEED_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_pay_101',
    orderId: 'ORD-8821',
    payerName: 'Rohan Sharma',
    payerPhone: '+91 98271 23456',
    payerEmail: 'rohan.sharma@rungta.ac.in',
    payerHostel: 'Hostel Block B, Room 204',
    itemOrServiceTitle: 'Monthly Deluxe Mess Subscription',
    category: 'food-mess',
    amount: 2499,
    paymentMethod: 'upi_qr',
    upiIdUsed: 'easehub@okhdfcbank',
    utrNumber: '425918274019',
    status: 'pending_verification',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    adminNotes: 'Awaiting bank confirmation',
  },
  {
    id: 'tx_pay_102',
    orderId: 'ORD-8819',
    payerName: 'Sneha Patel',
    payerPhone: '+91 94251 98765',
    payerEmail: 'sneha.p@rungta.ac.in',
    payerHostel: 'Girls Hostel 2, Room 108',
    itemOrServiceTitle: 'Doorstep Steam Iron & Express Wash (15kg)',
    category: 'laundry',
    amount: 599,
    paymentMethod: 'upi_qr',
    upiIdUsed: 'easehub@okhdfcbank',
    utrNumber: '425890123984',
    status: 'verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    verifiedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    adminNotes: 'UTR verified on PhonePe Business',
  },
  {
    id: 'tx_pay_103',
    orderId: 'ORD-8815',
    payerName: 'Amit Verma',
    payerPhone: '+91 91112 34567',
    payerEmail: 'amit.v@rungta.ac.in',
    payerHostel: 'Hostel Block C, Room 312',
    itemOrServiceTitle: 'Room Shifting & Cooler Servicing Package',
    category: 'extra',
    amount: 850,
    paymentMethod: 'upi_intent',
    upiIdUsed: 'easehub@okhdfcbank',
    utrNumber: '425781290345',
    status: 'verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  },
];

export class PaymentService {
  public static getGatewaySettings(): GatewaySettings {
    if (typeof window === 'undefined') return DEFAULT_GATEWAY_SETTINGS;
    try {
      const saved = localStorage.getItem(GATEWAY_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_GATEWAY_SETTINGS;
  }

  public static updateGatewaySettings(settings: Partial<GatewaySettings>): GatewaySettings {
    const current = this.getGatewaySettings();
    const updated: GatewaySettings = { ...current, ...settings };
    try {
      localStorage.setItem(GATEWAY_SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }
    return updated;
  }

  public static getTransactions(): PaymentTransaction[] {
    if (typeof window === 'undefined') return SEED_TRANSACTIONS;
    try {
      const saved = localStorage.getItem(TRANSACTIONS_KEY);
      if (saved) return JSON.parse(saved);
      // Seed default data
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(SEED_TRANSACTIONS));
    } catch {
      // Fallback
    }
    return SEED_TRANSACTIONS;
  }

  public static submitPayment(tx: Omit<PaymentTransaction, 'id' | 'status' | 'timestamp'>): PaymentTransaction {
    const newTx: PaymentTransaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending_verification',
      timestamp: new Date().toISOString(),
    };

    const current = this.getTransactions();
    const updated = [newTx, ...current];
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }
    return newTx;
  }

  public static updateTransactionStatus(id: string, status: PaymentStatus, adminNotes?: string): PaymentTransaction | null {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;

    transactions[idx] = {
      ...transactions[idx],
      status,
      adminNotes: adminNotes || transactions[idx].adminNotes,
      verifiedAt: status === 'verified' ? new Date().toISOString() : transactions[idx].verifiedAt,
    };

    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch {
      // Storage unavailable
    }
    return transactions[idx];
  }

  /**
   * Generates standard NPCI UPI Intent URI for payment.
   * Works on any mobile UPI App (GPay, PhonePe, Paytm, BHIM, CRED).
   */
  public static buildUpiIntentUri(amount: number, orderId: string, customNote?: string): string {
    const settings = this.getGatewaySettings();
    const note = customNote || `EaseHub ${orderId}`;
    const cleanUpi = settings.adminUpiId.trim();
    const cleanName = settings.payeeName.trim();

    return `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(cleanName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  }

  /**
   * Generates a high-resolution dynamic QR Code URL embedding the UPI Intent.
   */
  public static getDynamicQrCodeUrl(amount: number, orderId: string, customNote?: string): string {
    const upiUri = this.buildUpiIntentUri(amount, orderId, customNote);
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUri)}&margin=12&format=svg`;
  }
}
