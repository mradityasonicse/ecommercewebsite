/**
 * EASEHUB NOTIFICATION TYPES
 * Production-grade data contracts for Notification Center (Phase 10 & Phase 9 preview).
 */

export type NotificationType =
  | 'request_update'
  | 'service_alert'
  | 'security'
  | 'campus_notice'
  | 'promo';

export type NotificationPriority = 'low' | 'normal' | 'high';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  targetUrl?: string;
  priority?: NotificationPriority;
  metadata?: {
    requestId?: string;
    serviceSlug?: string;
    actor?: string;
  };
}

export type NotificationFilter = 'all' | 'unread' | 'requests' | 'security';
