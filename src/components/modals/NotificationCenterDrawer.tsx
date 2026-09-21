import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Package,
  Megaphone,
  CheckCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { NotificationService } from '../../services/notificationService';
import type { AppNotification } from '../../types/notification';
import { useAuth } from '../../context/AuthContext';

export interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTracker?: (orderId?: string) => void;
  onNavigateAccount?: () => void;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose,
  onOpenTracker,
  onNavigateAccount,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'orders' | 'security'>('all');
  const [loading, setLoading] = useState<boolean>(true);

  // Load and subscribe to notification updates
  const loadNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications(user?.email);
      setNotifications(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadNotifications();
    const unsubscribe = NotificationService.subscribe(loadNotifications);
    return () => unsubscribe();
  }, [isOpen, user?.email]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'orders') return n.type === 'request_update' || n.type === 'service_alert';
    if (activeTab === 'security') return n.type === 'security';
    return true;
  });

  const handleMarkAllRead = async () => {
    await NotificationService.markAllAsRead(user?.email);
    await loadNotifications();
  };

  const handleNotificationClick = async (item: AppNotification) => {
    await NotificationService.markAsRead(item.id);
    await loadNotifications();

    if (item.metadata?.requestId && onOpenTracker) {
      onClose();
      onOpenTracker(item.metadata.requestId);
      return;
    }

    if (item.targetUrl) {
      onClose();
      window.location.hash = item.targetUrl;
    }
  };

  const formatTimeAgo = (isoDate: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDays = Math.floor(diffHour / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'request_update':
        return <Package size={17} color="#15803D" />;
      case 'service_alert':
        return <Sparkles size={17} color="#D97706" />;
      case 'security':
        return <ShieldCheck size={17} color="#2563EB" />;
      case 'campus_notice':
      default:
        return <Megaphone size={17} color="#0F766E" />;
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Campus Notifications Center"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '0 8px 12px 8px',
        boxSizing: 'border-box',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Sliding Bottom Drawer / Dialog */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '84vh',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUpNotif 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Handle Drag Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
          <div style={{ width: '42px', height: '4px', borderRadius: '4px', backgroundColor: '#CBD5E1' }} />
        </div>

        {/* Header Bar */}
        <div
          style={{
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803D',
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Notifications
                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      padding: '1px 7px',
                      borderRadius: '9999px',
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                Campus orders, alerts & delivery live updates
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                title="Mark all as read"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#15803D',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F0FDF4',
                }}
              >
                <CheckCheck size={14} />
                <span>Mark Read</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '10px 18px',
            borderBottom: '1px solid #F1F5F9',
            backgroundColor: '#F8FAF9',
            overflowX: 'auto',
          }}
        >
          {(['all', 'unread', 'orders', 'security'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: activeTab === tab ? 800 : 600,
                border: activeTab === tab ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
                backgroundColor: activeTab === tab ? '#15803D' : '#FFFFFF',
                color: activeTab === tab ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notification Feed List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8', fontSize: '0.86rem' }}>
              Loading campus alerts...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16A34A',
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1E293B' }}>
                All Caught Up!
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', maxWidth: '280px' }}>
                No notifications in this filter. Live meal status and campus updates will appear here automatically.
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '16px',
                  backgroundColor: notif.read ? '#FFFFFF' : '#F0FDF4',
                  border: notif.read ? '1px solid #E2E8F0' : '1.5px solid #86EFAC',
                  display: 'flex',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: notif.read ? 'none' : '0 2px 8px rgba(22, 163, 74, 0.08)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: notif.read ? '#F8FAFC' : '#DCFCE7',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {renderIcon(notif.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {formatTimeAgo(notif.timestamp)}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '3px', lineHeight: 1.45 }}>
                    {notif.description}
                  </div>

                  {notif.metadata?.requestId && (
                    <div
                      style={{
                        marginTop: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#15803D',
                      }}
                    >
                      <span>Tap to track live order</span>
                      <ArrowRight size={12} />
                    </div>
                  )}
                </div>

                {!notif.read && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                      alignSelf: 'center',
                      boxShadow: '0 0 6px #16A34A',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Action */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#FAFCF9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            EaseHub Instant Notification Engine
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigateAccount) onNavigateAccount();
              else window.location.hash = '#account/notifications';
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#15803D',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Account Settings</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUpNotif {
          from {
            transform: translateY(100%);
            opacity: 0.7;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
