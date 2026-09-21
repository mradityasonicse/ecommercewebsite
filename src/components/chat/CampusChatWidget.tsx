import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Phone,
  Headphones,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  UtensilsCrossed,
  Building2,
  Shirt,
  Wrench,
  Store,
  Moon,
} from 'lucide-react';
import { type Campus } from '../../data/campuses';
import { SITE_CONFIG } from '../../data/site-config';

export interface CampusChatWidgetProps {
  selectedCampus?: Campus;
  businessWhatsAppNumber?: string;
  defaultOpen?: boolean;
}

const DEFAULT_PHONE = '918102848776';

interface QuickTopic {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; color?: string }>;
  color: string;
  bgColor: string;
  query: string;
}

const QUICK_TOPICS: QuickTopic[] = [
  {
    id: 'mess',
    label: 'Daily Mess & Tiffin Plans',
    icon: UtensilsCrossed,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.16)',
    query: 'Hi EaseHub! I want details about hygienic monthly mess & tiffin plans near campus.',
  },
  {
    id: 'pg',
    label: 'Zero-Brokerage PG & Rooms',
    icon: Building2,
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.16)',
    query: 'Hi EaseHub! Looking for verified student PG / hostel rooms with zero brokerage.',
  },
  {
    id: 'laundry',
    label: '24h Doorstep Laundry Pickup',
    icon: Shirt,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.16)',
    query: 'Hi EaseHub! How does the 24-hour campus doorstep laundry pickup and iron service work?',
  },
  {
    id: 'night_owl',
    label: 'Midnight Canteen & Snacks',
    icon: Moon,
    color: '#C084FC',
    bgColor: 'rgba(192, 132, 252, 0.16)',
    query: 'Hi EaseHub! I want to order late-night Maggi / snacks to my hostel gate.',
  },
  {
    id: 'repairs',
    label: 'Urgent Room Electrician/Plumbing',
    icon: Wrench,
    color: '#FB923C',
    bgColor: 'rgba(251, 146, 60, 0.16)',
    query: 'Hi EaseHub! I need urgent electrician/plumber maintenance in my student room.',
  },
  {
    id: 'partner',
    label: 'List Your Campus Business',
    icon: Store,
    color: '#818CF8',
    bgColor: 'rgba(129, 140, 248, 0.16)',
    query: 'Hi EaseHub! I am a local campus service provider and want to get verified on EaseHub.',
  },
];

