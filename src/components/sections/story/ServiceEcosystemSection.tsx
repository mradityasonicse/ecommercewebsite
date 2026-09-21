import React, { useState } from 'react';
import { 
  Utensils, 
  Home, 
  Shirt, 
  Dumbbell, 
  Bike, 
  Wifi, 
  SprayCan, 
  Wrench, 
  ArrowUpRight, 
  ShieldCheck
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { ECOSYSTEM_SERVICES, type EcosystemService } from '../../../data/services';

interface ServiceEcosystemSectionProps {
  onSelectService: (service: EcosystemService) => void;
}

export const ServiceEcosystemSection: React.FC<ServiceEcosystemSectionProps> = ({
  onSelectService,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'essential' | 'living' | 'utility'>('all');

  const getServiceIcon = (name: string, size = 20) => {
    switch (name) {
      case 'Utensils': return <Utensils size={size} />;
      case 'Home': return <Home size={size} />;
      case 'Shirt': return <Shirt size={size} />;
      case 'Dumbbell': return <Dumbbell size={size} />;
      case 'Bike': return <Bike size={size} />;
      case 'Wifi': return <Wifi size={size} />;
      case 'SprayCan':
      case 'Sparkles': return <SprayCan size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      default: return <Utensils size={size} />;
    }
  };

  // 2 Anchor services: Food and Stay
  const foodService = ECOSYSTEM_SERVICES.find(s => s.id === 'food')!;
  const stayService = ECOSYSTEM_SERVICES.find(s => s.id === 'stay')!;
  const supportingServices = ECOSYSTEM_SERVICES.filter(s => s.id !== 'food' && s.id !== 'stay');

  const filteredSupporting = supportingServices.filter(service => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'essential') return ['laundry', 'transport'].includes(service.id);
    if (activeCategory === 'living') return ['cleaning', 'maintenance'].includes(service.id);
    if (activeCategory === 'utility') return ['wifi', 'fitness'].includes(service.id);
    return true;
  });

  return (
    <section
      id="services"
      data-section="ecosystem"
      aria-label="Campus Living Ecosystem"
      style={{
        position: 'relative',
        backgroundColor: '#07090E',
        paddingTop: 'var(--space-24)',
        paddingBottom: 'var(--space-24)',
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
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <ShieldCheck size={13} color="#FFFFFF" />
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: '#E2E8F0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              8 Living Pillars
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            Everything in One Place.{' '}
            <span
              style={{
                color: 'var(--color-brand-gold)',
              }}
            >
              Curated for Student Living.
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Every single service is backed by our strict university audit guidelines, upfront student rates, and dedicated support.
          </p>
        </div>

        {/* Featured Editorial Anchor Hero Services (Food & Stay) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {/* Food Featured Anchor */}
          <div
            onClick={() => onSelectService(foodService)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectService(foodService); }}
            style={{
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
              transition: 'transform var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast)',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '240px',
                height: '240px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <Utensils size={24} />
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                  }}
                >
                  {foodService.badgeText}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#CBD5E1', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                Anchor Pillar 01
              </div>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-3) 0' }}>
                {foodService.name}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 var(--space-6) 0' }}>
                {foodService.fullDesc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--space-6)' }}>
                {foodService.popularFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      color: '#F1F5F9',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                    }}
                  >
                    <span style={{ color: '#10B981', marginRight: '4px' }}>✓</span> {feat}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Student Rate</span>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF' }}>
                  {foodService.startingPrice}{' '}
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>{foodService.pricingUnit}</span>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-blue-light)', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Explore Kitchens ({foodService.metrics.providersAvailable})</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>

          {/* Stay Featured Anchor */}
          <div
            onClick={() => onSelectService(stayService)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectService(stayService); }}
            style={{
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
              transition: 'transform var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast)',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255, 43, 43, 0.4)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '240px',
                height: '240px',
                background: 'radial-gradient(circle, rgba(255, 43, 43, 0.1) 0%, rgba(255, 43, 43, 0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(255, 43, 43, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-red)',
                  }}
                >
                  <Home size={24} />
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-brand-red)',
                    backgroundColor: 'rgba(255, 43, 43, 0.12)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255, 43, 43, 0.25)',
                  }}
                >
                  {stayService.badgeText}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-brand-red)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Anchor Pillar 02
              </div>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-3) 0' }}>
                {stayService.name}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 var(--space-6) 0' }}>
                {stayService.fullDesc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--space-6)' }}>
                {stayService.popularFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-primary)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Student Rate</span>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF' }}>
                  {stayService.startingPrice}{' '}
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>{stayService.pricingUnit}</span>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-brand-red)', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Inspect Residences ({stayService.metrics.providersAvailable})</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Services Filter Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            paddingBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#FFFFFF' }}>
            Supporting Campus Services ({filteredSupporting.length})
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'essential', label: 'Laundry & Transit' },
              { id: 'living', label: 'Clean & Repair' },
              { id: 'utility', label: 'Wi-Fi & Gym' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  border: activeCategory === tab.id ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.14)',
                  backgroundColor: activeCategory === tab.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.04)',
                  color: activeCategory === tab.id ? '#080A0F' : '#CBD5E1',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Supporting Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {filteredSupporting.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectService(service); }}
              style={{
                backgroundColor: '#111622',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--duration-fast), border-color var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: service.accentColor === 'red' ? '#FF7B72' : '#FFFFFF',
                    }}
                  >
                    {getServiceIcon(service.iconName, 18)}
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {service.badgeText}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.35rem 0' }}>
                  {service.name}
                </h4>

                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 var(--space-4) 0' }}>
                  {service.shortDesc}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>From </span>
                  <span style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#FFFFFF' }}>
                    {service.startingPrice}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}> /{service.pricingUnit.replace('per ', '')}</span>
                </div>

                <span style={{ fontSize: '0.75rem', color: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                  View details <ArrowUpRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
