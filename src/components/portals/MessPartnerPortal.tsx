import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Bell,
  Save,
  ArrowLeft,
  Sparkles,
  LogOut,
  Flame,
  ChefHat,
  Users,
  Phone,
  MessageSquare,
  Send,
  Search,
  MapPin,
  X,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { CampusStateService } from '../../services/campusStateService';
import { ServiceRequestRepository } from '../../services/serviceRequestRepository';
import { NotificationService } from '../../services/notificationService';
import type { ServiceRequest, RequestStatus } from '../../types/booking';

export type KitchenStage = 'cooking' | 'dispatched' | 'gate_arrived' | 'delivered';

export interface DailyMenuPlan {
  breakfast: string;
  breakfastTime: string;
  lunch: string;
  lunchTime: string;
  dinner: string;
  dinnerTime: string;
  specialItem: string;
  isPublished: boolean;
}

const DEFAULT_MENU: DailyMenuPlan = {
  breakfast: 'Poha with Sev, Boiled Eggs / Banana, Masala Chai',
  breakfastTime: '7:30 AM - 9:30 AM',
  lunch: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, 4 Butter Tawa Roti, Boondi Raita & Salad',
  lunchTime: '12:30 PM - 2:30 PM',
  dinner: 'Aloo Gobhi Adraki, Mix Dal, Steamed Rice, Phulka Roti, Hot Gulab Jamun',
  dinnerTime: '7:45 PM - 9:45 PM',
  specialItem: 'Hot Gulab Jamun & Crisp Papad Included Today',
  isPublished: true,
};

const STORAGE_KEY_MENU = 'easehub_mess_custom_menu_v1';
const STORAGE_KEY_STAGE = 'easehub_mess_live_stage_v1';

