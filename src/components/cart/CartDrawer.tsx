import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Building2,
  Utensils,
  Shirt,
  Home,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    grandTotal,
    appliedCoupon,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    deliveryDetails,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Campus Shopping Cart"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'flex-end',
          transition: 'all 0.25s ease',
        }}
        onClick={closeCart}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 'min(440px, 100vw)',
            height: '100%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.2)',
            animation: 'easehub-slide-left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAF7',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    Campus Cart
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {itemCount}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Hostel Gate Direct Delivery
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Delivery Room Notice Bar */}
          <div
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: '#EFF6FF',
              borderBottom: '1px solid #DBEAFE',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              color: '#1E40AF',
              fontWeight: 600,
            }}
          >
            <Building2 size={14} color="#2563EB" />
            <span>Delivering to: Hostel {deliveryDetails.hostelBlock}, Room {deliveryDetails.roomNumber}</span>
          </div>

          {/* Items List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {items.length === 0 ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '1rem',
                  color: '#64748B',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                  }}
                >
                  <ShoppingBag size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Your campus cart is empty
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0.35rem 0 0 0', maxWidth: '240px' }}>
                    Add delicious mess thalis, laundry bundles, or book zero-brokerage PG visits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    window.location.hash = '#catalog';
                  }}
                  style={{
                    padding: '0.65rem 1.15rem',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Explore Campus Services
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    padding: '0.9rem',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  {/* Thumbnail */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '10px',
                        backgroundColor: '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748B',
                      }}
                    >
                      {item.category === 'meals' ? <Utensils size={20} /> : item.category === 'laundry' ? <Shirt size={20} /> : <Home size={20} />}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94A3B8',
                            padding: '2px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                        {item.providerName || 'Verified Partner'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#15803D' }}>
                        ₹{item.numericPrice * item.quantity}
                      </div>

                      {/* Stepper */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#F1F5F9',
                          borderRadius: '8px',
                          padding: '2px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#334155',
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.84rem', fontWeight: 800, minWidth: '22px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#334155',
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div
              style={{
                borderTop: '1px solid #E2E8F0',
                padding: '1.25rem',
                backgroundColor: '#F8FAF7',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              {/* Promo code box */}
              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.75rem',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#15803D',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Tag size={14} />
                    <span>Coupon {appliedCoupon} applied (-₹{discountAmount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', color: '#B91C1C', cursor: 'pointer', fontWeight: 800, fontSize: '0.74rem' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. CAMPUS50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      minHeight: '40px',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '16px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.45rem 0.95rem',
                      minHeight: '40px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <div style={{ fontSize: '0.74rem', color: couponMessage.isError ? '#DC2626' : '#16A34A', fontWeight: 600 }}>
                  {couponMessage.text}
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: '#64748B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Item Subtotal</span>
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                    <span>Student Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hostel Delivery</span>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>FREE (₹0)</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: '#0F172A',
                    paddingTop: '0.4rem',
                    borderTop: '1px dashed #CBD5E1',
                    marginTop: '0.2rem',
                  }}
                >
                  <span>Total Payable</span>
                  <span style={{ color: '#15803D' }}>₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleOpenCheckout}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  padding: '0.85rem',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: 'clamp(0.88rem, 2.5vw, 0.96rem)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.4)',
                }}
              >
                <span>Proceed to Instant Checkout (₹{grandTotal})</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={() => {
          setIsCheckoutOpen(false);
          closeCart();
        }}
      />
    </>
  );
};
