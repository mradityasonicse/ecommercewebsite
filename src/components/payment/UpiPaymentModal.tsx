import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  Copy,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PaymentService } from '../../services/paymentService';
import type { PaymentTransaction, GatewaySettings } from '../../types/payment';

export interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  itemTitle: string;
  amount: number;
  category?: string;
  payerName?: string;
  payerPhone?: string;
  onPaymentSuccess?: (tx: PaymentTransaction) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  itemTitle,
  amount,
  category = 'bazaar',
  payerName = '',
  payerPhone = '',
  onPaymentSuccess,
}) => {
  const [settings, setSettings] = useState<GatewaySettings>(PaymentService.getGatewaySettings());
  const [utrNumber, setUtrNumber] = useState('');
  const [studentName, setStudentName] = useState(payerName);
  const [studentPhone, setStudentPhone] = useState(payerPhone);
  const [hostelInfo, setHostelInfo] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const generatedOrderId = orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  useEffect(() => {
    if (isOpen) {
      setSettings(PaymentService.getGatewaySettings());
      setCompletedTx(null);
      setErrorMsg('');
      setUtrNumber('');
      if (payerName) setStudentName(payerName);
      if (payerPhone) setStudentPhone(payerPhone);
    }
  }, [isOpen, payerName, payerPhone]);

  if (!isOpen) return null;

  const upiIntentUri = PaymentService.buildUpiIntentUri(amount, generatedOrderId, itemTitle);
  const dynamicQrUrl = PaymentService.getDynamicQrCodeUrl(amount, generatedOrderId, itemTitle);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.adminUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePayViaApp = () => {
    window.location.href = upiIntentUri;
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid 12-digit UPI Reference / UTR Number from your banking app.');
      return;
    }
    if (!studentName.trim() || !studentPhone.trim()) {
      setErrorMsg('Please fill in your name and WhatsApp phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const tx = PaymentService.submitPayment({
        orderId: generatedOrderId,
        payerName: studentName.trim(),
        payerPhone: studentPhone.trim(),
        payerHostel: hostelInfo.trim() || 'Campus Hostels',
        itemOrServiceTitle: itemTitle,
        category,
        amount,
        paymentMethod: 'upi_qr',
        upiIdUsed: settings.adminUpiId,
        utrNumber: utrNumber.trim(),
        adminNotes: 'Awaiting Admin Verification',
      });

      setIsSubmitting(false);
      setCompletedTx(tx);
      if (onPaymentSuccess) {
        onPaymentSuccess(tx);
      }
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid rgba(22, 163, 74, 0.25)',
          borderRadius: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          color: '#0F172A',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(22, 163, 74, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #F0FDF4, #FEFCE8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803D',
              }}
            >
              <QrCode size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                EaseHub Fast UPI Checkout
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                0% Gateway Fee • 100% Student Escrow Protection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(15, 23, 42, 0.05)',
              border: '1px solid rgba(22, 163, 74, 0.15)',
              color: '#475569',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto' }}>
          {completedTx ? (
            /* Success / Receipt Screen */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  border: '2px solid #16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#15803D',
                }}
              >
                <CheckCircle size={36} />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                Payment Proof Submitted!
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                Your payment for <strong style={{ color: '#0F172A' }}>{itemTitle}</strong> has been logged with UTR{' '}
                <code style={{ color: '#15803D', fontWeight: 700, backgroundColor: '#F0FDF4', padding: '2px 6px', borderRadius: '4px' }}>
                  {completedTx.utrNumber}
                </code>.
              </p>

              <div
                style={{
                  backgroundColor: '#F8FAF7',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  border: '1.5px solid rgba(22, 163, 74, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Order ID:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{completedTx.orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Amount Paid:</span>
                  <span style={{ fontWeight: 800, color: '#16A34A', fontSize: '1rem' }}>₹{completedTx.amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Status:</span>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#FEF08A',
                      color: '#854D0E',
                      border: '1px solid #FACC15',
                    }}
                  >
                    Pending Admin Verification
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Timestamp:</span>
                  <span style={{ color: '#334155' }}>{new Date(completedTx.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.hash = '#account/requests';
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '0.5rem',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  View My Orders
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    backgroundColor: '#16A34A',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Standard Payment Steps */
            <div>
              {/* Order Summary Pill */}
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  borderRadius: '0.75rem',
                  padding: '0.9rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1.5px solid #BBF7D0',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#15803D', fontWeight: 700 }}>
                    Item / Service
                  </span>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>{itemTitle}</div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Order Ref: {generatedOrderId}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#15803D', fontWeight: 700 }}>
                    Total Payable
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803D' }}>₹{amount}</div>
                </div>
              </div>

              {/* Dynamic QR Code & UPI Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.25rem',
                  backgroundColor: '#F8FAF7',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  border: '1.5px solid rgba(22, 163, 74, 0.2)',
                  marginBottom: '1.25rem',
                  alignItems: 'center',
                }}
              >
                {/* QR Box */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <img
                      src={dynamicQrUrl}
                      alt="Scan to Pay via UPI"
                      style={{ width: '150px', height: '150px', display: 'block' }}
                    />
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#475569', fontWeight: 500 }}>
                    Scan with Google Pay, PhonePe, Paytm, etc.
                  </div>
                </div>

                {/* Direct Pay / Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700 }}>
                      Official UPI ID
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '0.5rem',
                        padding: '0.45rem 0.75rem',
                        border: '1.5px solid #CBD5E1',
                        marginTop: '0.2rem',
                      }}
                    >
                      <code style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 800 }}>
                        {settings.adminUpiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedUpi ? '#16A34A' : '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {copiedUpi ? <CheckCircle size={14} /> : <Copy size={14} />}
                        {copiedUpi ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Payee Name: </span>
                    <strong style={{ fontSize: '0.8rem', color: '#0F172A' }}>{settings.payeeName}</strong>
                  </div>

                  {/* One-Tap Mobile UPI Intent Button */}
                  <button
                    type="button"
                    onClick={handlePayViaApp}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      padding: '0.65rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
                    }}
                  >
                    <Smartphone size={16} />
                    <span>Pay with any UPI App</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Confirmation / UTR Submission Form */}
              <form onSubmit={handleSubmitProof} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
                  <Sparkles size={16} color="#EAB308" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>Step 2: Enter Transaction Details</span>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#FEE2E2',
                      border: '1px solid #FCA5A5',
                      color: '#B91C1C',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#334155', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aryan Singh"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #CBD5E1',
                        color: '#0F172A',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#334155', fontWeight: 600, marginBottom: '0.25rem' }}>
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #CBD5E1',
                        color: '#0F172A',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#334155', fontWeight: 600, marginBottom: '0.25rem' }}>
                    12-Digit UPI Reference Number (UTR) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="e.g. 425918274019 (Found in GPay/PhonePe receipt)"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\s/g, ''))}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #16A34A',
                      color: '#15803D',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '0.2rem' }}>
                    Open your payment app history, look for "UPI Ref No" or "UTR".
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#334155', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Delivery Room / Hostel Block (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hostel Block B, Room 214"
                    value={hostelInfo}
                    onChange={(e) => setHostelInfo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      color: '#0F172A',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.72rem',
                    color: '#15803D',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Your funds are held securely in EaseHub Escrow until you confirm item receipt!</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.8rem',
                    backgroundColor: isSubmitting ? '#94A3B8' : '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                    marginTop: '0.25rem',
                  }}
                >
                  {isSubmitting ? (
                    'Verifying Proof...'
                  ) : (
                    <>
                      <span>Submit Payment Proof</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
