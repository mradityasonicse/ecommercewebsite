import React from 'react';
import { Compass, MapPin, School } from 'lucide-react';
import { Container } from '../primitives/Container';
import type { Campus } from '../../data/campuses';

interface DiscoveryHeaderProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen: () => void;
}

export const DiscoveryHeader: React.FC<DiscoveryHeaderProps> = ({
  selectedCampus,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: '6.5rem', // Offset for fixed navbar
        paddingBottom: '2.5rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      <Container variant="wide">
        <div style={{ maxWidth: '780px' }}>
          {/* Breadcrumb / Context Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '1rem',
            }}
          >
            <Compass size={14} color="var(--color-brand-blue)" />
            <span
              style={{
                fontSize: 'var(--text-caption)',
                fontFamily: 'var(--font-family-caption)',
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-uppercase)',
              }}
            >
              Services Directory
            </span>
          </div>

          {/* Primary Heading */}
          <h1
            style={{
              fontSize: 'var(--text-h1)',
              fontFamily: 'var(--font-family-h1)',
              fontWeight: 'var(--weight-h1)',
              lineHeight: 'var(--leading-h1)',
              letterSpacing: 'var(--tracking-h1)',
              color: 'var(--color-text-primary)',
              margin: '0 0 0.75rem 0',
              textWrap: 'balance',
            }}
          >
            Browse verified student services.
          </h1>

          {/* Supporting Copy */}
          <p
            style={{
              fontSize: 'var(--text-body-lg)',
              fontFamily: 'var(--font-family-body-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--leading-body-lg)',
              margin: '0 0 1.5rem 0',
              textWrap: 'pretty',
            }}
          >
            Filter meal subscriptions, student accommodations, doorstep laundry, and campus repairs by category, price, and availability.
          </p>

          {/* Location / Campus Context Indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.45rem 0.9rem',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-body-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-brand-blue)' }}>
              <School size={15} />
              <span style={{ fontWeight: 600 }}>Active Hub:</span>
            </div>

            <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
              {selectedCampus.name}
            </span>

            <span style={{ color: 'var(--color-text-muted)' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary)', fontSize: 'var(--text-caption)' }}>
              <MapPin size={13} color="#EF4444" />
              <span>{selectedCampus.hubLocation || 'Campus Operations Desk'}</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
