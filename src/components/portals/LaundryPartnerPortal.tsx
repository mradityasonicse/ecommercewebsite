import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  ArrowLeft,
  LogOut,
  Search,
} from 'lucide-react';

export type LaundryStage =
  | 'scheduled'
  | 'picked_up'
  | 'in_wash'
  | 'out_for_delivery'
  | 'delivered';

export interface LaundryOrder {
  id: string;
  studentName: string;
  studentPhone: string;
  hostelBlock: string;
  roomNumber: string;
  scheduledTime: string; // e.g., "10:30 AM"
  scheduledDate: string; // e.g., "Today, 21 Sep"
  weightKg: number;
  clothesCount: number;
  serviceType: 'Wash & Fold' | 'Wash & Steam Iron' | 'Express 12h Iron' | 'Blanket Deep Clean';
  stage: LaundryStage;
  amount: number;
  paymentStatus: 'Paid UPI' | 'Cash on Delivery';
  notes?: string;
}

const DEFAULT_LAUNDRY_ORDERS: LaundryOrder[] = [
  {
    id: 'LD-4091',
    studentName: 'Rahul Verma',
    studentPhone: '9876543210',
    hostelBlock: 'Boys Hostel 1',
    roomNumber: '304',
    scheduledTime: '10:30 AM',
    scheduledDate: 'Today',
    weightKg: 4.2,
    clothesCount: 14,
    serviceType: 'Wash & Steam Iron',
    stage: 'in_wash',
    amount: 180,
    paymentStatus: 'Paid UPI',
    notes: 'Handle white lab coat with care',
  },
  {
    id: 'LD-4092',
    studentName: 'Sneha Patel',
    studentPhone: '9425123456',
    hostelBlock: 'Girls Hostel B',
    roomNumber: '210',
    scheduledTime: '11:15 AM',
    scheduledDate: 'Today',
    weightKg: 3.5,
    clothesCount: 10,
    serviceType: 'Wash & Fold',
    stage: 'out_for_delivery',
    amount: 140,
    paymentStatus: 'Paid UPI',
    notes: 'Call before arriving at security gate',
  },
  {
    id: 'LD-4093',
    studentName: 'Aman Kumar',
    studentPhone: '9123456789',
    hostelBlock: 'Rungta PG Block C',
    roomNumber: '102',
    scheduledTime: '2:00 PM',
    scheduledDate: 'Today',
    weightKg: 5.0,
    clothesCount: 18,
    serviceType: 'Express 12h Iron',
    stage: 'scheduled',
    amount: 220,
    paymentStatus: 'Cash on Delivery',
    notes: 'Urgent formal shirts for interview tomorrow',
  },
  {
    id: 'LD-4094',
    studentName: 'Devansh Tiwari',
    studentPhone: '9893112233',
    hostelBlock: 'Hostel Block A',
    roomNumber: '418',
    scheduledTime: '9:00 AM',
    scheduledDate: 'Today',
    weightKg: 6.5,
    clothesCount: 20,
    serviceType: 'Blanket Deep Clean',
    stage: 'delivered',
    amount: 350,
    paymentStatus: 'Paid UPI',
    notes: 'Delivered to room attendant',
  },
];

const STORAGE_KEY = 'easehub_laundry_orders_v1';