export const MessPartnerPortal: React.FC<{
  onBackToApp?: () => void;
  onSwitchRole?: () => void;
}> = ({ onBackToApp, onSwitchRole }) => {
  // Navigation tabs in Mess Portal
  const [activePortalTab, setActivePortalTab] = useState<'subscribers' | 'pipeline' | 'menu'>('subscribers');

  // Booked Students State
  const [bookings, setBookings] = useState<ServiceRequest[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'delivered'>('all');

  // Notification Modal State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<ServiceRequest | null>(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifPriority, setNotifPriority] = useState<'normal' | 'high'>('high');
  const [isSendingNotif, setIsSendingNotif] = useState(false);

  // Menu State
  const [menu, setMenu] = useState<DailyMenuPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENU);
      return saved ? JSON.parse(saved) : DEFAULT_MENU;
    } catch {
      return DEFAULT_MENU;
    }
  });

  const [currentStage, setCurrentStage] = useState<KitchenStage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAGE) as KitchenStage;
      return saved || 'cooking';
    } catch {
      return 'cooking';
    }
  });

  const [activeMealType, setActiveMealType] = useState<'Lunch' | 'Dinner' | 'Breakfast'>('Lunch');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [lastNotificationSent, setLastNotificationSent] = useState<string | null>(null);

  // Load Booked Mess Students
  const loadMessBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const data = await ServiceRequestRepository.getMessBookings();
      setBookings(data);
    } catch (err) {
      console.warn('Failed to load mess bookings', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadMessBookings();
    const handleUpdate = () => loadMessBookings();
    window.addEventListener('easehub_requests_updated', handleUpdate);
    return () => window.removeEventListener('easehub_requests_updated', handleUpdate);
  }, []);

  // Filtered Students List
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.customer.name.toLowerCase().includes(q) ||
        (b.customer.roomNumber && b.customer.roomNumber.toLowerCase().includes(q)) ||
        (b.customer.hostelBlock && b.customer.hostelBlock.toLowerCase().includes(q)) ||
        (b.customer.studentId && b.customer.studentId.toLowerCase().includes(q)) ||
        (b.optionName && b.optionName.toLowerCase().includes(q)) ||
        b.id.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'accepted';
      if (statusFilter === 'pending') return b.status === 'pending';
      if (statusFilter === 'delivered') return b.status === 'completed';
      return true;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Update Status for an Individual Student's Order/Subscription
  const handleUpdateStudentStatus = async (requestId: string, newStatus: RequestStatus) => {
    const res = await ServiceRequestRepository.updateBookingStatus(requestId, newStatus);
    if (res.success) {
      setSaveToast(`✅ Student status updated to: ${newStatus.toUpperCase()}`);
      setTimeout(() => setSaveToast(null), 3000);
      loadMessBookings();
    }
  };

  // Open Direct Notification Modal for a specific student or all students
  const handleOpenNotificationModal = (student: ServiceRequest | null = null) => {
    setTargetStudent(student);
    if (student) {
      setNotifTitle(`🍱 Khana Update for Room ${student.customer.roomNumber || ''}`);
      setNotifMessage(`Hello ${student.customer.name.split(' ')[0]}, your mess meal is prepared! Please collect from the hostel gate.`);
    } else {
      setNotifTitle(`📢 Annapurna Mess Broadcast (${activeMealType})`);
      setNotifMessage(`Hot & fresh ${activeMealType} is now ready for all hostel residents!`);
    }
    setNotifPriority('high');
    setIsNotifModalOpen(true);
  };

  // Send Direct / Broadcast Notification
  const handleSendNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    setIsSendingNotif(true);
    try {
      const targetUserId = targetStudent ? targetStudent.customer.email : 'all_students';

      await NotificationService.createNotification({
        userId: targetUserId,
        type: 'service_alert',
        title: notifTitle.trim(),
        description: notifMessage.trim(),
        targetUrl: targetStudent ? `#account/requests/${targetStudent.id}` : '#account/services',
        priority: notifPriority,
        metadata: {
          requestId: targetStudent?.id,
          serviceSlug: 'mess',
          actor: 'Annapurna Mess Desk',
        },
      });

      const sentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastNotificationSent(sentTime);
      setIsNotifModalOpen(false);

      if (targetStudent) {
        setSaveToast(`🚀 Direct notification sent to ${targetStudent.customer.name} (Room ${targetStudent.customer.roomNumber})!`);
      } else {
        setSaveToast(`🚀 Broadcast sent to all ${bookings.length} mess subscribers!`);
      }
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err) {
      console.warn('Failed to send notification', err);
    } finally {
      setIsSendingNotif(false);
    }
  };

  // One-click Send Today's Menu to Booked Students
  const handleSendMenuToStudents = async (studentToNotify?: ServiceRequest) => {
    const menuSummary = `Lunch: ${menu.lunch} • Dinner: ${menu.dinner} • Special: ${menu.specialItem}`;
    const targetUserId = studentToNotify ? studentToNotify.customer.email : 'all_students';

    await NotificationService.createNotification({
      userId: targetUserId,
      type: 'service_alert',
      title: `🍱 Today's Live Mess Menu Published`,
      description: menuSummary,
      targetUrl: '#account/services',
      priority: 'normal',
      metadata: {
        serviceSlug: 'mess',
        actor: 'Annapurna Mess Partner',
      },
    });

    const sentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastNotificationSent(sentTime);

    if (studentToNotify) {
      setSaveToast(`✅ Today's menu sent directly to ${studentToNotify.customer.name}!`);
    } else {
      setSaveToast(`✅ Today's menu broadcasted to all ${bookings.length} mess subscribers!`);
    }
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Sync with CampusStateService & local storage
  const handlePublishMenu = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menu));
    } catch (err) {
      console.warn('Storage save failed', err);
    }

    // Broadcast menu update to student homepage
    CampusStateService.updateMessState({
      todayMenu: {
        lunch: menu.lunch,
        dinner: menu.dinner,
        specialItem: menu.specialItem,
      },
    });

    window.dispatchEvent(
      new CustomEvent('easehub:mess-menu-updated', {
        detail: { ...menu },
      })
    );

    setSaveToast("✅ Today's Live Mess Menu has been published to student home screens!");
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleUpdateStage = (newStage: KitchenStage) => {
    setCurrentStage(newStage);
    try {
      localStorage.setItem(STORAGE_KEY_STAGE, newStage);
    } catch (err) {
      console.warn('Storage save failed', err);
    }

    let stageCode: 'kitchen_preparing' | 'packaging' | 'out_for_delivery' | 'arrived' = 'kitchen_preparing';
    if (newStage === 'cooking') stageCode = 'kitchen_preparing';
    else if (newStage === 'dispatched') stageCode = 'out_for_delivery';
    else if (newStage === 'gate_arrived') stageCode = 'arrived';
    else if (newStage === 'delivered') stageCode = 'arrived';

    const stageTitles: Record<KitchenStage, string> = {
      cooking: '🍳 Khana Ban Raha Hai (Cooking in Progress)',
      dispatched: '🛵 Dispatch Ho Gaya (Van left kitchen for hostels)',
      gate_arrived: '📍 Hostel Gate Pe Pahunch Gaya!',
      delivered: '✅ Delivery Completed / Done',
    };

    CampusStateService.updateMessState({
      currentStage: stageCode,
      stageLabel: stageTitles[newStage],
    });

    if (newStage === 'gate_arrived') {
      triggerGateNotification();
    } else {
      setSaveToast(`Pipeline Updated: ${stageTitles[newStage]}`);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const triggerGateNotification = () => {
    const alertMsg = `📢 Annapurna Mess Alert: ${activeMealType} van has arrived at Hostel Main Gate! Fresh hot tiffins are ready for collection.`;
    setLastNotificationSent(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Global in-app custom event for all student views
    window.dispatchEvent(
      new CustomEvent('easehub_notification_toast', {
        detail: {
          title: '🍱 Meal Arrived at Hostel Gate!',
          message: alertMsg,
          type: 'mess',
        },
      })
    );

    NotificationService.createNotification({
      userId: 'all_students',
      type: 'service_alert',
      title: '📍 Khana Hostel Gate Pe Aa Gaya Hai!',
      description: alertMsg,
      targetUrl: '#account/services',
      priority: 'high',
    });

    setSaveToast('🚀 NOTIFICATION DISPATCHED: Alert broadcasted to all students via app!');
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAF7',
        color: '#0F172A',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        paddingTop: '5rem',
        paddingBottom: '6rem',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Top Control Ribbon */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1.5px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onBackToApp || (() => (window.location.hash = ''))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '10px',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>Student View</span>
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: '#FEF08A',
                    color: '#854D0E',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    border: '1px solid #FACC15',
                  }}
                >
                  MESS &amp; KITCHEN PARTNER
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Live Dining Management Console</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: '#0F172A' }}>
                Annapurna Mess — Student Bookings &amp; Kitchen Portal
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onSwitchRole || (() => window.dispatchEvent(new CustomEvent('easehub_open_role_gate')))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.95rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                borderRadius: '10px',
                color: '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
              <span>Switch Role</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMenuToStudents()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                backgroundColor: '#0284C7',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
              }}
            >
              <Share2 size={15} />
              <span>Broadcast Menu to Students</span>
            </button>

            <button
              type="button"
              onClick={handlePublishMenu}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                backgroundColor: '#15803D',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
              }}
            >
              <Save size={16} />
              <span>Publish Menu Live</span>
            </button>
          </div>
        </div>

        {/* Real-Time Toast Alert */}
        {saveToast && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#DCFCE7',
              border: '1.5px solid #16A34A',
              borderRadius: '12px',
              color: '#15803D',
              fontWeight: 700,
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Top KPI Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Card 1: Total Subscribers */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.15rem 1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Booked Students
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
                {bookings.length} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16A34A' }}>Active</span>
              </div>
            </div>
          </div>

          {/* Card 2: Hostel Delivery Rooms */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.15rem 1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Hostel Rooms
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
                {bookings.filter((b) => b.customer.roomNumber).length} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Deliveries</span>
              </div>
            </div>
          </div>

          {/* Card 3: Kitchen Pipeline Status */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.15rem 1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Kitchen Pipeline
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', textTransform: 'capitalize' }}>
                {currentStage === 'cooking' ? '🍳 Khana Ban Raha' : currentStage === 'dispatched' ? '🛵 Out for Delivery' : currentStage === 'gate_arrived' ? '📍 At Gate' : '✅ Delivered'}
              </div>
            </div>
          </div>

          {/* Card 4: Last Broadcast */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.15rem 1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#F3E8FF',
                color: '#7E22CE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Student Alert Feed
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                {lastNotificationSent ? `Sent at ${lastNotificationSent}` : 'Ready to Send'}
              </div>
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid #E2E8F0',
            marginBottom: '1.75rem',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActivePortalTab('subscribers')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderBottom: activePortalTab === 'subscribers' ? '3px solid #15803D' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activePortalTab === 'subscribers' ? '#15803D' : '#64748B',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Users size={18} />
            <span>Booked Students &amp; Details (छात्र विवरण)</span>
            <span
              style={{
                backgroundColor: activePortalTab === 'subscribers' ? '#DCFCE7' : '#F1F5F9',
                color: activePortalTab === 'subscribers' ? '#15803D' : '#64748B',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
              }}
            >
              {bookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab('pipeline')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderBottom: activePortalTab === 'pipeline' ? '3px solid #15803D' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activePortalTab === 'pipeline' ? '#15803D' : '#64748B',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Flame size={18} />
            <span>Kitchen &amp; Gate Pipeline (किचन ट्रैकिंग)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab('menu')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderBottom: activePortalTab === 'menu' ? '3px solid #15803D' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activePortalTab === 'menu' ? '#15803D' : '#64748B',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <ChefHat size={18} />
            <span>Today's Menu Board &amp; Broadcast (मेनू बोर्ड)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: BOOKED STUDENTS & MEAL SUBSCRIBERS (Core User Requirement) */}
        {/* ========================================================================= */}
        {activePortalTab === 'subscribers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top Toolbar: Search, Filters & Action Button */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.15rem 1.25rem',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '0.45rem 0.85rem',
                    flex: 1,
                  }}
                >
                  <Search size={16} color="#64748B" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, room 304, Block B, ID..."
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      fontSize: '0.85rem',
                      width: '100%',
                      color: '#0F172A',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(['all', 'active', 'pending', 'delivered'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      style={{
                        padding: '0.45rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: statusFilter === filter ? '1px solid #15803D' : '1px solid #E2E8F0',
                        backgroundColor: statusFilter === filter ? '#DCFCE7' : '#FFFFFF',
                        color: statusFilter === filter ? '#15803D' : '#64748B',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={loadMessBookings}
                  title="Refresh bookings"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.5rem 0.85rem',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenNotificationModal(null)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.1rem',
                    backgroundColor: '#D97706',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
                  }}
                >
                  <Bell size={15} />
                  <span>Broadcast Alert to All</span>
                </button>
              </div>
            </div>

            {/* Students List Table / Cards */}
            {isLoadingBookings ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                Loading booked students...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  border: '1.5px dashed #CBD5E1',
                }}
              >
                <Users size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
                  No Mess Bookings Found
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
                  {searchQuery
                    ? `No students matching "${searchQuery}". Clear your search query.`
                    : 'When students subscribe to your mess or order tiffin services, their details, room number, and dietary notes will appear here.'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#15803D',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {filteredBookings.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      position: 'relative',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    {/* Top Header: Student Identity & Booking Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            border: '1.5px solid #FDE68A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1rem',
                          }}
                        >
                          {req.customer.name
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                            {req.customer.name}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                              {req.customer.studentId || 'STUDENT'}
                            </span>
                            <span style={{ color: '#CBD5E1' }}>•</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              ID: {req.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                          backgroundColor:
                            req.status === 'confirmed'
                              ? '#DCFCE7'
                              : req.status === 'in_progress'
                              ? '#DBEAFE'
                              : req.status === 'completed'
                              ? '#F1F5F9'
                              : '#FEF3C7',
                          color:
                            req.status === 'confirmed'
                              ? '#15803D'
                              : req.status === 'in_progress'
                              ? '#1D4ED8'
                              : req.status === 'completed'
                              ? '#475569'
                              : '#B45309',
                          border:
                            req.status === 'confirmed'
                              ? '1px solid #86EFAC'
                              : req.status === 'in_progress'
                              ? '1px solid #93C5FD'
                              : '1px solid #CBD5E1',
                        }}
                      >
                        {req.status === 'in_progress' ? 'COOKING / TRANSIT' : req.status}
                      </span>
                    </div>

                    {/* Room & Hostel Delivery Destination (CRITICAL DETAILS) */}
                    <div
                      style={{
                        backgroundColor: '#F8FAF7',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '0.75rem 0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0F172A', fontWeight: 800, fontSize: '0.86rem' }}>
                        <MapPin size={16} color="#15803D" />
                        <span>
                          {req.customer.hostelBlock || 'Campus Hostel'}
                          {req.customer.roomNumber ? ` • Room ${req.customer.roomNumber}` : ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '1.45rem' }}>
                        <span>Campus: {req.customer.campusName || 'Main Campus'}</span>
                        <span>•</span>
                        <span>Slot: {req.schedule?.timeSlot || 'Standard Delivery Window'}</span>
                      </div>
                    </div>

                    {/* Plan Booked & Dietary Notes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#334155' }}>
                          🍽️ {req.optionName || req.serviceName}
                        </span>
                        <span style={{ fontWeight: 800, color: '#15803D' }}>
                          {req.estimatedPrice || 'Monthly Plan'}
                        </span>
                      </div>

                      {/* Special Dietary Note Highlight */}
                      {req.notes && (
                        <div
                          style={{
                            padding: '0.45rem 0.65rem',
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            borderRadius: '8px',
                            color: '#92400E',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            lineHeight: 1.35,
                          }}
                        >
                          <span style={{ fontWeight: 800 }}>Dietary Note: </span>
                          <span>{req.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Student Contact Bar (WhatsApp & Call) */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid #F1F5F9',
                      }}
                    >
                      <a
                        href={`tel:${req.customer.phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          color: '#334155',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <Phone size={13} color="#2563EB" />
                        <span>{req.customer.phone || 'Call'}</span>
                      </a>

                      <a
                        href={`https://wa.me/${req.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${req.customer.name}, regarding your Annapurna Mess meal order (${req.id}):`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: '#DCFCE7',
                          border: '1px solid #86EFAC',
                          color: '#15803D',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp</span>
                      </a>

                      <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#94A3B8' }}>
                        {req.customer.email}
                      </div>
                    </div>

                    {/* Action Row: Update Status Dropdown + Direct Actions */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid #F1F5F9',
                      }}
                    >
                      {/* Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>
                          Status:
                        </label>
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateStudentStatus(req.id, e.target.value as RequestStatus)}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            color: '#0F172A',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">Khana Ban Raha Hai</option>
                          <option value="completed">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleSendMenuToStudents(req)}
                          title="Send Today's Menu to this student"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.7rem',
                            backgroundColor: '#F0FDF4',
                            border: '1px solid #86EFAC',
                            borderRadius: '6px',
                            color: '#15803D',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <ChefHat size={13} />
                          <span>Send Menu</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenNotificationModal(req)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#15803D',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#FFFFFF',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          <Send size={13} />
                          <span>Notify Student</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 4-STAGE LIVE COOKING & DELIVERY PIPELINE (Original Pipeline) */}
        {/* ========================================================================= */}
        {activePortalTab === 'pipeline' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #86EFAC',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.08)',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flame size={20} color="#F59E0B" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Live Kitchen &amp; Gate-Arrival Delivery Pipeline
                  </h2>
                </div>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                  Select current stage to update students' live tracking screen and broadcast gate arrival alerts.
                </p>
              </div>

              {/* Meal selector */}
              <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '10px' }}>
                {(['Breakfast', 'Lunch', 'Dinner'] as const).map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => setActiveMealType(meal)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      backgroundColor: activeMealType === meal ? '#FFFFFF' : 'transparent',
                      color: activeMealType === meal ? '#15803D' : '#64748B',
                      boxShadow: activeMealType === meal ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Interactive Pipeline Stage Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Stage 1: Cooking */}
              <div
                onClick={() => handleUpdateStage('cooking')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: currentStage === 'cooking' ? '2px solid #F59E0B' : '1.5px solid #E2E8F0',
                  backgroundColor: currentStage === 'cooking' ? '#FFFBEB' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: currentStage === 'cooking' ? '#F59E0B' : '#F1F5F9',
                      color: currentStage === 'cooking' ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                    }}
                  >
                    1
                  </span>
                  {currentStage === 'cooking' && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#B45309', backgroundColor: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      CURRENTLY ACTIVE
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                  🍳 Khana Ban Raha Hai
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.25rem' }}>
                  Kitchen staff cooking fresh rotis, rice, and sabzi in commercial cookware.
                </div>
              </div>

              {/* Stage 2: Dispatched */}
              <div
                onClick={() => handleUpdateStage('dispatched')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: currentStage === 'dispatched' ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: currentStage === 'dispatched' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: currentStage === 'dispatched' ? '#3B82F6' : '#F1F5F9',
                      color: currentStage === 'dispatched' ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                    }}
                  >
                    2
                  </span>
                  {currentStage === 'dispatched' && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1D4ED8', backgroundColor: '#DBEAFE', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      IN TRANSIT
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                  🛵 Dispatch Ho Gaya
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.25rem' }}>
                  Packed inside insulated thermal containers; delivery van on the way.
                </div>
              </div>

              {/* Stage 3: Arrived at Gate (High Priority) */}
              <div
                onClick={() => handleUpdateStage('gate_arrived')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: currentStage === 'gate_arrived' ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                  backgroundColor: currentStage === 'gate_arrived' ? '#ECFDF5' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: currentStage === 'gate_arrived' ? '#10B981' : '#F1F5F9',
                      color: currentStage === 'gate_arrived' ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                    }}
                  >
                    3
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', backgroundColor: '#D1FAE5', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    GATE ARRIVED 🔔
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                  📍 Hostel Gate Pe Pahunch Gaya
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.25rem' }}>
                  Dispatches immediate popup &amp; notification to all registered hostel students!
                </div>
              </div>

              {/* Stage 4: Delivered / Done */}
              <div
                onClick={() => handleUpdateStage('delivered')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: currentStage === 'delivered' ? '2px solid #64748B' : '1.5px solid #E2E8F0',
                  backgroundColor: currentStage === 'delivered' ? '#F8FAFC' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: currentStage === 'delivered' ? '#64748B' : '#F1F5F9',
                      color: currentStage === 'delivered' ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                    }}
                  >
                    4
                  </span>
                  {currentStage === 'delivered' && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155', backgroundColor: '#E2E8F0', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      COMPLETED
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                  ✅ Delivered / Done
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.25rem' }}>
                  All tiffin boxes collected; service marked finished for this meal slot.
                </div>
              </div>
            </div>

            {/* Quick Trigger Gate Alert Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#F8FAF7',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                  Hostel Gate Arrival Notification Broadcast
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {lastNotificationSent
                    ? `Last broadcasted today at ${lastNotificationSent}`
                    : 'Click below when the delivery van reaches the hostel security gate.'}
                </div>
              </div>

              <button
                type="button"
                onClick={triggerGateNotification}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#15803D',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(21, 128, 61, 0.25)',
                }}
              >
                <Bell size={16} />
                <span>Send "Khana Gate Pe Hai" Alert!</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TODAY'S ACTIVE MENU LIVE EDITOR (Original Menu Board) */}
        {/* ========================================================================= */}
        {activePortalTab === 'menu' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Left Column: Editable Form */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChefHat size={20} color="#15803D" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Update Today's Menu Board
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendMenuToStudents()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#0284C7',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Send size={13} />
                  <span>Send Menu to Students</span>
                </button>
              </div>

              <form onSubmit={handlePublishMenu} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* 1. Lunch Editor */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                      🍛 Lunch Thali Menu
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Timing: {menu.lunchTime}</span>
                  </div>
                  <textarea
                    rows={3}
                    value={menu.lunch}
                    onChange={(e) => setMenu({ ...menu, lunch: e.target.value })}
                    placeholder="e.g. Paneer Butter Masala, Dal Tadka, Jeera Rice, 4 Butter Tawa Roti, Salad"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      lineHeight: 1.4,
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 2. Dinner Editor */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                      🍲 Dinner Thali Menu
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Timing: {menu.dinnerTime}</span>
                  </div>
                  <textarea
                    rows={3}
                    value={menu.dinner}
                    onChange={(e) => setMenu({ ...menu, dinner: e.target.value })}
                    placeholder="e.g. Aloo Gobhi, Mix Dal, Steamed Rice, Phulka Roti, Hot Gulab Jamun"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      lineHeight: 1.4,
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 3. Breakfast Editor */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                      ☕ Morning Breakfast
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Timing: {menu.breakfastTime}</span>
                  </div>
                  <input
                    type="text"
                    value={menu.breakfast}
                    onChange={(e) => setMenu({ ...menu, breakfast: e.target.value })}
                    placeholder="e.g. Poha, Boiled Eggs / Banana, Masala Chai"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 4. Special Item of the Day */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                    ⭐ Special Extra Item / Sweet
                  </label>
                  <input
                    type="text"
                    value={menu.specialItem}
                    onChange={(e) => setMenu({ ...menu, specialItem: e.target.value })}
                    placeholder="e.g. Hot Gulab Jamun & Crisp Papad Included"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.85rem',
                    backgroundColor: '#15803D',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)',
                  }}
                >
                  Save &amp; Update Student Boards Now
                </button>
              </form>
            </div>

            {/* Right Column: Live Student View Preview */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1.5px solid #86EFAC',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={18} color="#16A34A" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Live Student View Preview
                  </h3>
                </div>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                  }}
                >
                  PUBLIC BOARD
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                This is exactly what hostel students see right now on their student profile, homepage, and mobile alerts.
              </p>

              <div
                style={{
                  backgroundColor: '#F8FAF7',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  flex: 1,
                }}
              >
                {/* Today's Special Badge */}
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#FEF08A',
                    border: '1px solid #FACC15',
                    borderRadius: '8px',
                    color: '#854D0E',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>⭐</span>
                  <span>{menu.specialItem}</span>
                </div>

                {/* Lunch Card Preview */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#15803D' }}>
                      🍛 Lunch (12:30 PM - 2:30 PM)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      TODAY'S SPECIAL
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45, fontWeight: 500 }}>
                    {menu.lunch}
                  </div>
                </div>

                {/* Dinner Card Preview */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>
                      🍲 Dinner (7:45 PM - 9:45 PM)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Evening Meal</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45, fontWeight: 500 }}>
                    {menu.dinner}
                  </div>
                </div>

                {/* Breakfast Preview */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '0.2rem' }}>
                    ☕ Morning Breakfast (7:30 AM - 9:30 AM)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                    {menu.breakfast}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DIRECT / BROADCAST NOTIFICATION MODAL */}
        {/* ========================================================================= */}
        {isNotifModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.75rem',
                maxWidth: '540px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1.5px solid #E2E8F0',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsNotifModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    {targetStudent ? 'Send Notification to Student' : 'Broadcast Alert to All Mess Students'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {targetStudent
                      ? `Targeting: ${targetStudent.customer.name} (Room ${targetStudent.customer.roomNumber || 'Hostel'})`
                      : `Targeting: All ${bookings.length} registered campus mess subscribers`}
                  </div>
                </div>
              </div>

              {/* Quick Template Buttons */}
              <div style={{ margin: '1rem 0 0.75rem 0' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Quick Message Templates:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifTitle('📍 Khana Hostel Gate Pe Aa Gaya Hai!');
                      setNotifMessage(
                        targetStudent
                          ? `Hi ${targetStudent.customer.name.split(' ')[0]}, your hot meal has arrived at Hostel Gate! Please collect now.`
                          : 'Annapurna Mess delivery van has reached the Hostel Security Gate. Fresh hot tiffins are ready for collection!'
                      );
                    }}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      fontSize: '0.74rem',
                      color: '#1D4ED8',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    📍 Gate Arrived
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNotifTitle('🍛 Today\'s Special Lunch Ready');
                      setNotifMessage('Fresh Paneer Butter Masala, Dal Tadka & hot phulkas ready at the dining counter!');
                    }}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      fontSize: '0.74rem',
                      color: '#15803D',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🍛 Lunch Ready
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNotifTitle('⏰ Dinner Counter Closing in 30 Mins');
                      setNotifMessage('Mess dinner service closes at 9:45 PM tonight. Please pick up your tiffins before closing.');
                    }}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FDE68A',
                      fontSize: '0.74rem',
                      color: '#B45309',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ⏰ Dinner Reminder
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNotifTitle('🎉 Sunday Feast Special Announcement');
                      setNotifMessage('Special dessert and paneer feast scheduled this Sunday! Meal tokens active.');
                    }}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: '#F5F3FF',
                      border: '1px solid #DDD6FE',
                      fontSize: '0.74rem',
                      color: '#6D28D9',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🎉 Sunday Feast
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendNotificationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                    Notification Title
                  </label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                    Message Content
                  </label>
                  <textarea
                    rows={3}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      lineHeight: 1.4,
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Priority:</span>
                    <button
                      type="button"
                      onClick={() => setNotifPriority('normal')}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: notifPriority === 'normal' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: notifPriority === 'normal' ? '#EFF6FF' : '#FFFFFF',
                        color: notifPriority === 'normal' ? '#1D4ED8' : '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifPriority('high')}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: notifPriority === 'high' ? '1.5px solid #DC2626' : '1px solid #E2E8F0',
                        backgroundColor: notifPriority === 'high' ? '#FEF2F2' : '#FFFFFF',
                        color: notifPriority === 'high' ? '#DC2626' : '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      🔥 Urgent / Gate Alert
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsNotifModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      color: '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSendingNotif}
                    style={{
                      flex: 2,
                      padding: '0.75rem',
                      backgroundColor: '#15803D',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: isSendingNotif ? 'wait' : 'pointer',
                      boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Send size={15} />
                    <span>{isSendingNotif ? 'Sending Alert...' : 'Send Alert Now'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
