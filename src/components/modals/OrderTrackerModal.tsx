import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Clock,
  CheckCircle2,
  MessageCircle,
  Search,
  Wifi,
  Bike,
  Flame,
  Calendar,
  CreditCard,
  FileCheck,
  Key,
  Home,
  UtensilsCrossed,
  Package,
  MapPin,
  Shirt,
  Sparkles,
  Scale,
} from 'lucide-react';
import {
  PgLivingIcon,
  MessCulinaryIcon,
  LaundryAquaIcon,
} from '../icons/ProfessionalCategoryIcons';
import {
  TrackingBackendService,
  type TrackableOrder,
  type PgOrder,
  type MessOrder,
  type LaundryOrder,
  type PgStage,
  type MessStage,
  type LaundryStage,
} from '../../services/trackingBackendService';

export interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  defaultTab?: 'mess' | 'laundry' | 'pg';
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orderId,
  defaultTab = 'mess',
}) => {
  const [orders, setOrders] = useState<TrackableOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TrackableOrder | null>(null);
  const [activeKind, setActiveKind] = useState<'mess' | 'laundry' | 'pg'>(defaultTab);

  const [searchInput, setSearchInput] = useState('');
  const [copiedMenu, setCopiedMenu] = useState(false);

  // Live ticking countdown for meal delivery
  const [countdownSecs, setCountdownSecs] = useState<number>(685);

  // Load backend orders on modal open
  useEffect(() => {
    if (isOpen) {
      const allOrders = TrackingBackendService.getAllOrders();
      setOrders(allOrders);

      if (orderId) {
        const found = allOrders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
        if (found) {
          setSelectedOrder(found);
          setActiveKind(found.kind);
          return;
        }
      }

      // Default to matching kind
      const match = allOrders.find((o) => o.kind === defaultTab) || allOrders[0];
      setSelectedOrder(match || null);
      if (match) setActiveKind(match.kind);
    }
  }, [isOpen, orderId, defaultTab]);

  // Ticking countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdownSecs((prev) => (prev > 1 ? prev - 1 : 720));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Listen for backend real-time updates
  useEffect(() => {
    const handleOrderUpdate = () => {
      const refreshed = TrackingBackendService.getAllOrders();
      setOrders(refreshed);
      if (selectedOrder) {
        const updatedCurrent = refreshed.find((o) => o.id === selectedOrder.id);
        if (updatedCurrent) setSelectedOrder(updatedCurrent);
      }
    };

    window.addEventListener('easehub_order_status_updated', handleOrderUpdate);
    window.addEventListener('easehub_campus_status_updated', handleOrderUpdate);
    return () => {
      window.removeEventListener('easehub_order_status_updated', handleOrderUpdate);
      window.removeEventListener('easehub_campus_status_updated', handleOrderUpdate);
    };
  }, [selectedOrder]);

  if (!isOpen) return null;

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // Switch Category Tab (PG / Mess / Laundry)
  const handleTabSwitch = (kind: 'mess' | 'laundry' | 'pg') => {
    setActiveKind(kind);
    const match = orders.find((o) => o.kind === kind);
    if (match) setSelectedOrder(match);
  };

  // Search order by ID or Name
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const q = searchInput.trim().toLowerCase();
    const found = orders.find(
      (o) => o.id.toLowerCase().includes(q) || o.studentName.toLowerCase().includes(q) || o.utrNumber.toLowerCase().includes(q)
    );
    if (found) {
      setSelectedOrder(found);
      setActiveKind(found.kind);
      setSearchInput('');
    }
  };

  // Interactive Stage Advance (Working Simulation)
  const handleAdvanceStage = (newStage: string) => {
    if (!selectedOrder) return;
    const updated = TrackingBackendService.updateOrderStatus(selectedOrder.id, newStage as any);
    if (updated) setSelectedOrder(updated);
  };

  // Contact Handlers
  const handleWhatsApp = (phone: string, text: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renderStageIcon = (key: string) => {
    switch (key) {
      case 'visit_scheduled': return <Calendar size={15} />;
      case 'visit_completed': return <Search size={15} />;
      case 'token_paid': return <CreditCard size={15} />;
      case 'kyc_verified': return <FileCheck size={15} />;
      case 'keys_handed_over': return <Key size={15} />;
      case 'resident_active': return <Home size={15} />;
      case 'kitchen_prep': return <UtensilsCrossed size={15} />;
      case 'packed_thermal': return <Package size={15} />;
      case 'out_for_delivery': return <Bike size={15} />;
      case 'arrived_at_gate': return <MapPin size={15} />;
      case 'pickup_scheduled': return <Calendar size={15} />;
      case 'picked_up': return <Scale size={15} />;
      case 'in_wash': return <Shirt size={15} />;
      case 'steam_ironing': return <Sparkles size={15} />;
      case 'delivered': return <CheckCircle2 size={15} />;
      default: return <Clock size={15} />;
    }
  };

  // --- STAGE METADATA ---
  const pgStages: Array<{ key: PgStage; title: string; desc: string; icon: string }> = [
    { key: 'visit_scheduled', title: '1. Room Visit Scheduled', desc: 'Coordinator assigned for in-person room inspection.', icon: '📅' },
    { key: 'visit_completed', title: '2. Room Inspected & Selected', desc: 'Student inspected AC room, study desk & attached bath.', icon: '🔍' },
    { key: 'token_paid', title: '3. Token Advance Received', desc: 'Verified via instant UPI QR payment proof.', icon: '💳' },
    { key: 'kyc_verified', title: '4. KYC ID & Agreement Done', desc: 'Hostel rules signed, Aadhar & student ID verified.', icon: '📄' },
    { key: 'keys_handed_over', title: '5. Keys & Gate Pass Handover', desc: 'Physical room keys handed over with biometric access.', icon: '🔑' },
    { key: 'resident_active', title: '6. Active Campus Resident', desc: 'Move-in complete! Wi-Fi & warden support enabled.', icon: '🏠' },
  ];

  const messStages: Array<{ key: MessStage; title: string; desc: string; icon: string }> = [
    { key: 'kitchen_prep', title: '1. Chef Cooking in Kitchen', desc: 'Fresh tawa chapatis, gravies & dal simmering in central kitchen.', icon: '👨‍🍳' },
    { key: 'packed_thermal', title: '2. Thermal Box Packed', desc: 'Food hygienically sealed in heat-retention containers.', icon: '📦' },
    { key: 'out_for_delivery', title: '3. Out for Hostel Delivery', desc: 'Campus pilot Rahul en route on bike to your hostel block.', icon: '🛵' },
    { key: 'arrived_at_gate', title: '4. Arrived at Hostel Gate', desc: 'Delivery pilot has arrived! Food ready at collection desk.', icon: '🎉' },
    { key: 'delivered', title: '5. Delivered & Completed', desc: 'Meal received and verified by student.', icon: '✅' },
  ];

  const laundryStages: Array<{ key: LaundryStage; title: string; desc: string; icon: string }> = [
    { key: 'pickup_scheduled', title: '1. Pickup Scheduled', desc: 'Campus rider assigned to collect clothes from room.', icon: '🧺' },
    { key: 'picked_up', title: '2. Clothes Collected & Weighed', desc: 'Barcoded laundry bag collected & weighed (4.8 kg).', icon: '⚖️' },
    { key: 'in_wash', title: '3. Anti-Bacterial Wash', desc: 'Treated with front-load hypo-allergenic sanitization.', icon: '🧼' },
    { key: 'steam_ironing', title: '4. High-Temp Steam Press', desc: 'Wrinkle-free steam ironed and hygienic fold-packed.', icon: '♨️' },
    { key: 'out_for_delivery', title: '5. Out for Doorstep Delivery', desc: 'Clean fresh clothes en route back to your hostel door.', icon: '🛵' },
    { key: 'delivered', title: '6. Delivered to Student', desc: 'Order completed at hostel room.', icon: '✅' },
  ];

  const currentKind = selectedOrder?.kind || activeKind;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-tracker-title"
      className="easehub-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="easehub-bottom-sheet"
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid rgba(22, 163, 74, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(22, 163, 74, 0.2), 0 10px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Mobile Pull Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0 0', backgroundColor: '#F8FAF7' }}>
          <div style={{ width: '42px', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '9999px' }} />
        </div>

        {/* Header Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: '#F8FAF7',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: currentKind === 'pg' 
                  ? 'linear-gradient(135deg, #16A34A, #15803D)'
                  : currentKind === 'mess'
                  ? 'linear-gradient(135deg, #EAB308, #CA8A04)'
                  : 'linear-gradient(135deg, #16A34A, #0D9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
              }}
            >
              {currentKind === 'pg' ? <PgLivingIcon size={22} /> : currentKind === 'mess' ? <MessCulinaryIcon size={22} /> : <LaundryAquaIcon size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 id="order-tracker-title" style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Live Campus Fulfillment Engine
                </h3>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    border: '1px solid #86EFAC',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                  LIVE PIPELINE
                </span>
              </div>
              <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                {selectedOrder 
                  ? `Order #${selectedOrder.id} • ${selectedOrder.packageName} (${selectedOrder.studentName})`
                  : 'Select an order or service tab to view real-time tracking'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Search & Order Switcher Strip */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Quick Order Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>ORDERS:</span>
            {orders.slice(0, 4).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setSelectedOrder(ord);
                  setActiveKind(ord.kind);
                }}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '8px',
                  border: ord.id === selectedOrder?.id ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
                  backgroundColor: ord.id === selectedOrder?.id ? '#DCFCE7' : '#F8FAF7',
                  color: ord.id === selectedOrder?.id ? '#15803D' : '#64748B',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                #{ord.id} ({ord.kind.toUpperCase()})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search ID or Name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  padding: '0.35rem 0.6rem 0.35rem 1.8rem',
                  backgroundColor: '#F8FAF7',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  color: '#0F172A',
                  fontSize: '0.75rem',
                  outline: 'none',
                  width: '150px',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '0.35rem 0.65rem',
                backgroundColor: '#16A34A',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Find
            </button>
          </form>
        </div>

        {/* Primary Service Selector (PG vs Mess vs Laundry) */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAF7',
            padding: '0.5rem 1rem 0 1rem',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => handleTabSwitch('pg')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeKind === 'pg' ? '3px solid #16A34A' : '3px solid transparent',
              color: activeKind === 'pg' ? '#15803D' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <PgLivingIcon size={18} color={activeKind === 'pg' ? '#15803D' : '#64748B'} />
            <span>PG & Room Move-In Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('mess')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeKind === 'mess' ? '3px solid #EAB308' : '3px solid transparent',
              color: activeKind === 'mess' ? '#854D0E' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <MessCulinaryIcon size={18} color={activeKind === 'mess' ? '#854D0E' : '#64748B'} />
            <span>Daily Mess Meal Delivery</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('laundry')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeKind === 'laundry' ? '3px solid #16A34A' : '3px solid transparent',
              color: activeKind === 'laundry' ? '#15803D' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LaundryAquaIcon size={18} color={activeKind === 'laundry' ? '#15803D' : '#64748B'} />
            <span>Doorstep Laundry Pipeline</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, backgroundColor: '#FFFFFF' }}>
          {/* ========================================================================= */}
          {/* 1. PG ACCOMMODATION & MOVE-IN PIPELINE                                     */}
          {/* ========================================================================= */}
          {activeKind === 'pg' && (
            <div>
              {/* PG Top Telemetry Banner */}
              <div
                style={{
                  padding: '1.2rem 1.4rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                  border: '1.5px solid #86EFAC',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Hostel Accommodation Lifecycle
                      </span>
                      <span style={{ color: '#CBD5E1' }}>•</span>
                      <span style={{ fontSize: '0.74rem', color: '#475569' }}>Order #{selectedOrder?.id || 'EH-3914'}</span>
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                      {selectedOrder?.serviceTitle || 'Royal Executive AC PG'}
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#475569', display: 'block', marginTop: '0.25rem' }}>
                      Resident: <strong style={{ color: '#0F172A' }}>{selectedOrder?.studentName || 'Priya Sharma'}</strong> • {selectedOrder?.hostelRoom || 'Kurud Rd Near Gate 1'}
                    </span>
                  </div>

                  <span
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                      color: '#15803D',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                    }}
                  >
                    UPI PAYMENT VERIFIED (₹{selectedOrder?.amount || 6500})
                  </span>
                </div>
              </div>

              {/* PG Coordinator & Allocated Room Card */}
              <div
                style={{
                  backgroundColor: '#F8FAF7',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>CAMPUS FIELD COORDINATOR</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    Manish Sahu (+91 81028 48776)
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Available for room keys & biometric access</span>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleWhatsApp('918102848776', `Hi Manish! I am at the hostel gate for my room visit #${selectedOrder?.id || 'EH-3914'}.`)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <MessageCircle size={13} />
                      <span>Chat with Coordinator</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>ALLOCATED ROOM & AMENITIES</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803D', marginTop: '0.2rem' }}>
                    Room 204 (AC Double Sharing)
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Attached balcony, 2 study desks & high-speed fiber Wi-Fi</span>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Wifi size={14} color="#16A34A" />
                    <span style={{ fontSize: '0.75rem', color: '#334155' }}>SSID: <strong>RoyalExecutive_5G</strong> (Pass: CampusStay#2026)</span>
                  </div>
                </div>
              </div>

              {/* PG 6-Stage Progression Stepper */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    PG Move-In Lifecycle (Tap to Advance / Test Stage)
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pgStages.map((stg, idx) => {
                    const currentOrderStage = (selectedOrder as PgOrder)?.currentStage || 'visit_scheduled';
                    const currentIdx = pgStages.findIndex((s) => s.key === currentOrderStage);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stg.key}
                        onClick={() => handleAdvanceStage(stg.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: isCurrent ? '#F0FDF4' : isCompleted ? '#F8FAF7' : '#FFFFFF',
                          border: `1.5px solid ${isCurrent ? '#16A34A' : isCompleted ? '#86EFAC' : '#E2E8F0'}`,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? '#16A34A' : isCurrent ? '#15803D' : '#F1F5F9',
                            color: isCurrent || isCompleted ? '#FFFFFF' : '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : renderStageIcon(stg.key)}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isCurrent ? '#15803D' : isCompleted ? '#0F172A' : '#64748B' }}>
                              {stg.title}
                            </span>
                            {isCurrent && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803D', backgroundColor: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #86EFAC' }}>
                                CURRENT STATUS
                              </span>
                            )}
                            {isCompleted && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16A34A' }}>DONE</span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '0.15rem' }}>
                            {stg.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DAILY MESS FOOD DELIVERY PIPELINE                                      */}
          {/* ========================================================================= */}
          {activeKind === 'mess' && (
            <div>
              {/* Live Delivery Telemetry Banner */}
              <div
                style={{
                  padding: '1.2rem 1.4rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FEFCE8, #FEF08A)',
                  border: '1.5px solid #FDE047',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#854D0E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Hot Meal Delivery Tracker
                    </span>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <span style={{ fontSize: '0.74rem', color: '#713F12' }}>Order #{selectedOrder?.id || 'EH-8492'}</span>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedOrder?.serviceTitle || 'Annapurna Homely Student Mess'}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginTop: '0.25rem' }}>
                    Delivering to: <strong style={{ color: '#0F172A' }}>{selectedOrder?.studentName || 'Aryan Deshmukh'}</strong> • {selectedOrder?.hostelRoom || 'Block B, Room 204'}
                  </span>
                </div>

                {/* Real-time Ticking Countdown Box */}
                <div
                  style={{
                    textAlign: 'center',
                    padding: '0.65rem 1.1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1.5px solid #FACC15',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#854D0E', marginBottom: '2px' }}>
                    <Clock size={15} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Live ETA</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#A16207', fontFamily: 'monospace' }}>
                    {formatCountdown(countdownSecs)}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Est. ~08:15 PM</span>
                </div>
              </div>

              {/* Delivery Pilot Card */}
              <div
                style={{
                  backgroundColor: '#F8FAF7',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.85rem 1.15rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#FEF08A',
                      color: '#854D0E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bike size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                      Rider Rahul Sharma (Pilot #402)
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Honda Activa (CG-07-AB-4921) • En route to Hostel Block B
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleWhatsApp('918102848776', `Hi Rahul! I am waiting for meal order #${selectedOrder?.id || 'EH-8492'}. How far are you?`)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Delivery Pilot</span>
                </button>
              </div>

              {/* Mess 5-Stage Stepper */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Meal Delivery Lifecycle (Tap to Advance / Test Stage)
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {messStages.map((stg, idx) => {
                    const currentMessStage = (selectedOrder as MessOrder)?.currentStage || 'out_for_delivery';
                    const currentIdx = messStages.findIndex((s) => s.key === currentMessStage);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stg.key}
                        onClick={() => handleAdvanceStage(stg.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: isCurrent ? '#FEFCE8' : isCompleted ? '#F0FDF4' : '#FFFFFF',
                          border: `1.5px solid ${isCurrent ? '#EAB308' : isCompleted ? '#86EFAC' : '#E2E8F0'}`,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? '#16A34A' : isCurrent ? '#EAB308' : '#F1F5F9',
                            color: isCurrent || isCompleted ? '#FFFFFF' : '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : renderStageIcon(stg.key)}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isCurrent ? '#854D0E' : isCompleted ? '#0F172A' : '#64748B' }}>
                              {stg.title}
                            </span>
                            {isCurrent && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#854D0E', backgroundColor: '#FEF08A', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #FACC15' }}>
                                CURRENT STATUS
                              </span>
                            )}
                            {isCompleted && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16A34A' }}>DONE</span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '0.15rem' }}>
                            {stg.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Live Menu Card */}
              <div
                style={{
                  backgroundColor: '#F8FAF7',
                  border: '1.5px solid #FEF08A',
                  borderRadius: '16px',
                  padding: '1.15rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Flame size={16} color="#EAB308" />
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                      Today's Live Kitchen Menu
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `🍽️ Today's EaseHub Menu:\n☀️ Lunch: Shahi Paneer, Dal Tadka, Roti\n🌙 Dinner: Dal Makhani, Gulab Jamun`;
                      navigator.clipboard.writeText(text);
                      setCopiedMenu(true);
                      setTimeout(() => setCopiedMenu(false), 2000);
                    }}
                    style={{
                      padding: '0.25rem 0.55rem',
                      backgroundColor: copiedMenu ? '#DCFCE7' : '#FEF08A',
                      border: '1px solid #FACC15',
                      borderRadius: '6px',
                      color: copiedMenu ? '#15803D' : '#854D0E',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedMenu ? 'Copied!' : 'Copy Menu'}
                  </button>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                  <strong style={{ color: '#0F172A' }}>🌙 Tonight's Dinner:</strong> Dal Makhani, Mix Veg Masala, Steamed Basmati Rice, 4 Fresh Phulkas & Hot Gulab Jamun.
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. DOORSTEP LAUNDRY PIPELINE                                              */}
          {/* ========================================================================= */}
          {activeKind === 'laundry' && (
            <div>
              {/* Laundry Telemetry Banner */}
              <div
                style={{
                  padding: '1.2rem 1.4rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                  border: '1.5px solid #86EFAC',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Doorstep Laundry & Iron Pipeline
                      </span>
                      <span style={{ color: '#CBD5E1' }}>•</span>
                      <span style={{ fontSize: '0.74rem', color: '#475569' }}>Batch #{(selectedOrder as LaundryOrder)?.batchCode || 'BATCH-RN41'}</span>
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                      {selectedOrder?.serviceTitle || 'Doorstep Steam Iron & Express Wash'}
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#475569', display: 'block', marginTop: '0.25rem' }}>
                      Student: <strong style={{ color: '#0F172A' }}>{selectedOrder?.studentName || 'Vivek Kashyap'}</strong> • {selectedOrder?.hostelRoom || 'Block C, Room 202'}
                    </span>
                  </div>

                  <span
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FEF08A',
                      border: '1px solid #FACC15',
                      color: '#854D0E',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                    }}
                  >
                    WEIGHT: {(selectedOrder as LaundryOrder)?.weightKg || 4.8} KG ({(selectedOrder as LaundryOrder)?.itemCount || 14} ITEMS)
                  </span>
                </div>
              </div>

              {/* Laundry 6-Stage Stepper */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Doorstep Laundry Lifecycle (Tap to Advance / Test Stage)
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {laundryStages.map((stg, idx) => {
                    const currentLaundryStage = (selectedOrder as LaundryOrder)?.currentStage || 'steam_ironing';
                    const currentIdx = laundryStages.findIndex((s) => s.key === currentLaundryStage);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stg.key}
                        onClick={() => handleAdvanceStage(stg.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: isCurrent ? '#F0FDF4' : isCompleted ? '#F8FAF7' : '#FFFFFF',
                          border: `1.5px solid ${isCurrent ? '#16A34A' : isCompleted ? '#86EFAC' : '#E2E8F0'}`,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? '#16A34A' : isCurrent ? '#15803D' : '#F1F5F9',
                            color: isCurrent || isCompleted ? '#FFFFFF' : '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : renderStageIcon(stg.key)}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isCurrent ? '#15803D' : isCompleted ? '#0F172A' : '#64748B' }}>
                              {stg.title}
                            </span>
                            {isCurrent && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803D', backgroundColor: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #86EFAC' }}>
                                CURRENT STATUS
                              </span>
                            )}
                            {isCompleted && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16A34A' }}>DONE</span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '0.15rem' }}>
                            {stg.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleWhatsApp('918102848776', `Hi! I want to check my laundry order #${selectedOrder?.id || 'EH-5102'} (Batch: BATCH-RN41).`)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                }}
              >
                <MessageCircle size={18} color="#FFFFFF" />
                <span>WhatsApp Laundry Hub Pilot</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
