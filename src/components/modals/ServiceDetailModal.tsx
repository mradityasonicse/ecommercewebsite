import React from 'react';
import type { EcosystemService } from '../../data/services';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Check } from 'lucide-react';

interface ServiceDetailModalProps {
  service: EcosystemService | null;
  onClose: () => void;
  onExploreProviders: () => void;
  onBookService?: (slug: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onExploreProviders,
  onBookService,
}) => {
  if (!service) return null;

  return (
    <Modal isOpen={!!service} onClose={onClose} title={service.name} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Badge & Key Highlight */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Badge variant={service.accentColor === 'red' ? 'red' : 'blue'} size="md">
            {service.badgeText}
          </Badge>
          <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)' }}>
            Starts at {service.startingPrice} / {service.pricingUnit}
          </div>
        </div>

        {/* Detailed Description */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6 }}>
          {service.fullDesc}
        </p>

        {/* Service Performance Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: '#f3fbf5',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle, #E8E4D5)',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #6B736D)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Providers
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)' }}>
              {service.metrics.providersAvailable}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #6B736D)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Avg Arrival
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)' }}>
              {service.metrics.avgDeliveryTime}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #6B736D)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Satisfaction
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'Domine, serif', fontWeight: 700, color: '#2E7D32' }}>
              {service.metrics.studentSatisfaction}
            </div>
          </div>
        </div>

        {/* Popular Features List */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            EaseHub Quality Safeguards
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {service.popularFeatures.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary, #151D1A)' }}>
                <Check size={14} color="#2E7D32" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="accent"
              size="md"
              fullWidth
              onClick={() => {
                onClose();
                if (onBookService) {
                  onBookService(service.slug);
                } else {
                  window.location.hash = `#services/${service.slug}/book`;
                }
              }}
            >
              Book / Request Service Now
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                onClose();
                window.location.hash = `#services/${service.slug}`;
              }}
            >
              Details
            </Button>
            <Button variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onExploreProviders();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary, #414845)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.25rem',
              textAlign: 'center',
            }}
          >
            Or browse all providers in Discovery filter
          </button>
        </div>

      </div>
    </Modal>
  );
};
