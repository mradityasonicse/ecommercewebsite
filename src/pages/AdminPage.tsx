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

type AdminTab = 'overview' | 'services' | 'orders' | 'tracking' | 'payments' | 'gateway' | 'broadcast';

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

  // Services State
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');

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

    try {
      const savedBookings = localStorage.getItem('easehub_admin_bookings');
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        setBookings(SEED_BOOKINGS);
        localStorage.setItem('easehub_admin_bookings', JSON.stringify(SEED_BOOKINGS));
      }
    } catch {
      setBookings(SEED_BOOKINGS);
    }
  };

  useEffect(() => {
    loadData();
    const handleStatusUpdate = () => {
      setMessState(CampusStateService.getMessState());
      setLaundryState(CampusStateService.getLaundryState());
      setPgVacancies(CampusStateService.getPgVacancies());
      setTrackableOrders(TrackingBackendService.getAllOrders());
    };
    window.addEventListener('easehub_campus_status_updated', handleStatusUpdate);
    window.addEventListener('easehub_order_status_updated', handleStatusUpdate);
    return () => {
      window.removeEventListener('easehub_campus_status_updated', handleStatusUpdate);
      window.removeEventListener('easehub_order_status_updated', handleStatusUpdate);
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

  // --- BOOKING CONFIRMATION WITH EMAIL DISPATCH ---
  const handleConfirmBookingAndSendEmail = (booking: StudentBooking) => {
    // 1. Update Booking Status to Confirmed
    const updated = bookings.map((b) => (b.id === booking.id ? { ...b, status: 'confirmed' as const } : b));
    saveBookingsToStorage(updated);

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
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', display: 'inline-block', marginBottom: '1rem' }}>
                  <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="26" height="26" rx="4" fill="#0A1633" /><rect x="15" y="15" width="16" height="16" rx="2" fill="white" /><rect x="19" y="19" width="8" height="8" fill="#3B82F6" />
                    <rect x="64" y="10" width="26" height="26" rx="4" fill="#0A1633" /><rect x="69" y="15" width="16" height="16" rx="2" fill="white" /><rect x="73" y="19" width="8" height="8" fill="#3B82F6" />
                    <rect x="10" y="64" width="26" height="26" rx="4" fill="#0A1633" /><rect x="15" y="69" width="16" height="16" rx="2" fill="white" /><rect x="19" y="73" width="8" height="8" fill="#3B82F6" />
                    <rect x="42" y="14" width="6" height="6" fill="#0A1633" /><rect x="52" y="24" width="6" height="6" fill="#0A1633" />
                    <rect x="42" y="34" width="16" height="16" rx="2" fill="#2563EB" /><rect x="45" y="37" width="10" height="10" fill="white" /><rect x="48" y="40" width="4" height="4" fill="#2563EB" />
                    <rect x="14" y="44" width="6" height="6" fill="#0A1633" /><rect x="24" y="52" width="6" height="6" fill="#0A1633" /><rect x="64" y="44" width="8" height="8" fill="#0A1633" />
                    <rect x="44" y="64" width="6" height="6" fill="#0A1633" /><rect x="54" y="74" width="8" height="8" fill="#0A1633" />
                  </svg>
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10B981', fontSize: '0.9rem' }}>{gatewaySettings.adminUpiId}</div>
              </div>
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
