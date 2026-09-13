# 🎓 EaseHub — Collegiate Living & Campus Services Operating System

[![Live Website](https://img.shields.io/badge/Live_Website-Vercel-black?style=for-the-badge&logo=vercel)](https://ecommercewebsite-theta-topaz.vercel.app)
[![React 19](https://img.shields.io/badge/React_19-087EA4?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

> **Live Production Deployment**: [https://ecommercewebsite-theta-topaz.vercel.app](https://ecommercewebsite-theta-topaz.vercel.app)

---

## 🌟 Overview

**EaseHub** is a next-generation campus living operating system and student commerce platform built specifically for university environments. It eliminates the everyday friction faced by college students by bringing all essential campus services together under a unified, ultra-fast interface:

* 🏠 **Student Housing & PGs**: Curated, verified single, double, and triple sharing rooms near university campuses.
* 🍱 **Daily Meals & Mess Subscriptions**: Hygienic breakfast, lunch, and dinner plans with campus delivery.
* 🧺 **Doorstep Laundry & Dry Cleaning**: Same-day pickup and ironed delivery for hostel residents.
* 📦 **Smart Living Bundles**: All-in-one discounted bundles combining food, accommodation, and laundry.
* ⚡ **WhatsApp Concierge Hotline**: Direct, 1-click booking pre-formatted with order details, room number, and campus location.

---

## ✨ Key Features & Highlights

### 1. 🎨 Dual Visual Theme Engine (Navy Blue & Obsidian Black)
* **Brand Royal Navy (`#12285A`)**: Clean editorial, professional collegiate aesthetic inspired by high-trust institutional universities.
* **Obsidian Pitch Black (`#050505`)**: True pitch-black AMOLED dark mode with high-contrast text and subtle violet-accented neon cues.
* **Persistent Theme State**: Theme toggles instantly without page flicker and remembers preference in `localStorage`.

### 2. 🔐 Multi-Provider Authentication (Firebase + Google + OTP)
* **Firebase Authentication (`easehub-58293`)**: Production-ready Auth integration with Firebase Web SDK.
* **Google Direct Sign-In**: Integrated with `GoogleAuthProvider` and `signInWithPopup`.
* **Mobile Phone OTP / Email Login**: Streamlined modal flow allowing students to authenticate via phone or email credentials.
* **Student Dashboard**: Personalized dashboard with bookings tracker, active orders, and notifications.

### 3. 💬 WhatsApp Automated Concierge Booking Flow
* Interactive modal prompts student for room number, hostel block, service tier, and notes.
* Automatically synthesizes structured order payload and opens WhatsApp with a pre-filled, formatted dispatch text to campus admins.

### 4. 🛡️ Content Protection & Anti-Copy Security Shield
* **Anti-Scraping**: Right-click inspection and text drag selection protected on sensitive assets.
* **Source Protection**: Developer-grade client shield preventing automated clone scripts from stealing verified campus data.

### 5. 📱 100% Responsive & Mobile First
* Seamless experience across desktop (1280px+), tablets (768px - 1024px), and mobile devices (390px iPhone & Android screens).
* Smooth slide-in mobile navigation drawer with quick theme switcher and search.

---

## 🏗️ Tech Stack & Architecture

| Layer | Technology | Purpose | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | **React 19** | Component-driven declarative UI | **₹0 Free** |
| **Language** | **TypeScript (~6.0)** | End-to-end type safety & zero runtime bugs | **₹0 Free** |
| **Bundler** | **Vite 8.2** | Sub-second HMR & optimized tree-shaking | **₹0 Free** |
| **Styling** | **Vanilla CSS + Design Tokens** | Maximum performance, zero runtime Tailwind bloat | **₹0 Free** |
| **Icons** | **Lucide React** | Lightweight, high-clarity SVG icon library | **₹0 Free** |
| **Authentication**| **Firebase Auth** | Google OAuth & Mobile Phone OTP | **₹0 Free** |
| **Hosting** | **Vercel** | Edge CDN deployment with auto-CI/CD | **₹0 Free** |

---

## 📁 Directory Structure

```text
Easehub/
├── public/                     # Static assets (favicons, brand marks, redirects)
│   ├── _redirects              # SPA client routing for Vercel/Netlify
│   └── easehub-mark.png        # Official verified brand crest
├── src/
│   ├── assets/                 # High-resolution brand assets
│   ├── components/             # Reusable UI component library
│   │   ├── account/            # Student dashboard, tabs, and settings
│   │   ├── auth/               # Google login, phone OTP, password forms
│   │   ├── booking/            # Booking flow, dates, price breakdown
│   │   ├── brand/              # Brand logos (desktop, mobile, compact)
│   │   ├── chat/               # Persistent WhatsApp floating chat widget
│   │   ├── discovery/          # Category filter bars, search triggers
│   │   ├── drawers/            # Slide-out bottom sheets and drawers
│   │   ├── intro/              # Brand splash screen on first visit
│   │   ├── layout/             # AppShell, Navbar, Global Footer
│   │   ├── modals/             # WhatsApp booking & login gate popups
│   │   ├── navigation/         # DesktopNav, MobileMenu, UserActions
│   │   ├── primitives/         # Card, Container, Badge, Button primitives
│   │   └── sections/story/     # CoreServicesSection, BundlesSection
│   ├── config/                 # Application configs & navigation tree
│   │   ├── firebase.ts         # Firebase app, auth, & analytics init
│   │   └── navigation.ts       # Global navbar links & category definitions
│   ├── context/                # Global React contexts (AuthContext, ThemeContext)
│   ├── data/                   # Initial services, campuses, & pricing catalogues
│   ├── pages/                  # Top-level routed views (AccountPage, AuthPage, etc.)
│   ├── services/               # Data layer (authService, notificationService)
│   ├── styles/                 # Design tokens (colors, typography, radii, motion)
│   ├── types/                  # TypeScript interface declarations
│   ├── utils/                  # Utility functions (whatsapp, routes, security)
│   ├── App.tsx                 # Master root application controller
│   └── main.tsx                # Entry point & security shield mounting
├── .env                        # Active environment variables (git-ignored)
├── .env.example                # Sample environment template
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite bundler configuration
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Application Environment
VITE_APP_NAME="EaseHub"
VITE_APP_ENV="production"
VITE_APP_URL="https://ecommercewebsite-theta-topaz.vercel.app"

# Google Authentication Client ID
VITE_GOOGLE_CLIENT_ID="249523355187-un7401cet203k31pluhp3mujn3lpt6b5.apps.googleusercontent.com"

# Google Firebase Project Configuration
VITE_FIREBASE_API_KEY="AIzaSyByqMM43CogFptDvJuOlvVUefZSGJT4J3M"
VITE_FIREBASE_AUTH_DOMAIN="easehub-58293.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="easehub-58293"
VITE_FIREBASE_STORAGE_BUCKET="easehub-58293.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="247492480202"
VITE_FIREBASE_APP_ID="1:247492480202:web:0acdc6a1ac596ff382f833"
VITE_FIREBASE_MEASUREMENT_ID="G-FLW3BEVN3M"

# WhatsApp Business Concierge
VITE_WHATSAPP_NUMBER="918102848776"
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/mradityasonicse/ecommercewebsite.git
cd ecommercewebsite

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on port `5173` |
| `npm run build` | Runs TypeScript compiler (`tsc -b`) and bundles for production with Vite |
| `npm run preview` | Locally serves the production `dist/` build |
| `npm run lint` | Runs fast code quality and linter checks with `oxlint` |

---

## 🌐 Deployment

### Continuous Deployment with Vercel
The project is configured for continuous deployment on Vercel:
1. Every push to the `main` branch on GitHub automatically triggers a new deployment.
2. Routing is handled smoothly for single-page applications via `public/_redirects`.

### Firebase Authorized Domains
To ensure Google Sign-In operates seamlessly on any deployment:
1. Open [Firebase Console](https://console.firebase.google.com/project/easehub-58293/authentication/settings).
2. Go to **Authentication** ➔ **Settings** ➔ **Authorized domains**.
3. Verify that your deployment domain (e.g., `ecommercewebsite-theta-topaz.vercel.app`) is added to the list.

---

## 🛣️ Roadmap & Future Architecture

- [x] High-converting Homepage with Royal Navy & Obsidian Black themes
- [x] Verified PG, Mess, and Laundry service ecosystem
- [x] Dynamic WhatsApp automated concierge booking
- [x] Firebase Authentication with Google Sign-In
- [ ] **Campus OLX P2P Marketplace**: Student-to-student buy & sell engine for used textbooks, cycles, room coolers, and appliances.
- [ ] **Cloud Firestore Integration**: Persistent cloud database replacing mock data arrays.
- [ ] **Client-Side Image Auto-Compression**: Ultra-fast media compression before upload to maintain 100% free hosting tiers.
- [ ] **Progressive Web App (PWA)**: Add-to-homescreen mobile app installability without Play Store fees.

---

## 👨‍💻 Author & Maintainers

Built with high craft for collegiate living by **Aditya Soni** and the EaseHub engineering team.

* **GitHub**: [@mradityasonicse](https://github.com/mradityasonicse)
* **Website**: [https://ecommercewebsite-theta-topaz.vercel.app](https://ecommercewebsite-theta-topaz.vercel.app)
