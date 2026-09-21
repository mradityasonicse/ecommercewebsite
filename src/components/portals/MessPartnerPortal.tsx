import React, { useState } from 'react';
import {
  CheckCircle2,
  Bell,
  Save,
  ArrowLeft,
  Sparkles,
  LogOut,
  Flame,
  ChefHat,
} from 'lucide-react';
import { CampusStateService } from '../../services/campusStateService';

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

    setSaveToast('✅ Today\'s Live Mess Menu has been published to student home screens!');
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

    // If gate arrived, trigger high-priority student alert
    if (newStage === 'gate_arrived') {
      triggerGateNotification();
    } else {
      const stageTitles: Record<KitchenStage, string> = {
        cooking: '🍳 Khana Ban Raha Hai (Cooking in Progress)',
        dispatched: '🛵 Dispatch Ho Gaya (Van left kitchen for hostels)',
        gate_arrived: '📍 Hostel Gate Pe Pahunch Gaya!',
        delivered: '✅ Delivery Completed / Done',
      };
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
        paddingBottom: '5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
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
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Live Daily Kitchen Console</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: '#0F172A' }}>
                Annapurna Student Mess — Menu &amp; Delivery Console
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
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
              <span>Switch Role / Logout</span>
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
            }}
          >
            <CheckCircle2 size={18} />
            <span>{saveToast}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: 4-STAGE LIVE COOKING & DELIVERY PIPELINE (Core User Requirement) */}
        {/* ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #86EFAC',
            boxShadow: '0 8px 24px rgba(22, 163, 74, 0.08)',
            padding: '1.5rem',
            marginBottom: '2rem',
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
                Select current stage to update students' live tracking screen and send gate arrival alerts.
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
                Kitchen staff cooking fresh rotis and sabzi in commercial cookware.
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
                Packed inside insulated thermal containers; delivery bike on the way.
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
                position: 'relative',
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
                Dispatches immediate popup &amp; notification to all registered students!
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

        {/* ========================================================================= */}
        {/* SECTION 2: TODAY'S ACTIVE MENU LIVE EDITOR */}
        {/* ========================================================================= */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ChefHat size={20} color="#15803D" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                Update Today's Menu Board
              </h2>
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
              This is exactly what hostel students see right now on the EaseHub homepage and mobile bottom sheet.
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
      </div>
    </div>
  );
};
