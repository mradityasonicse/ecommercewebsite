import React, { useState } from 'react';
import type { Provider } from '../../data/providers';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ShieldCheck, Star, MapPin, Clock, CheckCircle2 } from 'lucide-react';

interface ProviderDetailModalProps {
  provider: Provider | null;
  onClose: () => void;
  onBookService?: (category: string) => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({ provider, onClose, onBookService }) => {
  const [isBooked, setIsBooked] = useState(false);
  const [studentPhone, setStudentPhone] = useState('');
  const [studentRoom, setStudentRoom] = useState('');

  if (!provider) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentPhone.trim()) return;
    setIsBooked(true);
  };

  return (
    <Modal
      isOpen={!!provider}
      onClose={() => {
        setIsBooked(false);
        onClose();
      }}
      title={provider.name}
      maxWidth="620px"
    >
      {!isBooked ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Top Verification Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <Badge variant="verified" size="md" icon={<ShieldCheck size={14} />}>
              {provider.verificationBadge}
            </Badge>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', fontWeight: 700, color: '#D97706' }}>
              <Star size={16} fill="#D97706" />
              <span>{provider.rating}</span>
              <span style={{ color: 'var(--color-text-muted, #6B736D)' }}>({provider.reviewsCount} student reviews)</span>
            </div>
          </div>

          {/* Location & Response */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary, #414845)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="var(--color-brand-blue, #0F382C)" />
              <span>{provider.distanceFromCampus}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="var(--color-brand-blue, #0F382C)" />
              <span>Average response: {provider.responseTime}</span>
            </div>
          </div>

          {/* Bio & Description */}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6 }}>
            {provider.bio}
          </p>

          {/* Pricing Highlight Box */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f3fbf5',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle, #E8E4D5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #6B736D)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Standard Student Rate
              </div>
              <div style={{ fontSize: '1.35rem', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)' }}>
                {provider.priceHighlight}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 700, backgroundColor: 'rgba(46, 125, 50, 0.1)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-pill)' }}>
              Zero Commission • Direct Rate
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)' }}>
              Direct Student Connection
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input
                type="tel"
                required
                placeholder="WhatsApp Phone Number"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle, #E8E4D5)',
                  color: 'var(--color-text-primary, #151D1A)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(15, 56, 44, 0.04)'
                }}
              />
              <input
                type="text"
                placeholder="Hostel / Room No (e.g. Block B-204)"
                value={studentRoom}
                onChange={(e) => setStudentRoom(e.target.value)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle, #E8E4D5)',
                  color: 'var(--color-text-primary, #151D1A)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(15, 56, 44, 0.04)'
                }}
              />
            </div>

            <Button variant="accent" size="md" fullWidth type="submit">
              Connect With Provider & Lock Student Rate
            </Button>
            {onBookService && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                type="button"
                onClick={() => {
                  onClose();
                  onBookService(provider.serviceId);
                }}
              >
                Go to Dedicated Service Request & Scheduling →
              </Button>
            )}
          </form>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <CheckCircle2 size={48} color="#2E7D32" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: 'var(--text-h3)', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', marginBottom: '0.5rem' }}>
            Connection Confirmed!
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary, #414845)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {provider.name} has been notified for your room at <strong style={{ color: 'var(--color-brand-blue, #0F382C)' }}>{studentRoom || 'Campus Address'}</strong>.
            You will receive a WhatsApp verification token and callback in {provider.responseTime}.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {onBookService && (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsBooked(false);
                  onClose();
                  onBookService(provider.serviceId);
                }}
              >
                Continue to Scheduling
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsBooked(false);
                onClose();
              }}
            >
              Close & Back to Hub
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
