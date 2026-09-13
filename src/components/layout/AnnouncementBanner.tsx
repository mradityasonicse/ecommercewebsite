import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface AnnouncementBannerProps {
  message?: string;
  onDismiss?: () => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message = '🎉 Early users get priority support',
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <aside
      aria-label="Announcement"
      className="easehub-announcement-banner"
      style={{
        position: 'relative',
        zIndex: 9950,
        backgroundColor: '#15803D',
        color: '#FFFFFF',
        fontSize: '0.85rem',
        fontWeight: 600,
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '0 auto',
        }}
      >
        <span>{message}</span>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#FFFFFF',
          opacity: 0.85,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          borderRadius: '4px',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
      >
        <X size={16} />
      </button>
    </aside>
  );
};
