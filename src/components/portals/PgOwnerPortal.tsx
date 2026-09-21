import React, { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Trash2,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { CampusStateService } from '../../services/campusStateService';

export interface PgRoom {
  id: string;
  roomNumber: string;
  floor: string;
  roomType: 'Single AC' | 'Double Sharing' | 'Triple Sharing' | 'Executive Suite';
  totalBeds: number;
  vacantBeds: number;
  rentPerMonth: number;
  availableFrom: string; // e.g., "Available Immediately" or "From 1st Oct"
  amenities: string[];
  isAvailable: boolean;
}

const DEFAULT_ROOMS: PgRoom[] = [
  {
    id: 'room-101',
    roomNumber: '101',
    floor: '1st Floor',
    roomType: 'Single AC',
    totalBeds: 1,
    vacantBeds: 1,
    rentPerMonth: 8500,
    availableFrom: 'Available Immediately',
    amenities: ['Attached Washroom', 'Split AC', 'Study Table', 'High-Speed WiFi'],
    isAvailable: true,
  },
  {
    id: 'room-102',
    roomNumber: '102',
    floor: '1st Floor',
    roomType: 'Double Sharing',
    totalBeds: 2,
    vacantBeds: 1,
    rentPerMonth: 6500,
    availableFrom: 'Available Immediately',
    amenities: ['Balcony View', 'Cooler', '2 Wardrobes', 'WiFi'],
    isAvailable: true,
  },
  {
    id: 'room-201',
    roomNumber: '201',
    floor: '2nd Floor',
    roomType: 'Double Sharing',
    totalBeds: 2,
    vacantBeds: 0,
    rentPerMonth: 6000,
    availableFrom: 'Available from 1st Oct 2026',
    amenities: ['Attached Washroom', 'AC', 'Power Backup'],
    isAvailable: false,
  },
  {
    id: 'room-202',
    roomNumber: '202',
    floor: '2nd Floor',
    roomType: 'Triple Sharing',
    totalBeds: 3,
    vacantBeds: 2,
    rentPerMonth: 4800,
    availableFrom: 'Available Immediately',
    amenities: ['Spacious', 'Cooler', 'Common Geyser', 'Free Laundry Access'],
    isAvailable: true,
  },
  {
    id: 'room-301',
    roomNumber: '301',
    floor: '3rd Floor',
    roomType: 'Single AC',
    totalBeds: 1,
    vacantBeds: 0,
    rentPerMonth: 9000,
    availableFrom: 'Occupied till Nov 2026',
    amenities: ['Penthouse Balcony', 'Split AC', 'Fridge', 'Silent Study Area'],
    isAvailable: false,
  },
];

const STORAGE_KEY = 'easehub_pg_rooms_inventory_v1';

export const PgOwnerPortal: React.FC<{
  onBackToApp?: () => void;
  onSwitchRole?: () => void;
}> = ({ onBackToApp, onSwitchRole }) => {
  const [rooms, setRooms] = useState<PgRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ROOMS;
    } catch {
      return DEFAULT_ROOMS;
    }
  });

  const [filter, setFilter] = useState<'all' | 'vacant' | 'occupied'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New room form state
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newFloor, setNewFloor] = useState('1st Floor');
  const [newType, setNewType] = useState<PgRoom['roomType']>('Double Sharing');
  const [newTotalBeds, setNewTotalBeds] = useState(2);
  const [newVacantBeds, setNewVacantBeds] = useState(1);
  const [newRent, setNewRent] = useState(6500);
  const [newAvailableFrom, setNewAvailableFrom] = useState('Available Immediately');

  // Save to local storage & broadcast to public components
  const persistRooms = (updatedRooms: PgRoom[]) => {
    setRooms(updatedRooms);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRooms));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }

    // Sync with CampusStateService
    const totalVacant = updatedRooms.reduce((acc, r) => acc + r.vacantBeds, 0);
    CampusStateService.updatePgVacancy('pg-royal-comfort', totalVacant, [
      'Single AC Room',
      'Double Sharing',
      'Triple Sharing',
    ]);

    // Dispatch global event for immediate reactivity
    window.dispatchEvent(
      new CustomEvent('easehub:pg-vacancies-updated', {
        detail: { rooms: updatedRooms, totalVacant },
      })
    );

    setSavedNotice('✅ Room vacancy & rent changes updated live on student portal!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleToggleVacancy = (roomId: string) => {
    const updated = rooms.map((r) => {
      if (r.id === roomId) {
        const nextAvailable = !r.isAvailable;
        return {
          ...r,
          isAvailable: nextAvailable,
          vacantBeds: nextAvailable ? Math.max(1, r.vacantBeds || 1) : 0,
          availableFrom: nextAvailable ? 'Available Immediately' : 'Currently Occupied',
        };
      }
      return r;
    });
    persistRooms(updated);
  };

  const handleBedCountChange = (roomId: string, count: number) => {
    const updated = rooms.map((r) => {
      if (r.id === roomId) {
        const clamped = Math.max(0, Math.min(r.totalBeds, count));
        return {
          ...r,
          vacantBeds: clamped,
          isAvailable: clamped > 0,
          availableFrom: clamped > 0 ? 'Available Immediately' : 'Occupied',
        };
      }
      return r;
    });
    persistRooms(updated);
  };

  const handleUpdateAvailabilityNote = (roomId: string, note: string) => {
    const updated = rooms.map((r) => (r.id === roomId ? { ...r, availableFrom: note } : r));
    persistRooms(updated);
  };

  const handleUpdateRent = (roomId: string, rent: number) => {
    const updated = rooms.map((r) => (r.id === roomId ? { ...r, rentPerMonth: rent } : r));
    persistRooms(updated);
  };

  const handleDeleteRoom = (roomId: string) => {
    const updated = rooms.filter((r) => r.id !== roomId);
    persistRooms(updated);
  };

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) return;

    const newRoom: PgRoom = {
      id: `room-${Date.now()}`,
      roomNumber: newRoomNumber,
      floor: newFloor,
      roomType: newType,
      totalBeds: newTotalBeds,
      vacantBeds: newVacantBeds,
      rentPerMonth: newRent,
      availableFrom: newAvailableFrom,
      amenities: ['Split AC / Cooler', 'Study Desk', 'High-Speed Wi-Fi', 'Power Backup'],
      isAvailable: newVacantBeds > 0,
    };

    persistRooms([...rooms, newRoom]);
    setIsAddModalOpen(false);
    setNewRoomNumber('');
  };

  const totalBedsCount = rooms.reduce((acc, r) => acc + r.totalBeds, 0);
  const totalVacantCount = rooms.reduce((acc, r) => acc + r.vacantBeds, 0);
  const totalOccupiedCount = totalBedsCount - totalVacantCount;
  const occupancyRate = totalBedsCount > 0 ? Math.round((totalOccupiedCount / totalBedsCount) * 100) : 0;

  const filteredRooms = rooms.filter((r) => {
    if (filter === 'vacant') return r.isAvailable && r.vacantBeds > 0;
    if (filter === 'occupied') return !r.isAvailable || r.vacantBeds === 0;
    return true;
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
        {/* Top Control Bar */}
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
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    border: '1px solid #86EFAC',
                  }}
                >
                  PG OWNER PORTAL
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Verified Partner Dashboard</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: '#0F172A' }}>
                Comfort Executive PG — Room Vacancy Manager
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
              <span>Add New Room</span>
            </button>
          </div>
        </div>

        {/* Real-time Save Toast */}
        {savedNotice && (
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
            <span>{savedNotice}</span>
          </div>
        )}

        {/* 4 Metric Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Rooms
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', marginTop: '0.35rem' }}>
              {rooms.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
              Across {new Set(rooms.map((r) => r.floor)).size} Floors
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1.5px solid #86EFAC',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700, textTransform: 'uppercase' }}>
              Vacant Beds (Available)
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803D', marginTop: '0.35rem' }}>
              {totalVacantCount} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/ {totalBedsCount} Beds</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, marginTop: '0.25rem' }}>
              Visible to students now
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1.5px solid #CBD5E1',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Occupied Beds
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#334155', marginTop: '0.35rem' }}>
              {totalOccupiedCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
              {occupancyRate}% Occupancy Rate
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1.5px solid #FEF08A',
              boxShadow: '0 4px 12px rgba(250, 204, 21, 0.1)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#854D0E', fontWeight: 700, textTransform: 'uppercase' }}>
              Est. Monthly Rent
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#854D0E', marginTop: '0.35rem' }}>
              ₹{(totalOccupiedCount * 6500).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#A16207', marginTop: '0.25rem' }}>
              Potential: ₹{(totalBedsCount * 6500).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
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
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setFilter('all')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: filter === 'all' ? '1.5px solid #15803D' : '1px solid #E2E8F0',
                backgroundColor: filter === 'all' ? '#DCFCE7' : '#FFFFFF',
                color: filter === 'all' ? '#15803D' : '#64748B',
                cursor: 'pointer',
              }}
            >
              All Rooms ({rooms.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('vacant')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: filter === 'vacant' ? '1.5px solid #15803D' : '1px solid #E2E8F0',
                backgroundColor: filter === 'vacant' ? '#DCFCE7' : '#FFFFFF',
                color: filter === 'vacant' ? '#15803D' : '#64748B',
                cursor: 'pointer',
              }}
            >
              🟢 Vacant Rooms ({rooms.filter((r) => r.vacantBeds > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('occupied')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: filter === 'occupied' ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
                backgroundColor: filter === 'occupied' ? '#FEE2E2' : '#FFFFFF',
                color: filter === 'occupied' ? '#B91C1C' : '#64748B',
                cursor: 'pointer',
              }}
            >
              🔴 Fully Occupied ({rooms.filter((r) => r.vacantBeds === 0).length})
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            💡 Click <strong>"Vacant / Occupied"</strong> toggle to instantly update student search!
          </div>
        </div>

        {/* Room Inventory Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: room.isAvailable ? '1.5px solid #86EFAC' : '1.5px solid #E2E8F0',
                boxShadow: room.isAvailable ? '0 6px 18px rgba(22, 163, 74, 0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                position: 'relative',
              }}
            >
              {/* Card Header: Room number & Status badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>
                      Room {room.roomNumber}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                      }}
                    >
                      {room.floor}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>
                    {room.roomType}
                  </div>
                </div>

                {/* 1-Click Status Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleVacancy(room.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    border: room.isAvailable ? '1.5px solid #16A34A' : '1.5px solid #EF4444',
                    backgroundColor: room.isAvailable ? '#DCFCE7' : '#FEE2E2',
                    color: room.isAvailable ? '#15803D' : '#B91C1C',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title="Click to toggle vacant vs occupied"
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: room.isAvailable ? '#16A34A' : '#EF4444',
                    }}
                  />
                  <span>{room.isAvailable ? 'VACANT' : 'OCCUPIED'}</span>
                </button>
              </div>

              {/* Bed counter controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#F8FAF7',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Vacant Beds in Room:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleBedCountChange(room.id, room.vacantBeds - 1)}
                    disabled={room.vacantBeds <= 0}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontWeight: 800,
                      cursor: room.vacantBeds <= 0 ? 'not-allowed' : 'pointer',
                      opacity: room.vacantBeds <= 0 ? 0.4 : 1,
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0F172A', minWidth: '36px', textAlign: 'center' }}>
                    {room.vacantBeds} / {room.totalBeds}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBedCountChange(room.id, room.vacantBeds + 1)}
                    disabled={room.vacantBeds >= room.totalBeds}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontWeight: 800,
                      cursor: room.vacantBeds >= room.totalBeds ? 'not-allowed' : 'pointer',
                      opacity: room.vacantBeds >= room.totalBeds ? 0.4 : 1,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Availability Note & Expected Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748B', marginBottom: '0.25rem' }}>
                  Availability Status / Handover Date:
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    value={room.availableFrom}
                    onChange={(e) => handleUpdateAvailabilityNote(room.id, e.target.value)}
                    placeholder="e.g. Available Immediately, From 1st Oct"
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              {/* Rent per bed editor */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Monthly Rent per Bed:</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803D' }}>₹</span>
                    <input
                      type="number"
                      value={room.rentPerMonth}
                      onChange={(e) => handleUpdateRent(room.id, Number(e.target.value))}
                      style={{
                        width: '90px',
                        padding: '0.3rem 0.45rem',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        color: '#15803D',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/mo</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteRoom(room.id)}
                  title="Remove Room"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    borderRadius: '6px',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Room Modal */}
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
                Add New Room to PG Inventory
              </h3>

              <form onSubmit={handleAddRoomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Room Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 204"
                      value={newRoomNumber}
                      onChange={(e) => setNewRoomNumber(e.target.value)}
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
                      Floor
                    </label>
                    <select
                      value={newFloor}
                      onChange={(e) => setNewFloor(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    >
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                    Sharing / Room Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const val = e.target.value as PgRoom['roomType'];
                      setNewType(val);
                      if (val === 'Single AC') {
                        setNewTotalBeds(1);
                        setNewVacantBeds(1);
                        setNewRent(8500);
                      } else if (val === 'Double Sharing') {
                        setNewTotalBeds(2);
                        setNewVacantBeds(2);
                        setNewRent(6500);
                      } else if (val === 'Triple Sharing') {
                        setNewTotalBeds(3);
                        setNewVacantBeds(3);
                        setNewRent(4800);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  >
                    <option value="Single AC">Single AC Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                    <option value="Executive Suite">Executive Suite</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Total Beds
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={newTotalBeds}
                      onChange={(e) => setNewTotalBeds(Number(e.target.value))}
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
                      Vacant Beds
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={newTotalBeds}
                      value={newVacantBeds}
                      onChange={(e) => setNewVacantBeds(Number(e.target.value))}
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
                      Rent per Bed (₹)
                    </label>
                    <input
                      type="number"
                      value={newRent}
                      onChange={(e) => setNewRent(Number(e.target.value))}
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
                      Available From
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Immediately"
                      value={newAvailableFrom}
                      onChange={(e) => setNewAvailableFrom(e.target.value)}
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
                    Add Room
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
