import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from '../types/auth';
import type { ServiceRequest } from '../types/booking';
import type { AppNotification } from '../types/notification';

/**
 * ⚡ EASEHUB FIREBASE CLOUD FIRESTORE SERVICE
 * Fully integrated with project: 'easehub-58293' (Mumbai Region: asia-south1)
 * 100% Free Forever Tier (1GB Storage, 50k reads/day, 20k writes/day)
 */

export class FirestoreService {
  /**
   * Saves or updates a student/partner user profile in Firestore 'users' collection.
   */
  public static async saveUser(user: User): Promise<void> {
    try {
      if (!user || !user.email) return;
      const docId = user.id || user.email.replace(/[@.]/g, '_');
      const userRef = doc(db, 'users', docId);
      await setDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] User sync skipped:', err);
    }
  }

  /**
   * Saves a service booking or request in Firestore 'bookings' collection.
   */
  public static async saveBooking(request: ServiceRequest): Promise<void> {
    try {
      if (!request || !request.id) return;
      const bookingRef = doc(db, 'bookings', request.id);
      await setDoc(bookingRef, {
        ...request,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Booking sync skipped:', err);
    }
  }

  /**
   * Saves a student notification in Firestore 'notifications' collection.
   */
  public static async saveNotification(notification: AppNotification): Promise<void> {
    try {
      if (!notification || !notification.id) return;
      const notifRef = doc(db, 'notifications', notification.id);
      await setDoc(notifRef, {
        ...notification,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Notification sync skipped:', err);
    }
  }

  /**
   * Saves today's live mess menu in Firestore 'mess_menu' collection.
   */
  public static async saveMessMenu(menuData: any): Promise<void> {
    try {
      const menuRef = doc(db, 'mess_menu', 'current_menu');
      await setDoc(menuRef, {
        ...menuData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Menu sync skipped:', err);
    }
  }

  /**
   * Fetches all cloud bookings from Firestore.
   */
  public static async getCloudBookings(): Promise<ServiceRequest[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const bookings: ServiceRequest[] = [];
      snapshot.forEach((docSnap) => {
        bookings.push(docSnap.data() as ServiceRequest);
      });
      return bookings;
    } catch (err) {
      console.warn('[Firestore] Fetch bookings fallback:', err);
      return [];
    }
  }

  /**
   * Auto-seed initial starter campus data into Firestore so collections appear in Firebase Console.
   */
  public static async seedInitialCollections(): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Seed demo student
      await setDoc(doc(db, 'users', 'usr-student-demo'), {
        id: 'usr-student-demo',
        name: 'Aditya Soni',
        email: 'student@easehub.in',
        phone: '+91 98765 43210',
        role: 'student',
        status: 'active',
        studentId: 'STU-2024-042',
        hostelBlock: 'Block B',
        roomNumber: '304',
        university: 'Bhilai Campus Institute',
        createdAt: new Date().toISOString(),
      }, { merge: true });

      // 2. Seed demo booking for mess
      await setDoc(doc(db, 'bookings', 'EH-MESS-001'), {
        id: 'EH-MESS-001',
        serviceSlug: 'mess',
        serviceName: 'Daily 2-Meal Fresh Mess Tiffin',
        actionType: 'booking',
        providerName: 'Annapurna Campus Dining',
        customer: {
          name: 'Aditya Soni',
          email: 'student@easehub.in',
          phone: '+91 98765 43210',
          hostelBlock: 'Block B',
          roomNumber: '304',
          studentId: 'STU-2024-042',
        },
        status: 'confirmed',
        estimatedPrice: '₹2,400 /month',
        createdAt: new Date().toISOString(),
      }, { merge: true });

      // 3. Seed demo booking for PG
      await setDoc(doc(db, 'bookings', 'EH-PG-001'), {
        id: 'EH-PG-001',
        serviceSlug: 'pg',
        serviceName: 'Verified PG / Hostel Room',
        actionType: 'booking',
        providerName: 'Royal Living PG & Hostels',
        customer: {
          name: 'Aditya Soni',
          email: 'student@easehub.in',
          phone: '+91 98765 43210',
          hostelBlock: 'Block B',
          roomNumber: '304',
          studentId: 'STU-2024-042',
        },
        status: 'confirmed',
        estimatedPrice: '₹3,500 /month',
        createdAt: new Date().toISOString(),
      }, { merge: true });

      // 4. Seed today's live mess menu
      await setDoc(doc(db, 'mess_menu', 'current_menu'), {
        mealDate: new Date().toISOString().split('T')[0],
        breakfast: 'Poha + Hot Jalebi + Ginger Masala Chai',
        lunch: 'Paneer Butter Masala + Dal Tadka + Jeera Rice + Tawa Roti',
        dinner: 'Mix Veg Kadhai + Dal Fry + Phulka Roti + Gulab Jamun',
        stage: 'cooking',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      return { success: true, message: 'Collections seeded successfully' };
    } catch (err: any) {
      console.warn('[Firestore] Seed error:', err);
      return { success: false, message: err?.message || 'Failed to seed' };
    }
  }
}
