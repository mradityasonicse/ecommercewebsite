import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ActivityItem {
  id: string;
  student: string;
  hostel: string;
  action: string;
  timeAgo: string;
  category: 'pg' | 'mess' | 'laundry';
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    student: 'Aryan D.',
    hostel: 'Hostel Block 1, Room 314',
    action: 'Booked Deluxe AC Double Sharing PG',
    timeAgo: '3 mins ago',
    category: 'pg',
  },
  {
    id: '2',
    student: 'Priya S.',
    hostel: 'Girls PG Flat 2B',
    action: 'Renewed Monthly Homely Mess (30 Days)',
    timeAgo: '7 mins ago',
    category: 'mess',
  },
  {
    id: '3',
    student: 'Vivek K.',
    hostel: 'Hostel Block C, Room 202',
    action: 'Scheduled 15kg Express Doorstep Laundry',
    timeAgo: '12 mins ago',
    category: 'laundry',
  },
  {
    id: '4',
    student: 'Sneha P.',
    hostel: 'Girls Hostel 2',
    action: 'Verified UPI QR Payment for Daily Thali',
    timeAgo: '18 mins ago',
    category: 'mess',
  },
];

export const CampusLiveActivityToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 400);
    }, 7500);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = ACTIVITIES[currentIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      className="easehub-activity-toast"
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '24px',
        zIndex: 9820,
        maxWidth: '340px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.96)',
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.65rem 0.85rem',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 16px 36px -8px rgba(0, 0, 0, 0.75)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9999px',
            backgroundColor: current.category === 'pg' ? 'rgba(59, 130, 246, 0.2)' : current.category === 'mess' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)',
            color: current.category === 'pg' ? '#60A5FA' : current.category === 'mess' ? '#FBBF24' : '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Sparkles size={15} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {current.student}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>• {current.timeAgo}</span>
          </div>
          <span style={{ fontSize: '0.73rem', color: '#CBD5E1', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {current.action}
          </span>
          <span style={{ fontSize: '0.66rem', color: '#64748B', display: 'block' }}>
            {current.hostel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss toast"
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
