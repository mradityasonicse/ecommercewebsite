import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '420px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const drawerContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9995,
        backgroundColor: 'rgba(15, 56, 44, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
        animation: 'easeRevealFade 0.2s ease-out forwards'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: width,
          height: '100%',
          backgroundColor: 'var(--color-bg-primary, #FBF9F1)',
          color: 'var(--color-text-primary, #151D1A)',
          borderLeft: position === 'right' ? '1px solid var(--color-border-subtle, #E8E4D5)' : 'none',
          borderRight: position === 'left' ? '1px solid var(--color-border-subtle, #E8E4D5)' : 'none',
          boxShadow: '0 20px 60px rgba(15, 56, 44, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'easeRevealFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border-subtle, #E8E4D5)',
            backgroundColor: 'var(--color-surface, #FFFFFF)'
          }}
        >
          <h3 style={{ fontSize: 'var(--text-h4)', fontFamily: 'Domine, serif', fontWeight: 700, margin: 0, color: 'var(--color-brand-blue, #0F382C)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary, #414845)',
              backgroundColor: 'rgba(15, 56, 44, 0.05)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 56, 44, 0.12)';
              e.currentTarget.style.color = 'var(--color-brand-blue, #0F382C)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 56, 44, 0.05)';
              e.currentTarget.style.color = 'var(--color-text-secondary, #414845)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(drawerContent, document.body);
  }
  return drawerContent;
};
