import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Campus } from '../../data/campuses';
import type { BookingTargetPayload } from '../sections/story/CoreServicesSection';
import { dispatchBookingToWhatsApp, type BookingSubmissionData } from '../../utils/whatsapp';
import { PaymentService } from '../../services/paymentService';

interface WhatsAppBookingModalProps {
  payload: BookingTargetPayload | null;
  selectedCampus: Campus;
  onClose: () => void;
  onBookingSubmitted: (data: BookingSubmissionData) => void;
}

export const WhatsAppBookingModal: React.FC<WhatsAppBookingModalProps> = ({
  payload,
  selectedCampus,
  onClose,
  onBookingSubmitted,
}) => {
  const { user } = useAuth();
  const gatewaySettings = PaymentService.getGatewaySettings();

  // Wizard Step State (1: Student Details, 2: Online UPI QR Payment)
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [addressOrRoom, setAddressOrRoom] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  
  // Payment Proof State
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [hasScannedQr, setHasScannedQr] = useState(false);

  const [bookingRefId, setBookingRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Pre-fill user data when opened
  useEffect(() => {
    if (user) {
      setStudentName(user.name || '');
      setStudentPhone(user.phone || '');
      setStudentEmail(user.email || '');
      const hostel = user.hostelBlock ? `${user.hostelBlock}, Room ${user.roomNumber || ''}` : '';
      setAddressOrRoom(hostel);
    }
    setBookingRefId(`EH-${Math.floor(1000 + Math.random() * 9000)}`);
  }, [user, payload]);

  if (!payload) return null;

  const numericPrice = payload.price ? parseFloat(String(payload.price).replace(/[^0-9.]/g, '')) || 499 : 499;

  // Step 1: Validate details and proceed to UPI Payment
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!studentPhone.trim() || studentPhone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }
    if (!addressOrRoom.trim()) {
      setFormError('Please specify your hostel block, room number, or flat address.');
      return;
    }

    setFormError(null);
    setStep(2);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(gatewaySettings.adminUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Step 2: Submit final payment proof & dispatch booking
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const bookingData: BookingSubmissionData = {
      serviceId: payload.serviceId,
      serviceName: payload.serviceName,
      optionId: payload.optionId,
      optionName: payload.optionName || payload.serviceName,
      price: payload.price,
      period: payload.period,
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail.trim() || undefined,
      campusName: selectedCampus.name,
      addressOrRoom: addressOrRoom.trim(),
      preferredDate: preferredDate.trim() || 'Immediate / Next Available Slot',
      specialNotes: specialNotes.trim() ? `${specialNotes.trim()} [UTR: ${utrNumber.trim() || 'Scanned UPI QR'}]` : `[UTR: ${utrNumber.trim() || 'Scanned UPI QR'}]`,
      referenceId: bookingRefId,
    };

    // 1. Record Payment Transaction in PaymentService
    PaymentService.submitPayment({
      orderId: bookingRefId,
      payerName: studentName.trim(),
      payerPhone: studentPhone.trim(),
      payerEmail: studentEmail.trim() || `${studentPhone.trim()}@easehub.in`,
      payerHostel: addressOrRoom.trim(),
      itemOrServiceTitle: `${payload.serviceName} (${payload.optionName || payload.serviceName})`,
      category: payload.serviceId.includes('pg') ? 'pg' : payload.serviceId.includes('mess') ? 'food-mess' : payload.serviceId.includes('laundry') ? 'laundry' : 'extra',
      amount: numericPrice,
      paymentMethod: 'upi_qr',
      upiIdUsed: gatewaySettings.adminUpiId,
      utrNumber: utrNumber.trim() || `UPI-QR-${Date.now().toString().slice(-6)}`,
      adminNotes: 'Awaiting admin verification & confirmation dispatch',
    });

    // 2. Record Student Booking in Admin Bookings Store
    try {
      const existingBookings = JSON.parse(localStorage.getItem('easehub_admin_bookings') || '[]');
      const newAdminBooking = {
        id: bookingRefId,
        studentName: studentName.trim(),
        studentPhone: studentPhone.trim(),
        studentEmail: studentEmail.trim() || 'student@campus.edu',
        roomOrHostel: addressOrRoom.trim(),
        serviceTitle: payload.serviceName,
        category: payload.serviceId.includes('pg') ? 'pg' : payload.serviceId.includes('mess') ? 'mess' : payload.serviceId.includes('laundry') ? 'laundry' : 'extra',
        planOrOption: payload.optionName || payload.serviceName,
        amount: numericPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        utrNumber: utrNumber.trim() || 'UPI-QR-DIRECT',
        notes: specialNotes.trim() || undefined,
      };
      existingBookings.unshift(newAdminBooking);
      localStorage.setItem('easehub_admin_bookings', JSON.stringify(existingBookings));
      window.dispatchEvent(new CustomEvent('easehub_admin_bookings_updated'));
    } catch {
      // Storage unavailable
    }

    // 3. Dispatch to WhatsApp for instant chat trail
    dispatchBookingToWhatsApp(bookingData);

    // 4. Trigger parent success flow (opens confirmation modal)
    setIsSubmitting(false);
    onBookingSubmitted(bookingData);
  };

  const dynamicQrUrl = PaymentService.getDynamicQrCodeUrl(numericPrice, bookingRefId, `EaseHub ${payload.serviceName}`);
  const upiIntentUri = PaymentService.buildUpiIntentUri(numericPrice, bookingRefId, `EaseHub ${payload.serviceName}`);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="easehub-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(6, 7, 9, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="easehub-bottom-sheet"
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid rgba(22, 163, 74, 0.22)',
          borderRadius: '24px',
          boxShadow: '0 24px 64px -8px rgba(15, 81, 50, 0.15), 0 0 35px rgba(250, 204, 21, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Mobile Pull Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0 0' }}>
          <div style={{ width: '42px', height: '4px', backgroundColor: 'rgba(0, 0, 0, 0.15)', borderRadius: '9999px' }} />
        </div>

        {/* Modal Top Banner */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(22, 163, 74, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAF7',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: step === 1 ? '#15803D' : '#854D0E',
                  backgroundColor: step === 1 ? '#DCFCE7' : '#FEF08A',
                  border: `1px solid ${step === 1 ? '#86EFAC' : '#FDE047'}`,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {step === 1 ? 'Step 1: Student Details' : 'Step 2: Instant UPI Payment'}
              </span>
              <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedCampus.name}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              {step === 1 ? `Book ${payload.serviceName}` : 'Scan UPI QR to Confirm Booking'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              backgroundColor: '#EFF5EC',
              border: '1px solid rgba(22, 163, 74, 0.2)',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Plan Summary Banner */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: '#EFF5EC',
            borderBottom: '1px solid rgba(22, 163, 74, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Package Selected
            </span>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A' }}>
              {payload.optionName || payload.serviceName}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803D' }}>
              ₹{numericPrice.toLocaleString()}
            </span>
            {payload.period && (
              <span style={{ fontSize: '0.76rem', color: '#64748B', marginLeft: '0.25rem' }}>
                /{payload.period}
              </span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: STUDENT & ROOM DETAILS */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} style={{ padding: '1.5rem' }}>
            {formError && (
              <div
                style={{
                  marginBottom: '1.2rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  color: '#F87171',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                }}
              >
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {/* Student Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Full Student Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya Soni"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      color: '#0F172A',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  WhatsApp Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      color: '#0F172A',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {/* Student Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Student Email Address * (For Confirmation Mail)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="student@rungta.ac.in or gmail"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      color: '#0F172A',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Preferred Start Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Preferred Start Date / Slot
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow lunch / 1st of month"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      color: '#0F172A',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Address / Hostel & Room */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Hostel Block / Room Number / Flat Address *
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Hostel Block B, Room 304 or PG Flat 201"
                  value={addressOrRoom}
                  onChange={(e) => setAddressOrRoom(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    color: '#0F172A',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Special Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Special Notes / Dietary / Room Requirements (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Pure veg diet, upper floor room, or steam iron formals"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '10px',
                  color: '#0F172A',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Continue to Online UPI Payment (QR Scan)</span>
              <ArrowRight size={18} />
            </button>

            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                fontSize: '0.76rem',
                color: '#64748B',
                textAlign: 'center',
              }}
            >
              <ShieldCheck size={14} color="#15803D" />
              <span>Direct student verification with 100% verified campus partners.</span>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: INSTANT ONLINE UPI QR PAYMENT */}
        {/* ========================================================================= */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'none',
                  border: 'none',
                  color: '#15803D',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <ArrowLeft size={16} />
                <span>Edit Student Details</span>
              </button>

              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Ref ID: <strong style={{ color: '#0F172A' }}>{bookingRefId}</strong>
              </span>
            </div>

            {/* QR Code Container Card */}
            <div
              style={{
                backgroundColor: '#F8FAF7',
                border: '1.5px solid rgba(22, 163, 74, 0.2)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(15, 81, 50, 0.1)',
                  marginBottom: '1rem',
                  display: 'inline-block',
                  border: '1px solid rgba(22, 163, 74, 0.15)',
                }}
              >
                <img
                  src={dynamicQrUrl}
                  alt={`UPI QR Code for ${payload.serviceName}`}
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <QrCode size={18} color="#15803D" />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                  Scan & Pay ₹{numericPrice.toLocaleString()}
                </span>
              </div>

              <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.78rem', color: '#64748B' }}>
                Scan using Google Pay, PhonePe, Paytm, BHIM or any UPI App
              </p>

              {/* Copy UPI ID Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '0.5rem 0.85rem',
                  gap: '0.5rem',
                }}
              >
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>OFFICIAL UPI ID</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {gatewaySettings.adminUpiId}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    backgroundColor: copiedUpi ? '#DCFCE7' : '#16A34A',
                    color: copiedUpi ? '#15803D' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
                </button>
              </div>

              {/* Direct UPI App intent button for Mobile */}
              <a
                href={upiIntentUri}
                style={{
                  marginTop: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#15803D',
                  textDecoration: 'none',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: '#DCFCE7',
                }}
              >
                <ExternalLink size={13} />
                <span>Open in UPI App directly (Mobile)</span>
              </a>
            </div>

            {/* UTR Input Section */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                12-digit UPI / UTR Transaction ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 425918274019 (from Google Pay / PhonePe)"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #16A34A',
                  borderRadius: '10px',
                  color: '#15803D',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  letterSpacing: '0.04em',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.72rem', color: '#64748B' }}>
                Visible in your UPI payment receipt. Admin verifies this before confirming.
              </span>
            </div>

            {/* Checkbox Acknowledgment */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                color: '#334155',
                marginBottom: '1.5rem',
              }}
            >
              <input
                type="checkbox"
                checked={hasScannedQr}
                onChange={(e) => setHasScannedQr(e.target.checked)}
                style={{ marginTop: '0.15rem', accentColor: '#16A34A' }}
              />
              <span>
                I have transferred ₹{numericPrice.toLocaleString()} via UPI QR and want EaseHub admin to confirm my booking.
              </span>
            </label>

            {/* Final Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.95rem 1.25rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: isSubmitting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <CheckCircle2 size={20} />
              <span>{isSubmitting ? 'Verifying & Submitting...' : 'Submit Booking & Payment Verification'}</span>
            </button>

            <div
              style={{
                marginTop: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                color: '#94A3B8',
                textAlign: 'center',
              }}
            >
              <Lock size={13} color="#F59E0B" />
              <span>Upon admin confirmation, a verification email and WhatsApp receipt will be dispatched to you.</span>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
