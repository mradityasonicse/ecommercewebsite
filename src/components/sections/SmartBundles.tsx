import React, { useState } from 'react';
import { Package, Check, ArrowRight, Zap } from 'lucide-react';
import { BUNDLES, type Bundle } from '../../data/bundles';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FadeReveal } from '../motion/FadeReveal';

interface SmartBundlesProps {
  onSelectBundle: (bundle: Bundle) => void;
}

export const SmartBundles: React.FC<SmartBundlesProps> = ({ onSelectBundle }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'semester'>('monthly');

  return (
    <section id="bundles" className="section-spacing" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <FadeReveal direction="up" delay={50}>
            <div className="section-eyebrow">
              <Package size={14} />
              <span>Act 4 • Unified Simplicity</span>
            </div>
            <h2 className="section-title">
              Smart Student Living Bundles
            </h2>
            <p className="section-desc">
              Combine your stay, meals, laundry, and internet into one transparent monthly pass. One invoice. Zero headache.
            </p>
          </FadeReveal>
        </div>

        {/* Semester vs Monthly Cycle Selector */}
        <FadeReveal direction="up" delay={100}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)'
              }}
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  backgroundColor: billingCycle === 'monthly' ? 'var(--color-blue)' : 'transparent',
                  color: billingCycle === 'monthly' ? 'var(--color-white)' : 'var(--color-text-secondary)',
                  transition: 'all var(--duration-fast)'
                }}
              >
                Monthly Plan
              </button>
              <button
                onClick={() => setBillingCycle('semester')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  backgroundColor: billingCycle === 'semester' ? 'var(--color-blue)' : 'transparent',
                  color: billingCycle === 'semester' ? 'var(--color-white)' : 'var(--color-text-secondary)',
                  transition: 'all var(--duration-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Semester Pass (5 Months)</span>
                <span
                  style={{
                    backgroundColor: 'var(--color-red)',
                    color: '#fff',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.65rem'
                  }}
                >
                  Save 15% More
                </span>
              </button>
            </div>
          </div>
        </FadeReveal>

        {/* Bundle Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch'
          }}
        >
          {BUNDLES.map((bundle, index) => {
            const price = billingCycle === 'semester'
              ? Math.round(bundle.bundlePrice * 0.85)
              : bundle.bundlePrice;

            const savings = billingCycle === 'semester'
              ? bundle.savingsPercentage + 15
              : bundle.savingsPercentage;

            return (
              <FadeReveal key={bundle.id} direction="up" delay={index * 80}>
                <div
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: bundle.isPopular
                      ? '2px solid var(--color-blue)'
                      : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    position: 'relative',
                    boxShadow: bundle.isPopular ? '0 12px 36px var(--color-blue-glow)' : 'none'
                  }}
                >
                  {/* Top Popular Highlight */}
                  {bundle.isPopular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--color-blue)',
                        color: 'var(--color-white)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {bundle.badge}
                    </div>
                  )}

                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h3
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: 'var(--color-white)',
                          marginBottom: '0.4rem'
                        }}
                      >
                        {bundle.name}
                      </h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {bundle.tagline}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div
                      style={{
                        padding: '1.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        marginBottom: '1.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-white)', fontFamily: 'var(--font-display)' }}>
                          ₹{price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          /{bundle.billingPeriod}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                        <span style={{ fontSize: 'var(--text-xs)', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                          ₹{(bundle.originalPrice).toLocaleString()}
                        </span>
                        <Badge variant="blue" size="sm">
                          Save {savings}%
                        </Badge>
                      </div>
                    </div>

                    {/* Services Included */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                        Services Included
                      </div>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {bundle.servicesIncluded.map((serv, idx) => (
                          <li
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.6rem',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--color-white)'
                            }}
                          >
                            <span style={{ color: 'var(--color-blue-light)', marginTop: '2px' }}>
                              <Check size={14} />
                            </span>
                            <span>{serv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Perks */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                        Bundle Privileges
                      </div>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {bundle.perks.map((perk, idx) => (
                          <li
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                              fontSize: '0.75rem',
                              color: 'var(--color-text-secondary)'
                            }}
                          >
                            <Zap size={12} color="var(--color-red)" style={{ marginTop: '2px' }} />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Trigger Action */}
                  <Button
                    variant={bundle.isPopular ? 'primary' : 'outline'}
                    fullWidth
                    size="md"
                    onClick={() => onSelectBundle(bundle)}
                  >
                    <span>Choose {bundle.name}</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </FadeReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
