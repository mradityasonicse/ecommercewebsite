/**
 * EASEHUB WHATSAPP NOTIFICATION UTILITY
 * Formats structured messages and dispatches student logins and service booking requests directly to WhatsApp.
 */

// Default verified EaseHub campus coordinator / support WhatsApp number
export const DEFAULT_WHATSAPP_ADMIN_NUMBER = '+918102848776';

export interface BookingSubmissionData {
  serviceId: string;
  serviceName: string;
  optionId?: string;
  optionName?: string;
  price?: number | string;
  period?: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  campusName: string;
  addressOrRoom: string;
  preferredDate?: string;
  specialNotes?: string;
  referenceId: string;
}

/**
 * Builds a direct WhatsApp URL with pre-filled booking inquiry
 */
export function buildBookingWhatsAppUrl(
  data: BookingSubmissionData,
  adminNumber: string = DEFAULT_WHATSAPP_ADMIN_NUMBER
): string {
  const cleanPhone = adminNumber.replace(/\D/g, '');
  const lines = [
    '🚀 *NEW EASEHUB BOOKING REQUEST*',
    '━━━━━━━━━━━━━━━━━━━━━',
    `📋 *Service:* ${data.serviceName}`,
    data.optionName ? `📦 *Plan:* ${data.optionName}` : '',
    data.price ? `💰 *Price:* ₹${data.price} ${data.period ? `(${data.period})` : ''}` : '',
    `👤 *Student:* ${data.studentName}`,
    `📞 *WhatsApp:* ${data.studentPhone}`,
    data.studentEmail ? `✉️ *Email:* ${data.studentEmail}` : '',
    `🏫 *Campus:* ${data.campusName}`,
    `📍 *Hostel/Room:* ${data.addressOrRoom}`,
    data.preferredDate ? `📅 *Start Date:* ${data.preferredDate}` : '',
    data.specialNotes ? `📝 *Notes:* ${data.specialNotes}` : '',
    '━━━━━━━━━━━━━━━━━━━━━',
    `🔖 *Ref ID:* ${data.referenceId}`,
    `⏰ *Timestamp:* ${new Date().toLocaleString('en-IN')}`,
    'Sent via EaseHub Student Living Portal',
  ].filter(Boolean);

  const message = lines.join('\n');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Builds a direct WhatsApp URL for notifying login events
 */
export function buildLoginWhatsAppUrl(
  user: {
    name: string;
    phone?: string;
    email?: string;
    campusName?: string;
    hostelBlock?: string;
    roomNumber?: string;
  },
  adminNumber: string = DEFAULT_WHATSAPP_ADMIN_NUMBER
): string {
  const cleanPhone = adminNumber.replace(/\D/g, '');
  const lines = [
    '🔔 *NEW STUDENT LOGIN ON EASEHUB*',
    '━━━━━━━━━━━━━━━━━━━━━',
    `👤 *Name:* ${user.name}`,
    `📞 *Phone:* ${user.phone || 'N/A'}`,
    `✉️ *Email:* ${user.email || 'N/A'}`,
    `🏫 *Campus:* ${user.campusName || 'Student Campus'}`,
    user.hostelBlock ? `🏠 *Hostel/Room:* ${user.hostelBlock} ${user.roomNumber ? `(${user.roomNumber})` : ''}` : '',
    `⏰ *Login Time:* ${new Date().toLocaleString('en-IN')}`,
    '━━━━━━━━━━━━━━━━━━━━━',
    'EaseHub Security & Access Log',
  ].filter(Boolean);

  const message = lines.join('\n');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Dispatches a booking request to WhatsApp and saves record locally
 */
export function dispatchBookingToWhatsApp(
  data: BookingSubmissionData,
  adminNumber: string = DEFAULT_WHATSAPP_ADMIN_NUMBER
): void {
  const url = buildBookingWhatsAppUrl(data, adminNumber);
  
  // Also store in localStorage history for student dashboard tracking
  try {
    const existing = JSON.parse(localStorage.getItem('easehub_submitted_bookings') || '[]');
    const newEntry = {
      ...data,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem('easehub_submitted_bookings', JSON.stringify([newEntry, ...existing]));
  } catch {
    // LocalStorage fallback
  }

  // Open WhatsApp in a new tab
  window.open(url, '_blank');
}
