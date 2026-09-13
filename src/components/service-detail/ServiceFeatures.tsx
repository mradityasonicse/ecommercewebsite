import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import type { ServiceDetail } from '../../types/serviceDetail';

interface ServiceFeaturesProps {
  service: ServiceDetail;
}

export const ServiceFeatures: React.FC<ServiceFeaturesProps> = ({ service }) => {
  return (
    <section
      id="features"
      aria-label="Features and Inclusions"
      style={{
        padding: 'var(--space-16) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Section Header */}
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-12)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(15, 56, 44, 0.06)',
            border: '1px solid rgba(15, 56, 44, 0.16)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: 'var(--color-brand-blue, #0F382C)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <ShieldCheck size={13} color="var(--color-brand-blue, #0F382C)" />
          <span>Verified Safeguards</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary, #151D1A)',
            lineHeight: 1.2,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          What Makes This Service Different.
        </h2>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6, margin: 0 }}>
          Designed specifically to eliminate common student compromises around hygiene, predatory lock-ins, and deposit disputes.
        </p>
      </div>

      {/* 4 Numbered Highlights Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-16)',
        }}
      >
        {service.keyHighlights.map((hl) => (
          <div
            key={hl.number}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border-subtle, #E8E4D5)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--color-brand-blue, #0F382C)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle, #E8E4D5)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div
              style={{
                fontSize: '1.4rem',
                fontFamily: 'var(--font-serif, "Domine", serif)',
                fontWeight: 700,
                color: 'var(--color-brand-blue, #0F382C)',
                marginBottom: 'var(--space-3)',
              }}
            >
              {hl.number}
            </div>

            <h3
              style={{
                fontSize: '1.1rem',
                fontFamily: 'var(--font-serif, "Domine", serif)',
                fontWeight: 600,
                color: 'var(--color-text-primary, #151D1A)',
                margin: '0 0 var(--space-2) 0',
                lineHeight: 1.3,
              }}
            >
              {hl.title}
            </h3>

            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.55, margin: 0 }}>
              {hl.description}
            </p>
          </div>
        ))}
      </div>

      {/* Inclusions vs Exclusions Split Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {/* Inclusions */}
        <div
          style={{
            backgroundColor: '#f3fbf5',
            border: '1px solid rgba(46, 125, 50, 0.25)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-4)' }}>
            <CheckCircle2 size={20} color="#2E7D32" />
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', margin: 0 }}>
              What Is Included
            </h3>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {service.inclusions.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.88rem', color: 'var(--color-text-primary, #151D1A)' }}>
                <span style={{ color: '#2E7D32', marginTop: '2px', fontWeight: 800 }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border-subtle, #E8E4D5)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-4)' }}>
            <XCircle size={20} color="var(--color-text-muted, #6B736D)" />
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', margin: 0 }}>
              What Is Not Included
            </h3>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {service.exclusions.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.88rem', color: 'var(--color-text-secondary, #414845)' }}>
                <span style={{ color: 'var(--color-text-muted, #6B736D)', marginTop: '2px' }}>✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
