import React from 'react';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Search,
  Building2,
  UtensilsCrossed,
  Shirt,
  Moon,
  Zap,
  Star,
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { ScrollReveal } from '../../motion/ScrollReveal';
import type { Campus } from '../../../data/campuses';
import { useDomain } from '../../../context/DomainContext';
import { SiteSettingsService, type SiteSettings } from '../../../services/siteSettingsService';

export interface PrizeWinningHeroProps {
  selectedCampus: Campus;
  onOpenQuickCategory: (category: 'pg' | 'meals' | 'laundry' | 'extra') => void;
  onOpenCanteen: () => void;
  onOpenTracker: () => void;
  onOpenShowcase?: () => void;
  onOpenSearch: () => void;
}

export const PrizeWinningHero: React.FC<PrizeWinningHeroProps> = ({
  selectedCampus,
  onOpenQuickCategory,
  onOpenCanteen,
  onOpenTracker: _onOpenTracker,
  onOpenShowcase: _onOpenShowcase,
  onOpenSearch,
}) => {
  const { domainConfig, currentDomain } = useDomain();
  const [siteSettings, setSiteSettings] = React.useState<SiteSettings>(() => SiteSettingsService.getSettings());

  React.useEffect(() => {
    const handleUpdate = () => {
      setSiteSettings(SiteSettingsService.getSettings());
    };
    window.addEventListener('easehub_site_settings_updated', handleUpdate);
    return () => window.removeEventListener('easehub_site_settings_updated', handleUpdate);
  }, []);
  return (
    <section
      id="hero"
      aria-label="EaseHub Prize-Winning Living Operating System"
      style={{
        position: 'relative',
        paddingTop: 'clamp(1.25rem, 2.5vw, 2.25rem)',
        paddingBottom: 'clamp(2.5rem, 4vw, 4rem)',
        backgroundColor: 'var(--color-bg-primary)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* 1. Fine Architectural Grid Background (Soft Emerald Tint) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(22, 163, 74, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(22, 163, 74, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000000 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000000 40%, transparent 90%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 2. Refined Atmospheric Lighting Aura */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(900px, 100vw)',
          height: '420px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${domainConfig.accentBg} 0%, rgba(255, 255, 255, 0) 70%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Container variant="wide" style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '920px',
            margin: '0 auto',
            padding: '0 clamp(0.5rem, 2vw, 1.5rem)',
          }}
        >
          {/* Institutional Trust & Campus Network Live Indicator */}
          <div
            className="easehub-ambient-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: domainConfig.accentColor,
              backgroundColor: domainConfig.accentBg,
              border: `1px solid ${domainConfig.accentBorder}`,
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={16} color={domainConfig.accentColor} />
            <span>{currentDomain === 'unified' ? (siteSettings.badgeText || domainConfig.badge) : domainConfig.badge}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: domainConfig.accentColor }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: domainConfig.accentColor,
                  boxShadow: `0 0 10px ${domainConfig.accentColor}`,
                }}
              />
              {siteSettings.campusName || selectedCampus.name} Live
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.1rem, 5.2vw, 3.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              margin: '0 0 1.2rem 0',
              color: '#0F172A',
            }}
          >
            {siteSettings.headlinePrefix || domainConfig.headlinePrefix}{' '}
            <span className="prize-gradient-text" style={{ color: domainConfig.accentColor }}>
              {siteSettings.headlineHighlight || domainConfig.headlineHighlight}
            </span>{' '}
            {siteSettings.headlineSuffix !== undefined && siteSettings.headlineSuffix !== '' ? siteSettings.headlineSuffix : domainConfig.headlineSuffix}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 0 2rem 0',
              fontWeight: 400,
            }}
          >
            {siteSettings.heroDescription || domainConfig.description}
          </p>

          {/* 3. Global Quick Search Bar & Shortcut Trigger */}
          <div
            onClick={onOpenSearch}
            className="prize-glass-card easehub-hover-lift"
            style={{
              width: '100%',
              maxWidth: '640px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              marginBottom: '2rem',
              border: `1px solid ${domainConfig.accentBorder}`,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 6px 20px -2px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748B', minWidth: 0 }}>
              <Search size={18} color={domainConfig.accentColor} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.90rem', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Search rooms, mess plans, laundry, or night food...
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: domainConfig.accentBg,
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: domainConfig.accentColor,
                fontWeight: 700,
                border: `1px solid ${domainConfig.accentBorder}`,
                flexShrink: 0,
              }}
            >
              <span>⌘K</span>
            </div>
          </div>

          {/* 4. Interactive Quick-Action Dock (Domain Configured) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.65rem',
              marginBottom: '3rem',
              width: '100%',
            }}
          >
            {domainConfig.quickActions.map((action) => {
              let Icon = Building2;
              let iconColor = domainConfig.accentColor;

              if (action.action === 'mess-menu' || action.id.includes('mess')) {
                Icon = UtensilsCrossed;
                iconColor = '#D97706';
              } else if (action.id.includes('laundry') || action.category === 'laundry') {
                Icon = Shirt;
                iconColor = '#7C3AED';
              } else if (action.action === 'canteen') {
                Icon = Moon;
                iconColor = '#D97706';
              } else if (action.category === 'pg') {
                Icon = Building2;
                iconColor = '#1D4ED8';
              } else {
                Icon = Zap;
              }

              const handleClick = () => {
                if (action.action === 'mess-menu') {
                  window.dispatchEvent(new CustomEvent('easehub_open_mess_menu'));
                } else if (action.action === 'canteen') {
                  onOpenCanteen();
                } else if (action.category && action.category !== 'all') {
                  onOpenQuickCategory(action.category);
                } else {
                  const el = document.getElementById('core-services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onOpenQuickCategory('pg');
                }
              };

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={handleClick}
                  className="prize-dock-btn easehub-spring-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.15rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#0F172A',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '44px',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Icon size={16} color={iconColor} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* 5. Live Showcase Bento Grid Preview (Visual Wow Cards) */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3rem',
              textAlign: 'left',
            }}
          >
            {/* Card 1: Verified Living */}
            <ScrollReveal variant="fade-up" delay={0}>
              <div
                className="prize-glass-card easehub-hover-lift"
                style={{
                  padding: '1.4rem',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border-subtle)',
                  height: '100%',
                }}
              >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building2 size={20} color="#15803D" />
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: '#15803D',
                    border: '1px solid rgba(22, 163, 74, 0.25)',
                  }}
                >
                  ZERO BROKERAGE
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.35rem 0' }}>
                Hostels & PGs Near Campus
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                Walkable distance, high-speed Wi-Fi, study desks, and biometric student security.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid rgba(22, 163, 74, 0.1)' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#15803D' }}>From ₹3,200/mo</span>
                <span
                  onClick={() => onOpenQuickCategory('pg')}
                  style={{ fontSize: '0.78rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  View Rooms <ArrowRight size={13} className="easehub-arrow-slide" />
                </span>
              </div>
            </div>
            </ScrollReveal>

            {/* Card 2: Fresh Mess & Culinary */}
            <ScrollReveal variant="fade-up" delay={80}>
              <div
                className="prize-glass-card easehub-hover-lift"
                style={{
                  padding: '1.4rem',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border-subtle)',
                  height: '100%',
                }}
              >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(250, 204, 21, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UtensilsCrossed size={20} color="#D97706" />
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: '#FEF08A',
                    color: '#854D0E',
                    border: '1px solid #FDE047',
                  }}
                >
                  HYGIENE AUDITED
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.35rem 0' }}>
                Monthly Mess Subscriptions
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                Balanced North & South Indian meals with flexible pause days and hostel delivery.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid rgba(234, 179, 8, 0.15)' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#D97706' }}>From ₹2,400/mo</span>
                <span
                  onClick={() => window.dispatchEvent(new CustomEvent('easehub_open_mess_menu'))}
                  style={{ fontSize: '0.78rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  View Today's Menu <ArrowRight size={13} className="easehub-arrow-slide" />
                </span>
              </div>
            </div>
            </ScrollReveal>

            {/* Card 3: 15-Min Doorstep Laundry */}
            <ScrollReveal variant="fade-up" delay={160}>
              <div
                className="prize-glass-card easehub-hover-lift"
                style={{
                  padding: '1.4rem',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border-subtle)',
                  height: '100%',
                }}
              >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Shirt size={20} color="#15803D" />
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: '#15803D',
                    border: '1px solid rgba(22, 163, 74, 0.25)',
                  }}
                >
                  SAME-DAY DISPATCH
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.35rem 0' }}>
                Express Laundry & Steam Iron
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                Hostel gate pickup, automated weight scale tracking, and crisply pressed delivery.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid rgba(22, 163, 74, 0.1)' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#15803D' }}>₹49 / kg</span>
                <span
                  onClick={() => onOpenQuickCategory('laundry')}
                  style={{ fontSize: '0.78rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  Book Wash <ArrowRight size={13} className="easehub-arrow-slide" />
                </span>
              </div>
            </div>
            </ScrollReveal>
          </div>

          {/* 6. Live Trust & Operational Metrics Ribbon (Fixed Responsive Layout matching Awwwards E-Commerce Standards) */}
          <ScrollReveal variant="fade-up" delay={200}>
            <div
              className="easehub-hero-trust-ribbon"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: '1.25rem 2rem',
                padding: '1.25rem 2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px',
                border: '1.5px solid rgba(22, 163, 74, 0.25)',
                boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                marginTop: '1.75rem',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              {/* Item 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  flex: '1 1 200px',
                  minWidth: '180px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#15803D',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={22} strokeWidth={2.4} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    100% Verified
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                    Biometric & gate checked
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  flex: '1 1 200px',
                  minWidth: '180px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF9C3',
                    border: '1px solid #FDE047',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#CA8A04',
                    flexShrink: 0,
                  }}
                >
                  <Star size={22} strokeWidth={2.4} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    4.9 / 5.0 Rating
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                    1,400+ campus hostellers
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  flex: '1 1 200px',
                  minWidth: '180px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={22} strokeWidth={2.4} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    &lt; 15-Min Dispatch
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                    Midnight canteen speed
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  flex: '1 1 200px',
                  minWidth: '180px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706',
                    flexShrink: 0,
                  }}
                >
                  <Zap size={22} strokeWidth={2.4} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    ₹0 Brokerage
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                    Direct campus rates
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
};
