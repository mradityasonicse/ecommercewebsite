import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  Clock,
  DollarSign,
  Layers,
  Plus,
  Edit2,
  RefreshCw,
  QrCode,
  Phone,
  ExternalLink,
  Search,
  X,
  Megaphone,
  Save,
  Home,
  MapPin,
  FileText,
  Lock,
  Mail,
  Truck,
  Utensils,
  Shirt,
  LogOut,
  AlertCircle,
  Activity,
  Globe,
  Radio,
  Eye,
  Check,
  Sparkles,
  ShoppingBag,
  Building2,
  Trash2,
  ShoppingCart,
} from 'lucide-react';
import { ServiceRepository } from '../services/serviceRepository';
import type { Service, AvailabilityStatus } from '../types/service';
import { PaymentService } from '../services/paymentService';
import type { PaymentTransaction, GatewaySettings, PaymentStatus } from '../types/payment';
import {
  CampusStateService,
  type MessLiveState,
  type LaundryLiveState,
  type PgVacancyInfo,
} from '../services/campusStateService';
import {
  TrackingBackendService,
  type TrackableOrder,
} from '../services/trackingBackendService';
import { SiteSettingsService, type SiteSettings } from '../services/siteSettingsService';
import { ServiceRequestRepository } from '../services/serviceRequestRepository';
import { BundleRepository } from '../services/bundleRepository';
import type { Bundle } from '../data/bundles';
import { useCart } from '../context/CartContext';

type AdminTab = 'overview' | 'activity' | 'content' | 'combos' | 'services' | 'orders' | 'tracking' | 'payments' | 'gateway' | 'broadcast';

interface StudentBooking {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  roomOrHostel: string;
  serviceTitle: string;
  category: string;
  planOrOption: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'in_service' | 'completed' | 'cancelled';
  createdAt: string;
  utrNumber?: string;
  notes?: string;
}

