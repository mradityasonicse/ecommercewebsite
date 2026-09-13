import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { User } from '../../types/auth';
import type { ServiceRequest } from '../../types/booking';
import { ServiceRequestRepository } from '../../services/serviceRequestRepository';
import { RequestStatusBadge } from './RequestStatusBadge';
import { Button } from '../ui/Button';

interface AccountRequestsTabProps {
  user: User;
  onNavigateToServices?: () => void;
}

export const AccountRequestsTab: React.FC<AccountRequestsTabProps> = ({ user, onNavigateToServices }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // Try by user's email first; if none or demo, fallback to getAllRequests
      let userRequests = await ServiceRequestRepository.getUserRequests(user.email);
      if (userRequests.length === 0) {
        userRequests = await ServiceRequestRepository.getAllRequests();
      }
      setRequests(userRequests);
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user.email]);

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Filters Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: filter === f ? '1px solid #FFFFFF' : '1px solid var(--color-border-subtle)',
                backgroundColor: filter === f ? '#FFFFFF' : 'var(--color-surface-1)',
                color: filter === f ? '#080A0F' : 'var(--color-text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textTransform: 'capitalize',
              }}
            >
              {f === 'all' ? `All Requests (${requests.length})` : f}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<ExternalLink size={13} />}
          iconPosition="right"
          onClick={() => {
            if (onNavigateToServices) {
              onNavigateToServices();
            } else {
              window.location.hash = '#services';
            }
          }}
        >
          Book New Service
        </Button>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div
          style={{
            padding: 'var(--space-12)',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
          }}
        >
          Loading your active service orders...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div
          style={{
            padding: 'var(--space-12)',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}
          >
            <Search size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
              No service orders found
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '380px' }}>
              You do not have any requests matching this filter. Schedule hostel laundry, room maintenance, mess meals, or high-speed Wi-Fi in seconds.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (onNavigateToServices) {
                onNavigateToServices();
              } else {
                window.location.hash = '#services';
              }
            }}
          >
            Explore Campus Services
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredRequests.map((req) => {
            const isExpanded = expandedId === req.id;
            return (
              <div
                key={req.id}
                style={{
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5)',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Top Row: Service Name, ID, Badge */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {req.id}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                        {req.serviceName}
                      </h4>
                      <RequestStatusBadge status={req.status} size="sm" />
                    </div>
                    {req.optionName && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0.35rem 0 0 0' }}>
                        Selected plan: <strong style={{ color: '#FFFFFF' }}>{req.optionName}</strong>
                      </p>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<ExternalLink size={12} />}
                      iconPosition="right"
                      onClick={() => {
                        window.location.hash = `#account/requests/${req.id}`;
                      }}
                    >
                      Track & Details
                    </Button>
                    {req.estimatedPrice && (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Rate Card
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                          {req.estimatedPrice}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : req.id)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.4rem',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Mid Details: Schedule & Location Chips */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)',
                    marginTop: 'var(--space-4)',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--color-border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {req.schedule?.date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} color="var(--color-brand-blue)" />
                      <span>{req.schedule.date}</span>
                    </div>
                  )}
                  {req.schedule?.timeSlot && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} color="var(--color-brand-blue)" />
                      <span>{req.schedule.timeSlot}</span>
                    </div>
                  )}
                  {(req.customer.hostelBlock || req.customer.roomNumber) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="var(--color-brand-blue)" />
                      <span>
                        {req.customer.hostelBlock || 'Hostel'} {req.customer.roomNumber ? `• Rm ${req.customer.roomNumber}` : ''}
                      </span>
                    </div>
                  )}
                  <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    Created on {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: 'var(--space-4)',
                      padding: 'var(--space-4)',
                      backgroundColor: 'var(--color-surface-2)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Customer Contact
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                          {req.customer.name} ({req.customer.phone})
                        </span>
                        <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          {req.customer.email}
                        </span>
                      </div>

                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Campus & Delivery Node
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                          {req.customer.campusName || 'Campus Living Hub'}
                        </span>
                        <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          {req.customer.hostelBlock || 'Hostel'}, Room {req.customer.roomNumber || 'Warden Desk'}
                        </span>
                      </div>
                    </div>

                    {req.notes && (
                      <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px dashed var(--color-border-subtle)' }}>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Instructions / Special Notes
                        </span>
                        <p style={{ fontSize: '0.82rem', color: '#FFFFFF', fontStyle: 'italic', margin: '0.2rem 0 0 0' }}>
                          "{req.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
