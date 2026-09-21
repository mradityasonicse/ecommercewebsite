import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Shirt,
  Building2,
  Package,
  MessageSquare,
  QrCode,
  Sparkles,
  RefreshCw,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import type { User } from '../../types/auth';
import type { ServiceRequest } from '../../types/booking';
import { ServiceRequestRepository } from '../../services/serviceRequestRepository';
import { Button } from '../ui/Button';

export interface AccountServicesTabProps {
  user: User;
  onNavigateToServices?: () => void;
  onOpenTracker?: (tab: 'mess' | 'laundry' | 'pg', orderId?: string) => void;
}

type ServiceFilter = 'all' | 'active' | 'dining' | 'laundry' | 'stay';

export const AccountServicesTab: React.FC<AccountServicesTabProps> = ({
  user,
  onNavigateToServices,
  onOpenTracker,
}) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filter, setFilter] = useState<ServiceFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMealQr, setSelectedMealQr] = useState<{ planName: string; token: string } | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ServiceRequest | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await ServiceRequestRepository.getUserRequests(user.email);
      setRequests(data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('easehub_requests_updated', handleUpdate);
    return () => window.removeEventListener('easehub_requests_updated', handleUpdate);
  }, [user.email]);

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    if (filter === 'active') return req.status !== 'completed' && req.status !== 'cancelled';
    if (filter === 'dining') return req.serviceSlug === 'mess' || req.serviceSlug.includes('food') || req.serviceSlug.includes('tiffin');
    if (filter === 'laundry') return req.serviceSlug === 'laundry';
    if (filter === 'stay') return req.serviceSlug === 'pg' || req.serviceSlug === 'hostel' || req.serviceSlug.includes('room');
    return true;
  });

  const handleTriggerTracker = (slug: string, id: string) => {
    let tab: 'mess' | 'laundry' | 'pg' = 'mess';
    if (slug === 'laundry') tab = 'laundry';
    else if (slug === 'pg' || slug === 'hostel') tab = 'pg';

    if (onOpenTracker) {
      onOpenTracker(tab, id);
    } else {
      window.dispatchEvent(new CustomEvent('easehub_open_order_tracker', { detail: { tab, orderId: id } }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner & Overview Metrics */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '20px',
          padding: '1.75rem clamp(1.25rem, 3vw, 2rem)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4ADE80', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Sparkles size={14} />
              <span>ACTIVE STUDENT CAMPUS SERVICES</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.7rem)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
              My Subscriptions & Bookings
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', margin: '0.3rem 0 0 0' }}>
              Connected to Hostel {user.hostelBlock || 'Block B'}, Room {user.roomNumber || '304'} • Real-time live status
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={loadRequests}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 0.95rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh Status</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateToServices) onNavigateToServices();
                else window.location.hash = '#catalog';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1rem',
                backgroundColor: '#16A34A',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              }}
            >
              <span>+ Explore New Services</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 3 Active Category Metric Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Utensils size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Active Mess Dining</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFFFFF' }}>Annapurna 3-Meal Deluxe</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shirt size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Laundry Plan</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFFFFF' }}>15kg Steam Press Care</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Verified Campus Room</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFFFFF' }}>Block B, Room 304</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        {[
          { id: 'all', label: `All Services (${requests.length})` },
          { id: 'active', label: 'Active Plans & Orders' },
          { id: 'dining', label: 'Mess & Dining' },
          { id: 'laundry', label: 'Laundry Express' },
          { id: 'stay', label: 'Hostel & PG Stay' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as ServiceFilter)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: filter === tab.id ? 800 : 600,
              backgroundColor: filter === tab.id ? '#16A34A' : '#FFFFFF',
              color: filter === tab.id ? '#FFFFFF' : '#475569',
              border: filter === tab.id ? '1px solid #16A34A' : '1px solid #E2E8F0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filter === tab.id ? '0 2px 8px rgba(22, 163, 74, 0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services List / Cards */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#16A34A', fontWeight: 700 }}>
          Loading your campus services...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px dashed #CBD5E1',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>No services found under this filter</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
              Subscribe to healthy mess meals, doorstep laundry, or verify your hostel room stay.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (onNavigateToServices) onNavigateToServices();
              else window.location.hash = '#catalog';
            }}
          >
            Browse Campus Marketplace
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredRequests.map((req) => {
            const isMess = req.serviceSlug === 'mess' || req.serviceSlug.includes('food');
            const isLaundry = req.serviceSlug === 'laundry';
            const isPg = req.serviceSlug === 'pg' || req.serviceSlug === 'hostel';

            return (
              <div
                key={req.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'border-color 0.15s ease',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: isMess ? '#FEF3C7' : isLaundry ? '#EDE9FE' : '#DBEAFE',
                        color: isMess ? '#D97706' : isLaundry ? '#7C3AED' : '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isMess ? <Utensils size={22} /> : isLaundry ? <Shirt size={22} /> : <Building2 size={22} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {req.serviceName}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor:
                              req.status === 'confirmed' || req.status === 'completed'
                                ? '#DCFCE7'
                                : req.status === 'in_progress'
                                ? '#DBEAFE'
                                : '#FEF3C7',
                            color:
                              req.status === 'confirmed' || req.status === 'completed'
                                ? '#15803D'
                                : req.status === 'in_progress'
                                ? '#1D4ED8'
                                : '#B45309',
                            textTransform: 'uppercase',
                          }}
                        >
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                        {req.optionName || 'Standard Package'} • Provided by <strong style={{ color: '#334155' }}>{req.providerName || 'EaseHub Verified Partner'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Price & Ref ID */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-display)' }}>
                      {req.estimatedPrice || '₹0'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                      ID: {req.id}
                    </div>
                  </div>
                </div>

                {/* Specific Live Detail Blocks */}
                {isMess && (
                  <div
                    style={{
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={16} color="#D97706" />
                        <strong style={{ fontSize: '0.84rem', color: '#92400E' }}>
                          Today's Live Menu & Kitchen Status
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#B45309', fontWeight: 700 }}>
                        Current Status: Cooking & Packing (Dispatches 12:45 PM)
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#78350F', lineHeight: 1.5 }}>
                      <strong>Lunch Special:</strong> Paneer Butter Masala, Dal Tadka, Jeera Rice, 4 Butter Tawa Roti, Boondi Raita & Salad.
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedMealQr({ planName: req.serviceName, token: `EASE-MEAL-${req.id.slice(-4)}-VALID` })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.75rem',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D97706',
                          borderRadius: '8px',
                          color: '#B45309',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <QrCode size={14} />
                        <span>Show Digital Meal QR Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTriggerTracker('mess', req.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.75rem',
                          backgroundColor: '#D97706',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span>Track Kitchen Delivery</span>
                      </button>
                    </div>
                  </div>
                )}

                {isLaundry && (
                  <div
                    style={{
                      backgroundColor: '#F5F3FF',
                      border: '1px solid #DDD6FE',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shirt size={16} color="#7C3AED" />
                        <strong style={{ fontSize: '0.84rem', color: '#5B21B6' }}>
                          5-Stage Wash & Steam Press Pipeline
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#6D28D9', fontWeight: 800 }}>
                        Pickup PIN: <span style={{ backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>8392</span>
                      </span>
                    </div>

                    {/* Progress visual steps */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                      <div style={{ padding: '0.4rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #C4B5FD', fontSize: '0.74rem', color: '#15803D', fontWeight: 700 }}>
                        ✓ 1. Bag Picked Up
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #C4B5FD', fontSize: '0.74rem', color: '#15803D', fontWeight: 700 }}>
                        ✓ 2. 4.6 kg (14 pcs)
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#EDE9FE', borderRadius: '8px', border: '1.5px solid #7C3AED', fontSize: '0.74rem', color: '#6D28D9', fontWeight: 800 }}>
                        🔄 3. Washing & Spin
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.74rem', color: '#94A3B8' }}>
                        4. Steam Press
                      </div>
                      <div style={{ padding: '0.4rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.74rem', color: '#94A3B8' }}>
                        5. Hostel Handover
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => handleTriggerTracker('laundry', req.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.75rem',
                          backgroundColor: '#7C3AED',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span>Live Wash Tracking</span>
                      </button>
                    </div>
                  </div>
                )}

                {isPg && (
                  <div
                    style={{
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={16} color="#1D4ED8" />
                        <strong style={{ fontSize: '0.84rem', color: '#1E40AF' }}>
                          Verified Student Accommodation & Agreement
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#16A34A', fontWeight: 800, backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '9999px' }}>
                        ✓ Zero Brokerage Verified
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#1E3A8A', lineHeight: 1.5 }}>
                      Room 304 (AC Double Sharing) • Security Deposit ₹5,000 Safe-Locked • Landlord: Rajesh Sharma (+91 98271 23456)
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <a
                        href="https://wa.me/919827123456"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.75rem',
                          backgroundColor: '#16A34A',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <MessageSquare size={14} />
                        <span>Chat with Landlord</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(req)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.75rem',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #BFDBFE',
                          borderRadius: '8px',
                          color: '#1D4ED8',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <FileText size={14} />
                        <span>View Lease Slip</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Scheduled for: <strong style={{ color: '#334155' }}>{req.schedule?.date || 'Ongoing Term Plan'} ({req.schedule?.timeSlot || 'Active'})</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(req)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#334155',
                        cursor: 'pointer',
                      }}
                    >
                      Receipt & Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital QR Pass Modal */}
      {selectedMealQr && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setSelectedMealQr(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Digital Student Meal Pass
            </h3>

            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
              Scan at the dining hall or hostel delivery counter for instant verification.
            </p>

            {/* Generated QR Placeholder */}
            <div
              style={{
                width: '180px',
                height: '180px',
                backgroundColor: '#F8FAFC',
                border: '2px solid #E2E8F0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(selectedMealQr.token)}`}
                alt="Meal Pass QR Code"
                style={{ width: '100%', height: '100%', borderRadius: '8px' }}
              />
            </div>

            <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#F1F5F9', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
              {selectedMealQr.token}
            </div>

            <button
              type="button"
              onClick={() => setSelectedMealQr(null)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '460px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#16A34A" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Service Confirmation Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94A3B8' }}
              >
                ×
              </button>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Order Reference:</span>
                <strong style={{ fontFamily: 'monospace' }}>{selectedReceipt.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Service Name:</span>
                <strong>{selectedReceipt.serviceName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Option Selected:</span>
                <span>{selectedReceipt.optionName || 'Standard'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Delivery Address:</span>
                <span>Hostel {selectedReceipt.customer.hostelBlock || 'Block B'}, {selectedReceipt.customer.roomNumber || '304'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Price Amount:</span>
                <strong style={{ color: '#15803D', fontSize: '0.96rem' }}>{selectedReceipt.estimatedPrice}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
