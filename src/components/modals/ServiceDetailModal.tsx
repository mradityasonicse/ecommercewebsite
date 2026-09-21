import React from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { EcosystemService } from '../../data/services';

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
    <Modal
      isOpen={!!service}
      onClose={onClose}
      title={service.name}
      maxWidth="600px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Badge & Key Highlight */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Badge variant={service.accentColor === 'red' ? 'red' : 'blue'} size="md">
            {service.badgeText}
          </Badge>
          <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-brand-blue)' }}>
            Starts at {service.startingPrice} / {service.pricingUnit}
          </div>
        </div>

        {/* Detailed Description */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {service.fullDesc}
        </p>

        {/* Service Specifications */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Perimeter
            </div>
            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-brand-blue)' }}>
              1.5 km
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Turnaround SLA
            </div>
            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-brand-blue)' }}>
              {service.metrics?.avgDeliveryTime || 'Standard'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              Audit Level
            </div>
            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-success)' }}>
              Verified
            </div>
          </div>
        </div>

        {/* Popular Features List */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            EaseHub Quality Safeguards
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {service.popularFeatures.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>
                <Check size={14} color="var(--color-success)" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="accent"
              size="md"
              style={{ flex: '1 1 200px' }}
              onClick={() => {
                onClose();
                if (onBookService) {
                  onBookService(service.slug);
                } else {
                  window.location.hash = `#services/${service.slug}/book`;
                }
              }}
            >
              Request Service Now
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                onClose();
                window.location.hash = `#services/${service.slug}`;
              }}
            >
              View Full Details
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
              color: 'var(--color-text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.25rem',
              textAlign: 'center',
            }}
          >
            Or browse all catalog services in Discovery
          </button>
        </div>

      </div>
    </Modal>
  );
};
