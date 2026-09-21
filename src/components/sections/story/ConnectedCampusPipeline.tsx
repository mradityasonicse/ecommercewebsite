import React, { useState } from 'react';
import {
  Building2,
  UtensilsCrossed,
  Shirt,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  MapPin,
  Clock,
  ShieldCheck,
  Calculator,
  Compass,
  Moon,
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { ScrollReveal } from '../../motion/ScrollReveal';

interface ConnectedCampusPipelineProps {
  onExploreBundles?: () => void;
  onOpenMessMenu?: () => void;
  onOpenTracker?: () => void;
}

export const ConnectedCampusPipeline: React.FC<ConnectedCampusPipelineProps> = ({
  onExploreBundles,
  onOpenMessMenu,
  onOpenTracker,
}) => {
  // Interactive custom combo builder state
  const [includeRoom, setIncludeRoom] = useState(true);
  const [includeMess, setIncludeMess] = useState(true);
  const [includeLaundry, setIncludeLaundry] = useState(true);
  const [includeCanteen, setIncludeCanteen] = useState(false);

  // Prices
  const roomPrice = includeRoom ? 3500 : 0;
  const messPrice = includeMess ? 2400 : 0;
  const laundryPrice = includeLaundry ? 600 : 0;
  const canteenPrice = includeCanteen ? 499 : 0;

  const individualTotal = roomPrice + messPrice + laundryPrice + canteenPrice;
  const bundleDiscount = individualTotal > 4000 ? 1800 : individualTotal > 2500 ? 900 : 300;
  const finalBundlePrice = Math.max(individualTotal - bundleDiscount, 0);

  return (
    <section
      id="campus-pipeline"
      style={{
        padding: '4rem 0 3rem',
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #E2E8F0',
        position: 'relative',
      }}
    >
      <Container variant="wide">
        {/* Natural Warm Header */}
        <ScrollReveal variant="fade-up" delay={0}>
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 2.5rem' }}>
            <div
              className="easehub-ambient-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#15803D',
                fontSize: '0.8rem',
                fontWeight: 800,
                marginBottom: '0.85rem',
              }}
            >
              <Sparkles size={14} color="#15803D" />
              <span>HOSTEL LIFE MADE EFFORTLESS • BHILAI &amp; DURG CAMPUSES</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.8vw, 2.75rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.18,
                color: '#0F172A',
                margin: '0 0 0.85rem',
              }}
            >
              Room, Khana, Laundry &amp; Night Canteen —{' '}
              <span style={{ color: '#15803D', textDecoration: 'underline decoration-[#86EFAC]' }}>
                Sab Kuch Ek Jagah Settled.
              </span>
            </h2>

            <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              College aane ke baad 5 alag-alag logon se deal karne ki zaroorat nahi. EaseHub pe room choose karo, aur usi hostel gate par ghar jaisa garam tiffin, weekly laundry pickup aur raat ko 2 baje garam Maggi automatically link ho jati hai.
            </p>
          </div>
        </ScrollReveal>

        {/* Natural Visual Flow Ribbon (Hostel Life Connected Journey) */}
        <div
          style={{
            backgroundColor: '#F8FAF7',
            borderRadius: '1.5rem',
            border: '1.5px solid #E2E8F0',
            padding: '2rem 1.75rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            position: 'relative',
          }}
        >
          {/* Pathway Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803D',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(22, 163, 74, 0.12)',
                }}
              >
                <Compass size={18} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
                The Natural Campus Day Loop (Subah se Raat tak)
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #86EFAC' }}>
              ● 100% Synchronized with Your College Timings
            </span>
          </div>

          {/* 4 Connected Pathway Cards with Arrow Flow */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1rem',
            }}
          >
            {/* Step 1: Stay */}
            <ScrollReveal variant="fade-up" delay={50}>
              <div
                className="easehub-hover-lift"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.15rem',
                  border: '1.5px solid #86EFAC',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)',
                  position: 'relative',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#15803D',
                    }}
                  >
                    <Building2 size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803D', backgroundColor: '#EFF5EC', padding: '3px 8px', borderRadius: '6px' }}>
                    STEP 1 • APNA ROOM
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                  Verified Hostel / PG
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                  Rungta ya BIT campus ke paas pre-inspected room. Zero broker charges, study table aur biometric security ready.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', fontSize: '0.74rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={13} />
                  <span>Primary gate delivery point set</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2: Dining */}
            <ScrollReveal variant="fade-up" delay={120}>
              <div
                className="easehub-hover-lift"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.15rem',
                  border: '1.5px solid #FDE047',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 2px 8px rgba(234, 179, 8, 0.08)',
                  position: 'relative',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#FEF08A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#854D0E',
                    }}
                  >
                    <UtensilsCrossed size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#854D0E', backgroundColor: '#FEFCE8', padding: '3px 8px', borderRadius: '6px' }}>
                    STEP 2 • GHAR KA KHANA
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                  Daily Mess Synced
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                  Roj subah garam nashta aur dono time fresh tiffin direct room gate par. Bahar khana ho toh 1-click me meal pause &amp; refund.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #FEF9C3', fontSize: '0.74rem', color: '#854D0E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={13} />
                  <span>3 Tiffins linked to room timetable</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3: Laundry */}
            <ScrollReveal variant="fade-up" delay={190}>
              <div
                className="easehub-hover-lift"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.15rem',
                  border: '1.5px solid #BAE6FD',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)',
                  position: 'relative',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0369A1',
                    }}
                  >
                    <Shirt size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0369A1', backgroundColor: '#F0F9FF', padding: '3px 8px', borderRadius: '6px' }}>
                    STEP 3 • CLEAN CLOTHES
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                  Doorstep Laundry
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                  Hostel gate par bag drop karo (Tue &amp; Fri). Automated weight scale se bill count hota hai aur 24 ghante me steam ironed delivery.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #E0F2FE', fontSize: '0.74rem', color: '#0369A1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={13} />
                  <span>Zero lost clothes guarantee</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 4: Midnight Canteen & Single Pass */}
            <ScrollReveal variant="fade-up" delay={260}>
              <div
                className="easehub-hover-lift"
                style={{
                  backgroundColor: '#EFF5EC',
                  borderRadius: '1.15rem',
                  border: '2px solid #16A34A',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.15)',
                  position: 'relative',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    <CreditCard size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                    RESULT • 1 STUDENT PASS
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                  1 Single Monthly Bill
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#15803D', fontWeight: 700, lineHeight: 1.45 }}>
                  Sabhi services ka ek UPI payment. Har mahine ₹1,800+ ki direct bachat + 2 AM Midnight Canteen access.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #86EFAC', fontSize: '0.74rem', color: '#15803D', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Zap size={13} />
                  <span>Save ~34% vs Booking Separately</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Live Interactive Student Living Calculator ("Build Your Own Combo") */}
        <ScrollReveal variant="fade-up" delay={150}>
          <div
            className="easehub-hover-lift"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1.5rem',
              border: '2px solid #E2E8F0',
              padding: 'clamp(1.25rem, 3.5vw, 2rem)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(1.5rem, 3vw, 2.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left: Interactive Checklist */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Calculator size={18} color="#15803D" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  INTERACTIVE CAMPUS COMBO CALCULATOR
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem' }}>
                Apni Zaroorat Ke Mutabik Services Jodo
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
                Tick karo jo bhi services chahiye. Dekho kaise bundle karne par monthly kharcha kam hota hai:
              </p>

              {/* Checklist Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Option 1: Room */}
                <label
                  onClick={() => setIncludeRoom(!includeRoom)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '0.85rem',
                    backgroundColor: includeRoom ? '#EFF5EC' : '#F8FAF7',
                    border: `1.5px solid ${includeRoom ? '#86EFAC' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={includeRoom}
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', accentColor: '#16A34A', cursor: 'pointer' }}
                    />
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#DCFCE7',
                        border: '1px solid #86EFAC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#15803D',
                        flexShrink: 0,
                      }}
                    >
                      <Building2 size={17} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                        Verified PG / Hostel Room
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                        Smriti Nagar / Kohka • Wi-Fi &amp; Biometric Security
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#15803D' }}>₹3,500/mo</span>
                </label>

                {/* Option 2: Mess */}
                <label
                  onClick={() => setIncludeMess(!includeMess)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '0.85rem',
                    backgroundColor: includeMess ? '#FEFCE8' : '#F8FAF7',
                    border: `1.5px solid ${includeMess ? '#FDE047' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={includeMess}
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', accentColor: '#EAB308', cursor: 'pointer' }}
                    />
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#FEF08A',
                        border: '1px solid #FDE047',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#854D0E',
                        flexShrink: 0,
                      }}
                    >
                      <UtensilsCrossed size={17} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                        Daily 2-Meal Fresh Mess Tiffin
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                        Subah Nashta + Raat ka Khana • 1-Click Pause &amp; Refund
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#854D0E' }}>₹2,400/mo</span>
                </label>

                {/* Option 3: Laundry */}
                <label
                  onClick={() => setIncludeLaundry(!includeLaundry)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '0.85rem',
                    backgroundColor: includeLaundry ? '#F0F9FF' : '#F8FAF7',
                    border: `1.5px solid ${includeLaundry ? '#BAE6FD' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={includeLaundry}
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', accentColor: '#0284C7', cursor: 'pointer' }}
                    />
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#E0F2FE',
                        border: '1px solid #BAE6FD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0369A1',
                        flexShrink: 0,
                      }}
                    >
                      <Shirt size={17} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                        Doorstep Laundry &amp; Steam Iron (30kg/mo)
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                        Hostel Gate Pickup (Tue/Fri) • Same-Day Dispatch
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0369A1' }}>₹600/mo</span>
                </label>

                {/* Option 4: Midnight Canteen */}
                <label
                  onClick={() => setIncludeCanteen(!includeCanteen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '0.85rem',
                    backgroundColor: includeCanteen ? '#FAF5FF' : '#F8FAF7',
                    border: `1.5px solid ${includeCanteen ? '#DDD6FE' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={includeCanteen}
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', accentColor: '#9333EA', cursor: 'pointer' }}
                    />
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#F3E8FF',
                        border: '1px solid #DDD6FE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#7C3AED',
                        flexShrink: 0,
                      }}
                    >
                      <Moon size={17} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                        Midnight Exam Canteen Pass
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                        Late Night Deliveries till 3:30 AM • Zero Delivery Fee
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#7C3AED' }}>₹499/mo</span>
                </label>
              </div>
            </div>

            {/* Right: Live Dynamic Savings Calculation Card */}
            <div
              style={{
                backgroundColor: '#EFF5EC',
                borderRadius: '1.5rem',
                border: '2px solid #86EFAC',
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.1)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CONSOLIDATED STUDENT COMBO
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.65rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 900, color: '#0F172A', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    ₹{finalBundlePrice.toLocaleString('en-IN')}
                  </span>
                  {individualTotal > finalBundlePrice && (
                    <span style={{ fontSize: '1.15rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      ₹{individualTotal.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {bundleDiscount > 0 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: '#FEF08A', color: '#854D0E', border: '1px solid #FDE047', borderRadius: '9999px', padding: '0.3rem 0.95rem', fontSize: '0.82rem', fontWeight: 800, marginTop: '0.65rem', whiteSpace: 'nowrap' }}>
                    <Sparkles size={14} color="#854D0E" strokeWidth={2.5} />
                    <span>You Save ₹{bundleDiscount.toLocaleString('en-IN')} every month!</span>
                  </div>
                )}
              </div>

              {/* Realistic Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', textAlign: 'left', backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '0.85rem', border: '1px solid #DCFCE7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>1 Single UPI payment (Zero confusion for parents)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>Free doorstep delivery of hot meals to your room</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>Hostel gate pickup for laundry on schedule</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('bundles');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else if (onExploreBundles) onExploreBundles();
                  }}
                  style={{
                    flex: 1,
                    minWidth: '160px',
                    padding: '0.85rem 1.25rem',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                  }}
                >
                  <span>Pair This Combo</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenMessMenu) onOpenMessMenu();
                    else window.dispatchEvent(new CustomEvent('easehub_open_mess_menu'));
                  }}
                  style={{
                    padding: '0.85rem 1.15rem',
                    backgroundColor: '#FFFFFF',
                    color: '#15803D',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '0.75rem',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Today's Mess Menu
                </button>

                {onOpenTracker && (
                  <button
                    type="button"
                    onClick={onOpenTracker}
                    style={{
                      padding: '0.85rem 1.15rem',
                      backgroundColor: '#FEF08A',
                      color: '#854D0E',
                      border: '1.5px solid #FDE047',
                      borderRadius: '0.75rem',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Live Order Tracker
                  </button>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};
