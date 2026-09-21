import React, { useState } from 'react';
import { ShieldCheck, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Provider } from '../../data/providers';

interface ProviderDetailModalProps {
  provider: Provider | null;
  onClose: () => void;
  onBookService?: (category: string) => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  provider,
  onClose,
  onBookService,
}) => {
  const [studentPhone, setStudentPhone] = useState('');
  const [studentRoom, setStudentRoom] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!provider) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              <Clock size={13} color="var(--color-brand-blue)" />
              <span>Response: {provider.responseTime}</span>
            </div>
          </div>

          {/* Location & Response */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="var(--color-brand-blue)" />
              <span>{provider.distanceFromCampus}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="var(--color-success)" />
              <span>Audited Campus Partner</span>
            </div>
          </div>

          {/* Bio & Description */}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {provider.bio}
          </p>

          {/* Pricing Highlight Box */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Standard Student Rate
              </div>
              <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {provider.priceHighlight}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              Zero Broker Fee • Direct Rate
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-brand-blue)' }}>
              Direct Student Connection
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <input
                type="tel"
                required
                placeholder="WhatsApp Phone Number"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              />
              <input
                type="text"
                required
                placeholder="Hostel / Room / Address"
                value={studentRoom}
                onChange={(e) => setStudentRoom(e.target.value)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
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
          <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: 'var(--text-h3)', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            Connection Confirmed!
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {provider.name} has been notified for your room at <strong style={{ color: 'var(--color-brand-blue)' }}>{studentRoom || 'Campus Address'}</strong>.
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
