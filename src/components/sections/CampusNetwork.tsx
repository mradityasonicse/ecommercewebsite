import React from 'react';
import { MapPin, Building2, ArrowRight, PlusCircle } from 'lucide-react';
import { CAMPUSES, type Campus } from '../../data/campuses';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FadeReveal } from '../motion/FadeReveal';

interface CampusNetworkProps {
  selectedCampus: Campus;
  onSelectCampus: (campus: Campus) => void;
  onRequestCampusOpen: () => void;
}

export const CampusNetwork: React.FC<CampusNetworkProps> = ({
  selectedCampus,
  onSelectCampus,
  onRequestCampusOpen
}) => {
  return (
    <section id="campuses" className="section-spacing" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <FadeReveal direction="up" delay={50}>
            <div className="section-eyebrow">
              <Building2 size={14} />
              <span>Act 6 • Expanding Footprint</span>
            </div>
            <h2 className="section-title">
              Active University Hubs
            </h2>
            <p className="section-desc">
              Explore verified student living hubs and local verified campus ecosystems.
            </p>
          </FadeReveal>
        </div>

        {/* Campus Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {CAMPUSES.map((campus, idx) => {
            const isCurrent = selectedCampus.id === campus.id;

            return (
              <FadeReveal key={campus.id} direction="up" delay={idx * 60}>
                <div
                  className="interactive-card"
                  onClick={() => onSelectCampus(campus)}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: isCurrent
                      ? '2px solid var(--color-blue)'
                      : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <Badge
                        variant={campus.status === 'active' ? 'blue' : 'neutral'}
                        size="sm"
                      >
                        {campus.status === 'active' ? 'Operational Hub' : 'Launching Q3'}
                      </Badge>

                      {isCurrent && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-blue-light)', fontWeight: 700 }}>
                          ● Active Selection
                        </span>
                      )}
                    </div>

                    {/* Campus Title */}
                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--color-white)',
                        marginBottom: '0.4rem',
                        lineHeight: 1.3
                      }}
                    >
                      {campus.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                      <MapPin size={12} color="var(--color-red)" />
                      <span>{campus.city}, {campus.state}</span>
                    </div>

                    {/* Quick Stats */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        padding: '0.85rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        marginBottom: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Students
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-white)' }}>
                          {(campus.studentCount).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Providers
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-blue-light)' }}>
                          {campus.activeProviders} Verified
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Switch Action */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-border)'
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-xs)', color: isCurrent ? 'var(--color-blue-light)' : 'var(--color-text-secondary)', fontWeight: 600 }}>
                      {isCurrent ? 'Currently Exploring' : 'Switch to this Hub'}
                    </span>
                    <ArrowRight size={14} color={isCurrent ? 'var(--color-blue-light)' : 'var(--color-text-secondary)'} />
                  </div>
                </div>
              </FadeReveal>
            );
          })}
        </div>

        {/* Request Your Campus Callout Banner */}
        <FadeReveal direction="up" delay={150}>
          <div
            style={{
              padding: '2.5rem',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--color-border-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h3 style={{ fontSize: 'var(--text-h4)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Don't see your college or university?
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '560px' }}>
                We launch new university clusters when 200 students from a campus express interest. Nominate your institution today.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              icon={<PlusCircle size={16} />}
              onClick={onRequestCampusOpen}
            >
              Request Your Campus
            </Button>
          </div>
        </FadeReveal>

      </div>
    </section>
  );
};