export const CampusChatWidget: React.FC<CampusChatWidgetProps> = ({
  selectedCampus,
  businessWhatsAppNumber = DEFAULT_PHONE,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep chat pill clean without intrusive auto-popup
  useEffect(() => {
    setShowTooltip(false);
  }, [isOpen]);

  // Hide tooltip when opened
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Listen to custom event to open chat from anywhere (Navbar, Footer, etc.)
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('easehub:open-chat', handleOpenChat);
    return () => window.removeEventListener('easehub:open-chat', handleOpenChat);
  }, []);

  const campusName = selectedCampus?.name || 'Student Living Hub';

  const sendWhatsApp = (customText?: string) => {
    const textToSend = customText || message.trim() || 'Hello EaseHub! I have a question about campus services.';
    const formatted = `*Campus Inquiry (${campusName})*\n${textToSend}\n\n_Sent via EaseHub Student Desk_`;
    const encoded = encodeURIComponent(formatted);
    const cleanNumber = businessWhatsAppNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleSelectTopic = (topic: QuickTopic) => {
    setSelectedTopic(topic.id);
    setMessage(topic.query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      {/* Floating Action Button (Always visible on BOTH Laptop & Mobile) */}
      <aside
        aria-label="Student Helpdesk Chat"
        className="easehub-chat-floating-root"
        style={{
          position: 'fixed',
          bottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))',
          right: 'max(1.25rem, env(safe-area-inset-right, 1.25rem))',
          zIndex: 9950,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.625rem',
          pointerEvents: 'none',
        }}
      >
        {/* Desktop Greeting Bubble */}
        {!isOpen && showTooltip && (
          <div
            className="easehub-chat-desktop-tooltip"
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'var(--color-surface-1, #111622)',
              border: '1px solid var(--color-border-hover, rgba(255, 255, 255, 0.32))',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '0.625rem 0.875rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              maxWidth: '280px',
              animation: 'easehubFadeUp 0.3s ease-out forwards',
              cursor: 'pointer',
            }}
            onClick={() => setIsOpen(true)}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
                flexShrink: 0,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: '0.78rem',
                color: 'var(--color-text-primary, #FFFFFF)',
                lineHeight: 1.35,
                fontWeight: 500,
              }}
            >
              Need help with Mess, PG, or Laundry? <strong style={{ color: '#25D366' }}>Chat with us</strong>
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              aria-label="Dismiss message"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted, #94A3B8)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          type="button"
          id="easehub-chat-trigger"
          aria-label={isOpen ? 'Close student chat helpdesk' : 'Open student chat helpdesk on WhatsApp'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: isOpen ? 'var(--color-surface-2, #181F2E)' : '#25D366',
            color: '#FFFFFF',
            border: isOpen
              ? '1px solid var(--color-border-hover, rgba(255, 255, 255, 0.32))'
              : '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '9999px',
            padding: '0.75rem 1.125rem',
            minHeight: '48px',
            boxShadow: isOpen
              ? '0 10px 25px rgba(0, 0, 0, 0.5)'
              : '0 8px 24px rgba(37, 211, 102, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = '#20BD5A';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = '#25D366';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)';
            }
          }}
        >
          {isOpen ? (
            <>
              <X size={20} strokeWidth={2.5} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.01em' }}>
                Close
              </span>
            </>
          ) : (
            <>
              {/* WhatsApp / Chat Icon with pulse */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MessageCircle size={22} strokeWidth={2.4} fill="currentColor" />
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #25D366',
                  }}
                />
              </div>

              {/* Bold Readable Text on Both Laptop AND Mobile */}
              <span
                className="easehub-chat-btn-text"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                Chat Support
              </span>

              {/* Status Dot */}
              <div
                className="easehub-chat-online-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'inline-block',
                    animation: 'easehubPulseDot 1.6s infinite',
                  }}
                />
                <span>Online</span>
              </div>
            </>
          )}
        </button>
      </aside>

      {/* Interactive Chat Panel Drawer / Card (Visible on click on Both Laptop & Mobile) */}
      {isOpen && (
        <>
          {/* Mobile backdrop for tap outside to dismiss */}
          <div
            className="easehub-chat-backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 9940,
            }}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="EaseHub Student Concierge & Helpdesk"
            className="easehub-chat-panel"
            style={{
              position: 'fixed',
              bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom, 0px) + 5.5rem))',
              right: 'max(1.25rem, env(safe-area-inset-right, 1.25rem))',
              zIndex: 9955,
              width: 'calc(100vw - 2.5rem)',
              maxWidth: '390px',
              backgroundColor: 'var(--color-surface-1, #111622)',
              border: '1px solid var(--color-border-hover, rgba(255, 255, 255, 0.24))',
              borderRadius: 'var(--radius-xl, 16px)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 7rem)',
              animation: 'easehubSlideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Header: Brand + Agent Profile */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-2, #181F2E)',
                borderBottom: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.1))',
                padding: '1rem 1.125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Support Avatar */}
                <div
                  style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  <MessageCircle size={20} strokeWidth={2.4} fill="currentColor" />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      border: '2px solid #181F2E',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '0.925rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary, #FFFFFF)',
                      }}
                    >
                      EaseHub Student Desk
                    </h3>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34D399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontWeight: 600,
                      }}
                    >
                      Verified
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '0.125rem 0 0',
                      fontSize: '0.72rem',
                      color: 'var(--color-text-secondary, #CBD5E1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{campusName}</span>
                    <span>•</span>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>Avg reply &lt; 2 min</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat window"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted, #94A3B8)',
                  cursor: 'pointer',
                  padding: '0.375rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div
              style={{
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                flex: 1,
              }}
            >
              {/* Agent Greeting Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface-2, #181F2E)',
                  border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08))',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '0.875rem',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <Headphones size={14} style={{ color: '#25D366' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8' }}>
                    Instant Student Support
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.825rem',
                    color: 'var(--color-text-primary, #FFFFFF)',
                    lineHeight: 1.5,
                  }}
                >
                  👋 Hi! Welcome to <strong>EaseHub</strong>. Need help choosing a Mess plan, finding verified PG rooms, or booking laundry near <strong>{campusName}</strong>?
                </p>
              </div>

              {/* Quick Topic Prompts */}
              <div>
                <p
                  style={{
                    margin: '0 0 0.5rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted, #94A3B8)',
                  }}
                >
                  What do you need help with?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {QUICK_TOPICS.map((topic) => {
                    const isSelected = selectedTopic === topic.id;
                    const IconComponent = topic.icon;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(topic)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          backgroundColor: isSelected
                            ? 'rgba(37, 211, 102, 0.14)'
                            : 'var(--color-surface-2, #181F2E)',
                          border: isSelected
                            ? '1px solid #25D366'
                            : '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08))',
                          borderRadius: '10px',
                          color: 'var(--color-text-primary, #FFFFFF)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.transform = 'translateX(3px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface-2, #181F2E)';
                            e.currentTarget.style.transform = 'none';
                          }
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              backgroundColor: topic.bgColor,
                              border: `1px solid ${topic.color}35`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: topic.color,
                              flexShrink: 0,
                              boxShadow: `0 2px 8px ${topic.color}20`,
                            }}
                          >
                            <IconComponent size={15} strokeWidth={2.2} />
                          </span>
                          <span style={{ color: 'var(--color-text-primary, #FFFFFF)' }}>{topic.label}</span>
                        </span>
                        <ChevronRight
                          size={15}
                          style={{
                            color: isSelected ? '#25D366' : 'var(--color-text-muted, #94A3B8)',
                            flexShrink: 0,
                            transition: 'transform 0.15s ease',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Message Input Area */}
              <div>
                <label
                  htmlFor="easehub-chat-input"
                  style={{
                    display: 'block',
                    margin: '0 0 0.375rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted, #94A3B8)',
                  }}
                >
                  Or write your custom question:
                </label>
                <textarea
                  id="easehub-chat-input"
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Which mess is best near gate 2? Can I book a single sharing PG?"
                  rows={2}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--color-bg-primary, #080A0F)',
                    border: '1px solid var(--color-border-default, rgba(255, 255, 255, 0.16))',
                    borderRadius: 'var(--radius-sm, 6px)',
                    color: '#FFFFFF',
                    padding: '0.625rem 0.75rem',
                    fontSize: '0.8rem',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendWhatsApp();
                    }
                  }}
                />
              </div>

              {/* Primary Action Button: WhatsApp */}
              <button
                type="button"
                id="easehub-chat-send-wa"
                onClick={() => sendWhatsApp()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#20BD5A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
              >
                <MessageCircle size={18} strokeWidth={2.4} fill="currentColor" />
                <span>Open Chat on WhatsApp</span>
                <ExternalLink size={14} />
              </button>

              {/* Alternative Quick Contact Channels */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  paddingTop: '0.25rem',
                }}
              >
                <a
                  href={`tel:${SITE_CONFIG.contact.campusHelpline.replace(/[^0-9+]/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    backgroundColor: 'var(--color-surface-2, #181F2E)',
                    border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08))',
                    borderRadius: 'var(--radius-sm, 6px)',
                    padding: '0.5rem',
                    color: 'var(--color-text-secondary, #CBD5E1)',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  <Phone size={13} style={{ color: '#60A5FA' }} />
                  <span>Call Helpline</span>
                </a>

                <a
                  href={`mailto:${SITE_CONFIG.contact.supportEmail}?subject=${encodeURIComponent(`EaseHub Inquiry - ${campusName}`)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    backgroundColor: 'var(--color-surface-2, #181F2E)',
                    border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08))',
                    borderRadius: 'var(--radius-sm, 6px)',
                    padding: '0.5rem',
                    color: 'var(--color-text-secondary, #CBD5E1)',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  <HelpCircle size={13} style={{ color: '#F59E0B' }} />
                  <span>Email Care</span>
                </a>
              </div>
            </div>

            {/* Footer Trust Bar */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-primary, #080A0F)',
                borderTop: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08))',
                padding: '0.625rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Shield size={12} style={{ color: '#10B981' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #94A3B8)' }}>
                  100% Student Privacy &amp; Escrow Protected
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>
                24/7 Available
              </span>
            </div>
          </div>
        </>
      )}

      {/* Embedded Injected Styles for Animations & Mobile Breakpoint Tweaks */}
      <style>{`
        @keyframes easehubPulseDot {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes easehubFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes easehubSlideInUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 860px) {
          .easehub-chat-floating-root {
            bottom: calc(env(safe-area-inset-bottom, 0px) + 88px) !important;
            right: 16px !important;
          }
          .easehub-chat-panel {
            bottom: calc(env(safe-area-inset-bottom, 0px) + 90px) !important;
          }
          .easehub-chat-online-badge {
            display: none !important;
          }
          .easehub-chat-desktop-tooltip {
            display: none !important;
          }
          #easehub-chat-trigger {
            padding: 0.62rem 0.95rem !important;
            min-height: 42px !important;
          }
        }
        @media (max-width: 640px) {
          .easehub-chat-panel {
            right: 1rem !important;
            left: 1rem !important;
            width: auto !important;
            max-width: none !important;
            bottom: max(5.5rem, calc(env(safe-area-inset-bottom, 0px) + 5.5rem)) !important;
          }
          #easehub-chat-trigger {
            padding: 0.6rem 0.9rem !important;
          }
        }
      `}</style>
    </>
  );
};
