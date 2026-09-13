import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  Package,
  Bell,
  Search,
  User as UserIcon,
  Building2,
  ExternalLink,
  Utensils,
  Shirt,
  Wifi,
  Dumbbell,
  Home,
  Bus,
  SprayCan,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import type { User } from '../../types/auth';
import type { ServiceRequest } from '../../types/booking';
import type { AppNotification } from '../../types/notification';
import { ServiceRequestRepository, type StudentActivityItem } from '../../services/serviceRequestRepository';
import { NotificationService } from '../../services/notificationService';
import { RequestStatusBadge } from './RequestStatusBadge';
import { Button } from '../ui/Button';

interface StudentDashboardOverviewProps {
  user: User;
  onNavigateToTab: (tab: string, requestId?: string) => void;
  onNavigateToServices?: () => void;
}

export const StudentDashboardOverview: React.FC<StudentDashboardOverviewProps> = ({
  user,
  onNavigateToTab,
  onNavigateToServices,
}) => {
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [upcomingServices, setUpcomingServices] = useState<ServiceRequest[]>([]);
  const [recentActivity, setRecentActivity] = useState<StudentActivityItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time-aware greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user.name ? user.name.split(' ')[0] : 'Scholar';

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [userRequests, upcoming, activity, notifs] = await Promise.all([
          ServiceRequestRepository.getUserRequests(user.email),
          ServiceRequestRepository.getUpcomingServices(user.email),
          ServiceRequestRepository.getRecentActivity(user.email),
          NotificationService.getNotifications(user.email),
        ]);

        if (isMounted) {
          setActiveRequests(userRequests.filter((r) => r.status !== 'completed' && r.status !== 'cancelled'));
          setUpcomingServices(upcoming);
          setRecentActivity(activity.slice(0, 4));
          setNotifications(notifs.slice(0, 3));
        }
      } catch {
        // graceful empty fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user.email]);

  const categoryShortcuts = [
    { name: 'Food & Mess', slug: 'mess', icon: Utensils, price: 'from ₹75' },
    { name: 'Laundry Care', slug: 'laundry', icon: Shirt, price: 'from ₹39' },
    { name: 'Wi-Fi & Mesh', slug: 'wifi', icon: Wifi, price: 'from ₹399' },
    { name: 'Hostel & PG', slug: 'hostel', icon: Home, price: 'verified stays' },
    { name: 'Gym & Fitness', slug: 'fitness', icon: Dumbbell, price: 'student pass' },
    { name: 'Transit & Cabs', slug: 'transport', icon: Bus, price: 'flat rate' },
    { name: 'Room Cleaning', slug: 'cleaning', icon: SprayCan, price: 'deep clean' },
    { name: 'Maintenance', slug: 'maintenance', icon: Wrench, price: 'zero deposit' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 1. Personalized Welcome Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          padding: 'var(--space-6) var(--space-8)',
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-2xl)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-brand-blue)',
            opacity: 0.08,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
              }}
            >
              <Building2 size={12} color="var(--color-brand-gold)" /> {user.campusName || 'Campus Living'}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 1.9rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 0.35rem 0',
            }}
          >
            {getTimeGreeting()}, {firstName}.
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Here's what's happening with your EaseHub campus living services.
          </p>
        </div>

        {/* Action button */}
        <Button
          variant="primary"
          size="md"
          icon={<ArrowRight size={14} />}
          iconPosition="right"
          onClick={() => {
            if (onNavigateToServices) onNavigateToServices();
            else window.location.hash = '#services';
          }}
        >
          Book a Service
        </Button>
      </div>

      {/* 2. Quick Actions Toolbar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (onNavigateToServices) onNavigateToServices();
            else window.location.hash = '#services';
          }}
          style={quickActionButtonStyle}
        >
          <Search size={18} color="var(--color-brand-blue)" />
          <span style={{ fontWeight: 600 }}>Find a Service</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('requests')}
          style={quickActionButtonStyle}
        >
          <Package size={18} color="var(--color-brand-blue)" />
          <span style={{ fontWeight: 600 }}>My Requests</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('notifications')}
          style={quickActionButtonStyle}
        >
          <Bell size={18} color="var(--color-brand-blue)" />
          <span style={{ fontWeight: 600 }}>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('profile')}
          style={quickActionButtonStyle}
        >
          <UserIcon size={18} color="var(--color-brand-blue)" />
          <span style={{ fontWeight: 600 }}>Student Profile</span>
        </button>
      </div>

      {/* 3. Main Dashboard Grid: Active Requests + Upcoming Services */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Active Requests Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Active Service Orders ({activeRequests.length})
            </h3>
            <button
              type="button"
              onClick={() => onNavigateToTab('requests')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-blue-light)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View All &rarr;
            </button>
          </div>

          {isLoading ? (
            <div style={cardSkeletonStyle}>Loading active requests...</div>
          ) : activeRequests.length === 0 ? (
            <div style={emptyCardStyle}>
              <Package size={28} color="var(--color-text-muted)" />
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.95rem' }}>
                You haven't requested a service yet.
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Order laundry pickup, reserve meals, or schedule room repairs.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (onNavigateToServices) onNavigateToServices();
                  else window.location.hash = '#services';
                }}
              >
                Explore Services
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {activeRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  style={{
                    backgroundColor: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4) var(--space-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-brand-blue)', fontWeight: 700 }}>
                          {req.id}
                        </span>
                        <RequestStatusBadge status={req.status} size="sm" />
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                        {req.serviceName}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {req.providerName || 'EaseHub Partner'}
                      </span>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<ExternalLink size={12} />}
                      iconPosition="right"
                      onClick={() => onNavigateToTab('requests', req.id)}
                    >
                      Track
                    </Button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} color="var(--color-brand-blue)" />
                      <span>{req.schedule?.date || 'Today'} • {req.schedule?.timeSlot || 'Standard window'}</span>
                    </div>
                    {req.estimatedPrice && (
                      <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{req.estimatedPrice}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Services Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Upcoming Schedule
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Next 7 days
            </span>
          </div>

          {isLoading ? (
            <div style={cardSkeletonStyle}>Checking scheduled bookings...</div>
          ) : upcomingServices.length === 0 ? (
            <div style={emptyCardStyle}>
              <Calendar size={28} color="var(--color-text-muted)" />
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.95rem' }}>
                Nothing scheduled yet.
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Schedule daily hostel laundry, gym slots, or mess meal deliveries.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (onNavigateToServices) onNavigateToServices();
                  else window.location.hash = '#services';
                }}
              >
                Find Something You Need
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {upcomingServices.map((service) => (
                <div
                  key={`up-${service.id}`}
                  style={{
                    backgroundColor: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4) var(--space-5)',
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
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {service.serviceName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} />
                        <span>{service.schedule?.date || 'Scheduled'} ({service.schedule?.timeSlot || 'Window'})</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('requests', service.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-blue-light)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Details &rarr;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Lower Grid: Recent Student Activity & In-App Notifications Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Recent Activity */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Recent Account Activity
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Verified Log</span>
          </div>

          {recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Your recent activity will appear here as you book and track services.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {recentActivity.map((act) => (
                <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-brand-blue)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      {act.description}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Preview */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Campus Notices & Updates
            </h3>
            <button
              type="button"
              onClick={() => onNavigateToTab('notifications')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-blue-light)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View All Notifications &rarr;
            </button>
          </div>

          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <CheckCircle2 size={24} color="#22C55E" style={{ marginBottom: '0.35rem' }} />
              <div>You're all caught up!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onNavigateToTab('notifications')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.55rem 0.65rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: n.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                    border: n.read ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-surface-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-brand-blue)',
                      flexShrink: 0,
                    }}
                  >
                    <Bell size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: n.read ? 600 : 700, color: '#FFFFFF' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Service Discovery Bridge (Connecting back to Phase 5) */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6) var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Need Another Campus Service?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0 0' }}>
              Instant student discounts and fast-track hostel delivery across all living pillars.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (onNavigateToServices) onNavigateToServices();
              else window.location.hash = '#services';
            }}
          >
            Explore Catalog
          </Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {categoryShortcuts.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  window.location.hash = `#services/${cat.slug}`;
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.85rem 0.65rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>{cat.name}</span>
                <span style={{ fontSize: '0.68rem', color: '#CBD5E1' }}>{cat.price}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const quickActionButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.75rem 1rem',
  backgroundColor: 'var(--color-surface-1)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: 'var(--radius-lg)',
  color: '#FFFFFF',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const emptyCardStyle: React.CSSProperties = {
  padding: 'var(--space-8)',
  textAlign: 'center',
  backgroundColor: 'var(--color-surface-1)',
  borderRadius: 'var(--radius-xl)',
  border: '1px dashed var(--color-border-default)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-3)',
};

const cardSkeletonStyle: React.CSSProperties = {
  padding: 'var(--space-8)',
  textAlign: 'center',
  backgroundColor: 'var(--color-surface-1)',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--color-border-subtle)',
  color: 'var(--color-text-muted)',
  fontSize: '0.85rem',
};
