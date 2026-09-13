import React from 'react';
import { 
  Utensils, 
  Home, 
  Shirt, 
  Dumbbell, 
  Bike, 
  Wifi, 
  SprayCan, 
  Wrench, 
  Layers, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { ECOSYSTEM_SERVICES, type EcosystemService } from '../../data/services';
import { Badge } from '../ui/Badge';
import { FadeReveal } from '../motion/FadeReveal';

interface EcosystemGridProps {
  onSelectService: (service: EcosystemService) => void;
}

export const EcosystemGrid: React.FC<EcosystemGridProps> = ({ onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils size={24} />;
      case 'Home': return <Home size={24} />;
      case 'Shirt': return <Shirt size={24} />;
      case 'Dumbbell': return <Dumbbell size={24} />;
      case 'Bike': return <Bike size={24} />;
      case 'Wifi': return <Wifi size={24} />;
      case 'SprayCan':
      case 'Sparkles': return <SprayCan size={24} />;
      case 'Wrench': return <Wrench size={24} />;
      default: return <Layers size={24} />;
    }
  };

  return (
    <section id="ecosystem" className="section-spacing" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <FadeReveal direction="up" delay={50}>
            <div className="section-eyebrow">
              <Layers size={14} />
              <span>Act 3 • The Complete Ecosystem</span>
            </div>
            <h2 className="section-title">
              8 Pillars of Frictionless Campus Life
            </h2>
            <p className="section-desc">
              Engineered specifically for student living. No random aggregators or unaccountable third parties.
            </p>
          </FadeReveal>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.5rem'
          }}
        >
          {ECOSYSTEM_SERVICES.map((service, index) => {
            // First two services (Food & Stay) span 6 columns each on desktop, others span 4 or 6
            const isWide = index === 0 || index === 1;
            const colSpan = isWide ? 'span 6' : 'span 4';

            return (
              <div
                key={service.id}
                className="interactive-card ecosystem-card"
                onClick={() => onSelectService(service)}
                style={{
                  gridColumn: colSpan,
                  backgroundColor: 'var(--color-surface)',
                  border: service.accentColor === 'blue' 
                    ? '1px solid rgba(28, 100, 242, 0.28)' 
                    : service.accentColor === 'red'
                    ? '1px solid rgba(255, 59, 48, 0.25)'
                    : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background ambient accent */}
                {service.accentColor === 'blue' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle at top right, var(--color-blue-glow), transparent 70%)',
                      pointerEvents: 'none'
                    }}
                  />
                )}
                {service.accentColor === 'red' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle at top right, var(--color-red-glow), transparent 70%)',
                      pointerEvents: 'none'
                    }}
                  />
                )}

                <div>
                  {/* Icon & Badge Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: service.accentColor === 'blue' 
                          ? 'var(--color-blue-subtle)' 
                          : service.accentColor === 'red'
                          ? 'var(--color-red-subtle)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: service.accentColor === 'blue'
                          ? 'var(--color-blue-light)'
                          : service.accentColor === 'red'
                          ? 'var(--color-red-light)'
                          : 'var(--color-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {getIcon(service.iconName)}
                    </div>

                    <Badge
                      variant={service.accentColor === 'red' ? 'red' : service.accentColor === 'blue' ? 'blue' : 'neutral'}
                      size="sm"
                    >
                      {service.badgeText}
                    </Badge>
                  </div>

                  {/* Title & Short Description */}
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--color-white)',
                      marginBottom: '0.6rem',
                      lineHeight: 1.25
                    }}
                  >
                    {service.name}
                  </h3>

                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem'
                    }}
                  >
                    {service.shortDesc}
                  </p>

                  {/* Feature Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.75rem' }}>
                    {service.popularFeatures.slice(0, 3).map((feat, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        <Zap size={12} color={service.accentColor === 'red' ? 'var(--color-red)' : 'var(--color-blue)'} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Price & Trigger */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--color-border)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                      Starting at
                    </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-white)' }}>
                      {service.startingPrice}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                      /{service.pricingUnit}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'var(--color-blue-light)'
                    }}
                  >
                    <span>View Providers</span>
                    <ArrowRight size={14} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .ecosystem-card {
            grid-column: span 6 !important;
          }
        }
        @media (max-width: 680px) {
          .ecosystem-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
};
