import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Utensils,
  Shirt,
  Home,
  Wifi,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import type { User } from '../../types/auth';
import type { ServiceRequest, RequestStatus } from '../../types/booking';
import { ServiceRequestRepository } from '../../services/serviceRequestRepository';
import { RequestStatusBadge } from './RequestStatusBadge';
import { Button } from '../ui/Button';

export interface AccountOrderTrackingTabProps {
  user: User;
  onNavigateToServices?: () => void;
  preselectedOrderId?: string;
}

type OrderFilter = 'all' | 'active' | 'completed' | 'cancelled';

export const AccountOrderTrackingTab: React.FC<AccountOrderTrackingTabProps> = ({
  user,
  onNavigateToServices,
  preselectedOrderId,
}) => {
  const [orders, setOrders] = useState<ServiceRequest[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(preselectedOrderId || null);
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      let userOrders = await ServiceRequestRepository.getUserRequests(user.email);
      if (userOrders.length === 0) {
        userOrders = await ServiceRequestRepository.getAllRequests();
      }
      setOrders(userOrders);

      // If preselected order ID was given, set it, otherwise select the first order if available
      if (preselectedOrderId) {
        setSelectedOrderId(preselectedOrderId);
      } else if (!selectedOrderId && userOrders.length > 0) {
        setSelectedOrderId(userOrders[0].id);
      }
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('easehub_requests_updated', handleUpdate);
    return () => window.removeEventListener('easehub_requests_updated', handleUpdate);
  }, [user.email]);

  const filteredOrders = orders.filter((o) => {
    // Status Filter
    if (filter === 'active') {
      if (o.status === 'completed' || o.status === 'cancelled') return false;
    } else if (filter === 'completed') {
      if (o.status !== 'completed') return false;
    } else if (filter === 'cancelled') {
      if (o.status !== 'cancelled') return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.serviceName.toLowerCase().includes(q);
      const matchProvider = (o.providerName || '').toLowerCase().includes(q);
      return matchId || matchName || matchProvider;
    }

    return true;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || null;

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this campus service request?')) return;
    try {
      await ServiceRequestRepository.cancelRequest(orderId, 'Cancelled by student in account tracking');
      setActionFeedback('Order has been cancelled successfully.');
      setTimeout(() => setActionFeedback(null), 3000);
      loadOrders();
    } catch {
      alert('Unable to cancel this order. Please contact partner support directly.');
    }
  };

  const getServiceIcon = (slug: string) => {
    if (slug.includes('food') || slug.includes('mess')) return Utensils;
    if (slug.includes('laundry')) return Shirt;
    if (slug.includes('pg') || slug.includes('hostel')) return Home;
    if (slug.includes('wifi')) return Wifi;
    return Package;
  };

  const renderMilestones = (order: ServiceRequest) => {
    const steps: Array<{ key: RequestStatus; label: string; desc: string }> = [
      { key: 'pending', label: 'Order Placed', desc: 'Request submitted to campus dispatch' },
      { key: 'accepted', label: 'Accepted by Partner', desc: 'Partner assigned and scheduled' },
      { key: 'confirmed', label: 'Slot Confirmed', desc: 'Delivery node locked & in progress' },
      { key: 'in_progress', label: 'In Transit / Progress', desc: 'Technician/courier en route to hostel' },
      { key: 'completed', label: 'Service Completed', desc: 'Delivered & verified by student' },
    ];

    const currentStatus = order.status;
    const isCancelled = currentStatus === 'cancelled';

    // Determine current step index
    const statusOrder: RequestStatus[] = ['pending', 'accepted', 'confirmed', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus as RequestStatus);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1rem 0' }}>
        {isCancelled ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              color: '#B91C1C',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <XCircle size={18} />
            <span>This order was cancelled. Zero cancellation charges apply.</span>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Timeline Vertical Line */}
            <div
              style={{
                position: 'absolute',
                left: '9px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                backgroundColor: '#E2E8F0',
              }}
            />

            {steps.map((step, idx) => {
              const isPast = !isCancelled && idx <= currentIndex;
              const isCurrent = !isCancelled && idx === currentIndex;

              return (
                <div
                  key={step.key}
                  style={{
                    position: 'relative',
                    paddingBottom: idx === steps.length - 1 ? '0' : '1.25rem',
                  }}
                >
                  {/* Step Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-28px',
                      top: '2px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isPast ? '#16A34A' : '#FFFFFF',
                      border: isPast ? '2px solid #16A34A' : '2px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(22, 163, 74, 0.2)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isPast && <CheckCircle2 size={12} color="#FFFFFF" />}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: isCurrent ? 800 : isPast ? 700 : 500,
                        color: isCurrent ? '#15803D' : isPast ? '#0F172A' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <span>{step.label}</span>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '9999px',
                            backgroundColor: '#DCFCE7',
                            color: '#15803D',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                          }}
                        >
                          CURRENT STATUS
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header Banner & Metrics */}
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4ADE80', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <ShieldCheck size={14} />
              <span>OFFICIAL STUDENT ORDER TRACKING</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.7rem)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
              Order & Request Tracking
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', margin: '0.3rem 0 0 0' }}>
              Real-time milestone tracking for meal deliveries, laundry bags, hostel check-ins, and campus repairs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={loadOrders}
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
              <span>Refresh Orders</span>
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
              <span>Book New Service</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Action feedback toast */}
        {actionFeedback && (
          <div
            style={{
              padding: '0.65rem 1rem',
              backgroundColor: '#15803D',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            {actionFeedback}
          </div>
        )}
      </div>

      {/* 2. Filter Toolbar & Search */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(
            [
              { id: 'all', label: `All Orders (${orders.length})` },
              { id: 'active', label: 'Active / En Route' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                border: filter === t.id ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
                backgroundColor: filter === t.id ? '#DCFCE7' : '#F8FAFC',
                color: filter === t.id ? '#15803D' : '#475569',
                fontSize: '0.8rem',
                fontWeight: filter === t.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '220px',
            flex: '1 1 220px',
            maxWidth: '360px',
          }}
        >
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="Search by order ID or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.25rem',
              borderRadius: '9999px',
              border: '1px solid #CBD5E1',
              fontSize: '0.82rem',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
            }}
          />
        </div>
      </div>

      {/* 3. Empty State or Main Tracking Grid */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px dashed #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}
          >
            <Package size={30} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
              No Active Service Orders Found
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '460px', margin: '0 auto', lineHeight: 1.5 }}>
              You don't have any orders matching your current filter. When you book student laundry, mess meals, hostel rooms, or midnight canteen snacks, your live tracking will appear here.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            onClick={() => {
              if (onNavigateToServices) onNavigateToServices();
              else window.location.hash = '#catalog';
            }}
            style={{ marginTop: '0.5rem' }}
          >
            Explore Campus Services
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Order Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Service Bookings ({filteredOrders.length})
            </div>

            {filteredOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              const IconComponent = getServiceIcon(order.serviceSlug);

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isSelected ? '2px solid #16A34A' : '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '1.15rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 8px 24px -4px rgba(22, 163, 74, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#DCFCE7' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#15803D' : '#475569',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#64748B' }}>
                          {order.id}
                        </div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                          {order.serviceName}
                        </h4>
                      </div>
                    </div>

                    <RequestStatusBadge status={order.status} size="sm" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      <span>{order.schedule?.date || 'Scheduled'}</span>
                    </div>

                    {order.estimatedPrice && (
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>{order.estimatedPrice}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Tracking Console */}
          {selectedOrder && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                boxShadow: '0 10px 30px -4px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Order Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.15rem 0.6rem', borderRadius: '9999px' }}>
                      {selectedOrder.id}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    {selectedOrder.serviceName}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '0.2rem' }}>
                    Partner: <strong>{selectedOrder.providerName || 'EaseHub Verified Campus Partner'}</strong>
                  </div>
                </div>

                <RequestStatusBadge status={selectedOrder.status} size="md" />
              </div>

              {/* Order Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Plan / Service</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {selectedOrder.optionName || 'Standard Package'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Location</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="#16A34A" />
                    <span>{selectedOrder.customer?.hostelBlock || user.hostelBlock || 'Hostel'}, Room {selectedOrder.customer?.roomNumber || user.roomNumber || '304'}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Service Window</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} color="#16A34A" />
                    <span>{selectedOrder.schedule?.date || 'Today'} ({selectedOrder.schedule?.timeSlot || 'Standard'})</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Amount</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#15803D', marginTop: '2px' }}>
                    {selectedOrder.estimatedPrice || '₹499'}
                  </div>
                </div>
              </div>

              {/* Special Instructions if any */}
              {selectedOrder.notes && (
                <div style={{ fontSize: '0.82rem', color: '#475569', backgroundColor: '#FFFBEB', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                  <strong>Student Notes:</strong> {selectedOrder.notes}
                </div>
              )}

              {/* Milestone Timeline */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                  Live Milestone Progress
                </h4>
                {renderMilestones(selectedOrder)}
              </div>

              {/* Action Support Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                {/* Direct WhatsApp Partner Contact */}
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello EaseHub Partner! I am tracking my service order ${selectedOrder.id} (${selectedOrder.serviceName}) for ${selectedOrder.customer?.hostelBlock || 'Hostel'} Room ${selectedOrder.customer?.roomNumber || '304'}. Could you share the current delivery status?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.15rem',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Partner Desk</span>
                </a>

                {/* Cancel Request (Only if not completed or cancelled) */}
                {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EF4444',
                      color: '#DC2626',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <span>Cancel Request</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
