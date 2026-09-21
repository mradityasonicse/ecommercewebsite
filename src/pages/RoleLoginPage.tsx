import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  UtensilsCrossed,
  Shirt,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Phone,
  User,
  Zap,
} from 'lucide-react';
import type { UserPersona } from '../components/auth/RoleLoginGateModal';

export interface RoleLoginPageProps {
  onLogin: (role: UserPersona) => void;
}

interface PersonaConfig {
  id: UserPersona;
  title: string;
  hindiLabel: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  color: string;
  bgLight: string;
  borderLight: string;
  tagline: string;
  highlights: string[];
  demoBtnText: string;
  defaultEmail: string;
  defaultPass: string;
}

const PERSONAS: PersonaConfig[] = [
  {
    id: 'student',
    title: 'Student & Resident',
    hindiLabel: 'विद्यार्थी / रेजिडेंट',
    badge: 'Campus Resident',
    icon: GraduationCap,
    color: '#15803D',
    bgLight: '#EFF5EC',
    borderLight: '#BBF7D0',
    tagline: 'Zero-brokerage PGs, daily mess menu, 2 AM midnight snacks & laundry booking.',
    highlights: [
      'Verified PG rooms with zero brokerage',
      'Today\'s live mess menu & kitchen alerts',
      'Doorstep laundry pickup & wash tracking',
      'Midnight canteen deliveries to hostel gate',
    ],
    demoBtnText: '🚀 Enter as Student (1-Click Demo)',
    defaultEmail: 'scholar@easehub.in',
    defaultPass: 'campus2026',
  },
  {
    id: 'pg_owner',
    title: 'PG & Hostel Owner',
    hindiLabel: 'पीजी व हॉस्टल मालिक',
    badge: 'Property Partner',
    icon: Building2,
    color: '#1D4ED8',
    bgLight: '#EFF6FF',
    borderLight: '#BFDBFE',
    tagline: 'Manage room vacancies, occupied status, handover dates & live bed pricing.',
    highlights: [
      'Room-by-room inventory (Room 101, 102...)',
      '1-click Vacant / Occupied live toggle',
      'Handover date picker (e.g., "Available from 1st Oct")',
      'Automatic live sync to public PG cards',
    ],
    demoBtnText: '🏠 Open PG Owner Portal (1-Click Demo)',
    defaultEmail: 'owner@easehub.in',
    defaultPass: 'pg2026',
  },
  {
    id: 'mess_partner',
    title: 'Mess & Kitchen Partner',
    hindiLabel: 'मेस व किचन पार्टनर',
    badge: 'Dining Partner',
    icon: UtensilsCrossed,
    color: '#D97706',
    bgLight: '#FFFBEB',
    borderLight: '#FDE68A',
    tagline: 'Update today\'s meal menus & send "Hostel Gate Pe Pahunch Gaya" arrival notifications.',
    highlights: [
      'Edit daily Lunch, Dinner & Chef Special dishes',
      '4-stage cooking & dispatch progress pipeline',
      '1-click student alert: "Hostel Gate Pe Pahunch Gaya"',
      'Live menu broadcast to all campus students',
    ],
    demoBtnText: '🍲 Open Mess Partner Portal (1-Click Demo)',
    defaultEmail: 'mess@easehub.in',
    defaultPass: 'mess2026',
  },
  {
    id: 'laundry_partner',
    title: 'Laundry Partner',
    hindiLabel: 'लॉन्ड्री सर्विस पार्टनर',
    badge: 'Laundry Partner',
    icon: Shirt,
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    borderLight: '#DDD6FE',
    tagline: 'Manage scheduled pickup queue by room, bag weight, clothes count & 5-stage wash pipeline.',
    highlights: [
      'Room pickup time queue (e.g. 10:30 AM, Room 204)',
      'Record clothes count & bag weight in kg',
      '5-stage wash, spin, steam press & delivery status',
      'Direct WhatsApp status link to student',
    ],
    demoBtnText: '👕 Open Laundry Partner Portal (1-Click Demo)',
    defaultEmail: 'laundry@easehub.in',
    defaultPass: 'laundry2026',
  },
  {
    id: 'admin',
    title: 'Super Administrator',
    hindiLabel: 'सुपर एडमिनिस्ट्रेटर',
    badge: 'Operations Hub',
    icon: ShieldCheck,
    color: '#0F766E',
    bgLight: '#F0FDFA',
    borderLight: '#99F6E4',
    tagline: 'Interactive bookings spreadsheet, 1-click CSV export to Google Sheets/Excel & catalog editor.',
    highlights: [
      'Interactive student booking records table',
      '📥 1-Click Export Spreadsheet (.CSV) generator',
      'Status updater (Pending, Confirmed, Completed)',
      'Service catalog pricing & partner controls',
    ],
    demoBtnText: '🛡️ Open Admin Console (1-Click Demo)',
    defaultEmail: 'admin@easehub.in',
    defaultPass: 'admin123',
  },
];

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({ onLogin }) => {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>('student');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentConfig = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  const handleSelectPersona = (id: UserPersona) => {
    setSelectedPersona(id);
    setErrorMessage(null);
    const target = PERSONAS.find((p) => p.id === id);
    if (target) {
      setEmailOrPhone(target.defaultEmail);
      setPassword(target.defaultPass);
    }
  };

  const handleDemoLogin = (personaId: UserPersona) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(personaId);
    }, 150);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedPersona === 'admin') {
      if (
        emailOrPhone.toLowerCase().includes('admin') ||
        password === 'admin123' ||
        password === 'easehub2026' ||
        !password
      ) {
        handleDemoLogin('admin');
      } else {
        setErrorMessage('Invalid Admin credentials. Try email: admin@easehub.in or click 1-Click Demo.');
      }
      return;
    }

    handleDemoLogin(selectedPersona);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#F8FAF7',
        backgroundImage:
          'radial-gradient(at 0% 0%, rgba(34, 197, 94, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(250, 204, 21, 0.08) 0px, transparent 50%)',
        color: '#0F172A',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        padding: '2rem 1.25rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {/* Top Brand Header */}
      <header
        style={{
          maxWidth: '820px',
          width: '100%',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            color: '#15803D',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
            boxShadow: '0 2px 8px rgba(21, 128, 61, 0.1)',
          }}
        >
          <Sparkles size={14} />
          <span>EaseHub Campus Portal Access</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.03em',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.15,
          }}
        >
          Sabse Pehle Login Karein
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.88rem, 2vw, 1.05rem)',
            color: '#475569',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          Apna role chunein — website aapke selected role ke anusar dedicated portal ke sath open hogi.
        </p>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: '1080px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* 5 Persona Selector Cards Grid */}
        <section aria-label="Select User Role">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {PERSONAS.map((persona) => {
              const isSelected = selectedPersona === persona.id;
              const IconComp = persona.icon;

              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleSelectPersona(persona.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isSelected
                      ? `2.5px solid ${persona.color}`
                      : '1.5px solid #E2E8F0',
                    borderRadius: '18px',
                    padding: '1.25rem 1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected
                      ? `0 12px 24px -6px ${persona.color}25, 0 0 0 2px ${persona.color}30`
                      : '0 2px 6px rgba(0,0,0,0.03)',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    position: 'relative',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  {/* Active Radio Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        backgroundColor: persona.bgLight,
                        border: `1px solid ${persona.borderLight}`,
                        color: persona.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={20} strokeWidth={2.4} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? persona.color : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#64748B',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {persona.badge}
                    </span>
                  </div>

                  {/* Title & Hindi Label */}
                  <div>
                    <h3
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: 800,
                        color: isSelected ? persona.color : '#0F172A',
                        margin: '0 0 0.15rem 0',
                        lineHeight: 1.2,
                      }}
                    >
                      {persona.title}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                      {persona.hindiLabel}
                    </div>
                  </div>

                  {/* Micro Indicator */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '0.35rem',
                      borderTop: '1px dashed #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isSelected ? persona.color : '#94A3B8',
                    }}
                  >
                    <span>{isSelected ? '✓ Selected' : 'Click to Select'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Persona Login Action Card */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: `2px solid ${currentConfig.borderLight}`,
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(0,0,0,0.02)',
            padding: '2rem clamp(1.25rem, 3vw, 2.5rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Role Overview & Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: currentConfig.bgLight,
                  border: `1.5px solid ${currentConfig.borderLight}`,
                  color: currentConfig.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <currentConfig.icon size={24} strokeWidth={2.4} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: currentConfig.color,
                  }}
                >
                  Selected Portal
                </span>
                <h2
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#0F172A',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {currentConfig.title}
                </h2>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              {currentConfig.tagline}
            </p>

            <div
              style={{
                backgroundColor: currentConfig.bgLight,
                border: `1px solid ${currentConfig.borderLight}`,
                borderRadius: '16px',
                padding: '1.1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: currentConfig.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                What opens inside this portal:
              </div>
              {currentConfig.highlights.map((point, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    fontSize: '0.84rem',
                    color: '#1E293B',
                    fontWeight: 500,
                    lineHeight: 1.35,
                  }}
                >
                  <CheckCircle2
                    size={16}
                    color={currentConfig.color}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Instant 1-Click Login & Manual Form */}
          <div
            style={{
              backgroundColor: '#F8FAF7',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#15803D',
                  marginBottom: '0.35rem',
                }}
              >
                <Zap size={14} />
                <span>RECOMMENDED FOR SPEED</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Instant 1-Click Access
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                Bina password type kiye turant login karein aur website access karein:
              </p>
            </div>

            {/* Glowing 1-Click Demo Login Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDemoLogin(selectedPersona)}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                backgroundColor: currentConfig.color,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '0.96rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: `0 8px 20px -4px ${currentConfig.color}50`,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <span>{currentConfig.demoBtnText}</span>
              <ArrowRight size={18} />
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#94A3B8',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: '#CBD5E1' }} />
              <span>OR ENTER CREDENTIALS</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#CBD5E1' }} />
            </div>

            {errorMessage && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #F87171',
                  color: '#B91C1C',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.25rem',
                  }}
                >
                  {selectedPersona === 'student'
                    ? 'Student Mobile or College Email'
                    : `${currentConfig.title} Email / User ID`}
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                    }}
                  >
                    {selectedPersona === 'student' ? <Phone size={15} /> : <User size={15} />}
                  </span>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder={currentConfig.defaultEmail}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.84rem',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.25rem',
                  }}
                >
                  Password / Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                    }}
                  >
                    <Lock size={15} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.84rem',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: '0.7rem 1rem',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF5EC';
                  e.currentTarget.style.borderColor = '#16A34A';
                  e.currentTarget.style.color = '#15803D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.color = '#1E293B';
                }}
              >
                Sign In with Credentials
              </button>
            </form>

            {/* Quick Guest Bypass for Students */}
            <div style={{ textAlign: 'center', paddingTop: '0.35rem' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#15803D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
              >
                <span>Or explore storefront as Guest Student</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer info note */}
        <footer
          style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#64748B',
            marginTop: '0.5rem',
          }}
        >
          <span>EASEHUB © 2026 — Verified Campus Infrastructure &amp; Student Living OS</span>
        </footer>
      </main>
    </div>
  );
};
