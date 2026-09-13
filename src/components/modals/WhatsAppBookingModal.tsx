import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Campus } from '../../data/campuses';
import type { BookingTargetPayload } from '../sections/story/CoreServicesSection';
import { dispatchBookingToWhatsApp, type BookingSubmissionData } from '../../utils/whatsapp';

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

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [addressOrRoom, setAddressOrRoom] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
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
  }, [user, payload]);

  if (!payload) return null;

  const handleSubmit = (e: React.FormEvent) => {
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
    setIsSubmitting(true);

    const refId = `EH-${Math.floor(1000 + Math.random() * 9000)}`;

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
      specialNotes: specialNotes.trim() || undefined,
      referenceId: refId,
    };

    // Dispatch to WhatsApp
    dispatchBookingToWhatsApp(bookingData);

    // Trigger parent success flow (opens Thank You for Trust modal)
    setIsSubmitting(false);
    onBookingSubmitted(bookingData);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(6, 7, 9, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
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
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 24px 64px -8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'motionModalEntrance var(--duration-fast, 200ms) var(--ease-smooth)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface-2)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#2E7D32',
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  border: '1px solid rgba(46, 125, 50, 0.2)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Direct WhatsApp Booking
              </span>
              <span style={{ color: 'var(--color-border-default)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{selectedCampus.name}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Book {payload.serviceName}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.borderColor = 'var(--color-border-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Plan Summary Banner */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            backgroundColor: 'var(--color-surface-2)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Selected Package
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-brand-gold, #FAC908)' }}>
              {payload.optionName || payload.serviceName}
            </div>
          </div>

          {payload.price && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-gold, #FAC908)' }}>
                ₹{Number(payload.price).toLocaleString()}
              </span>
              {payload.period && (
                <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>
                  /{payload.period}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {formError && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(211, 69, 46, 0.08)',
                border: '1px solid rgba(211, 69, 46, 0.25)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-brand-red)',
                fontSize: '0.84rem',
              }}
            >
              {formError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Student Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Soni"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                    backgroundColor: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                WhatsApp Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                    backgroundColor: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Student Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="student@university.edu or gmail"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                    backgroundColor: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Preferred Start Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Preferred Start Date / Slot
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Tomorrow lunch / 1st of month"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                    backgroundColor: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Address / Hostel & Room */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Hostel Block / Room Number / Flat Address *
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                placeholder="e.g. Hostel Block B, Room 304 or PG Flat 201"
                value={addressOrRoom}
                onChange={(e) => setAddressOrRoom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Special Notes / Instructions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Special Notes / Dietary / Room Requirements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Pure veg tiffin, upper floor PG room preferred, or steam iron formals"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.85rem',
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.95rem',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: '#25D366',
              color: '#0F382C',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isSubmitting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)',
              transition: 'transform var(--duration-fast), box-shadow var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.25)';
            }}
          >
            <MessageCircle size={20} color="#0F382C" />
            <span>{isSubmitting ? 'Preparing WhatsApp Message...' : 'Submit & Send to WhatsApp'}</span>
            <ArrowRight size={16} />
          </button>

          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
            }}
          >
            <ShieldCheck size={14} color="#2E7D32" />
            <span>Details will open in WhatsApp and save to your student account with 100% deposit escrow.</span>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
