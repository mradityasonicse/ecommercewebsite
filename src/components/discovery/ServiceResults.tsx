import React from 'react';
import type { Service } from '../../types/service';
import { ServiceCard } from './ServiceCard';

interface ServiceResultsProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export const ServiceResults: React.FC<ServiceResultsProps> = ({
  services,
  onSelectService,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--space-6)',
        paddingTop: 'var(--space-6)',
        paddingBottom: 'var(--space-12)',
      }}
      className="service-results-grid"
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onSelectService={onSelectService}
        />
      ))}

      <style>{`
        @media (max-width: 640px) {
          .service-results-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
