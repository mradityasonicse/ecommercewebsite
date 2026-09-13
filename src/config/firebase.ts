import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Firebase Project Configuration for EaseHub
 * Project ID: easehub-58293
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyByqMM43CogFptDvJuOlvVUefZSGJT4J3M',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'easehub-58293.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'easehub-58293',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'easehub-58293.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '247492480202',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:247492480202:web:0acdc6a1ac596ff382f833',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-FLW3BEVN3M',
};

// Initialize Firebase App instance singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Initialize Firebase Analytics safely (guards against non-browser or ad-blocked environments)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not available or blocked in current client environment
    });
}
