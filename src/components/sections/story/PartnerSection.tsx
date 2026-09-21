import React from 'react';
import { 
  ArrowRight, 
  Handshake,
  BadgeCheck
} from 'lucide-react';
import { Container } from '../../primitives/Container';

interface PartnerSectionProps {
  onPartnerOpen: () => void;
}

export const PartnerSection: React.FC<PartnerSectionProps> = ({ onPartnerOpen }) => {
  const partnerPerks = [
    {
      title: 'Direct Campus Reach',
      desc: 'Connect with local students living near your facility around Bhilai and Durg campus zones.',
      metric: 'Direct Inquiries',
    },
    {
      title: 'Predictable Monthly Demand',
      desc: 'Fill vacancies and meal slots with semester-long plans, fixed hostel contracts, and laundry cycles.',
      metric: 'Semester Bookings',
    },
    {
      title: 'Direct Settlements & Support',
      desc: 'Direct student inquiries via WhatsApp with verified listing details and clear terms.',
      metric: 'Verified Listing',
    },
  ];

  return (
    <section
      id="partners"
      aria-label="Partner Ecosystem & Local Vendor Verification"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-primary)',
        paddingTop: 'var(--space-24)',
        paddingBottom: 'var(--space-24)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <Container variant="wide">
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-10) var(--space-8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-10)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Mission & Pitch */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(255, 43, 43, 0.1)',
                border: '1px solid rgba(255, 43, 43, 0.25)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Handshake size={13} color="var(--color-brand-red)" />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--color-brand-red)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Dual-Sided Campus Ecosystem
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                color: '#FFFFFF',
                margin: '0 0 var(--space-4) 0',
              }}
            >
              Run a Campus Service?{' '}
              <span
                style={{
                  color: 'var(--color-brand-gold)',
                }}
              >
                Grow with EaseHub.
              </span>
            </h2>

            <p
              style={{
                fontSize: '0.98rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: 'var(--space-8)',
              }}
            >
              We partner with local mess owners, PG landlords, cleaners, laundry businesses, and certified technicians who care about quality. Pass our audit and get direct, verified student demand.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onPartnerOpen}
                style={{
                  padding: '0.8rem 1.6rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-red)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 43, 43, 0.3)',
                  transition: 'transform var(--duration-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                <span>Apply as a Verified Partner</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Perks Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {partnerPerks.map((perk, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <BadgeCheck size={17} color="var(--color-brand-red)" />
                    <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      {perk.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {perk.desc}
                  </p>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-brand-red)',
                    backgroundColor: 'rgba(255, 43, 43, 0.1)',
                    border: '1px solid rgba(255, 43, 43, 0.25)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {perk.metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
