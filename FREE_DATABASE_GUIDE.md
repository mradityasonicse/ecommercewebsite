# 🚀 EaseHub 100% Free Database Setup Guide (फ्री डेटाबेस गाइड)

Bhai, tumhare requirement ke mutabiq EaseHub me database setup karne ke **3 sabse best aur 100% FREE** options hain. Kisi me bhi koi credit card ya payment ki zaroorat nahi hai!

---

## 1. Abhi Ka System: Local Reactive Storage Engine (Zero Setup & 100% Free)
- **Kaise Kaam Karta Hai**: Abhi humne application me ek ultra-fast, reactive local storage engine connect kiya hua hai.
- **Cost**: ₹0 (Lifetime Free)
- **Features**:
  - Student jab mess ya koi bhi service book karta hai, booking turant store ho jati hai.
  - Mess partner console (`#mess-portal`) me wo booking live dikhti hai.
  - Mess partner jab student ko notification ya Today's Menu bhejta hai, wo turant student dashboard me appear ho jata hai.
  - Bina kisi internet server ya configuration ke abhi full checkout aur portals live chal rahe hain.

---

## 2. Option A: Firebase Cloud Firestore (Recommended - Project me Already Hai!)
Tumhare project me Firebase already installed hai (`firebase: ^12.19.0`) aur config `src/config/firebase.ts` me linked hai:
- **Project ID**: `easehub-58293`
- **Cost**: **100% FREE Forever (Spark Plan)**
- **Quota**:
  - 1 GB Database Storage (Lakhon bookings store ho sakti hain)
  - 50,000 Reads / Day
  - 20,000 Writes / Day
  - No Credit Card Required!

### Firestore Enable Karne Ka 2 Minute Ka Tareeka:
1. Google par jao aur open karo: **[Firebase Console](https://console.firebase.google.com/)**
2. Apne Google Account se Login karo aur apne project **`easehub-58293`** par click karo.
3. Left menu me **Build** -> **Firestore Database** par click karo.
4. **Create database** button dabao.
5. Location me `asia-south1 (Mumbai)` select karo aur Security Rules me **Start in test mode** choose karke Done kardo!
6. Bas! Firestore active ho jayega.

---

## 3. Option B: Supabase (PostgreSQL + Realtime WebSocket)
Agar tumhe relational database (SQL) pasand hai:
- **Cost**: **100% FREE Forever Tier**
- **Quota**: 500 MB PostgreSQL DB + Realtime Notifications + 50,000 Monthly Users.
- **Credit Card Required**: NO.

### Supabase Setup Steps:
1. Open karo: **https://supabase.com** aur free account bana lo.
2. **New Project** click karo aur naam do `EaseHub-DB`.
3. Left menu me **SQL Editor** par click karo aur neeche diya gaya SQL code paste karke **Run** dabao:

```sql
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
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  target_url TEXT,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public Read / Write Rules
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Menu" ON public.mess_menus FOR SELECT USING (true);
CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
```

4. Project Settings -> **API** me jakar `URL` aur `anon public key` copy karke `.env` me rakh sakte ho.

---

## Summary
Aapko abhi koi bhi paise kharch karne ki zaroorat nahi hai. Abhi code me sab kuch automatic local storage se 100% synchronized chal raha hai, aur jab online database chahiye ho toh upar diye gaye Firebase ya Supabase se 2 minute me connect kar sakte ho!