const SEED_BOOKINGS: StudentBooking[] = [
  {
    id: 'BK-9104',
    studentName: 'Aryan Deshmukh',
    studentPhone: '9827123456',
    studentEmail: 'aryan.d@rungta.ac.in',
    roomOrHostel: 'Rungta Boys Hostel 1, Room 314',
    serviceTitle: 'Royal Executive AC Double Sharing PG',
    category: 'pg',
    planOrOption: 'AC Double Sharing (Food + WiFi)',
    amount: 6500,
    status: 'confirmed',
    utrNumber: '425918274019',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    notes: 'Requested ground or 1st floor if available',
  },
  {
    id: 'BK-9103',
    studentName: 'Priya Sharma',
    studentPhone: '9425198765',
    studentEmail: 'priya.s@rungta.ac.in',
    roomOrHostel: 'Nehru Nagar Girls PG, Flat 2B',
    serviceTitle: 'Annapurna Homely Student Mess',
    category: 'mess',
    planOrOption: 'Full Thali (Lunch + Dinner, 30 Days)',
    amount: 2800,
    status: 'pending',
    utrNumber: '425890123984',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: 'Pure vegetarian diet',
  },
  {
    id: 'BK-9102',
    studentName: 'Vivek Kashyap',
    studentPhone: '9111234567',
    studentEmail: 'vivek.k@rungta.ac.in',
    roomOrHostel: 'Hostel Block C, Room 202',
    serviceTitle: 'Doorstep Steam Iron & Express Wash',
    category: 'laundry',
    planOrOption: 'Bi-Weekly 15kg Wash & Fold',
    amount: 599,
    status: 'pending',
    utrNumber: '425781290345',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    notes: 'Sunday morning pickup requested',
  },
  {
    id: 'BK-9101',
    studentName: 'Sakshi Verma',
    studentPhone: '9893012345',
    studentEmail: 'sakshi.v@rungta.ac.in',
    roomOrHostel: 'CSVTU Campus Flats, Block 4',
    serviceTitle: 'Room Shifting & Cooler Servicing',
    category: 'extra',
    planOrOption: 'Deep Clean & Cooler Pad Replacement',
    amount: 750,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const AdminPage: React.FC = () => {
  // --- ADMIN AUTHENTICATION STATE ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('easehub_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const { addItem: addCartItem, openCart: openShoppingCart } = useCart();

  // Services State
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');

  // Combos & Smart Passes State ("combo khud se edit karne wala rakh do jitna jo chahe add karle")
  const [bundles, setBundles] = useState<Bundle[]>(() => BundleRepository.getBundlesSync());
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  const [bundleToast, setBundleToast] = useState<string | null>(null);
  const [bundleForm, setBundleForm] = useState({
    id: '',
    name: '',
    tagline: '',
    originalPrice: 15000,
    bundlePrice: 9999,
    savingsPercentage: 33,
    billingPeriod: 'semester',
    badge: 'STUDENT PASS',
    servicesIncluded: 'AC PG Room, 3x Daily Mess, Express Laundry',
    perks: 'Free Wi-Fi, Zero Move-in Deposit, Priority Support',
  });

  // Bookings / Orders State
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [newBooking, setNewBooking] = useState<Partial<StudentBooking>>({
    studentName: '',
    studentPhone: '',
    studentEmail: '',
    roomOrHostel: '',
    serviceTitle: '',
    category: 'pg',
    planOrOption: 'Standard Plan',
    amount: 1000,
    status: 'pending',
  });
  const [emailNotificationToast, setEmailNotificationToast] = useState<string | null>(null);

  // Live Campus State (Mess, Laundry, PG Vacancies)
  const [messState, setMessState] = useState<MessLiveState>(CampusStateService.getMessState());
  const [laundryState, setLaundryState] = useState<LaundryLiveState>(CampusStateService.getLaundryState());
  const [pgVacancies, setPgVacancies] = useState<PgVacancyInfo[]>(CampusStateService.getPgVacancies());
  const [trackingSavedToast, setTrackingSavedToast] = useState(false);

  // Payment Transactions State
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Gateway Settings State
  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>(PaymentService.getGatewaySettings());
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Campus Broadcast Announcement State
  const [broadcastText, setBroadcastText] = useState(() => {
    return localStorage.getItem('easehub_campus_broadcast') || '🔥 Exam Alert: 30-min late night mess deliveries & printouts active till 2:00 AM across all hostel blocks!';
  });
  const [isBroadcastActive, setIsBroadcastActive] = useState(() => {
    return localStorage.getItem('easehub_broadcast_active') !== 'false';
  });
  const [broadcastSaved, setBroadcastSaved] = useState(false);

  // Whole Website Editable Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => SiteSettingsService.getSettings());
  const [siteSettingsSaved, setSiteSettingsSaved] = useState(false);

  // Live Activity Stream State & Nominations
  const [activityFilter, setActivityFilter] = useState<'all' | 'orders' | 'payments' | 'nominations'>('all');
  const [campusNominations, setCampusNominations] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('easehub_campus_nominations') || '[]');
    } catch {
      return [];
    }
  });

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('pg');
  const [newServicePrice, setNewServicePrice] = useState('5500');
  const [newServiceUnit, setNewServiceUnit] = useState('month');
  const [newServiceShortDesc, setNewServiceShortDesc] = useState('');
  const [newServiceBadge, setNewServiceBadge] = useState('Verified');

  // Trackable Fulfillment Orders State
  const [trackableOrders, setTrackableOrders] = useState<TrackableOrder[]>([]);

  // Load Data
  const loadData = () => {
    setServices(ServiceRepository.getServicesSync());
    setTransactions(PaymentService.getTransactions());
    setGatewaySettings(PaymentService.getGatewaySettings());
    setMessState(CampusStateService.getMessState());
    setLaundryState(CampusStateService.getLaundryState());
    setPgVacancies(CampusStateService.getPgVacancies());
    setTrackableOrders(TrackingBackendService.getAllOrders());
    setSiteSettings(SiteSettingsService.getSettings());
    setBundles(BundleRepository.getBundlesSync());

    try {
      const storedNoms = JSON.parse(localStorage.getItem('easehub_campus_nominations') || '[]');
      setCampusNominations(storedNoms);
    } catch {}

    // Pull student requests from centralized ServiceRequestRepository
    const studentRequests = ServiceRequestRepository.getAllRequestsSync();
    let currentBookings: StudentBooking[] = [];
    try {
      const savedBookings = localStorage.getItem('easehub_admin_bookings');
      if (savedBookings) {
        currentBookings = JSON.parse(savedBookings);
      } else {
        currentBookings = SEED_BOOKINGS;
      }
    } catch {
      currentBookings = SEED_BOOKINGS;
    }

    // Merge student requests into bookings without duplicates
    const existingIds = new Set(currentBookings.map((b) => b.id.toLowerCase()));
    const mappedStudentRequests: StudentBooking[] = studentRequests
      .filter((r) => !existingIds.has(r.id.toLowerCase()))
      .map((r) => ({
        id: r.id,
        studentName: r.customer?.name || 'Student',
        studentPhone: r.customer?.phone || '918102848776',
        studentEmail: r.customer?.email || 'student@easehub.in',
        roomOrHostel: `${r.customer?.campusName || 'Campus'}, ${r.customer?.hostelBlock || ''} ${r.customer?.roomNumber || ''}`.trim(),
        serviceTitle: r.serviceName,
        category: r.serviceSlug,
        planOrOption: r.optionName || 'Standard Order',
        amount: parseInt((r.estimatedPrice || '0').replace(/\D/g, '')) || 499,
        status: r.status === 'accepted' ? 'in_service' : (r.status as any),
        createdAt: r.createdAt,
        notes: r.notes || (r.schedule ? `${r.schedule.date} (${r.schedule.timeSlot})` : undefined),
      }));

    const mergedBookings = [...mappedStudentRequests, ...currentBookings];
    setBookings(mergedBookings);
  };

  useEffect(() => {
    loadData();
    const handleStatusUpdate = () => {
      loadData();
    };
    window.addEventListener('easehub_campus_status_updated', handleStatusUpdate);
    window.addEventListener('easehub_order_status_updated', handleStatusUpdate);
    window.addEventListener('easehub_requests_updated', handleStatusUpdate);
    window.addEventListener('easehub_campus_nominated', handleStatusUpdate);
    window.addEventListener('easehub_site_settings_updated', handleStatusUpdate);
    window.addEventListener('easehub_payment_submitted', handleStatusUpdate);
    window.addEventListener('easehub_bundles_updated', handleStatusUpdate);
    return () => {
      window.removeEventListener('easehub_campus_status_updated', handleStatusUpdate);
      window.removeEventListener('easehub_order_status_updated', handleStatusUpdate);
      window.removeEventListener('easehub_requests_updated', handleStatusUpdate);
      window.removeEventListener('easehub_campus_nominated', handleStatusUpdate);
      window.removeEventListener('easehub_site_settings_updated', handleStatusUpdate);
      window.removeEventListener('easehub_payment_submitted', handleStatusUpdate);
      window.removeEventListener('easehub_bundles_updated', handleStatusUpdate);
    };
  }, []);

  const saveBookingsToStorage = (updatedList: StudentBooking[]) => {
    setBookings(updatedList);
    try {
      localStorage.setItem('easehub_admin_bookings', JSON.stringify(updatedList));
    } catch {
      // Storage unavailable
    }
  };

  // --- ADMIN AUTH HANDLERS ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin credentials: admin@easehub.in / admin123 or easehub2026
    const validEmail = loginEmail.trim().toLowerCase() === 'admin@easehub.in' || loginEmail.trim().toLowerCase() === 'admin';
    const validPass = loginPassword === 'admin123' || loginPassword === 'easehub2026' || loginPassword === 'admin';

    if (validEmail && validPass) {
      sessionStorage.setItem('easehub_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setLoginError('');
      loadData();
    } else {
      setLoginError('Invalid Administrator credentials. Hint: admin@easehub.in / admin123');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('easehub_admin_auth');
    setIsAdminAuthenticated(false);
  };

  // KPIs
  const totalGrossRevenue = transactions
    .filter((t) => t.status === 'verified')
    .reduce((sum, t) => sum + t.amount, 0) +
    bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.amount, 0);

  const pendingPaymentsCount = transactions.filter((t) => t.status === 'pending_verification').length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_service').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  // --- SERVICE ACTIONS ---
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    ServiceRepository.saveService(editingService);
    setEditingService(null);
    setServices(ServiceRepository.getServicesSync());
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    const slug = newServiceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const numPrice = parseFloat(newServicePrice.replace(/[^0-9.]/g, '')) || 0;

    const serviceToSave: Service = {
      id: `srv_${Date.now()}`,
      slug: slug || `service-${Date.now()}`,
      name: newServiceName,
      shortDescription: newServiceShortDesc || 'Verified student campus service',
      fullDescription: newServiceShortDesc || 'Verified campus living service with doorstep delivery.',
      category: newServiceCategory,
      startingPrice: `₹${numPrice}`,
      numericStartingPrice: numPrice,
      pricingUnit: newServiceUnit || 'month',
      badgeText: newServiceBadge || 'Verified',
      iconName: newServiceCategory === 'pg' ? 'Home' : newServiceCategory === 'mess' ? 'Utensils' : 'Shirt',
      popularFeatures: ['Campus Doorstep Pickup', 'Student Verified Rate', 'Instant WhatsApp Support'],
      tags: ['Verified', newServiceCategory],
      metrics: {
        providersAvailable: 3,
        avgDeliveryTime: '30 mins',
        studentSatisfaction: '98%',
        ratingScore: 4.8,
        reviewCount: 42,
      },
      accentColor: 'blue',
      available: true,
      availabilityStatus: 'available',
      campusIds: ['rungta-bhilai', 'csvtu-bhilai'],
      isFeatured: true,
    };

    ServiceRepository.saveService(serviceToSave);
    setIsAddingService(false);
    setNewServiceName('');
    setNewServiceShortDesc('');
    setNewServicePrice('500');
    setNewServiceUnit('service');
    setNewServiceBadge('Verified');
    setServices(ServiceRepository.getServicesSync());
  };

  const handleQuickToggleAvailability = (service: Service) => {
    const nextStatus: Record<AvailabilityStatus, AvailabilityStatus> = {
      available: 'limited',
      limited: 'unavailable',
      unavailable: 'available',
      coming_soon: 'available',
    };
    const updated: Service = {
      ...service,
      availabilityStatus: nextStatus[service.availabilityStatus] || 'available',
      available: nextStatus[service.availabilityStatus] !== 'unavailable',
    };
    ServiceRepository.saveService(updated);
    setServices(ServiceRepository.getServicesSync());
  };

  const handleResetServices = () => {
    if (window.confirm('Reset all campus services back to default factory pricing and configurations?')) {
      ServiceRepository.resetServices();
      setServices(ServiceRepository.getServicesSync());
    }
  };

  // --- COMBOS & SMART PASSES CRUD HANDLERS ---
  const handleOpenAddBundle = () => {
    setEditingBundle(null);
    setBundleForm({
      id: `combo_${Date.now()}`,
      name: '',
      tagline: '',
      originalPrice: 15000,
      bundlePrice: 9999,
      savingsPercentage: 33,
      billingPeriod: 'semester',
      badge: 'POPULAR COMBO',
      servicesIncluded: 'AC Accommodation, 3x Homestyle Meals, Express Laundry',
      perks: 'High-speed Wi-Fi, Zero Move-in Deposit, Priority Repairs',
    });
    setIsAddingBundle(true);
  };

  const handleOpenEditBundle = (b: Bundle) => {
    setEditingBundle(b);
    setBundleForm({
      id: b.id,
      name: b.name,
      tagline: b.tagline,
      originalPrice: b.originalPrice,
      bundlePrice: b.bundlePrice,
      savingsPercentage: b.savingsPercentage,
      billingPeriod: b.billingPeriod,
      badge: b.badge || 'CAMPUS PASS',
      servicesIncluded: b.servicesIncluded.join(', '),
      perks: b.perks.join(', '),
    });
    setIsAddingBundle(true);
  };

  const handleSaveBundleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleForm.name.trim()) return;

    const original = Number(bundleForm.originalPrice) || 10000;
    const bundleP = Number(bundleForm.bundlePrice) || 6999;
    const savings = original > bundleP ? Math.round(((original - bundleP) / original) * 100) : 0;

    const bundleToSave: Bundle = {
      id: bundleForm.id || `combo_${Date.now()}`,
      name: bundleForm.name.trim(),
      tagline: bundleForm.tagline.trim() || 'Verified all-in-one student pass',
      originalPrice: original,
      bundlePrice: bundleP,
      savingsPercentage: savings || Number(bundleForm.savingsPercentage) || 25,
      billingPeriod: bundleForm.billingPeriod.trim() || 'month',
      badge: bundleForm.badge.trim() || 'Student Verified Pass',
      isPopular: Boolean(bundleForm.badge.toLowerCase().includes('popular') || savings >= 30),
      servicesIncluded: bundleForm.servicesIncluded
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      perks: bundleForm.perks
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    };

    BundleRepository.saveBundle(bundleToSave);
    setBundles(BundleRepository.getBundlesSync());
    setIsAddingBundle(false);
    setEditingBundle(null);
    setBundleToast(`Combo pass "${bundleToSave.name}" successfully updated & live across storefront!`);
    setTimeout(() => setBundleToast(null), 3500);
  };

  const handleDeleteBundle = (id: string, name: string) => {
    if (window.confirm(`Delete combo pass "${name}"? It will be removed immediately from student catalog.`)) {
      BundleRepository.deleteBundle(id);
      setBundles(BundleRepository.getBundlesSync());
      setBundleToast(`Combo "${name}" removed from catalog.`);
      setTimeout(() => setBundleToast(null), 3000);
    }
  };

  const handleResetBundles = () => {
    if (window.confirm('Reset all combo passes back to factory default student bundles?')) {
      BundleRepository.resetBundles();
      setBundles(BundleRepository.getBundlesSync());
      setBundleToast('Combo passes reset to factory configuration.');
      setTimeout(() => setBundleToast(null), 3000);
    }
  };

  // --- BOOKING CONFIRMATION WITH EMAIL DISPATCH ---
  const handleConfirmBookingAndSendEmail = (booking: StudentBooking) => {
    // 1. Update Booking Status to Confirmed
    const updated = bookings.map((b) => (b.id === booking.id ? { ...b, status: 'confirmed' as const } : b));
    saveBookingsToStorage(updated);
    ServiceRequestRepository.updateRequestStatusByAdmin(
      booking.id,
      'confirmed',
      'Booking officially confirmed by Campus Administration. Dispatch scheduled.'
    );

    // 2. Dispatch Confirmation Email via CampusStateService
    CampusStateService.sendBookingConfirmationEmail({
      studentName: booking.studentName,
      studentEmail: booking.studentEmail || `${booking.studentPhone}@easehub.in`,
      studentPhone: booking.studentPhone,
      bookingId: booking.id,
      serviceTitle: booking.serviceTitle,
      plan: booking.planOrOption,
      amount: booking.amount,
      roomOrHostel: booking.roomOrHostel,
    });

    // 3. Show Toast Feedback
    setEmailNotificationToast(
      `Booking ${booking.id} CONFIRMED! Notification email sent to ${booking.studentEmail || booking.studentPhone}.`
    );
    setTimeout(() => setEmailNotificationToast(null), 5000);
  };

  const handleUpdateBookingStatus = (id: string, newStatus: StudentBooking['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    saveBookingsToStorage(updated);
    ServiceRequestRepository.updateRequestStatusByAdmin(
      id,
      newStatus === 'in_service' ? 'accepted' : newStatus,
      `Status marked as ${newStatus.toUpperCase()} by Operations HQ.`
    );
  };

  // --- WEBSITE DETAILS / SETTINGS ACTIONS ---
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    SiteSettingsService.saveSettings(siteSettings);
    // Automatically synchronize UPI Gateway settings
    PaymentService.updateGatewaySettings({
      ...gatewaySettings,
      adminUpiId: siteSettings.upiId,
      payeeName: siteSettings.payeeName,
      qrImageUrl: siteSettings.qrImageUrl,
      supportPhone: siteSettings.supportPhone,
    });
    setGatewaySettings(PaymentService.getGatewaySettings());
    setSiteSettingsSaved(true);
    setTimeout(() => setSiteSettingsSaved(false), 3500);
  };

  const handleResetSiteSettings = () => {
    if (window.confirm('Reset all website branding, hero headlines, and settings back to original EaseHub platform defaults?')) {
      const def = SiteSettingsService.resetToDefaults();
      setSiteSettings(def);
      setSiteSettingsSaved(true);
      setTimeout(() => setSiteSettingsSaved(false), 3000);
    }
  };

  const handleExportSpreadsheetCSV = () => {
    const headers = [
      'Booking ID',
      'Student Name',
      'Phone Number',
      'Email ID',
      'Hostel Block / Room',
      'Service Name',
      'Category',
      'Selected Plan',
      'Amount (INR)',
      'Status',
      'UPI UTR Reference',
      'Booking Date',
      'Notes',
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.id}"`,
      `"${(b.studentName || '').replace(/"/g, '""')}"`,
      `"${b.studentPhone || ''}"`,
      `"${b.studentEmail || ''}"`,
      `"${(b.roomOrHostel || '').replace(/"/g, '""')}"`,
      `"${(b.serviceTitle || '').replace(/"/g, '""')}"`,
      `"${(b.category || '').toUpperCase()}"`,
      `"${(b.planOrOption || '').replace(/"/g, '""')}"`,
      b.amount,
      `"${b.status.toUpperCase()}"`,
      `"${b.utrNumber || ''}"`,
      `"${b.createdAt}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EaseHub_Student_Bookings_Spreadsheet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.studentName || !newBooking.studentPhone) return;

    const created: StudentBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: newBooking.studentName,
      studentPhone: newBooking.studentPhone,
      studentEmail: newBooking.studentEmail || `${newBooking.studentPhone}@easehub.in`,
      roomOrHostel: newBooking.roomOrHostel || 'Campus Hostel',
      serviceTitle: newBooking.serviceTitle || 'Campus Service',
      category: newBooking.category || 'pg',
      planOrOption: newBooking.planOrOption || 'Standard',
      amount: Number(newBooking.amount) || 0,
      status: (newBooking.status as any) || 'confirmed',
      createdAt: new Date().toISOString(),
      notes: newBooking.notes,
    };

    saveBookingsToStorage([created, ...bookings]);
    setIsAddingBooking(false);
    setNewBooking({
      studentName: '',
      studentPhone: '',
      studentEmail: '',
      roomOrHostel: '',
      serviceTitle: '',
      category: 'pg',
      planOrOption: 'Standard Plan',
      amount: 1000,
      status: 'pending',
    });
  };

  const handleWhatsAppStudent = (booking: StudentBooking) => {
    const cleanPhone = booking.studentPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const msg = `Hello ${booking.studentName}! 👋\n` +
      `This is EaseHub Central Operations regarding your registration *${booking.id}* for *${booking.serviceTitle}* (${booking.planOrOption}).\n\n` +
      `✅ Status: *${booking.status.toUpperCase()}*\n` +
      `🏠 Hostel/Room: ${booking.roomOrHostel}\n` +
      `💰 Amount: ₹${booking.amount}\n\n` +
      `We will contact you shortly to coordinate check-in or delivery. Please let us know if you have any questions!`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // --- LIVE TRACKING & LOGISTICS HANDLERS ---
  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    CampusStateService.updateMessState(messState);
    CampusStateService.updateLaundryState(laundryState);
    setTrackingSavedToast(true);
    setTimeout(() => setTrackingSavedToast(false), 3000);
  };

  // --- PG VACANCY HANDLER ---
  const handleUpdatePgVacancy = (pgId: string, vacantCount: number) => {
    const updated = CampusStateService.updatePgVacancy(pgId, vacantCount, [
      `Room 204: ${vacantCount > 1 ? '2 Beds' : '1 Bed'} Vacant`,
      vacantCount > 2 ? 'Room 105: 1 Bed Vacant' : 'Single Room: Sold Out',
    ]);
    setPgVacancies([...updated]);
  };

  // --- PAYMENT VERIFICATION ACTIONS ---
  const handleUpdatePaymentStatus = (id: string, status: PaymentStatus) => {
    PaymentService.updateTransactionStatus(id, status, `Reviewed by Admin on ${new Date().toLocaleDateString()}`);
    setTransactions([...PaymentService.getTransactions()]);
  };

  // --- GATEWAY ACTIONS ---
  const handleSaveGatewaySettings = (e: React.FormEvent) => {
    e.preventDefault();
    PaymentService.updateGatewaySettings(gatewaySettings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // --- BROADCAST ACTIONS ---
  const handleSaveBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('easehub_campus_broadcast', broadcastText);
      localStorage.setItem('easehub_broadcast_active', String(isBroadcastActive));
      window.dispatchEvent(new CustomEvent('easehub_broadcast_updated'));
      setBroadcastSaved(true);
      setTimeout(() => setBroadcastSaved(false), 3000);
    } catch {
      // Storage unavailable
    }
  };

  // Filtered lists
  const filteredServices = services.filter((s) => {
    const matchCat = serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter;
    const matchSearch =
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const filteredTransactions = transactions.filter((t) => {
    if (paymentFilter === 'all') return true;
    return t.status === paymentFilter;
  });

  // Unified Real-Time Activity Events across whole website
  const activityEvents: Array<{
    id: string;
    type: 'order' | 'payment' | 'nomination';
    title: string;
    subtitle: string;
    actor: string;
    contact: string;
    location: string;
    amount?: number;
    status: string;
    statusBadgeColor: string;
    timestamp: string;
    sourceObj: any;
  }> = [
    // Bookings & Cart Orders
    ...bookings.map((b) => ({
      id: b.id,
      type: 'order' as const,
      title: b.serviceTitle,
      subtitle: `${b.planOrOption}${b.utrNumber ? ` • UTR: ${b.utrNumber}` : ''}`,
      actor: b.studentName,
      contact: `${b.studentPhone}${b.studentEmail ? ` • ${b.studentEmail}` : ''}`,
      location: b.roomOrHostel || 'Campus Hostel',
      amount: b.amount,
      status: b.status,
      statusBadgeColor:
        b.status === 'confirmed'
          ? '#10B981'
          : b.status === 'in_service'
          ? '#3B82F6'
          : b.status === 'completed'
          ? '#059669'
          : b.status === 'cancelled'
          ? '#EF4444'
          : '#F59E0B',
      timestamp: b.createdAt,
      sourceObj: b,
    })),
    // UPI Transactions
    ...transactions.map((t) => ({
      id: t.id,
      type: 'payment' as const,
      title: `UPI Payment • ${t.itemOrServiceTitle}`,
      subtitle: `UTR: ${t.utrNumber || 'Awaiting UTR'} • VPA: ${t.upiIdUsed || gatewaySettings.adminUpiId}`,
      actor: t.payerName,
      contact: `${t.payerPhone}${t.payerEmail ? ` • ${t.payerEmail}` : ''}`,
      location: t.payerHostel || 'Campus Block',
      amount: t.amount,
      status: t.status === 'verified' ? 'verified' : t.status === 'rejected' ? 'rejected' : 'pending_verification',
      statusBadgeColor: t.status === 'verified' ? '#10B981' : t.status === 'rejected' ? '#EF4444' : '#F59E0B',
      timestamp: t.timestamp,
      sourceObj: t,
    })),
    // Campus Nominations
    ...campusNominations.map((nom: any) => ({
      id: nom.id || `NOM-${Date.now()}`,
      type: 'nomination' as const,
      title: `Campus Hub Requested: ${nom.collegeName}`,
      subtitle: `Cohort: ${nom.studentCohort || 'Hostellers'} • City: ${nom.city || 'Campus'}`,
      actor: nom.collegeName,
      contact: nom.email,
      location: `${nom.collegeName}, ${nom.city}`,
      status: 'review_pending',
      statusBadgeColor: '#8B5CF6',
      timestamp: nom.createdAt || new Date().toISOString(),
      sourceObj: nom,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredActivities = activityEvents.filter((ev) => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'orders') return ev.type === 'order';
    if (activityFilter === 'payments') return ev.type === 'payment';
    if (activityFilter === 'nominations') return ev.type === 'nomination';
    return true;
  });

  // Modern Glassmorphic Container Style (Option C)
  const glassCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
    padding: '1.5rem',
  };

  const navTabStyle = (tab: AdminTab): React.CSSProperties => {
    const isActive = activeTab === tab;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.65rem 1.15rem',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: isActive ? 700 : 500,
      cursor: 'pointer',
      border: isActive ? '1px solid #3B82F6' : '1px solid transparent',
      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
      color: isActive ? '#60A5FA' : '#94A3B8',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    };
  };

  // =========================================================================
  // VIEW 1: ADMIN LOGIN GATE (Secured Specific Login)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#070C18',
          color: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(7, 12, 24, 0) 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            ...glassCardStyle,
            maxWidth: '440px',
            width: '100%',
            padding: '2.5rem 2rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: '#60A5FA',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Lock size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.4rem', color: '#FFFFFF' }}>
              EaseHub Operations HQ
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
              Authorized campus administration & provider access portal
            </p>
          </div>

          {loginError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Admin Email ID
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  required
                  placeholder="admin@easehub.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Master Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.85rem 1.5rem',
                backgroundColor: '#2563EB',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              Enter Operations Console
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a
              href="#home"
              style={{ fontSize: '0.8rem', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s ease' }}
            >
              ← Return to EaseHub Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL ADMIN OPERATIONS CONSOLE (Secured Post-Login)
  // =========================================================================
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070C18',
        color: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        paddingTop: '5.5rem',
        paddingBottom: '5rem',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Email Dispatch Toast Banner */}
        {emailNotificationToast && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.9rem 1.25rem',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10B981',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="#10B981" />
              <span>{emailNotificationToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotificationToast(null)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Top Operational Ribbon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#60A5FA',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                <Shield size={13} />
                <span>EaseHub Central Operations HQ</span>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#10B981',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                  }}
                />
                Logged In as Operations Lead
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Admin Management Console
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.25rem 0 0' }}>
              Manage PG room vacancies, live mess menus, doorstep laundry pipeline, and verify student registrations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <a
              href="#home"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#E2E8F0',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Home size={14} />
              <span>Storefront</span>
            </a>
            <button
              type="button"
              onClick={loadData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1rem',
                backgroundColor: '#2563EB',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              <span>Sync Live</span>
            </button>
            <button
              type="button"
              onClick={handleAdminLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#F87171',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div style={glassCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Gross Revenue
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={17} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>
              ₹{totalGrossRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.3rem' }}>
              Confirmed bookings & verified UPI
            </div>
          </div>

          <div style={glassCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Active Bookings
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={17} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60A5FA' }}>
              {activeBookingsCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.3rem' }}>
              {pendingBookingsCount} requests waiting review
            </div>
          </div>

          <div style={glassCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Mess Delivery SLA
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Utensils size={17} />
              </div>
            </div>
            <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#F59E0B' }}>
              {messState.estimatedTime}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.3rem' }}>
              Current Stage: {messState.stageLabel}
            </div>
          </div>

          <div style={glassCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Pending Payments
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={17} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F87171' }}>
              {pendingPaymentsCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.3rem' }}>
              Awaiting UPI UTR audit
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button type="button" onClick={() => setActiveTab('overview')} style={navTabStyle('overview')}>
            <Shield size={16} />
            <span>HQ Overview</span>
          </button>
          <button type="button" onClick={() => setActiveTab('activity')} style={navTabStyle('activity')}>
            <Activity size={16} />
            <span>⚡ Live Activity Stream</span>
            {activityEvents.length > 0 && (
              <span style={{ backgroundColor: '#2563EB', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: 800 }}>
                {activityEvents.length}
              </span>
            )}
          </button>
          <button type="button" onClick={() => setActiveTab('content')} style={navTabStyle('content')}>
            <Globe size={16} />
            <span>🌐 Edit Website Details</span>
          </button>
          <button type="button" onClick={() => setActiveTab('orders')} style={navTabStyle('orders')}>
            <FileText size={16} />
            <span>Registrations & Pipeline ({bookings.length})</span>
            {pendingBookingsCount > 0 && (
              <span style={{ backgroundColor: '#EF4444', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                {pendingBookingsCount}
              </span>
            )}
          </button>
          <button type="button" onClick={() => setActiveTab('tracking')} style={navTabStyle('tracking')}>
            <Truck size={16} />
            <span>Live Tracking & Menu Updates</span>
          </button>
          <button type="button" onClick={() => setActiveTab('services')} style={navTabStyle('services')}>
            <Layers size={16} />
            <span>PG, Mess & Laundry Options ({services.length})</span>
          </button>
          <button type="button" onClick={() => setActiveTab('combos')} style={navTabStyle('combos')}>
            <Sparkles size={16} />
            <span>🎁 Smart Combos & Passes ({bundles.length})</span>
          </button>
          <button type="button" onClick={() => setActiveTab('payments')} style={navTabStyle('payments')}>
            <DollarSign size={16} />
            <span>UPI Payments & UTR</span>
          </button>
          <button type="button" onClick={() => setActiveTab('gateway')} style={navTabStyle('gateway')}>
            <QrCode size={16} />
            <span>UPI QR Config</span>
          </button>
          <button type="button" onClick={() => setActiveTab('broadcast')} style={navTabStyle('broadcast')}>
            <Megaphone size={16} />
            <span>Broadcast Notice</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: HQ OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Quick Actions */}
              <div style={glassCardStyle}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#FFFFFF' }}>
                  Central Action Shortcuts
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tracking')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '12px',
                      color: '#E2E8F0',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ color: '#F59E0B' }}><Truck size={20} /></div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Update Mess / Laundry Stage</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Dispatch riders or mark food preparing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '12px',
                      color: '#E2E8F0',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ color: '#10B981' }}><CheckCircle size={20} /></div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Confirm Pending Bookings</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Sends instant email & WhatsApp to student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      borderRadius: '12px',
                      color: '#E2E8F0',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ color: '#60A5FA' }}><Plus size={20} /></div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Add PG, Mess or Laundry Plan</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Adjust vacant beds and meal pricing</span>
                  </button>
                </div>
              </div>

              {/* Pending Bookings Waiting for Confirmation */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                    Registrations Awaiting Confirmation
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View All ({bookings.length}) →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {bookings.filter(b => b.status === 'pending').slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#F8FAFC' }}>{b.studentName}</span>
                          <span style={{ fontSize: '0.7rem', color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                            PENDING
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                          {b.serviceTitle} • {b.roomOrHostel} • {b.planOrOption}
                        </div>
                        {b.utrNumber && (
                          <div style={{ fontSize: '0.72rem', color: '#60A5FA', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                            UPI UTR: {b.utrNumber}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: '#10B981', fontSize: '1rem', marginRight: '0.5rem' }}>
                          ₹{b.amount}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConfirmBookingAndSendEmail(b)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.5rem 0.85rem',
                            backgroundColor: '#10B981',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <CheckCircle size={14} />
                          <span>Confirm & Send Mail</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {bookings.filter(b => b.status === 'pending').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                      🎉 All student registrations have been reviewed and confirmed!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: PG Vacancies & Today's Menu Snapshot */}
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* PG Vacancy Overview */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                    Live PG Vacancies
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Edit →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pgVacancies.map((pg) => (
                    <div
                      key={pg.pgId}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#F1F5F9' }}>{pg.pgName}</span>
                        <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.8rem' }}>
                          {pg.vacantBeds} Beds Vacant
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        {pg.roomTypesAvailable.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Mess Menu */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                    Today's Mess Menu
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tracking')}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Change →
                  </button>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#F59E0B' }}>Lunch:</strong> {messState.todayMenu.lunch}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                  <strong style={{ color: '#60A5FA' }}>Dinner:</strong> {messState.todayMenu.dinner}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REGISTRATIONS & BOOKING PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(['all', 'pending', 'confirmed', 'in_service', 'completed', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setBookingFilter(status)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: bookingFilter === status ? 700 : 500,
                      backgroundColor: bookingFilter === status ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: bookingFilter === status ? '#60A5FA' : '#94A3B8',
                      border: bookingFilter === status ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleExportSpreadsheetCSV}
                  title="Export live student registrations to CSV / Excel spreadsheet"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 1.1rem',
                    backgroundColor: '#10B981',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <FileText size={16} />
                  <span>📥 Export Spreadsheet (.CSV)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingBooking(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 1.1rem',
                    backgroundColor: '#2563EB',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={16} />
                  <span>Add Walk-In / Phone Request</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div style={{ ...glassCardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Student & Contact</th>
                      <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Service & Plan</th>
                      <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Hostel / Room</th>
                      <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Amount & UTR</th>
                      <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Status</th>
                      <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>One-Click Confirm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                      >
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: 800, color: '#F1F5F9' }}>{b.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#60A5FA' }}>{b.studentEmail || `${b.studentPhone}@easehub.in`}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{b.studentPhone}</div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: 600, color: '#E2E8F0' }}>{b.serviceTitle}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{b.planOrOption}</div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: '#CBD5E1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={13} color="#94A3B8" />
                            <span>{b.roomOrHostel}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>
                            ₹{b.amount}
                          </span>
                          {b.utrNumber && (
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'monospace' }}>
                              UTR: {b.utrNumber}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor:
                                b.status === 'confirmed'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : b.status === 'pending'
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : b.status === 'in_service'
                                  ? 'rgba(59, 130, 246, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                              color:
                                b.status === 'confirmed'
                                  ? '#10B981'
                                  : b.status === 'pending'
                                  ? '#F59E0B'
                                  : b.status === 'in_service'
                                  ? '#60A5FA'
                                  : '#EF4444',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_service">In Service</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {b.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleConfirmBookingAndSendEmail(b)}
                                title="Confirm booking and dispatch official confirmation email"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.45rem 0.75rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#10B981',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                <Mail size={12} />
                                <span>Confirm & Email</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleWhatsAppStudent(b)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.45rem 0.65rem',
                                borderRadius: '6px',
                                backgroundColor: '#22C55E',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Phone size={12} />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manual Booking Modal */}
            {isAddingBooking && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '1rem',
                }}
              >
                <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Record Student Booking</h3>
                    <button type="button" onClick={() => setIsAddingBooking(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleAddManualBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Student Name *</label>
                        <input type="text" required value={newBooking.studentName} onChange={(e) => setNewBooking({ ...newBooking, studentName: e.target.value })} style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Phone *</label>
                        <input type="tel" required placeholder="9827123456" value={newBooking.studentPhone} onChange={(e) => setNewBooking({ ...newBooking, studentPhone: e.target.value })} style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Student Email (for instant confirmation)</label>
                      <input type="email" placeholder="student@rungta.ac.in" value={newBooking.studentEmail} onChange={(e) => setNewBooking({ ...newBooking, studentEmail: e.target.value })} style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Hostel / Room Address *</label>
                      <input type="text" required placeholder="e.g. Hostel Block B, Room 104" value={newBooking.roomOrHostel} onChange={(e) => setNewBooking({ ...newBooking, roomOrHostel: e.target.value })} style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Service Title</label>
                        <input type="text" placeholder="e.g. Royal Double Sharing PG" value={newBooking.serviceTitle} onChange={(e) => setNewBooking({ ...newBooking, serviceTitle: e.target.value })} style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Amount (₹)</label>
                        <input type="number" value={newBooking.amount} onChange={(e) => setNewBooking({ ...newBooking, amount: Number(e.target.value) })} style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setIsAddingBooking(false)} style={{ padding: '0.6rem 1.1rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.82rem', cursor: 'pointer' }}>Cancel</button>
                      <button type="submit" style={{ padding: '0.6rem 1.1rem', backgroundColor: '#2563EB', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>Confirm Booking</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LIVE TRACKING & TODAY'S MENU UPDATES */}
        {/* ========================================================================= */}
        {activeTab === 'tracking' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
            {trackingSavedToast && (
              <div style={{ gridColumn: 'span 12', padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                <CheckCircle size={18} />
                <span>Campus tracking & menu status updated successfully! Students can now see live updates.</span>
              </div>
            )}
            {/* Left: Mess Food Delivery Tracking & Menu */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Utensils size={20} color="#F59E0B" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Daily Mess Live Tracker & Menu
                  </h3>
                </div>

                <form onSubmit={handleSaveTracking} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Current Delivery Stage (Seen by Students Live)
                    </label>
                    <select
                      value={messState.currentStage}
                      onChange={(e) => {
                        const stage = e.target.value as MessLiveState['currentStage'];
                        const labels: Record<MessLiveState['currentStage'], { label: string; desc: string }> = {
                          kitchen_preparing: { label: 'Chef Preparing Thali', desc: 'Fresh chapatis and hot curries are being prepared in the sanitized kitchen.' },
                          packaging: { label: 'Hygienically Packed', desc: 'Meals placed in thermal heat-retention boxes and sealed for hostel transit.' },
                          out_for_delivery: { label: 'Out for Hostel Delivery', desc: 'Campus rider Rahul is on the way to Hostel Blocks B & C.' },
                          arrived: { label: 'Arrived at Hostel Gate / Desk', desc: 'Food box ready for collection at your hostel common area desk.' },
                        };
                        setMessState({
                          ...messState,
                          currentStage: stage,
                          stageLabel: labels[stage].label,
                          stageDescription: labels[stage].desc,
                        });
                      }}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }}
                    >
                      <option value="kitchen_preparing">🍳 Stage 1: Kitchen Preparing</option>
                      <option value="packaging">📦 Stage 2: Packaging in Thermal Boxes</option>
                      <option value="out_for_delivery">🛵 Stage 3: Out for Hostel Delivery</option>
                      <option value="arrived">✅ Stage 4: Arrived at Hostel Desk</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Estimated Arrival Time Countdown
                    </label>
                    <input
                      type="text"
                      value={messState.estimatedTime}
                      onChange={(e) => setMessState({ ...messState, estimatedTime: e.target.value })}
                      placeholder="e.g. 8:30 PM (in 15 mins)"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                      Today's Live Menu Configuration
                    </h4>
                    <div style={{ marginBottom: '0.85rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.25rem' }}>
                        Lunch Thali Menu
                      </label>
                      <textarea
                        rows={2}
                        value={messState.todayMenu.lunch}
                        onChange={(e) => setMessState({ ...messState, todayMenu: { ...messState.todayMenu, lunch: e.target.value } })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.25rem' }}>
                        Dinner Thali Menu
                      </label>
                      <textarea
                        rows={2}
                        value={messState.todayMenu.dinner}
                        onChange={(e) => setMessState({ ...messState, todayMenu: { ...messState.todayMenu, dinner: e.target.value } })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.7rem 1.25rem',
                      backgroundColor: '#2563EB',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Save size={15} />
                    <span>Publish Mess Status Live</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Doorstep Laundry Process & PG Vacancies */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Laundry Tracker */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Shirt size={20} color="#60A5FA" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Doorstep Laundry Stage Controller
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Current Laundry Stage (1-5)
                    </label>
                    <select
                      value={laundryState.currentStage}
                      onChange={(e) => {
                        const stg = Number(e.target.value) as LaundryLiveState['currentStage'];
                        const stageLabels: Record<number, { label: string; desc: string }> = {
                          1: { label: 'Order Confirmed & Pickup Scheduled', desc: 'Rider assigned for hostel room pickup.' },
                          2: { label: 'Picked Up by Logistics Pilot', desc: 'Clothes bag collected, weighed & tagged.' },
                          3: { label: 'In Washing & Sanitization', desc: 'Treated with anti-bacterial fabric conditioner in front-load machines.' },
                          4: { label: 'Steam Ironing & Hygienic Packing', desc: 'Wrinkle-free steam press and vacuum folded.' },
                          5: { label: 'Out for Doorstep Delivery', desc: 'Dispatched to Hostel Room.' },
                        };
                        setLaundryState({
                          ...laundryState,
                          currentStage: stg,
                          stageLabel: stageLabels[stg].label,
                          stageDescription: stageLabels[stg].desc,
                        });
                      }}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }}
                    >
                      <option value={1}>1. Scheduled for Pickup</option>
                      <option value={2}>2. Collected from Room</option>
                      <option value={3}>3. Washing & Sanitization</option>
                      <option value={4}>4. Steam Ironing & Packing</option>
                      <option value={5}>5. Out for Doorstep Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Expected Delivery Time
                    </label>
                    <input
                      type="text"
                      value={laundryState.estimatedDelivery}
                      onChange={(e) => setLaundryState({ ...laundryState, estimatedDelivery: e.target.value })}
                      placeholder="e.g. Tomorrow by 5:30 PM"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#60A5FA', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveTracking}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.7rem 1.25rem',
                      backgroundColor: '#10B981',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Save size={15} />
                    <span>Update Laundry Status Live</span>
                  </button>
                </div>
              </div>

              {/* PG Vacancy Real-time Controller */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Home size={18} color="#A855F7" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Live PG & Hostel Vacant Rooms
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pgVacancies.map((pg) => (
                    <div
                      key={pg.pgId}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#F1F5F9' }}>{pg.pgName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{pg.totalRooms} Total Rooms Available</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Vacant Beds:</span>
                        <input
                          type="number"
                          min={0}
                          max={pg.totalRooms}
                          value={pg.vacantBeds}
                          onChange={(e) => handleUpdatePgVacancy(pg.pgId, Number(e.target.value))}
                          style={{
                            width: '60px',
                            padding: '0.35rem 0.5rem',
                            backgroundColor: '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            color: '#10B981',
                            fontWeight: 800,
                            textAlign: 'center',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* FULL WIDTH: INDIVIDUAL STUDENT PIPELINE CONTROLLER (PG / MESS / LAUNDRY)  */}
            {/* ========================================================================= */}
            <div style={{ gridColumn: 'span 12', ...glassCardStyle }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                      Student-Wise Live Fulfillment Pipelines
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      Advance stages in real-time. Students' Live Trackers update automatically.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>
                    {trackableOrders.length} Active Trackable Orders
                  </span>
                </div>
              </div>

              {trackableOrders.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                  No active student orders found.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <th style={{ padding: '0.85rem 1.1rem', color: '#94A3B8', fontWeight: 700 }}>Order & Service</th>
                        <th style={{ padding: '0.85rem 1.1rem', color: '#94A3B8', fontWeight: 700 }}>Student & Room</th>
                        <th style={{ padding: '0.85rem 1.1rem', color: '#94A3B8', fontWeight: 700 }}>Category</th>
                        <th style={{ padding: '0.85rem 1.1rem', color: '#94A3B8', fontWeight: 700 }}>Current Stage</th>
                        <th style={{ padding: '0.85rem 1.1rem', color: '#94A3B8', fontWeight: 700 }}>Advance Fulfillment Pipeline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackableOrders.map((order) => {
                        const isPg = order.kind === 'pg';
                        const isMess = order.kind === 'mess';

                        const pgStagesList = [
                          { key: 'visit_scheduled', label: '1. Visit Scheduled' },
                          { key: 'visit_completed', label: '2. Inspected' },
                          { key: 'token_paid', label: '3. Token Paid' },
                          { key: 'kyc_verified', label: '4. KYC Verified' },
                          { key: 'keys_handed_over', label: '5. Keys Handover' },
                          { key: 'resident_active', label: '6. Active Resident' },
                        ];

                        const messStagesList = [
                          { key: 'kitchen_prep', label: '1. Cooking' },
                          { key: 'packed_thermal', label: '2. Packed' },
                          { key: 'out_for_delivery', label: '3. Out for Delivery' },
                          { key: 'arrived_at_gate', label: '4. At Gate' },
                          { key: 'delivered', label: '5. Delivered' },
                        ];

                        const laundryStagesList = [
                          { key: 'pickup_scheduled', label: '1. Pickup Sched' },
                          { key: 'picked_up', label: '2. Weighed' },
                          { key: 'in_wash', label: '3. Washing' },
                          { key: 'steam_ironing', label: '4. Steam Iron' },
                          { key: 'out_for_delivery', label: '5. Out for Delivery' },
                          { key: 'delivered', label: '6. Delivered' },
                        ];

                        const activeStages = isPg ? pgStagesList : isMess ? messStagesList : laundryStagesList;

                        return (
                          <tr key={order.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '0.85rem 1.1rem' }}>
                              <div style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>#{order.id}</div>
                              <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>{order.serviceTitle}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{order.packageName}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1.1rem' }}>
                              <div style={{ fontWeight: 700, color: '#F1F5F9' }}>{order.studentName}</div>
                              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{order.hostelRoom}</div>
                              <div style={{ fontSize: '0.7rem', color: '#60A5FA' }}>{order.studentPhone}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1.1rem' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: isPg
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : isMess
                                    ? 'rgba(245, 158, 11, 0.15)'
                                    : 'rgba(6, 182, 212, 0.15)',
                                  color: isPg ? '#10B981' : isMess ? '#F59E0B' : '#06B6D4',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {order.kind}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1.1rem' }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: '#38BDF8',
                                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '6px',
                                  display: 'inline-block',
                                }}
                              >
                                {order.currentStage.replace(/_/g, ' ').toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1.1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {activeStages.map((stg) => {
                                  const isCurrent = order.currentStage === stg.key;
                                  return (
                                    <button
                                      key={stg.key}
                                      type="button"
                                      onClick={() => {
                                        TrackingBackendService.updateOrderStatus(order.id, stg.key as any);
                                        setTrackableOrders(TrackingBackendService.getAllOrders());
                                      }}
                                      style={{
                                        padding: '0.25rem 0.55rem',
                                        fontSize: '0.7rem',
                                        fontWeight: isCurrent ? 800 : 500,
                                        backgroundColor: isCurrent ? '#2563EB' : 'rgba(255, 255, 255, 0.06)',
                                        color: isCurrent ? '#FFFFFF' : '#94A3B8',
                                        border: isCurrent ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                      }}
                                    >
                                      {stg.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PG, MESS & LAUNDRY INVENTORY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type="text"
                    placeholder="Search PG, Mess or Laundry..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.82rem' }}
                  />
                </div>
                <select
                  value={serviceCategoryFilter}
                  onChange={(e) => setServiceCategoryFilter(e.target.value)}
                  style={{ padding: '0.6rem 1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  <option value="all">All Verticals</option>
                  <option value="pg">PG & Hostels</option>
                  <option value="mess">Daily Mess</option>
                  <option value="laundry">Doorstep Laundry</option>
                  <option value="extra">Extra Services</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={handleResetServices} style={{ padding: '0.6rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  Reset Defaults
                </button>
                <button type="button" onClick={() => setIsAddingService(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', backgroundColor: '#10B981', border: 'none', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={16} />
                  <span>Add PG / Mess Option</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {filteredServices.map((service) => (
                <div key={service.id} style={{ ...glassCardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', textTransform: 'uppercase' }}>
                        {service.category.toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickToggleAvailability(service)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: service.availabilityStatus === 'available' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: service.availabilityStatus === 'available' ? '#10B981' : '#F59E0B',
                        }}
                      >
                        <span>{service.availabilityStatus.toUpperCase()}</span>
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem', color: '#FFFFFF' }}>
                      {service.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 1rem', lineHeight: 1.4 }}>
                      {service.shortDescription}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981' }}>
                        {service.startingPrice}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        / {service.pricingUnit || 'month'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <button
                      type="button"
                      onClick={() => setEditingService(service)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: '#60A5FA', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Edit2 size={13} />
                      <span>Edit Details</span>
                    </button>
                    <a
                      href={`#services/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '0.5rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#94A3B8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Service Modal */}
            {editingService && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Edit Service: {editingService.name}</h3>
                    <button type="button" onClick={() => setEditingService(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Service Title</label>
                      <input type="text" value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Starting Price</label>
                        <input
                          type="text"
                          value={editingService.startingPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
                            setEditingService({
                              ...editingService,
                              startingPrice: val.startsWith('₹') ? val : `₹${val}`,
                              numericStartingPrice: num,
                            });
                          }}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Price Unit</label>
                        <input type="text" value={editingService.pricingUnit || 'month'} onChange={(e) => setEditingService({ ...editingService, pricingUnit: e.target.value })} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Short Description</label>
                      <input type="text" value={editingService.shortDescription} onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setEditingService(null)} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                      <button type="submit" style={{ padding: '0.65rem 1.25rem', backgroundColor: '#2563EB', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Save Service</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Create Service Modal */}
            {isAddingService && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Add New PG or Mess Plan</h3>
                    <button type="button" onClick={() => setIsAddingService(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Service Title *</label>
                      <input type="text" required placeholder="e.g. Deluxe Single AC Hostel Room" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Category</label>
                        <select value={newServiceCategory} onChange={(e) => setNewServiceCategory(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }}>
                          <option value="pg">PG & Hostels</option>
                          <option value="mess">Daily Mess</option>
                          <option value="laundry">Doorstep Laundry</option>
                          <option value="extra">Extra Services</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Starting Price (₹)</label>
                        <input type="text" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Badge Tag</label>
                      <input type="text" placeholder="e.g. Verified, Bestseller, 2 Rooms Left" value={newServiceBadge} onChange={(e) => setNewServiceBadge(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.3rem' }}>Short Tagline</label>
                      <input type="text" placeholder="e.g. Free Wi-Fi, 3 Meals & Attached Washroom" value={newServiceShortDesc} onChange={(e) => setNewServiceShortDesc(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setIsAddingService(false)} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                      <button type="submit" style={{ padding: '0.65rem 1.25rem', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Publish Service</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: UPI PAYMENTS & UTR VERIFICATION */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(['all', 'pending_verification', 'verified', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setPaymentFilter(status)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: paymentFilter === status ? 700 : 500,
                    backgroundColor: paymentFilter === status ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: paymentFilter === status ? '#60A5FA' : '#94A3B8',
                    border: paymentFilter === status ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  {status === 'all' ? 'All Transactions' : status === 'pending_verification' ? 'Pending Review' : status === 'verified' ? 'Verified Settlements' : 'Rejected'}
                </button>
              ))}
            </div>

            <div style={{ ...glassCardStyle, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Student & Service</th>
                    <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>UTR Number</th>
                    <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Amount</th>
                    <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '0.9rem 1.25rem', color: '#94A3B8', fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: '#F1F5F9' }}>{tx.payerName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{tx.itemOrServiceTitle}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#60A5FA', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                          {tx.utrNumber || 'No UTR'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981' }}>₹{tx.amount}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: tx.status === 'verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: tx.status === 'verified' ? '#10B981' : '#F59E0B' }}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {tx.status === 'pending_verification' ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button type="button" onClick={() => handleUpdatePaymentStatus(tx.id, 'verified')} style={{ padding: '0.4rem 0.75rem', backgroundColor: '#10B981', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                              Approve
                            </button>
                            <button type="button" onClick={() => handleUpdatePaymentStatus(tx.id, 'rejected')} style={{ padding: '0.4rem 0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#F87171', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Audited</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: UPI GATEWAY CONFIG & QR */}
        {/* ========================================================================= */}
        {activeTab === 'gateway' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 7' }}>
              <div style={glassCardStyle}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#FFFFFF' }}>Merchant UPI Gateway Setup</h3>
                {settingsSavedMessage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10B981', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                    <CheckCircle size={16} />
                    <span>Settings saved successfully!</span>
                  </div>
                )}
                <form onSubmit={handleSaveGatewaySettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>Receiver UPI ID (VPA) *</label>
                    <input type="text" required value={gatewaySettings.adminUpiId} onChange={(e) => setGatewaySettings({ ...gatewaySettings, adminUpiId: e.target.value })} style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#60A5FA', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>Payee Name</label>
                    <input type="text" value={gatewaySettings.payeeName} onChange={(e) => setGatewaySettings({ ...gatewaySettings, payeeName: e.target.value })} style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>WhatsApp Helpline</label>
                    <input type="text" value={gatewaySettings.supportPhone} onChange={(e) => setGatewaySettings({ ...gatewaySettings, supportPhone: e.target.value })} style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.85rem' }} />
                  </div>
                  <button type="submit" style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', backgroundColor: '#2563EB', border: 'none', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                    <Save size={16} />
                    <span>Save Gateway Settings</span>
                  </button>
                </form>
              </div>
            </div>

            <div style={{ gridColumn: 'span 5' }}>
              <div style={{ ...glassCardStyle, textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#FFFFFF' }}>Live Scannable QR Code</h4>
                <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '16px', display: 'inline-block', marginBottom: '1rem' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(gatewaySettings.adminUpiId)}&pn=${encodeURIComponent(gatewaySettings.payeeName)}&cu=INR&margin=8`}
                    alt={`Scannable UPI QR for ${gatewaySettings.adminUpiId}`}
                    style={{ width: '180px', height: '180px', display: 'block', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10B981', fontSize: '0.95rem' }}>{gatewaySettings.adminUpiId}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.35rem' }}>Scan with GPay / PhonePe / Paytm / BHIM</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: REAL-TIME ACTIVITY STREAM */}
        {/* ========================================================================= */}
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header / Stream Status */}
            <div
              style={{
                ...glassCardStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(37, 99, 235, 0.15)',
                      color: '#60A5FA',
                      border: '1px solid rgba(37, 99, 235, 0.35)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    <Radio size={13} className="easehub-pulse" />
                    LIVE EVENT BUS
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                    Listening to checkouts, UPI payments, and requests
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  ⚡ Real-Time Website Activity Stream
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.25rem 0 0' }}>
                  Complete audit log of all live user activities, registrations, payment verifications, and campus nominations.
                </p>
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(
                  [
                    { key: 'all', label: 'All Activities', count: activityEvents.length },
                    { key: 'orders', label: 'Cart & Orders', count: bookings.length },
                    { key: 'payments', label: 'UPI Payments', count: transactions.length },
                    { key: 'nominations', label: 'Campus Requests', count: campusNominations.length },
                  ] as const
                ).map((f) => {
                  const isSel = activityFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setActivityFilter(f.key)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        fontWeight: isSel ? 700 : 500,
                        backgroundColor: isSel ? '#2563EB' : 'rgba(255, 255, 255, 0.05)',
                        border: isSel ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isSel ? '#FFFFFF' : '#94A3B8',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {f.label} ({f.count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activity Stream Feed */}
            {filteredActivities.length === 0 ? (
              <div style={{ ...glassCardStyle, textAlign: 'center', padding: '3.5rem 1rem' }}>
                <Activity size={38} color="#64748B" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.4rem' }}>
                  No Activity In This Filter
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', maxWidth: '420px', margin: '0 auto' }}>
                  Activity will appear dynamically in real time whenever students browse, place orders, or submit payments.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredActivities.map((act) => {
                  const isOrder = act.type === 'order';
                  const isPayment = act.type === 'payment';
                  const isNomination = act.type === 'nomination';

                  return (
                    <div
                      key={act.id}
                      style={{
                        ...glassCardStyle,
                        padding: '1.15rem 1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        borderLeft: `4px solid ${act.statusBadgeColor}`,
                      }}
                    >
                      {/* Left: Icon & Description */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', minWidth: '280px', flex: 1 }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: `${act.statusBadgeColor}20`,
                            color: act.statusBadgeColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {isOrder && <ShoppingBag size={20} />}
                          {isPayment && <DollarSign size={20} />}
                          {isNomination && <Building2 size={20} />}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>
                              {act.title}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: `${act.statusBadgeColor}25`,
                                color: act.statusBadgeColor,
                                border: `1px solid ${act.statusBadgeColor}40`,
                              }}
                            >
                              {act.status.replace(/_/g, ' ')}
                            </span>
                            {act.amount !== undefined && (
                              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#10B981' }}>
                                ₹{act.amount}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.2rem' }}>
                            {act.subtitle}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.73rem', color: '#64748B', flexWrap: 'wrap' }}>
                            <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{act.actor}</span>
                            <span>•</span>
                            <span>{act.contact}</span>
                            <span>•</span>
                            <span style={{ color: '#94A3B8' }}>{act.location}</span>
                            <span>•</span>
                            <span style={{ color: '#60A5FA' }}>
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(act.timestamp).toLocaleDateString()})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Instant Admin Quick Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {isOrder && (
                          <>
                            {act.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleConfirmBookingAndSendEmail(act.sourceObj)}
                                style={{
                                  padding: '0.45rem 0.85rem',
                                  backgroundColor: '#10B981',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                }}
                              >
                                <Check size={14} />
                                <span>Confirm</span>
                              </button>
                            )}
                            {act.status !== 'completed' && act.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(act.id, 'completed')}
                                style={{
                                  padding: '0.45rem 0.85rem',
                                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                  border: '1px solid rgba(59, 130, 246, 0.35)',
                                  color: '#60A5FA',
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Complete
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleWhatsAppStudent(act.sourceObj)}
                              style={{
                                padding: '0.45rem 0.85rem',
                                backgroundColor: 'rgba(37, 211, 102, 0.12)',
                                border: '1px solid rgba(37, 211, 102, 0.3)',
                                color: '#25D366',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              WhatsApp
                            </button>
                          </>
                        )}

                        {isPayment && (
                          <>
                            {act.status === 'pending_verification' ? (
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePaymentStatus(act.id, 'verified')}
                                  style={{
                                    padding: '0.45rem 0.85rem',
                                    backgroundColor: '#10B981',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Verify UTR
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePaymentStatus(act.id, 'rejected')}
                                  style={{
                                    padding: '0.45rem 0.85rem',
                                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#F87171',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Audited ✓</span>
                            )}
                          </>
                        )}

                        {isNomination && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(act.contact);
                              alert(`Copied student nominee email: ${act.contact}`);
                            }}
                            style={{
                              padding: '0.45rem 0.85rem',
                              backgroundColor: 'rgba(139, 92, 246, 0.15)',
                              border: '1px solid rgba(139, 92, 246, 0.35)',
                              color: '#A78BFA',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Copy Email
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: EDIT WHOLE WEBSITE DETAILS */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Header & Save Confirmation Banner */}
            <div
              style={{
                ...glassCardStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Globe size={18} color="#60A5FA" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#60A5FA', letterSpacing: '0.05em' }}>
                    Site-Wide Content Management
                  </span>
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  🌐 Edit Whole Website Details
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.25rem 0 0' }}>
                  Customize branding, hero headlines, campus location, official helplines, broadcast notices, and UPI parameters.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleResetSiteSettings}
                  style={{
                    padding: '0.65rem 1.15rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#94A3B8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ↺ Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleSaveSiteSettings}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 1.4rem',
                    backgroundColor: '#2563EB',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  }}
                >
                  <Save size={16} />
                  <span>Save Website Details</span>
                </button>
              </div>
            </div>

            {/* Notification Toast */}
            {siteSettingsSaved && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                }}
              >
                <CheckCircle size={18} color="#10B981" />
                <span>All website details saved successfully! Changes are live across EaseHub storefront & hero immediately.</span>
              </div>
            )}

            {/* Live Interactive Storefront Preview Card */}
            <div
              style={{
                ...glassCardStyle,
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60A5FA', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Eye size={14} />
                  <span>Live Storefront Visual Preview (Real-Time Mockup)</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Updates as you type</span>
              </div>

              {/* Broadcast alert preview if enabled */}
              {siteSettings.isBroadcastActive && siteSettings.broadcastText && (
                <div
                  style={{
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    color: '#FEF08A',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Megaphone size={14} color="#FACC15" />
                  <span>{siteSettings.broadcastText}</span>
                </div>
              )}

              {/* Hero preview */}
              <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(22, 163, 74, 0.15)',
                    border: '1px solid rgba(22, 163, 74, 0.35)',
                    color: '#4ADE80',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                  }}
                >
                  <Shield size={14} />
                  <span>{siteSettings.badgeText}</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span>{siteSettings.campusName} Live</span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.6rem 0', lineHeight: 1.2 }}>
                  {siteSettings.headlinePrefix}{' '}
                  <span style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {siteSettings.headlineHighlight}
                  </span>{' '}
                  {siteSettings.headlineSuffix}
                </h2>

                <p style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 1.2rem auto', lineHeight: 1.5 }}>
                  {siteSettings.heroDescription}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748B', flexWrap: 'wrap' }}>
                  <span>📍 {siteSettings.campusCity}</span>
                  <span>•</span>
                  <span>📞 {siteSettings.supportPhone}</span>
                  <span>•</span>
                  <span>💬 WhatsApp: +{siteSettings.supportWhatsApp}</span>
                  <span>•</span>
                  <span>✉️ {siteSettings.supportEmail}</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Content Form Grid */}
            <form onSubmit={handleSaveSiteSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Section 1: Brand & Campus Identity */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                  <Sparkles size={18} color="#60A5FA" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    1. Brand & Campus Identity
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettings.brandName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, brandName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Hero Trust Badge Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettings.badgeText}
                      onChange={(e) => setSiteSettings({ ...siteSettings, badgeText: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Campus Hub Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettings.campusName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, campusName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Campus City / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettings.campusCity}
                      onChange={(e) => setSiteSettings({ ...siteSettings, campusCity: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Hero Section Headlines & Copy */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                  <Edit2 size={18} color="#10B981" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    2. Hero Section Headlines & Copy
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.15rem', marginBottom: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Headline Prefix
                    </label>
                    <input
                      type="text"
                      value={siteSettings.headlinePrefix}
                      onChange={(e) => setSiteSettings({ ...siteSettings, headlinePrefix: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Headline Highlight (Gradient Accent) *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettings.headlineHighlight}
                      onChange={(e) => setSiteSettings({ ...siteSettings, headlineHighlight: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#4ADE80', fontWeight: 700, fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Headline Suffix (Optional)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.headlineSuffix}
                      onChange={(e) => setSiteSettings({ ...siteSettings, headlineSuffix: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                    Hero Sub-headline / Platform Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={siteSettings.heroDescription}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroDescription: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Section 3: Official Helplines & Support Contact */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                  <Phone size={18} color="#F59E0B" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    3. Official Helplines & Support Contact
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Support Phone Number
                    </label>
                    <input
                      type="text"
                      value={siteSettings.supportPhone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, supportPhone: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      WhatsApp Number (with country code, digits only)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.supportWhatsApp}
                      onChange={(e) => setSiteSettings({ ...siteSettings, supportWhatsApp: e.target.value.replace(/\D/g, '') })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#25D366', fontWeight: 700, fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Support Email Address
                    </label>
                    <input
                      type="email"
                      value={siteSettings.supportEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Site-Wide Campus Notice Banner */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                  <Megaphone size={18} color="#A855F7" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    4. Site-Wide Campus Notice Banner
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.88rem', color: '#E2E8F0' }}>
                    <input
                      type="checkbox"
                      checked={siteSettings.isBroadcastActive}
                      onChange={(e) => setSiteSettings({ ...siteSettings, isBroadcastActive: e.target.checked })}
                    />
                    <span style={{ fontWeight: 700 }}>Enable broadcast notice banner across storefront</span>
                  </label>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Notice Text
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings.broadcastText}
                      onChange={(e) => setSiteSettings({ ...siteSettings, broadcastText: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Payment Gateway Quick Sync */}
              <div style={glassCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                  <QrCode size={18} color="#60A5FA" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    5. Central UPI Payment Gateway Parameters
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Admin Receiver UPI ID (VPA) *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettings.upiId}
                      onChange={(e) => setSiteSettings({ ...siteSettings, upiId: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#60A5FA', fontWeight: 700, fontFamily: 'monospace', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Payee Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettings.payeeName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, payeeName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      QR Code Image Path
                    </label>
                    <input
                      type="text"
                      value={siteSettings.qrImageUrl}
                      onChange={(e) => setSiteSettings({ ...siteSettings, qrImageUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 2rem',
                    backgroundColor: '#2563EB',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  <Save size={18} />
                  <span>Save All Website Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('services')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.85rem 1.4rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#E2E8F0',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Layers size={16} />
                  <span>Edit Services & Pricing Catalog ({services.length}) →</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: SMART COMBOS & ALL-IN-ONE PASSES */}
        {/* ========================================================================= */}
        {activeTab === 'combos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Notification Toast */}
            {bundleToast && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 1.25rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                }}
              >
                <CheckCircle size={18} color="#10B981" />
                <span>{bundleToast}</span>
              </div>
            )}

            {/* Header / Actions Card */}
            <div
              style={{
                ...glassCardStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={20} color="#F59E0B" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Smart Student Combos & All-in-One Passes
                  </h3>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    {bundles.length} Passes Active
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#94A3B8' }}>
                  Students save up to 40% with bundled services (PG + Food + Laundry). Customize prices, services, and perks anytime.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleResetBundles}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#CBD5E1',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddBundle}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.25rem',
                    backgroundColor: '#2563EB',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  <Plus size={16} />
                  <span>+ Create New Combo Pass</span>
                </button>
              </div>
            </div>

            {/* Create / Edit Combo Form Drawer / Card */}
            {isAddingBundle && (
              <div
                style={{
                  ...glassCardStyle,
                  border: '1.5px solid #3B82F6',
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} color="#60A5FA" />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                      {editingBundle ? `Edit Combo Pass: ${editingBundle.name}` : 'Create New Custom Combo Pass'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingBundle(false);
                      setEditingBundle(null);
                    }}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveBundleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                        Combo Pass Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Total Campus Living Pass"
                        value={bundleForm.name}
                        onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                        Promotional Badge (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MOST POPULAR, BEST VALUE, 35% OFF"
                        value={bundleForm.badge}
                        onChange={(e) => setBundleForm({ ...bundleForm, badge: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F59E0B', fontWeight: 700, fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                        Original Market Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="100"
                        value={bundleForm.originalPrice}
                        onChange={(e) => setBundleForm({ ...bundleForm, originalPrice: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                        Special Bundle Offer Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="100"
                        value={bundleForm.bundlePrice}
                        onChange={(e) => setBundleForm({ ...bundleForm, bundlePrice: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#10B981', fontWeight: 800, fontSize: '1rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                        Billing Period
                      </label>
                      <select
                        value={bundleForm.billingPeriod}
                        onChange={(e) => setBundleForm({ ...bundleForm, billingPeriod: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.9rem' }}
                      >
                        <option value="month">Per Month (Monthly)</option>
                        <option value="semester">Per Semester (6 Months)</option>
                        <option value="year">Per Academic Year (12 Months)</option>
                        <option value="term">Per Term</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                        Calculated Student Savings
                      </label>
                      <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10B981', fontWeight: 800, fontSize: '0.95rem' }}>
                        Save{' '}
                        {bundleForm.originalPrice > bundleForm.bundlePrice
                          ? Math.round(((bundleForm.originalPrice - bundleForm.bundlePrice) / bundleForm.originalPrice) * 100)
                          : 0}
                        % (₹{(bundleForm.originalPrice - bundleForm.bundlePrice).toLocaleString()} Discount)
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Pitch / Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Perfect for 1st-year students wanting verified housing, food, and laundry handled together."
                      value={bundleForm.tagline}
                      onChange={(e) => setBundleForm({ ...bundleForm, tagline: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Services Included (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AC Double Sharing PG, 3x Homestyle Student Meals, Doorstep Express Laundry"
                      value={bundleForm.servicesIncluded}
                      onChange={(e) => setBundleForm({ ...bundleForm, servicesIncluded: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.9rem' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
                      Separate each included service with a comma.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Exclusive Perks & Bonuses (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zero Brokerage & Move-in Deposit, 100Mbps Wi-Fi, 24/7 Concierge WhatsApp Assistance"
                      value={bundleForm.perks}
                      onChange={(e) => setBundleForm({ ...bundleForm, perks: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.9rem' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
                      Listed as bonus perks on student combo cards and checkout screens.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '0.8rem 1.8rem',
                        backgroundColor: '#2563EB',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Save size={16} />
                      <span>{editingBundle ? 'Update Combo Pass' : 'Save & Publish Combo Pass'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingBundle(false);
                        setEditingBundle(null);
                      }}
                      style={{
                        padding: '0.8rem 1.4rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        color: '#CBD5E1',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Active Combo Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  style={{
                    ...glassCardStyle,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    {/* Top Badge & ID */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      {bundle.badge ? (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          {bundle.badge}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>COMBO PASS</span>
                      )}
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                        Save {bundle.savingsPercentage}%
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.4rem' }}>
                      {bundle.name}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '0 0 1rem', lineHeight: 1.5 }}>
                      {bundle.tagline}
                    </p>

                    {/* Price Header */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1rem', padding: '0.75rem 0.9rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F59E0B' }}>
                        ₹{bundle.bundlePrice.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        /{bundle.billingPeriod}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#64748B', textDecoration: 'line-through' }}>
                        ₹{bundle.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Included Services */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
                        Included Services:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {bundle.servicesIncluded.map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#E2E8F0' }}>
                            <Check size={14} color="#10B981" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Perks */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
                        Special Perks:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {bundle.perks.map((p, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
                            <Sparkles size={13} color="#F59E0B" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditBundle(bundle)}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.85rem',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.35)',
                        borderRadius: '8px',
                        color: '#60A5FA',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      title="Test adding combo directly to shopping cart"
                      onClick={() => {
                        addCartItem({
                          id: `bundle_${bundle.id}`,
                          slug: bundle.id,
                          name: bundle.name,
                          category: 'extra',
                          priceText: `₹${bundle.bundlePrice.toLocaleString()}/${bundle.billingPeriod}`,
                          numericPrice: bundle.bundlePrice,
                          periodText: bundle.billingPeriod,
                          imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
                          providerName: 'EaseHub Smart All-in-One Pass',
                          optionName: bundle.tagline,
                        });
                        openShoppingCart();
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.85rem',
                        backgroundColor: '#10B981',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <ShoppingCart size={14} />
                      <span>+ Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBundle(bundle.id, bundle.name)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.55rem 0.75rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '8px',
                        color: '#F87171',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: CAMPUS BROADCAST NOTICE */}
        {/* ========================================================================= */}
        {activeTab === 'broadcast' && (
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div style={glassCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Megaphone size={20} color="#A855F7" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Site-Wide Campus Notice</h3>
              </div>
              <form onSubmit={handleSaveBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>Announcement</label>
                  <textarea rows={3} value={broadcastText} onChange={(e) => setBroadcastText(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.88rem' }} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <input type="checkbox" checked={isBroadcastActive} onChange={(e) => setIsBroadcastActive(e.target.checked)} />
                  <span>Display banner on homepage</span>
                </label>
                <button type="submit" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', backgroundColor: '#A855F7', border: 'none', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  <Save size={16} />
                  <span>Update Banner</span>
                </button>
                {broadcastSaved && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '10px', color: '#C084FC', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                    <CheckCircle size={18} />
                    <span>Broadcast banner updated live across Easehub!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminPage;
