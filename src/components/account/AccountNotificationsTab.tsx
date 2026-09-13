import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Package,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import type { User } from '../../types/auth';
import type { AppNotification, NotificationFilter } from '../../types/notification';
import { NotificationService } from '../../services/notificationService';
import { Button } from '../ui/Button';

interface AccountNotificationsTabProps {
  user: User;
  onNavigateToRequest?: (requestId: string) => void;
}

export const AccountNotificationsTab: React.FC<AccountNotificationsTabProps> = ({
  user,
  onNavigateToRequest,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await NotificationService.getNotifications(user.email);
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const unsubscribe = NotificationService.subscribe(fetchNotifications);
    return () => unsubscribe();
  }, [user.email]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await NotificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead(user.email);
    fetchNotifications();
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'requests') return notif.type === 'request_update' || notif.type === 'service_alert';
    if (filter === 'security') return notif.type === 'security' || notif.type === 'campus_notice';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'request_update':
        return <Package size={16} color="var(--color-brand-blue)" />;
      case 'service_alert':
        return <Clock size={16} color="var(--color-blue-light)" />;
      case 'security':
        return <ShieldCheck size={16} color="#22C55E" />;
      case 'campus_notice':
        return <Info size={16} color="#F59E0B" />;
      case 'promo':
      default:
        return <Bell size={16} color="var(--color-text-muted)" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read) {
      NotificationService.markAsRead(notif.id);
    }
    if (notif.metadata?.requestId && onNavigateToRequest) {
      onNavigateToRequest(notif.metadata.requestId);
    } else if (notif.targetUrl) {
      window.location.hash = notif.targetUrl.replace(/^#\/?/, '');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Filters & Actions Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(
            [
              { id: 'all', label: `All (${notifications.length})` },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'requests', label: 'Service Updates' },
              { id: 'security', label: 'Security & Campus' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as NotificationFilter)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: filter === tab.id ? '1px solid #FFFFFF' : '1px solid var(--color-border-subtle)',
                backgroundColor: filter === tab.id ? '#FFFFFF' : 'var(--color-surface-1)',
                color: filter === tab.id ? '#080A0F' : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<CheckCheck size={14} />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
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
          Loading your student alerts...
        </div>
      ) : filteredNotifications.length === 0 ? (
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
            gap: 'var(--space-3)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22C55E',
            }}
          >
            <CheckCheck size={24} />
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            You're all caught up.
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '380px' }}>
            Important updates regarding your hostel laundry, room maintenance, mess meals, and campus announcements will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              style={{
                backgroundColor: notif.read ? 'var(--color-surface-1)' : 'rgba(255, 255, 255, 0.05)',
                border: notif.read ? '1px solid var(--color-border-subtle)' : '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4) var(--space-5)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = notif.read
                  ? 'var(--color-border-subtle)'
                  : 'rgba(255, 255, 255, 0.22)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                {/* Type Icon */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {getTypeIcon(notif.type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h4
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: notif.read ? 600 : 800,
                        color: notif.read ? 'var(--color-text-primary)' : '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      {notif.title}
                    </h4>

                    {!notif.read && (
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-brand-blue)',
                          boxShadow: '0 0 6px var(--color-blue-glow)',
                        }}
                      />
                    )}

                    {notif.priority === 'high' && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#FF7B72',
                          backgroundColor: 'rgba(255, 43, 43, 0.15)',
                          padding: '0.05rem 0.35rem',
                          borderRadius: 'var(--radius-pill)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        Urgent
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--color-text-secondary)',
                      margin: '0.25rem 0 0 0',
                      lineHeight: 1.5,
                    }}
                  >
                    {notif.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(notif.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {notif.targetUrl && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <span>Open details</span>
                        <ExternalLink size={10} />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Individual Mark as Read */}
              {!notif.read && (
                <button
                  type="button"
                  onClick={(e) => handleMarkAsRead(notif.id, e)}
                  title="Mark as read"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-brand-blue)';
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
