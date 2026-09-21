import React, { useState } from 'react';
import {
  X,
  Moon,
  Flame,
  Coffee,
  UtensilsCrossed,
  Zap,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { CANTEEN_ITEMS, CANTEEN_DROP_POINTS } from '../../data/canteenItems';
import type { CanteenCategory } from '../../types/canteen';
import { type Campus } from '../../data/campuses';

export interface MidnightCanteenModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampus?: Campus;
}

export const MidnightCanteenModal: React.FC<MidnightCanteenModalProps> = ({
  isOpen,
  onClose,
  selectedCampus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CanteenCategory>('all');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [step, setStep] = useState<'menu' | 'checkout' | 'success'>('menu');

  // Checkout inputs
  const [selectedDropPoint, setSelectedDropPoint] = useState<string>(CANTEEN_DROP_POINTS[0].id);
  const [hostelRoomNumber, setHostelRoomNumber] = useState<string>('');
  const [studentPhone, setStudentPhone] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  if (!isOpen) return null;

  // Filter items
  const filteredItems = CANTEEN_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  // Calculate cart counts & totals
  const totalItemsCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const subtotal = CANTEEN_ITEMS.reduce((sum, item) => {
    const qty = cart[item.id] || 0;
    return sum + item.price * qty;
  }, 0);

  const deliveryFee = subtotal >= 149 ? 0 : 15;
  const grandTotal = subtotal + deliveryFee;

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'maggi':
        return <Flame size={15} strokeWidth={2.2} color="#F97316" />;
      case 'beverages':
        return <Coffee size={15} strokeWidth={2.2} color="#F59E0B" />;
      case 'snacks':
        return <UtensilsCrossed size={15} strokeWidth={2.2} color="#10B981" />;
      case 'exam_fuel':
        return <Zap size={15} strokeWidth={2.2} color="#C084FC" />;
      default:
        return <Sparkles size={15} strokeWidth={2.2} color="#38BDF8" />;
    }
  };

  const handleDispatchWhatsApp = () => {
    const dropPointObj = CANTEEN_DROP_POINTS.find((d) => d.id === selectedDropPoint);
    const cartSummary = Object.entries(cart)
      .map(([id, qty]) => {
        const item = CANTEEN_ITEMS.find((it) => it.id === id);
        return item ? `• ${qty}x ${item.name} (₹${item.price * qty})` : '';
      })
      .filter(Boolean)
      .join('\n');

    const message = `🌙 *EASEHUB MIDNIGHT CANTEEN ORDER* 🌙
-----------------------------------
📍 *Campus*: ${selectedCampus ? selectedCampus.name : 'University Campus'}
🚪 *Hostel Drop Point*: ${dropPointObj?.name || 'Hostel Gate'}
🔢 *Room / Gate Note*: ${hostelRoomNumber || 'N/A'}
📱 *Student Phone*: ${studentPhone || 'N/A'}
${specialInstructions ? `📝 *Instructions*: ${specialInstructions}\n` : ''}
-----------------------------------
📋 *ITEMS ORDERED*:
${cartSummary}
-----------------------------------
💰 *Subtotal*: ₹${subtotal}
🛵 *Delivery Fee*: ${deliveryFee === 0 ? 'FREE (Orders over ₹149)' : `₹${deliveryFee}`}
⚡ *Total Bill*: ₹${grandTotal}
⏰ *Avg ETA*: ~12-15 mins

Please confirm order & dispatch the night runner!`;

    const runnerPhone = '918102848776';
    const waUrl = `https://wa.me/${runnerPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setStep('success');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid rgba(22, 163, 74, 0.22)',
          boxShadow: '0 25px 60px -15px rgba(15, 81, 50, 0.15), 0 0 40px rgba(250, 204, 21, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '180px',
            background: 'radial-gradient(ellipse, rgba(250, 204, 21, 0.15) 0%, rgba(22, 163, 74, 0.08) 50%, transparent 80%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(22, 163, 74, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2,
            backgroundColor: '#F8FAF7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Moon size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Night Owl Midnight Canteen
                </h2>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    border: '1px solid #86EFAC',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                  Live Runner Active (10 PM - 3:30 AM)
                </span>
              </div>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#475569' }}>
                Hot Maggi, Kulhad Chai, Midnight Burgers &amp; Exam Fuel delivered to your hostel entrance in ~15 mins.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Midnight Canteen"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#EFF5EC',
              border: '1px solid rgba(22, 163, 74, 0.2)',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DCFCE7';
              e.currentTarget.style.color = '#15803D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EFF5EC';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: MENU BROWSING */}
        {step === 'menu' && (
          <>
            {/* Category Filter Pills */}
            <div
              style={{
                padding: '0.85rem 1.75rem',
                borderBottom: '1px solid rgba(22, 163, 74, 0.1)',
                display: 'flex',
                gap: '0.6rem',
                overflowX: 'auto',
                backgroundColor: '#EFF5EC',
              }}
            >
              {[
                { id: 'all', label: 'All Cravings' },
                { id: 'maggi', label: 'Maggi & Noodles' },
                { id: 'beverages', label: 'Chai & Cold Brews' },
                { id: 'snacks', label: 'Midnight Sandwiches' },
                { id: 'exam_fuel', label: 'Exam Survival Fuel' },
              ].map((c) => {
                const isActive = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id as CanteenCategory)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.5rem 0.95rem',
                      borderRadius: '10px',
                      backgroundColor: isActive ? '#16A34A' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#334155',
                      border: isActive ? '1px solid #15803D' : '1px solid rgba(22, 163, 74, 0.2)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(22, 163, 74, 0.3)' : 'none',
                    }}
                  >
                    {getCategoryIcon(c.id)}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Menu Items Grid */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                overflowY: 'auto',
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1rem',
              }}
            >
              {filteredItems.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: qty > 0 ? '1.5px solid #16A34A' : '1.5px solid #E2E8F0',
                      padding: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '4px',
                              border: item.isVeg ? '1px solid #16A34A' : '1px solid #EF4444',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: item.isVeg ? '#16A34A' : '#EF4444',
                              }}
                            />
                          </span>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0F172A' }}>
                            {item.name}
                          </h4>
                        </div>

                        {item.tag && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              backgroundColor: '#FEF08A',
                              color: '#854D0E',
                              border: '1px solid #FDE047',
                            }}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <p style={{ margin: '0 0 0.85rem', fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45 }}>
                        {item.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803D' }}>
                          ₹{item.price}
                        </span>
                        {item.originalPrice && (
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>

                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.45rem 0.95rem',
                            borderRadius: '10px',
                            backgroundColor: '#DCFCE7',
                            border: '1px solid #86EFAC',
                            color: '#15803D',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#16A34A';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#DCFCE7';
                            e.currentTarget.style.color = '#15803D';
                          }}
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: '#DCFCE7',
                            border: '1px solid #86EFAC',
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            style={{
                              padding: '0.4rem 0.65rem',
                              background: 'none',
                              border: 'none',
                              color: '#15803D',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D', minWidth: '22px', textAlign: 'center' }}>
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 1)}
                            style={{
                              padding: '0.4rem 0.65rem',
                              background: 'none',
                              border: 'none',
                              color: '#15803D',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Cart Bar (if items in cart) */}
            {totalItemsCount > 0 && (
              <div
                style={{
                  padding: '1rem 1.75rem',
                  backgroundColor: '#F8FAF7',
                  borderTop: '1px solid rgba(22, 163, 74, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 -10px 25px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in Midnight Cart
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      ₹{subtotal}{' '}
                      <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>
                        {subtotal >= 149 ? '• Free Hostel Delivery' : '+ ₹15 Night Runner Fee'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.35)',
                  }}
                >
                  <span>Proceed to Hostel Gate</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT & HOSTEL DROP-POINT SELECTION */}
        {step === 'checkout' && (
          <div
            style={{
              padding: '1.75rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                Select Delivery Location &amp; Contact
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                Our late-night runner drops orders directly at your designated hostel security porch or gate.
              </p>
            </div>

            {/* Drop Point Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hostel Drop Point / Porch
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.65rem' }}>
                {CANTEEN_DROP_POINTS.map((dp) => {
                  const isSelected = selectedDropPoint === dp.id;
                  return (
                    <button
                      key={dp.id}
                      type="button"
                      onClick={() => setSelectedDropPoint(dp.id)}
                      style={{
                        padding: '0.75rem 0.9rem',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? '#DCFCE7' : '#FFFFFF',
                        border: isSelected ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{dp.name}</span>
                        {isSelected && <CheckCircle2 size={15} color="#15803D" />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{dp.area} • ~{dp.avgMinutes} min</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Number & Phone inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Room Number / Floor (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 314, B-Wing"
                  value={hostelRoomNumber}
                  onChange={(e) => setHostelRoomNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    color: '#0F172A',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Student Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    color: '#0F172A',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Runner Delivery Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra spicy masala, leave at guard room, call once you reach"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  color: '#0F172A',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Bill Breakdown Card */}
            <div
              style={{
                backgroundColor: '#F8FAF7',
                borderRadius: '14px',
                border: '1px solid rgba(22, 163, 74, 0.15)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.35rem' }}>
                <span>Subtotal ({totalItemsCount} items)</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>
                <span>Hostel Night Delivery</span>
                <span style={{ color: deliveryFee === 0 ? '#15803D' : '#0F172A', fontWeight: 600 }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#15803D', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <span>Total Payable</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.85rem', marginTop: 'auto' }}>
              <button
                type="button"
                onClick={() => setStep('menu')}
                style={{
                  padding: '0.8rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#EFF5EC',
                  border: '1px solid rgba(22, 163, 74, 0.2)',
                  color: '#334155',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back to Menu
              </button>

              <button
                type="button"
                onClick={handleDispatchWhatsApp}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(22, 163, 74, 0.35)',
                }}
              >
                <Phone size={16} />
                <span>Confirm &amp; Dispatch via WhatsApp Runner</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(22, 163, 74, 0.25)',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Order Dispatched to Night Runner!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
              Your order is being prepared by the campus night chef. Please keep your phone handy — the runner will contact you as soon as they reach the hostel gate (~12-15 mins).
            </p>

            <button
              type="button"
              onClick={() => {
                setCart({});
                setStep('menu');
                onClose();
              }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 2rem',
                borderRadius: '12px',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
