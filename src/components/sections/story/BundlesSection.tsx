import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2,
  PackageCheck,
  Wifi,
  Sparkles,
} from 'lucide-react';
import {
  MessCulinaryIcon,
  LaundryAquaIcon,
} from '../../icons/ProfessionalCategoryIcons';
import { Container } from '../../primitives/Container';
import { ScrollReveal } from '../../motion/ScrollReveal';
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
        backgroundColor: '#FFFFFF',
        paddingTop: '5rem',
        paddingBottom: '5rem',
        borderBottom: '1.5px solid rgba(22, 163, 74, 0.15)',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              className="easehub-ambient-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                marginBottom: '0.75rem',
              }}
            >
              <PackageCheck size={14} color="#15803D" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#15803D',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                All-In-One Hostel Living Passes
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
                color: '#0F172A',
                margin: '0 0 0.75rem 0',
              }}
            >
              Room + Khana + Laundry.{' '}
              <span style={{ color: '#16A34A' }}>
                Ek Saath Sorted.
              </span>
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#334155',
                lineHeight: 1.6,
                maxWidth: '65ch',
                margin: '0 auto',
                fontWeight: 500,
              }}
            >
              Apna verified PG room, daily 3-time garam ghar jaisa tiffin, aur gate laundry ek saath combo mein lo. Ek single monthly bill, 34% ki direct bachat, aur zero broker tension.
            </p>
          </div>

          {/* The Equation Card */}
          <div
            className="easehub-hover-lift"
            style={{
              maxWidth: '920px',
              margin: '0 auto 2.5rem auto',
              backgroundColor: '#F8FAF7',
              border: '1.5px solid rgba(22, 163, 74, 0.2)',
              borderRadius: '16px',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#0F172A', fontWeight: 600, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#FFFFFF', border: '1px solid rgba(22, 163, 74, 0.2)', padding: '0.4rem 0.85rem', borderRadius: '8px', color: '#0F172A', fontWeight: 700 }}>
                <MessCulinaryIcon size={16} /> Daily Mess
              </span>
              <span style={{ color: '#16A34A', fontWeight: 800, fontSize: '1.1rem' }}>+</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#FFFFFF', border: '1px solid rgba(22, 163, 74, 0.2)', padding: '0.4rem 0.85rem', borderRadius: '8px', color: '#0F172A', fontWeight: 700 }}>
                <LaundryAquaIcon size={16} /> Doorstep Laundry
              </span>
              <span style={{ color: '#16A34A', fontWeight: 800, fontSize: '1.1rem' }}>+</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#FFFFFF', border: '1px solid rgba(22, 163, 74, 0.2)', padding: '0.4rem 0.85rem', borderRadius: '8px', color: '#0F172A', fontWeight: 700 }}>
                <Wifi size={16} color="#2563EB" /> Gigabit Wi-Fi
              </span>
              <span style={{ color: '#16A34A', fontWeight: 800, fontSize: '1.1rem' }}>=</span>
              <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '0.4rem 0.95rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.85rem' }}>
                1 Bill • Save ~34% Monthly
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Bundle Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
        >
          {BUNDLES.map((bundle, index) => {
            const isFeatured = bundle.isPopular;
            return (
              <ScrollReveal key={bundle.id} variant="fade-up" delay={index * 120}>
                <div
                  className="easehub-hover-lift"
                  onClick={() => onSelectBundle(bundle)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectBundle(bundle); }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isFeatured ? '2px solid #16A34A' : '1.5px solid rgba(22, 163, 74, 0.2)',
                    borderRadius: '20px',
                    padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: isFeatured ? '0 12px 32px rgba(22, 163, 74, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.04)',
                  }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = isFeatured ? '0 16px 40px rgba(22, 163, 74, 0.22)' : '0 10px 24px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isFeatured ? '0 12px 32px rgba(22, 163, 74, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div>
                  {/* Clean, Non-Overlapping Badge Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', minHeight: '28px' }}>
                    {isFeatured ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          backgroundColor: '#16A34A',
                          color: '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                        }}
                      >
                        <Sparkles size={12} fill="currentColor" />
                        {bundle.badge}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#15803D',
                          backgroundColor: '#DCFCE7',
                          border: '1px solid #86EFAC',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                        }}
                      >
                        {bundle.badge}
                      </span>
                    )}

                    {isFeatured && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          backgroundColor: '#FEF08A',
                          color: '#854D0E',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #FACC15',
                        }}
                      >
                        ★ TOP CHOICE
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.3,
                      letterSpacing: '-0.02em',
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    {bundle.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      margin: '0 0 1.25rem 0',
                    }}
                  >
                    {bundle.tagline}
                  </p>

                  {/* High-Contrast, Crystal Clear Pricing Box */}
                  <div
                    style={{
                      backgroundColor: '#F8FAF7',
                      border: '1.5px solid rgba(22, 163, 74, 0.2)',
                      borderRadius: '14px',
                      padding: '0.85rem 1rem',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'nowrap' }}>
                        <span
                          style={{
                            fontSize: 'clamp(1.35rem, 2.6vw, 1.65rem)',
                            fontWeight: 900,
                            color: '#0F172A',
                            letterSpacing: '-0.02em',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                          }}
                        >
                          ₹{bundle.bundlePrice.toLocaleString('en-IN')}
                        </span>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#475569',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          /{bundle.billingPeriod}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: '#64748B',
                          textDecoration: 'line-through',
                          fontWeight: 500,
                          marginTop: '2px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Standard Rate: ₹{bundle.originalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        border: '1px solid #86EFAC',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        alignSelf: 'center',
                      }}
                    >
                      {bundle.savingsPercentage}% Off
                    </div>
                  </div>

                  {/* Services Included List */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      Services Included in Pass
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {bundle.servicesIncluded.map((srv, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#0F172A', fontWeight: 600 }}>
                          <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ lineHeight: 1.4 }}>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Natural Student Real-Life Assurance Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: isFeatured ? '#FEF9C3' : '#F0FDF4',
                      border: isFeatured ? '1px solid #FDE047' : '1px solid #BBF7D0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isFeatured ? '#854D0E' : '#15803D',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <Sparkles size={14} color={isFeatured ? '#854D0E' : '#15803D'} style={{ flexShrink: 0 }} />
                    <span>
                      {bundle.id === 'freshman-starter'
                        ? 'Ghar jate waqt mess 1-click pause • Zero Brokerage'
                        : bundle.id === 'semester-all-in'
                        ? 'Hot tiffin direct to room + Ironed laundry bag'
                        : 'Exam time 2 AM hot Maggi & 12h express laundry'}
                    </span>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBundle(bundle);
                  }}
                  className="easehub-btn-tactile easehub-spring-btn"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: isFeatured ? '#16A34A' : '#F0FDF4',
                    color: isFeatured ? '#FFFFFF' : '#15803D',
                    border: isFeatured ? 'none' : '1.5px solid #86EFAC',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isFeatured ? '0 4px 14px rgba(22, 163, 74, 0.35)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isFeatured ? '#15803D' : '#DCFCE7';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isFeatured ? '#16A34A' : '#F0FDF4';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Explore Bundle Details</span>
                  <ArrowRight size={15} className="easehub-arrow-slide" />
                </button>
              </div>
            </ScrollReveal>
          );
        })}
        </div>
      </Container>
    </section>
  );
};
