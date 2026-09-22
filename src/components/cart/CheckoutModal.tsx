import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Truck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ServiceRequestRepository } from '../../services/serviceRequestRepository';
import { PaymentService } from '../../services/paymentService';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  const { items, grandTotal, deliveryDetails, setDeliveryDetails, clearCart } = useCart();
  const { user } = useAuth();
  const gatewaySettings = PaymentService.getGatewaySettings();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'campus_card'>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const upiId = gatewaySettings.adminUpiId || '6201614778@ibl';
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('EaseHub Campus Store')}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('EaseHub Cart Order')}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePayViaApp = () => {
    window.location.href = upiIntentUri;
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderRef = `EH-${Date.now().toString().slice(-6)}`;

      // Record in PaymentService if UPI
      if (paymentMethod === 'upi') {
        PaymentService.submitPayment({
          orderId: orderRef,
          payerName: deliveryDetails.studentName || user?.name || 'Campus Resident',
          payerPhone: deliveryDetails.studentPhone || user?.phone || '+91 62016 14778',
          payerEmail: user?.email || 'student@easehub.in',
          payerHostel: `Hostel ${deliveryDetails.hostelBlock || user?.hostelBlock || 'Block B'}, Room ${deliveryDetails.roomNumber || user?.roomNumber || '304'}`,
          itemOrServiceTitle: items.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'Campus Order',
          category: items[0]?.category || 'cart',
          amount: grandTotal,
          paymentMethod: 'upi_qr',
          upiIdUsed: upiId,
          utrNumber: utrNumber.trim() || `UPI-${Date.now().toString().slice(-6)}`,
          adminNotes: `Cart checkout for ${items.length} items to Hostel ${deliveryDetails.hostelBlock}`,
        });
      }

      // Generate service request entries for each cart item
      for (const item of items) {
        await ServiceRequestRepository.createRequest({
          serviceSlug: item.slug,
          serviceName: item.name,
          actionType: 'booking',
          optionName: item.optionName || `${item.quantity}x Ordered`,
          providerName: item.providerName || 'EaseHub Campus Partner',
          customer: {
            name: deliveryDetails.studentName || user?.name || 'Campus Resident',
            phone: deliveryDetails.studentPhone || user?.phone || '+91 98765 43210',
            email: user?.email || 'student@easehub.in',
            hostelBlock: deliveryDetails.hostelBlock || user?.hostelBlock || 'Block B',
            roomNumber: deliveryDetails.roomNumber || user?.roomNumber || '304',
            notes: deliveryDetails.specialInstructions,
          },
          schedule: {
            date: 'Today',
            timeSlot: item.category === 'meals' ? 'Lunch / Dinner Delivery' : item.category === 'laundry' ? 'Tomorrow Morning Pickup' : 'Immediate Dispatch',
          },
          estimatedPrice: `₹${item.numericPrice * item.quantity}`,
          notes: `Payment via ${paymentMethod.toUpperCase()}${utrNumber ? ` (UTR: ${utrNumber})` : ''} • ${deliveryDetails.specialInstructions || 'Hostel gate delivery'}`,
        });
      }

      window.dispatchEvent(new CustomEvent('easehub_requests_updated'));
      clearCart();
      setConfirmedOrderId(orderRef);

      if (onOrderPlaced) {
        onOrderPlaced(orderRef);
      }
    } catch {
      // Handle error gracefully
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDone = () => {
    const orderIdToTrack = confirmedOrderId;
    onClose();
    setConfirmedOrderId(null);
    window.location.hash = orderIdToTrack ? `#account/tracking/${orderIdToTrack}` : '#account/tracking';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vw, 1.25rem)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: 'min(520px, 100%)',
          width: '100%',
          maxHeight: 'min(94vh, calc(100dvh - 1.5rem))',
          overflowY: 'auto',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {confirmedOrderId ? (
          /* Order Success State */
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                border: '2px solid #86EFAC',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#15803D', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <Sparkles size={14} />
                <span>ORDER DISPATCH CONFIRMED</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Order Placed Successfully!
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.35rem' }}>
                Your campus order reference is <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{confirmedOrderId}</strong>
              </p>
            </div>

            <div
              style={{
                width: '100%',
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                textAlign: 'left',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Delivery Destination:</span>
                <strong>Hostel {deliveryDetails.hostelBlock}, Room {deliveryDetails.roomNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Payment Method:</span>
                <strong>{paymentMethod === 'upi' ? 'Instant UPI' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Campus Card'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Total Amount:</span>
                <strong style={{ color: '#15803D', fontSize: '1rem' }}>₹{grandTotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Live Status:</span>
                <span style={{ color: '#D97706', fontWeight: 700 }}>Kitchen / Partner Dispatched</span>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleDone}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.4)',
                }}
              >
                <span>Track Live Order in Account</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setConfirmedOrderId(null);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  color: '#64748B',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div style={{ padding: '1.75rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Instant Campus Checkout
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>
                  Total: <strong style={{ color: '#16A34A' }}>₹{grandTotal}</strong> • Zero Delivery Brokerage
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* 1. Delivery Details */}
              <div style={{ backgroundColor: '#F8FAF7', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>
                  Delivery Destination
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                      Hostel Wing / Block
                    </label>
                    <input
                      type="text"
                      value={deliveryDetails.hostelBlock}
                      onChange={(e) => setDeliveryDetails((prev) => ({ ...prev, hostelBlock: e.target.value }))}
                      style={{ width: '100%', minHeight: '42px', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '16px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={deliveryDetails.roomNumber}
                      onChange={(e) => setDeliveryDetails((prev) => ({ ...prev, roomNumber: e.target.value }))}
                      style={{ width: '100%', minHeight: '42px', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '16px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                    Delivery Call Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call when outside hostel gate"
                    value={deliveryDetails.specialInstructions}
                    onChange={(e) => setDeliveryDetails((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                    style={{ width: '100%', minHeight: '42px', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* 2. Payment Method Selector */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Select Payment Mode
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'upi' ? '2px solid #16A34A' : '1.5px solid #E2E8F0',
                      backgroundColor: paymentMethod === 'upi' ? '#F0FDF4' : '#FFFFFF',
                      color: paymentMethod === 'upi' ? '#15803D' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <QrCode size={20} />
                    <span>Instant UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'cod' ? '2px solid #16A34A' : '1.5px solid #E2E8F0',
                      backgroundColor: paymentMethod === 'cod' ? '#F0FDF4' : '#FFFFFF',
                      color: paymentMethod === 'cod' ? '#15803D' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Truck size={20} />
                    <span>Gate Pay (COD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('campus_card')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'campus_card' ? '2px solid #16A34A' : '1.5px solid #E2E8F0',
                      backgroundColor: paymentMethod === 'campus_card' ? '#F0FDF4' : '#FFFFFF',
                      color: paymentMethod === 'campus_card' ? '#15803D' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <CreditCard size={20} />
                    <span>Campus Pay</span>
                  </button>
                </div>
              </div>

              {/* UPI Dynamic QR & Payment Details */}
              {paymentMethod === 'upi' && (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '1.15rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>
                      Scan & Pay Direct via UPI
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', backgroundColor: '#E0F2FE', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                      0% Fees
                    </span>
                  </div>

                  {/* PhonePe Official QR Container */}
                  <div
                    style={{
                      padding: '0.65rem',
                      backgroundColor: '#0A0A0A',
                      borderRadius: '14px',
                      border: '2px solid #5F259F',
                      boxShadow: '0 6px 18px rgba(95, 37, 159, 0.22)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={gatewaySettings.qrImageUrl || '/payment-qr.jpg'}
                      alt="Official PhonePe QR Code - anshu kumar kedia"
                      style={{ width: '165px', height: 'auto', display: 'block', borderRadius: '6px' }}
                    />
                    <div style={{ marginTop: '0.4rem', fontSize: '0.74rem', color: '#D8B4FE', fontWeight: 800 }}>
                      PhonePe Accepted Here
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#FFFFFF', fontWeight: 600 }}>
                      anshu kumar kedia
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Pay <strong>₹{grandTotal}</strong> using PhonePe, GPay, Paytm or BHIM
                  </div>

                  {/* Direct Mobile UPI Pay Button */}
                  <button
                    type="button"
                    onClick={handlePayViaApp}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    <Smartphone size={16} />
                    <span>Open in UPI App (GPay / PhonePe / Paytm)</span>
                  </button>

                  {/* Copy UPI ID Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>UPI VPA / ID</div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', fontSize: '0.85rem' }}>
                        {upiId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{
                        padding: '0.35rem 0.65rem',
                        backgroundColor: copiedUpi ? '#DCFCE7' : '#F1F5F9',
                        color: copiedUpi ? '#15803D' : '#475569',
                        border: '1px solid',
                        borderColor: copiedUpi ? '#86EFAC' : '#CBD5E1',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* UTR Input */}
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                      UPI Ref / UTR Number (Optional for faster dispatch)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 425918274019"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '42px',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  padding: '0.95rem',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: 'clamp(0.88rem, 2.5vw, 0.98rem)',
                  fontWeight: 800,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.4)',
                  opacity: isProcessing ? 0.7 : 1,
                }}
              >
                {isProcessing ? (
                  <span>Dispatching to Kitchen & Partners...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Pay & Confirm Order (₹{grandTotal})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