export const LaundryPartnerPortal: React.FC<{
  onBackToApp?: () => void;
  onSwitchRole?: () => void;
}> = ({ onBackToApp, onSwitchRole }) => {
  const [orders, setOrders] = useState<LaundryOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_LAUNDRY_ORDERS;
    } catch {
      return DEFAULT_LAUNDRY_ORDERS;
    }
  });

  const [filter, setFilter] = useState<'all' | LaundryStage>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Order Form state
  const [newStudent, setNewStudent] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newHostel, setNewHostel] = useState('Boys Hostel 1');
  const [newRoom, setNewRoom] = useState('');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newWeight, setNewWeight] = useState(4.0);
  const [newCount, setNewCount] = useState(12);
  const [newService, setNewService] = useState<LaundryOrder['serviceType']>('Wash & Steam Iron');
  const [newAmount, setNewAmount] = useState(180);

  const persistOrders = (updated: LaundryOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error', e);
    }
  };

  const STAGE_ORDER: LaundryStage[] = [
    'scheduled',
    'picked_up',
    'in_wash',
    'out_for_delivery',
    'delivered',
  ];

  const handleAdvanceStage = (orderId: string) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        const currentIndex = STAGE_ORDER.indexOf(ord.stage);
        if (currentIndex < STAGE_ORDER.length - 1) {
          const nextStage = STAGE_ORDER[currentIndex + 1];

          // Broadcast status change for tracking
          setToastMessage(
            `🚀 ${ord.id} (${ord.studentName}): Advanced to "${getStageLabel(nextStage)}"`
          );
          setTimeout(() => setToastMessage(null), 3000);

          return { ...ord, stage: nextStage };
        }
      }
      return ord;
    });
    persistOrders(updated);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent || !newRoom) return;

    const newOrder: LaundryOrder = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: newStudent,
      studentPhone: newPhone || '9876543210',
      hostelBlock: newHostel,
      roomNumber: newRoom,
      scheduledTime: newTime,
      scheduledDate: 'Today',
      weightKg: newWeight,
      clothesCount: newCount,
      serviceType: newService,
      stage: 'scheduled',
      amount: newAmount,
      paymentStatus: 'Paid UPI',
    };

    persistOrders([newOrder, ...orders]);
    setIsAddModalOpen(false);
    setToastMessage(`✅ Pickup Scheduled for ${newStudent} at ${newTime}!`);
    setTimeout(() => setToastMessage(null), 3500);

    setNewStudent('');
    setNewRoom('');
  };

  const getStageLabel = (stage: LaundryStage): string => {
    switch (stage) {
      case 'scheduled':
        return '⏰ Scheduled Pickup';
      case 'picked_up':
        return '🧺 Picked Up & Weighed';
      case 'in_wash':
        return '🧼 Washing & Steam Press';
      case 'out_for_delivery':
        return '🚚 Out for Delivery';
      case 'delivered':
        return '✅ Delivered to Room / Done';
    }
  };

  const getStageBadgeStyle = (stage: LaundryStage) => {
    switch (stage) {
      case 'scheduled':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' };
      case 'picked_up':
        return { bg: '#E0E7FF', text: '#4338CA', border: '#A5B4FC' };
      case 'in_wash':
        return { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' };
      case 'out_for_delivery':
        return { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74' };
      case 'delivered':
        return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filter === 'all' || o.stage === filter;
    const matchSearch =
      search === '' ||
      o.studentName.toLowerCase().includes(search.toLowerCase()) ||
      o.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.hostelBlock.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

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
        {/* Top Header */}
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
                    backgroundColor: '#E0E7FF',
                    color: '#4338CA',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    border: '1px solid #C7D2FE',
                  }}
                >
                  LAUNDRY PARTNER PORTAL
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Doorstep Scheduled Pickup &amp; Wash Queue</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: '#0F172A' }}>
                Campus Express Laundry — Pickup &amp; Delivery Console
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
              onClick={() => setIsAddModalOpen(true)}
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
              <Plus size={16} />
              <span>New Pickup Slot</span>
            </button>
          </div>
        </div>

        {/* Live Action Toast */}
        {toastMessage && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#DCFCE7',
              border: '1.5px solid #16A34A',
              borderRadius: '12px',
              color: '#15803D',
              fontWeight: 700,
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Scheduled Pickups Today
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#B45309', marginTop: '0.35rem' }}>
              {orders.filter((o) => o.stage === 'scheduled').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
              Awaiting delivery boy arrival
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #93C5FD' }}>
            <div style={{ fontSize: '0.78rem', color: '#1D4ED8', fontWeight: 700, textTransform: 'uppercase' }}>
              In Wash &amp; Pressing
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1D4ED8', marginTop: '0.35rem' }}>
              {orders.filter((o) => o.stage === 'in_wash' || o.stage === 'picked_up').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#60A5FA', marginTop: '0.25rem' }}>
              Steam irons running
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #FDBA74' }}>
            <div style={{ fontSize: '0.78rem', color: '#C2410C', fontWeight: 700, textTransform: 'uppercase' }}>
              Out for Delivery
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#C2410C', marginTop: '0.35rem' }}>
              {orders.filter((o) => o.stage === 'out_for_delivery').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#EA580C', marginTop: '0.25rem' }}>
              Returning back to hostel rooms
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #86EFAC' }}>
            <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700, textTransform: 'uppercase' }}>
              Delivered Today
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803D', marginTop: '0.35rem' }}>
              {orders.filter((o) => o.stage === 'delivered').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.25rem' }}>
              Total Revenue: ₹{orders.reduce((acc, o) => acc + o.amount, 0)}
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
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
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(
              [
                ['all', 'All Bags'],
                ['scheduled', '⏰ Scheduled'],
                ['picked_up', '🧺 Weighed'],
                ['in_wash', '🧼 In Wash'],
                ['out_for_delivery', '🚚 Out for Delivery'],
                ['delivered', '✅ Completed'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setFilter(val)}
                style={{
                  padding: '0.45rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: filter === val ? '1.5px solid #15803D' : '1px solid #E2E8F0',
                  backgroundColor: filter === val ? '#DCFCE7' : '#FFFFFF',
                  color: filter === val ? '#15803D' : '#64748B',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Search student, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.8rem 0.45rem 2rem',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
              }}
            />
          </div>
        </div>

        {/* Scheduled Laundry Queue Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAF7', borderBottom: '1.5px solid #E2E8F0' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800 }}>Order ID &amp; Time</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800 }}>Student &amp; Hostel Room</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800 }}>Package &amp; Clothes Weight</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800 }}>Current Lifecycle Stage</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800 }}>Amount</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800 }}>Advance Stage</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const bStyle = getStageBadgeStyle(ord.stage);
                  return (
                    <tr
                      key={ord.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{ord.id}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem', color: '#15803D', fontWeight: 700, marginTop: '0.15rem' }}>
                          <Clock size={12} />
                          <span>{ord.scheduledTime} ({ord.scheduledDate})</span>
                        </div>
                      </td>

                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{ord.studentName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                          <MapPin size={12} />
                          <span>{ord.hostelBlock}, Room {ord.roomNumber}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{ord.studentPhone}</div>
                      </td>

                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{ord.serviceType}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                          <span style={{ fontSize: '0.74rem', color: '#0F172A', fontWeight: 800 }}>
                            {ord.weightKg} kg
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            ({ord.clothesCount} pcs)
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            backgroundColor: bStyle.bg,
                            color: bStyle.text,
                            border: `1px solid ${bStyle.border}`,
                          }}
                        >
                          {getStageLabel(ord.stage)}
                        </span>
                      </td>

                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#15803D', fontSize: '0.92rem' }}>
                          ₹{ord.amount}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{ord.paymentStatus}</div>
                      </td>

                      <td style={{ padding: '0.9rem 1rem' }}>
                        {ord.stage !== 'delivered' ? (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStage(ord.id)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              backgroundColor: '#15803D',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.2)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Advance Stage →
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.76rem', color: '#16A34A', fontWeight: 700 }}>
                            ✅ Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Pickup Modal */}
        {isAddModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
                border: '1.5px solid #E2E8F0',
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                Schedule New Laundry Pickup Slot
              </h3>

              <form onSubmit={handleCreateOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Akash Sharma"
                    value={newStudent}
                    onChange={(e) => setNewStudent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Hostel Block
                    </label>
                    <select
                      value={newHostel}
                      onChange={(e) => setNewHostel(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    >
                      <option value="Boys Hostel 1">Boys Hostel 1</option>
                      <option value="Boys Hostel 2">Boys Hostel 2</option>
                      <option value="Girls Hostel A">Girls Hostel A</option>
                      <option value="Girls Hostel B">Girls Hostel B</option>
                      <option value="Executive Campus PG">Executive Campus PG</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Room Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 302"
                      value={newRoom}
                      onChange={(e) => setNewRoom(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Estimated Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Clothes Count (pcs)
                    </label>
                    <input
                      type="number"
                      value={newCount}
                      onChange={(e) => setNewCount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Pickup Time Slot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 11:30 AM"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Service Plan
                    </label>
                    <select
                      value={newService}
                      onChange={(e) => setNewService(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    >
                      <option value="Wash & Fold">Wash &amp; Fold</option>
                      <option value="Wash & Steam Iron">Wash &amp; Steam Iron</option>
                      <option value="Express 12h Iron">Express 12h Iron</option>
                      <option value="Blanket Deep Clean">Blanket Deep Clean</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{
                      padding: '0.65rem 1.2rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.65rem 1.4rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#15803D',
                      color: '#FFFFFF',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Schedule Pickup
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
