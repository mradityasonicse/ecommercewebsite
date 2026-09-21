import React from 'react';
import { 
  MapPin, 
  PlusCircle, 
  ArrowRight,
  School
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { CAMPUSES, type Campus } from '../../../data/campuses';

interface CampusSectionProps {
  selectedCampus: Campus;
  onSelectCampus: (campus: Campus) => void;
  onRequestCampusOpen: () => void;
}

export const CampusSection: React.FC<CampusSectionProps> = ({
  selectedCampus,
  onSelectCampus,
  onRequestCampusOpen,
}) => {
  return (
    <section
      id="campuses"
      aria-label="Campus Network & Local Geofences"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-primary)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <School size={13} color="var(--color-brand-blue)" />
            <span
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                color: 'var(--color-brand-blue)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Hyperlocal University Network
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontFamily: 'var(--font-serif, "Domine", serif)',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            Operating Exclusively Within Verified Campus Geofences.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            EaseHub links directly with student unions, local kitchen networks, and verified private hostel gates within a strict 1.5 km perimeter.
          </p>
        </div>

        {/* Selected Campus Hub Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1.5px solid var(--color-brand-blue)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6) var(--space-8)',
            marginBottom: 'var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-6)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 'var(--space-2)' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-brand-blue)',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                ● Currently Selected Hub
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {selectedCampus.city}, {selectedCampus.state}
              </span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 var(--space-2) 0' }}>
              {selectedCampus.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              <MapPin size={15} color="var(--color-brand-blue)" />
              <span>Campus Ops HQ: <strong style={{ color: 'var(--color-text-primary)' }}>{selectedCampus.hubLocation}</strong></span>
            </div>
          </div>

          {/* Quick Metrics for Active Campus */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'var(--color-surface-2)', padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Enrolled Students</div>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {selectedCampus.studentCount.toLocaleString()}+
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-2)', padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Verified Providers</div>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-semantic-success)' }}>
                {selectedCampus.activeProviders} Live
              </div>
            </div>
          </div>
        </div>

        {/* Campus Switcher Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-10)',
          }}
        >
          {CAMPUSES.map((campus) => {
            const isCurrent = campus.id === selectedCampus.id;
            return (
              <div
                key={campus.id}
                onClick={() => onSelectCampus(campus)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectCampus(campus); }}
                style={{
                  backgroundColor: 'var(--color-surface-1)',
                  border: isCurrent ? '2px solid var(--color-brand-blue)' : '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  cursor: 'pointer',
                  boxShadow: isCurrent ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all var(--duration-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      color: campus.status === 'active' ? '#2E7D32' : 'var(--color-brand-red)',
                      backgroundColor: campus.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: campus.status === 'active' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                      padding: '0.18rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {campus.status === 'active' ? '● Operational' : '◌ Launching Soon'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {campus.city}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 var(--space-2) 0' }}>
                  {campus.shortName}
                </h4>

                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{campus.activeProviders} local vendors</span>
                  <span>{campus.studentCount.toLocaleString()} students</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bring EaseHub to Your College Callout */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px dashed var(--color-brand-blue)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5) var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand-blue)',
              }}
            >
              <PlusCircle size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.2rem 0' }}>
                Don't see your university listed yet?
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                We launch on campuses with high student demand. Nominate your institution to fast-track vendor audits.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestCampusOpen}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-brand-blue)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.86rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-blue-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-brand-blue)';
            }}
          >
            <span>Request Your Campus</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </Container>
    </section>
  );
};
