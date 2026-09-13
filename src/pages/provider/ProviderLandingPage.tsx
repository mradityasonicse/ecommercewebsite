import React from 'react';
import {
  ShieldCheck,
  Users,
  Banknote,
  ArrowRight,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CATEGORY_METADATA } from '../../services/providerService';
import type { ProviderCategory } from '../../types/provider';

interface ProviderLandingPageProps {
  onStartOnboarding: () => void;
  onCheckStatus: () => void;
  onNavigateHome: () => void;
  onSelectCategory?: (category: ProviderCategory) => void;
}

export const ProviderLandingPage: React.FC<ProviderLandingPageProps> = ({
  onStartOnboarding,
  onCheckStatus,
  onNavigateHome,
  onSelectCategory,
}) => {
  const categories = Object.keys(CATEGORY_METADATA) as ProviderCategory[];

  return (
    <div className="easehub-provider-landing" style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* 1. High-Impact Editorial Hero */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 4.5rem',
          borderBottom: '1px solid var(--color-border-subtle)',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(255, 255, 255, 0.08), transparent 70%)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Accreditation Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
            }}
          >
            <ShieldCheck size={15} />
            <span>EaseHub Campus Partner Network</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              maxWidth: '860px',
              margin: '0 auto 1.25rem',
            }}
          >
            Reach 15,000+ Verified Students. <br />
            <span style={{ color: 'var(--color-blue-light)' }}>Grow Your Campus Business.</span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.6,
            }}
          >
            The dedicated operating system for university service providers. Connect directly with hostel residents, eliminate middleman broker cuts, and manage digital orders with automated settlements.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '3rem',
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onStartOnboarding}
              icon={<ArrowRight size={18} />}
            >
              Apply as a Verified Partner
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onCheckStatus}
              style={{ color: 'var(--color-text-primary)' }}
            >
              Check Application Status
            </Button>
          </div>

          {/* Social Proof Metric Counters */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              maxWidth: '820px',
              margin: '0 auto',
              padding: '1.5rem 2rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF' }}>
                ₹0
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Broker Commission
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-blue-light)' }}>
                3.4x
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Avg. Student Demand Surge
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#10B981' }}>
                100%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Weekly Automated Payouts
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF' }}>
                8 Pillars
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Campus Living Services
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Operator Advantages */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-blue-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Why Campus Operators Partner With EaseHub
            </span>
            <h2
              style={{
                fontSize: 'var(--text-h2)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginTop: '0.5rem',
              }}
            >
              Built Specifically for University Micro-Economies
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Advantage 1 */}
            <div
              style={{
                padding: '2rem',
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Direct Dormitory Infiltration
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Stop handing out physical paper pamphlets. EaseHub places your menu, catalog, and rates directly onto student smartphones in every campus hostel block.
              </p>
            </div>

            {/* Advantage 2 */}
            <div
              style={{
                padding: '2rem',
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Banknote size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Guaranteed Advance Settlements
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Say goodbye to chasing student roommates for monthly tiffin or laundry dues. Subscriptions are billed upfront and disbursed straight to your verified account.
              </p>
            </div>

            {/* Advantage 3 */}
            <div
              style={{
                padding: '2rem',
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 43, 43, 0.15)',
                  color: '#FF7B72',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Official Campus Verification Badge
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Stand apart from unverified street vendors. EaseHub partners undergo physical hygiene and safety audits, giving students full peace of mind to book with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Supported Service Categories */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-blue-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Service Ecosystem
            </span>
            <h2
              style={{
                fontSize: 'var(--text-h2)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginTop: '0.5rem',
              }}
            >
              Which Category Does Your Business Serve?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Select your category to start your customized campus onboarding application.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((catKey) => {
              const cat = CATEGORY_METADATA[catKey];
              return (
                <div
                  key={catKey}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(catKey);
                    onStartOnboarding();
                  }}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--color-surface-1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                      {cat.label}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                      {cat.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-blue-light)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      marginTop: '1rem',
                    }}
                  >
                    <span>Apply for {cat.label.split(' ')[0]}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. The 4-Step Onboarding Journey */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-blue-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Simple Onboarding Flow
            </span>
            <h2
              style={{
                fontSize: 'var(--text-h2)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginTop: '0.5rem',
              }}
            >
              From Application to First Student Order
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <StepCard
              number="1"
              title="Digital Application"
              desc="Fill out your business profile, service offerings, delivery radius, and pricing in 10 minutes."
            />
            <StepCard
              number="2"
              title="Physical Premise Audit"
              desc="EaseHub campus auditor inspects your facility for hygiene, equipment safety, and fair pricing."
            />
            <StepCard
              number="3"
              title="Storefront Activation"
              desc="Receive your verified badge, set up order notification preferences, and open your live catalog."
            />
            <StepCard
              number="4"
              title="Fulfill & Grow"
              desc="Receive incoming student bookings, communicate in-app, and get paid weekly with automated bank deposits."
            />
          </div>
        </div>
      </section>

      {/* 5. Final CTA Gate */}
      <section style={{ padding: '5rem 0 2rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            style={{
              maxWidth: '740px',
              margin: '0 auto',
              padding: '3rem 2rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border-default)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--text-h3)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '0.75rem',
              }}
            >
              Ready to Expand Your Campus Reach?
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              Join the growing network of verified campus mess kitchens, laundromats, accommodations, and technicians on EaseHub.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={onStartOnboarding}
                icon={<ArrowRight size={18} />}
              >
                Start Partner Onboarding
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={onNavigateHome}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Return to Student Marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StepCard: React.FC<{ number: string; title: string; desc: string }> = ({ number, title, desc }) => (
  <div
    style={{
      padding: '1.75rem',
      backgroundColor: 'var(--color-surface-1)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-subtle)',
      position: 'relative',
    }}
  >
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-brand-blue)',
        color: '#FFFFFF',
        fontWeight: 800,
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}
    >
      {number}
    </div>
    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
      {title}
    </h3>
    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
      {desc}
    </p>
  </div>
);
