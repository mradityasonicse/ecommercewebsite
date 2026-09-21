export type PaymentStatus = 'pending_verification' | 'verified' | 'rejected';
export type PaymentMethod = 'upi_qr' | 'upi_intent' | 'cash_on_delivery';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  payerName: string;
  payerPhone: string;
  payerEmail?: string;
  payerHostel?: string;
  itemOrServiceTitle: string;
  category: string;
  amount: number;
  paymentMethod: PaymentMethod;
  upiIdUsed: string;
  utrNumber: string;
  screenshotUrl?: string;
  status: PaymentStatus;
  timestamp: string;
  verifiedAt?: string;
  adminNotes?: string;
}

export interface GatewaySettings {
  adminUpiId: string;
  payeeName: string;
  merchantCode?: string;
  isManualUpiEnabled: boolean;
  isCodEnabled: boolean;
  supportPhone: string;
  announcementText: string;
  isEscrowProtectionActive: boolean;
}
