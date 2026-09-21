import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Building2,
  UtensilsCrossed,
  Shirt,
  Moon,
  Activity,
  ArrowRight,
  Sparkles,
  Command,
  X,
} from 'lucide-react';

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string, payload?: any) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: 'PG & Rooms' | 'Mess Plans' | 'Laundry' | 'Midnight Food' | 'Platform Actions';
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent('easehub_open_command_palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items: PaletteItem[] = [
    {
      id: 'action-tracker',
      title: 'Open Live Order & Laundry Tracker',
      category: 'Platform Actions',
      subtitle: 'View live mess prep stages and laundry drum status',
      icon: <Activity size={18} color="#10B981" />,
      action: () => {
        onClose();
        onSelectAction('tracker');
      },
    },
    {
      id: 'action-canteen',
      title: 'Order Midnight Exam Food',
      category: 'Midnight Food',
      subtitle: 'Maggi, cold coffee & burgers delivered past 10 PM',
      icon: <Moon size={18} color="#C084FC" />,
      action: () => {
        onClose();
        onSelectAction('canteen');
      },
    },
    {
      id: 'action-mess-menu',
      title: "View Today's Mess Menu (Breakfast, Lunch, Dinner)",
      category: 'Mess Plans',
      subtitle: 'Check live dishes, chef highlights, and pause today meal',
      icon: <UtensilsCrossed size={18} color="#16A34A" />,
      action: () => {
        onClose();
        onSelectAction('mess-menu');
      },
    },
    {
      id: 'pg-single-ac',
      title: 'Single Occupancy AC Studio Room',
      category: 'PG & Rooms',
      subtitle: 'Kurud Road • Zero Brokerage • High-Speed Wi-Fi • ₹5,800/mo',
      icon: <Building2 size={18} color="#60A5FA" />,
      action: () => {
        onClose();
        onSelectAction('service-booking', 'pg');
      },
    },
    {
      id: 'pg-double-sharing',
      title: 'Comfort Double Sharing Residence',
      category: 'PG & Rooms',
      subtitle: 'Kohka Gate • Study desks & biometric entry • ₹3,400/mo',
      icon: <Building2 size={18} color="#60A5FA" />,
      action: () => {
        onClose();
        onSelectAction('service-booking', 'pg');
      },
    },
    {
      id: 'mess-deluxe-thali',
      title: 'Deluxe Student Monthly Thali (Lunch + Dinner)',
      category: 'Mess Plans',
      subtitle: 'Unlimited chapatis, paneer, dal fry & salads • ₹2,600/mo',
      icon: <UtensilsCrossed size={18} color="#FBBF24" />,
      action: () => {
        onClose();
        onSelectAction('service-booking', 'mess');
      },
    },
    {
      id: 'laundry-express',
      title: 'Express Same-Day Wash & Ironing',
      category: 'Laundry',
      subtitle: 'Hostel gate pickup • Automated weigh-in • ₹49/kg',
      icon: <Shirt size={18} color="#34D399" />,
      action: () => {
        onClose();
        onSelectAction('service-booking', 'laundry');
      },
    },
    {
      id: 'action-account',
      title: 'Go to Student Dashboard & Bookings',
      category: 'Platform Actions',
      subtitle: 'View booking passes, invoices & support chats',
      icon: <Sparkles size={18} color="#38BDF8" />,
      action: () => {
        onClose();
        onSelectAction('account');
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Command Palette"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '10vh 1.25rem 2rem 1.25rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="prize-glass-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid rgba(22, 163, 74, 0.22)',
          boxShadow: '0 25px 60px -15px rgba(15, 81, 50, 0.15), 0 0 35px rgba(250, 204, 21, 0.1)',
        }}
      >
        {/* Search Bar Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid rgba(22, 163, 74, 0.12)',
            backgroundColor: '#F8FAF7',
          }}
        >
          <Search size={20} color="#16A34A" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            placeholder="Type a service, food item, action, or question..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0F172A',
              fontSize: '1.05rem',
              fontWeight: 500,
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: '#EFF5EC',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: '#15803D',
              border: '1px solid rgba(22, 163, 74, 0.18)',
            }}
          >
            ESC to close
          </div>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
              <p style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>No matching campus items found for "{query}"</p>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Try searching "PG", "Mess", "Canteen", "Laundry", or "Showcase"
              </span>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#DCFCE7' : 'transparent',
                    border: isSelected ? '1px solid #86EFAC' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#EFF5EC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: isSelected ? '#15803D' : '#0F172A' }}>
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: '#FEF08A',
                            color: '#854D0E',
                            border: '1px solid #FDE047',
                            fontWeight: 700,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    color={isSelected ? '#15803D' : 'transparent'}
                    style={{ transition: 'color 0.15s' }}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.4rem',
            borderTop: '1px solid rgba(22, 163, 74, 0.12)',
            backgroundColor: '#F8FAF7',
            fontSize: '0.74rem',
            color: '#64748B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Dismiss</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#15803D', fontWeight: 600 }}>
            <Command size={12} /> EaseHub Spotlight
          </span>
        </div>
      </div>
    </div>
  );
};
