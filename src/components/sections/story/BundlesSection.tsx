import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2,
  PackageCheck
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { BUNDLES, type Bundle } from '../../../data/bundles';

interface BundlesSectionProps {
  onSelectBundle: (bundle: Bundle) => void;
}

export const BundlesSection: React.FC<BundlesSectionProps> = ({ onSelectBundle }) => {
  return (
    <section
      id="bundles"
      aria-label="Smart Living Bundles"
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
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <PackageCheck size={14} color="var(--color-brand-gold)" />
            <span
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                color: 'var(--color-brand-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Curated Living Passes
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-3) 0',
            }}
          >
            Smart Bundles.{' '}
            <span
              style={{
                color: 'var(--color-brand-gold)',
              }}
            >
              One Simple Equation.
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Combine accommodation, campus dining, and doorstep laundry into a unified semester subscription. Verified providers, guaranteed student rates, single checkout.
          </p>
        </div>

        {/* The Equation Card */}
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto var(--space-10) auto',
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5) var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-text-primary)', fontWeight: 600, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)' }}>
              🍱 Daily Mess
            </span>
            <span style={{ color: 'var(--color-brand-gold)', fontWeight: 800, fontSize: '1rem' }}>+</span>
            <span style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)' }}>
              👕 Doorstep Laundry
            </span>
            <span style={{ color: 'var(--color-brand-gold)', fontWeight: 800, fontSize: '1rem' }}>+</span>
            <span style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)' }}>
              ⚡ Gigabit Wi-Fi
            </span>
            <span style={{ color: 'var(--color-brand-gold)', fontWeight: 800, fontSize: '1rem' }}>=</span>
            <span style={{ backgroundColor: 'var(--color-brand-gold)', color: '#12285A', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
              1 Bill • Save ~34% Monthly
            </span>
          </div>
        </div>

        {/* 3 Bundle Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {BUNDLES.map((bundle) => {
            const isFeatured = bundle.isPopular;
            return (
              <div
                key={bundle.id}
                onClick={() => onSelectBundle(bundle)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectBundle(bundle); }}
                style={{
                  backgroundColor: 'var(--color-surface-1)',
                  border: isFeatured ? '2px solid var(--color-brand-gold, #FAC908)' : '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'transform var(--duration-fast, 200ms) var(--ease-smooth), box-shadow var(--duration-fast, 200ms) var(--ease-smooth)',
                  boxShadow: isFeatured ? '0 8px 24px rgba(0, 0, 0, 0.45)' : 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = isFeatured ? '0 14px 32px rgba(0, 0, 0, 0.6)' : 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isFeatured ? '0 8px 24px rgba(0, 0, 0, 0.45)' : 'var(--shadow-sm)';
                }}
              >
                {/* Popular Pill */}
                {isFeatured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--color-brand-gold, #FAC908)',
                      color: 'var(--color-brand-navy, #112758)',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '0.25rem 0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    ★ {bundle.badge}
                  </div>
                )}

                <div>
                  {!isFeatured && (
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-brand-gold)',
                          backgroundColor: 'var(--color-surface-2)',
                          border: '1px solid var(--color-border-subtle)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 600,
                        }}
                      >
                        {bundle.badge}
                      </span>
                    </div>
                  )}

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      margin: '0 0 var(--space-2) 0',
                    }}
                  >
                    {bundle.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.86rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      margin: '0 0 var(--space-5) 0',
                    }}
                  >
                    {bundle.tagline}
                  </p>

                  {/* Pricing Box */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4) var(--space-5)',
                      marginBottom: 'var(--space-5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-gold)' }}>
                          ₹{bundle.bundlePrice.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          /{bundle.billingPeriod}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                        Standard Rate: ₹{bundle.originalPrice.toLocaleString()}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(88, 169, 64, 0.2)',
                        color: '#6DBF55',
                        border: '1px solid rgba(88, 169, 64, 0.35)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                      }}
                    >
                      {bundle.savingsPercentage}% Off
                    </div>
                  </div>

                  {/* Services Included */}
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
                      Services Included in Pass
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {bundle.servicesIncluded.map((srv, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>
                          <CheckCircle2 size={15} color="#58A940" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBundle(bundle);
                  }}
                  className="easehub-btn-tactile"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isFeatured ? 'var(--color-brand-gold, #FAC908)' : 'var(--color-surface-2)',
                    color: isFeatured ? 'var(--color-brand-navy, #112758)' : 'var(--color-text-primary)',
                    border: isFeatured ? 'none' : '1px solid var(--color-border-subtle)',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isFeatured ? '#E5B507' : 'var(--color-surface-3)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isFeatured ? 'var(--color-brand-gold, #FAC908)' : 'var(--color-surface-2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0.5px) scale(0.985)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                >
                  <span>Explore Bundle Details</span>
                  <ArrowRight size={14} className="easehub-icon-nudge" />
                </button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
