import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Utensils,
  Shirt,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Star,
  Moon,
  Coffee,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { ScrollReveal } from '../../motion/ScrollReveal';
import type { Campus } from '../../../data/campuses';

interface CampusBentoSectionProps {
  selectedCampus?: Campus;
  onOpenTracker?: () => void;
  onOpenBooking?: (category: string) => void;
  onOpenCanteen?: () => void;
}

export const CampusBentoSection: React.FC<CampusBentoSectionProps> = ({
  selectedCampus,
  onOpenTracker,
  onOpenBooking,
  onOpenCanteen,
}) => {
  const [activeMealTab, setActiveMealTab] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const mealItems = {
    breakfast: {
      items: 'Poha, Aloo Paratha with Curd, Boiled Eggs / Banana, Masala Chai',
      rating: '4.9',
      prepTime: 'Served 7:30 AM - 10:00 AM',
    },
    lunch: {
      items: 'Dal Makhani, Shahi Paneer / Chicken Curry, Butter Roti, Jeera Rice, Salad',
      rating: '4.8',
      prepTime: 'Served 12:30 PM - 3:00 PM',
    },
    dinner: {
      items: 'Kadai Veg, Yellow Dal Tadka, Tawa Roti, Steamed Rice, Gulab Jamun',
      rating: '4.9',
      prepTime: 'Served 8:00 PM - 10:30 PM',
    },
  };

  return (
    <section
      id="campus-bento"
      style={{
        padding: '5rem 0',
        backgroundColor: '#F8FAF7',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.08) 0%, rgba(250, 204, 21, 0.06) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container>
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
            <div
              className="monograph-chip easehub-ambient-badge"
              style={{
                marginBottom: '1.25rem',
                backgroundColor: '#DCFCE7',
                borderColor: '#86EFAC',
              }}
            >
              <span style={{ color: '#15803D', fontWeight: 800 }}>02</span>
              <span style={{ color: '#86EFAC' }}>//</span>
              <span style={{ color: '#15803D' }}>CURATED CAMPUS INTELLIGENCE</span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span style={{ color: '#16A34A' }}>ZERO BROKERAGE GUARANTEED</span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                color: '#0F172A',
              }}
            >
              Engineered For Frictionless{' '}
              <span
                style={{
                  color: '#15803D',
                }}
              >
                Hostel &amp; Flat Living
              </span>
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#475569',
                maxWidth: '620px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Everything a student needs within walking distance of{' '}
              <strong style={{ color: '#0F172A' }}>
                {selectedCampus ? selectedCampus.name : 'University Campus'}
              </strong>. Verified rates, real-time logistics, and zero brokerage.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <ScrollReveal variant="fade-up" delay={80}>
          <div
            className="easehub-bento-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
          {/* 1. Large Hero Bento Card (Col 1-7, Row 1-2): All-in-One Living OS */}
          <div
            className="easehub-bento-card architectural-card"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: 'span 7',
              gridRow: 'span 2',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2.25rem',
              border: hoveredCard === 1 ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
              boxShadow: hoveredCard === 1 ? '0 20px 40px -15px rgba(22, 163, 74, 0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient Background Gradient for Card 1 */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '280px',
                height: '280px',
                background: 'radial-gradient(circle, rgba(22, 163, 74, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#15803D',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                    }}
                  >
                    01 // LIVING OS
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      backgroundColor: '#FEF08A',
                      color: '#854D0E',
                      border: '1px solid #FACC15',
                    }}
                  >
                    <Zap size={12} color="#854D0E" />
                    Save ₹3,200 / Mo
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="#CA8A04" color="#CA8A04" />
                  ))}
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginLeft: '4px' }}>
                    4.9
                  </span>
                </div>
              </div>

              <h3
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                The Smart Campus Bundle: PG + Food + Laundry
              </h3>
              <p
                style={{
                  fontSize: '0.98rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem',
                  maxWidth: '500px',
                }}
              >
                No more coordinating with 3 different landlords or vendors. Get your verified private room, daily 3-time hot meals, and doorstep laundry on one consolidated student bill.
              </p>

              {/* Feature Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} color="#16A34A" />
                  <span style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: 600 }}>Zero Brokerage Guaranteed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} color="#16A34A" />
                  <span style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: 600 }}>Daily Hygienic Meals (3x)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} color="#16A34A" />
                  <span style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: 600 }}>Doorstep Wash &amp; Steam Iron</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} color="#16A34A" />
                  <span style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: 600 }}>High-Speed 5G Campus WiFi</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                  Combo Pricing
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D' }}>₹6,499</span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>/ month</span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹9,700</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => (onOpenBooking ? onOpenBooking('bundle') : (window.location.hash = '#bundles'))}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                <span>Explore Bundle</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* 2. Card 2 (Col 8-12): Verified Security & Distance Radar */}
          <div
            className="easehub-bento-card architectural-card"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: 'span 5',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '1.75rem',
              border: hoveredCard === 2 ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
              boxShadow: hoveredCard === 2 ? '0 16px 36px -12px rgba(22, 163, 74, 0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.2)',
                  }}
                >
                  <ShieldCheck size={22} strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#15803D',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                  }}
                >
                  02 // AUDIT
                </span>
              </div>

              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                100% Physically Verified PGs
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Every single property is inspected in-person for CCTV security, warden protocols, clean washrooms, and power backup.
              </p>

              {/* Distance Radar visual */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  backgroundColor: '#F8FAF7',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={18} color="#16A34A" />
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>
                      Campus Gate Proximity
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Average walking distance</span>
                  </div>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#15803D' }}>350 Meters</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => (onOpenBooking ? onOpenBooking('pg') : (window.location.hash = '#core-services'))}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAF7',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#DCFCE7';
                  e.currentTarget.style.color = '#15803D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAF7';
                  e.currentTarget.style.color = '#0F172A';
                }}
              >
                <span>Browse Verified Hostels</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 3. Card 3 (Col 8-12): Live Daily Mess Menu Preview */}
          <div
            className="easehub-bento-card architectural-card"
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: 'span 5',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '1.75rem',
              border: hoveredCard === 3 ? '1.5px solid #EAB308' : '1px solid #E2E8F0',
              boxShadow: hoveredCard === 3 ? '0 16px 36px -12px rgba(234, 179, 8, 0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      backgroundColor: '#FEF08A',
                      border: '1px solid #FACC15',
                      color: '#854D0E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 18px -4px rgba(250, 204, 21, 0.3)',
                    }}
                  >
                    <Utensils size={19} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Live Mess Menu
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600 }}>● Chef Active Now</span>
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#854D0E',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: '#FEF08A',
                    border: '1px solid #FACC15',
                  }}
                >
                  03 // DIETARY
                </span>

                {/* Meal Tabs */}
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  {(['breakfast', 'lunch', 'dinner'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setActiveMealTab(m)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeMealTab === m ? '#FEF08A' : 'transparent',
                        color: activeMealTab === m ? '#854D0E' : '#64748B',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Meal Details */}
              <div
                style={{
                  padding: '0.9rem',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAF7',
                  border: '1px solid #E2E8F0',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.84rem', color: '#0F172A', fontWeight: 600, lineHeight: 1.45, marginBottom: '0.5rem' }}>
                  {mealItems[activeMealTab].items}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                  <span>{mealItems[activeMealTab].prepTime}</span>
                  <span style={{ color: '#CA8A04', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={12} fill="#CA8A04" color="#CA8A04" />
                    {mealItems[activeMealTab].rating} Student Score
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Plans starting at ₹1,800/mo</span>
              <button
                type="button"
                onClick={() => (onOpenBooking ? onOpenBooking('meals') : (window.location.hash = '#core-services'))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#854D0E',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>View Full Menu</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 4. Card 4 (Col 1-6): 24h Express Laundry with Live Tracker Button */}
          <div
            className="easehub-bento-card architectural-card"
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: 'span 6',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '1.75rem',
              border: hoveredCard === 4 ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
              boxShadow: hoveredCard === 4 ? '0 16px 36px -12px rgba(22, 163, 74, 0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 18px -4px rgba(22, 163, 74, 0.2)',
                  }}
                >
                  <Shirt size={20} strokeWidth={2.2} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#15803D',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                    }}
                  >
                    04 // LOGISTICS
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Zap size={13} color="#15803D" /> 24h Turnaround
                  </span>
                </div>
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                Hostel Doorstep Laundry &amp; Steam Ironing
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                We pick up from your hostel room door and return fresh, crisp, steam-ironed clothes in our hygienic antimicrobial carry bag.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onOpenTracker}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  color: '#15803D',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#16A34A';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DCFCE7';
                  e.currentTarget.style.color = '#15803D';
                }}
              >
                <Clock size={15} />
                <span>Track Active Order</span>
              </button>

              <button
                type="button"
                onClick={() => (onOpenBooking ? onOpenBooking('laundry') : (window.location.hash = '#core-services'))}
                style={{
                  padding: '0.7rem 1.2rem',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAF7',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Book Pickup
              </button>
            </div>
          </div>

          {/* 5. Card 5 (Col 7-12): Campus P2P Bazaar Hotline */}
          <div
            className="easehub-bento-card architectural-card"
            onMouseEnter={() => setHoveredCard(5)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: 'span 6',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '1.75rem',
              border: hoveredCard === 5 ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
              boxShadow: hoveredCard === 5 ? '0 16px 36px -12px rgba(22, 163, 74, 0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF08A',
                    border: '1px solid #FACC15',
                    color: '#854D0E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 18px -4px rgba(250, 204, 21, 0.3)',
                  }}
                >
                  <Zap size={20} strokeWidth={2.2} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#854D0E',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: '#FEF08A',
                      border: '1px solid #FACC15',
                    }}
                  >
                    05 // STUDENT CONCIERGE
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <ShieldCheck size={13} color="#15803D" /> Verified Assistance
                  </span>
                </div>
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                Campus Concierge: On-Demand Student Support
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Need emergency luggage shifting, printing, room cooler servicing, or customized requests? Our campus team assists you directly.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={16} color="#15803D" />
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Average response under 15 mins
                </span>
              </div>

              <a
                href="https://wa.me/918102848776?text=Hi%20EaseHub%20Concierge!%20I%20need%20assistance%20with%20a%20campus%20service."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                <span>Chat Concierge</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* 6. Card 6 (Col 1-12): "Night Owl" Midnight Canteen & Exam Deliveries */}
          <div
            className="easehub-bento-card architectural-card"
            onMouseEnter={() => setHoveredCard(6)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: 'span 12',
              background: 'linear-gradient(135deg, #F0FDF4 0%, #FEFCE8 50%, #FFFFFF 100%)',
              borderRadius: '24px',
              padding: '2rem 2.25rem',
              border: hoveredCard === 6 ? '1.5px solid #16A34A' : '1.5px solid #86EFAC',
              boxShadow: hoveredCard === 6 ? '0 20px 45px -15px rgba(22, 163, 74, 0.25)' : '0 10px 30px rgba(22, 163, 74, 0.08)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient Background Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 1 }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#FEF08A',
                  border: '1px solid #FACC15',
                  color: '#854D0E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px -4px rgba(250, 204, 21, 0.3)',
                  flexShrink: 0,
                }}
              >
                <Moon size={28} strokeWidth={2.2} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#15803D',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                    }}
                  >
                    06 // NIGHT OWL
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                    }}
                  >
                    <Moon size={12} color="#15803D" /> Night Canteen (10 PM - 3:30 AM)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 800 }}>
                    ● 12-min avg delivery to Hostel Gate
                  </span>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  Midterms &amp; Exam Night Cravings Delivered to Your Hostel Porch
                </h3>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#475569', maxWidth: '640px' }}>
                  Cheese Maggi, Hot Kulhad Masala Chai, Midnight Burgers, Red Bull, and late-night exam stationary delivered directly to Boys &amp; Girls Hostel gates.
                </p>

                {/* Quick Craving Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#1E293B', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                    <UtensilsCrossed size={12} color="#CA8A04" /> Double Cheese Maggi ₹60
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#1E293B', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                    <Coffee size={12} color="#CA8A04" /> Kulhad Ginger Chai ₹35
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#1E293B', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                    <Flame size={12} color="#16A34A" /> Grilled Paneer Sandwich ₹75
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#1E293B', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                    <Zap size={12} color="#854D0E" /> Exam All-Nighter Kit ₹185
                  </span>
                </div>
              </div>
            </div>

            <div style={{ zIndex: 1 }}>
              <button
                type="button"
                onClick={onOpenCanteen}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '14px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803D';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16A34A';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span>Order Midnight Cravings</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </Container>

      {/* Responsive Grid Media Queries */}
      <style>{`
        @media (max-width: 1024px) {
          .easehub-bento-grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          .easehub-bento-card {
            grid-column: span 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  );
};
