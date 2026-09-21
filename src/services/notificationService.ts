/**
 * EASEHUB NOTIFICATION SERVICE
 * Centralized, production-grade notification repository for EaseHub.
 * Handles in-app notification center, real-time unread counts, and cross-tab sync.
 */

import type { AppNotification } from '../types/notification';

const STORAGE_KEY = 'easehub_notifications_v1';

const INITIAL_DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-student-aditya',
    type: 'request_update',
    title: 'Laundry Pickup Confirmed',
    description: 'CleanCare Services confirmed your wash & steam press pickup for tomorrow, 10:00 AM. Driver assigned: Rajesh K.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    read: false,
    targetUrl: '#account/requests/EH-842109',
    priority: 'high',
    metadata: {
      requestId: 'EH-842109',
      serviceSlug: 'laundry',
    },
  },
  {
    id: 'notif-2',
    userId: 'usr-student-aditya',
    type: 'service_alert',
    title: 'High-Speed Wi-Fi Node Activated',
    description: 'Wi-Fi mesh credentials generated for Aryabhatta Block B (Room 304). 200 Mbps unlimited bandwidth active.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    read: false,
    targetUrl: '#account/requests/EH-10284',
    priority: 'normal',
    metadata: {
      requestId: 'EH-10284',
      serviceSlug: 'wifi',
    },
  },
  {
    id: 'notif-3',
    userId: 'usr-student-aditya',
    type: 'security',
    title: 'Security: New Device Session',
    description: 'Signed in from Chrome on Windows connected to Campus_Student_Secure Wi-Fi.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    targetUrl: '#account/settings',
    priority: 'normal',
  },
  {
    id: 'notif-4',
    userId: 'usr-student-aditya',
    type: 'campus_notice',
    title: 'Night Gate Protocol Reminder',
    description: 'Hostel gate closes at 10:00 PM for external delivery partners. Food & essentials are held at the Warden Security Desk.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    targetUrl: '#account/profile',
    priority: 'low',
  },
];

type NotificationListener = () => void;

export class NotificationService {
  private static listeners: Set<NotificationListener> = new Set();

  public static subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore listener errors
      }
    });
  }

  private static getStored(): AppNotification[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_NOTIFICATIONS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_NOTIFICATIONS));
      return INITIAL_DEMO_NOTIFICATIONS;
    } catch {
      return INITIAL_DEMO_NOTIFICATIONS;
    }
  }

  private static save(notifications: AppNotification[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      this.notifyListeners();
    } catch {
      // Storage unavailable
    }
  }

  public static async getNotifications(userIdOrEmail?: string): Promise<AppNotification[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const all = this.getStored();
    if (!userIdOrEmail) return all;

    const normalized = userIdOrEmail.trim().toLowerCase();
    return all.filter(
      (n) =>
        n.userId.toLowerCase() === normalized ||
        n.userId.toLowerCase() === 'all' ||
        n.userId.toLowerCase() === 'all_students' ||
        n.userId.toLowerCase() === 'students' ||
        n.userId === 'usr-student-aditya' || // fallback demo notifications for student experience
        normalized.includes('student@easehub.in')
    );
  }

  public static async getUnreadCount(userIdOrEmail?: string): Promise<number> {
    const list = await this.getNotifications(userIdOrEmail);
    return list.filter((n) => !n.read).length;
  }

  public static async markAsRead(id: string): Promise<void> {
    const all = this.getStored();
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.save(updated);
  }

  public static async markAllAsRead(userIdOrEmail?: string): Promise<void> {
    const all = this.getStored();
    const normalized = userIdOrEmail?.trim().toLowerCase();
    const updated = all.map((n) => {
      if (
        !userIdOrEmail ||
        n.userId.toLowerCase() === normalized ||
        n.userId === 'all' ||
        n.userId === 'all_students' ||
        n.userId === 'usr-student-aditya' ||
        (normalized && normalized.includes('student@easehub.in'))
      ) {
        return { ...n, read: true };
      }
      return n;
    });
    this.save(updated);
  }

  public static async createNotification(
    payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
  ): Promise<AppNotification> {
    const newNotif: AppNotification = {
      ...payload,
      id: `notif-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const all = this.getStored();
    this.save([newNotif, ...all]);

    // Dispatch global toast for any open student tab
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('easehub_notification_toast', {
          detail: {
            title: payload.title,
            message: payload.description,
            type: payload.type || 'request_update',
            targetUrl: payload.targetUrl,
          },
        })
      );
      window.dispatchEvent(new CustomEvent('easehub_notifications_updated'));
    }

    return newNotif;
  }

  public static async deleteNotification(id: string): Promise<void> {
    const all = this.getStored();
    this.save(all.filter((n) => n.id !== id));
  }
}
