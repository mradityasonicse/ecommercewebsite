/**
 * EASEHUB 100% FREE DATABASE SERVICE & INTEGRATION LAYER
 * 
 * Supports:
 * 1. Local Reactive Storage (Active by default, 100% free, zero configuration, works instantly)
 * 2. Firebase Cloud Firestore (Installed in project: 'easehub-58293', 100% Free Spark Tier: 1GB, 50k reads/day)
 * 3. Supabase PostgreSQL (100% Free Forever Tier: 500MB DB, Auth, Realtime WebSocket)
 */

export interface DatabaseConfig {
  provider: 'local' | 'firebase' | 'supabase';
  isOnline: boolean;
}

export const activeDbConfig: DatabaseConfig = {
  provider: 'local', // Switch to 'firebase' or 'supabase' when ready
  isOnline: true,
};

/**
 * Free Database Setup Instructions (Hinglish & English)
 */
export const FREE_DATABASE_DOCS = {
  activeProvider: 'Local Reactive Storage Engine (100% Free, Zero Setup)',
  firebaseOption: {
    name: 'Firebase Cloud Firestore',
    cost: '100% Free Forever (Spark Plan)',
    quota: '1 GB Storage, 50,000 document reads/day, 20,000 document writes/day',
    creditCardRequired: false,
    projectId: 'easehub-58293',
    steps: [
      '1. Open https://console.firebase.google.com/ and sign in with your Google account.',
      '2. Select your project "easehub-58293".',
      '3. Click on "Build" -> "Firestore Database" -> "Create database".',
      '4. Choose "Start in test mode" (or locked with rules) and select your nearest region (e.g. asia-south1 Mumbai).',
      '5. Collections needed: "students", "bookings", "mess_menus", "notifications".',
    ],
  },
  supabaseOption: {
    name: 'Supabase PostgreSQL & Realtime',
    cost: '100% Free Forever',
    quota: '500 MB Database, 50,000 monthly active users, 2 GB file storage, Realtime WebSocket',
    creditCardRequired: false,
    sqlSchema: `
-- =======================================================
-- EASEHUB FREE DATABASE TABLES (Run in Supabase SQL Editor)
-- =======================================================

-- 1. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'student',
  campus_id TEXT,
  campus_name TEXT,
  hostel_block TEXT,
  room_number TEXT,
  student_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bookings & Service Requests Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  service_slug TEXT NOT NULL,
  service_name TEXT NOT NULL,
  option_name TEXT,
  provider_name TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  hostel_block TEXT,
  room_number TEXT,
  student_id TEXT,
  schedule_date TEXT,
  schedule_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  estimated_price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Mess Daily Menu Table
CREATE TABLE IF NOT EXISTS public.mess_menus (
  id SERIAL PRIMARY KEY,
  meal_date DATE DEFAULT CURRENT_DATE,
  breakfast TEXT,
  breakfast_time TEXT,
  lunch TEXT,
  lunch_time TEXT,
  dinner TEXT,
  dinner_time TEXT,
  special_item TEXT,
  stage TEXT DEFAULT 'cooking',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. In-App Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL, -- Target student email or 'all_students'
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  target_url TEXT,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Read for free demo
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Menu" ON public.mess_menus FOR SELECT USING (true);
CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
`,
  },
};

/**
 * Sync helper: exports current local state as portable JSON for backup or database import.
 */
export const exportDatabaseBackup = () => {
  if (typeof window === 'undefined') return {};
  return {
    requests: localStorage.getItem('easehub_service_requests_v1'),
    notifications: localStorage.getItem('easehub_notifications_v1'),
    menu: localStorage.getItem('easehub_mess_custom_menu_v1'),
    stage: localStorage.getItem('easehub_mess_live_stage_v1'),
    timestamp: new Date().toISOString(),
  };
};
