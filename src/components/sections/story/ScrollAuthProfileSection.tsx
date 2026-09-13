import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  MessageCircle
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { useAuth } from '../../../context/AuthContext';
import { buildLoginWhatsAppUrl, DEFAULT_WHATSAPP_ADMIN_NUMBER } from '../../../utils/whatsapp';

interface ScrollAuthProfileSectionProps {
  onScrollToServices?: () => void;
}

export const ScrollAuthProfileSection: React.FC<ScrollAuthProfileSectionProps> = ({ onScrollToServices }) => {
  const { user, isAuthenticated, signIn, signInWithGoogle, signInWithPhone, signOut } = useAuth();

  // Auth Tab: 'google' | 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState<'google' | 'email' | 'phone'>('google');
  
  // Email Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone Form state
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Quick Google Sign-In
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGoogle();
      if (res.success && res.user) {
        setSuccessNotice(`Welcome back, ${res.user.name}!`);
        // Notify WhatsApp
        const waUrl = buildLoginWhatsAppUrl(res.user);
        window.open(waUrl, '_blank');
      } else {
        setErrorMessage(res.error || 'Failed to authenticate with Google.');
      }
    } catch {
      setErrorMessage('Google authentication encountered an unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  // Email Sign-In
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your institutional email and password.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signIn({ emailOrPhone: email.trim(), password: password.trim() });
      if (res.success && res.user) {
        setSuccessNotice(`Logged in as ${res.user.name}`);
        const waUrl = buildLoginWhatsAppUrl(res.user);
        window.open(waUrl, '_blank');
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify or use Demo Account.');
      }
    } catch {
      setErrorMessage('Email sign-in encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-Fill
  const handleUseDemoAccount = () => {
    setEmail('student@easehub.in');
    setPassword('Student#2026');
    setErrorMessage(null);
  };

  // Phone Sign-In
  const handleSendOtp = () => {
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage(null);
    setIsOtpSent(true);
    setOtp('123456'); // Simulated instant OTP
    setSuccessNotice('One-Time Password sent to your mobile! (Auto-filled: 123456)');
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }
    if (!otp.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signInWithPhone(phone, studentName || 'Campus Student');
      if (res.success && res.user) {
        setSuccessNotice(`Logged in with ${res.user.phone}`);
        const waUrl = buildLoginWhatsAppUrl(res.user);
        window.open(waUrl, '_blank');
      } else {
        setErrorMessage(res.error || 'Failed to authenticate phone number.');
      }
    } catch {
      setErrorMessage('Mobile login encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="auth-profile"
      aria-label="Student Authentication and Profile Hub"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-primary, #FBF9F1)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        borderBottom: '1px solid var(--color-border-subtle, #E8E4D5)',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(15, 56, 44, 0.06)',
              border: '1px solid rgba(15, 56, 44, 0.16)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <ShieldCheck size={14} color="#0F382C" />
            <span
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                color: 'var(--color-brand-blue, #0F382C)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {isAuthenticated ? 'Student Account Active' : 'Step 01 • Secure Living Gateway'}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
              fontFamily: 'var(--font-serif, "Domine", serif)',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary, #151D1A)',
              margin: '0 0 var(--space-3) 0',
            }}
          >
            {isAuthenticated ? (
              <>
                Your Verified Student Profile.{' '}
                <span style={{ color: 'var(--color-brand-blue, #0F382C)' }}>
                  Ready to Book.
                </span>
              </>
            ) : (
              <>
                Sign In to Access Student Rates.{' '}
                <span style={{ color: 'var(--color-brand-blue, #0F382C)' }}>
                  Instant Verification.
                </span>
              </>
            )}
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              color: 'var(--color-text-secondary, #414845)',
              lineHeight: 1.6,
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            {isAuthenticated
              ? 'Your account is authenticated with verified campus residency, instant WhatsApp booking confirmations, and deposit escrow guarantee.'
              : 'Choose your preferred sign-in method. Login details are recorded to our campus WhatsApp coordinator for instant live support.'}
          </p>
        </div>

        {/* FEEDBACK NOTICES */}
        {errorMessage && (
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto var(--space-6) auto',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(211, 69, 46, 0.08)',
              border: '1px solid rgba(211, 69, 46, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#D3452E',
              fontSize: '0.88rem',
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </div>
        )}

        {successNotice && (
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto var(--space-6) auto',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(46, 125, 50, 0.08)',
              border: '1px solid rgba(46, 125, 50, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#2E7D32',
              fontSize: '0.88rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={16} color="#2E7D32" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOGGED-IN: STUDENT PROFILE DASHBOARD CARD                                */}
        {/* ========================================================================= */}
        {isAuthenticated && user ? (
          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              backgroundColor: 'var(--color-surface-1, #FFFFFF)',
              border: '1px solid var(--color-border-subtle, #E8E4D5)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-6)',
                paddingBottom: 'var(--space-6)',
                borderBottom: '1px solid var(--color-border-subtle, #E8E4D5)',
              }}
            >
              {/* User Avatar & Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#f3fbf5',
                    border: '2px solid var(--color-brand-blue, #0F382C)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 700, color: '#0F382C' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)' }}>
                      {user.name}
                    </h3>
                    <span
                      style={{
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        border: '1px solid rgba(46, 125, 50, 0.3)',
                        color: '#2E7D32',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-pill)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <CheckCircle2 size={12} color="#2E7D32" />
                      Verified Student
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary, #414845)' }}>
                    {user.email} • {user.phone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              {/* Account Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href={`https://api.whatsapp.com/send?phone=${DEFAULT_WHATSAPP_ADMIN_NUMBER.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi EaseHub, I am logged in as ${user.name} (${user.campusName || 'Campus Resident'}). I need support with my services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#25D366',
                    border: '1px solid #20BA5A',
                    color: '#0F382C',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all var(--duration-fast)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <MessageCircle size={15} color="#0F382C" />
                  <span>WhatsApp Admin</span>
                </a>

                <button
                  type="button"
                  onClick={() => signOut()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border-subtle, #E8E4D5)',
                    color: 'var(--color-text-secondary, #414845)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-brand-blue, #0F382C)';
                    e.currentTarget.style.color = 'var(--color-brand-blue, #0F382C)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-subtle, #E8E4D5)';
                    e.currentTarget.style.color = 'var(--color-text-secondary, #414845)';
                  }}
                >
                  <LogOut size={14} />
                  <span>Switch / Sign Out</span>
                </button>
              </div>
            </div>

            {/* Campus & Living Info Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--space-4)',
                margin: 'var(--space-6) 0',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-surface-2, rgba(255,255,255,0.05))',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Enrolled Campus
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} color="var(--color-gold, #f39c12)" />
                  <span>{user.campusName || 'Campus Living'}</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-2, rgba(255,255,255,0.05))',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Hostel &amp; Room
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {user.hostelBlock || 'Hostel Block B'} • Room {user.roomNumber || '304'}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-2, rgba(255,255,255,0.05))',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Security &amp; Guarantee
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-gold, #f39c12)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--color-gold, #f39c12)" />
                  <span>Escrow Shield Active</span>
                </div>
              </div>
            </div>

            {/* Direct Link to Scroll into Services */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-2, rgba(255,255,255,0.05))',
                border: '1px dashed var(--color-border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5) var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontFamily: 'var(--font-serif, "Domine", serif)', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)' }}>
                  Explore Core Campus Services
                </h4>
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-text-secondary, #414845)' }}>
                  Pick your Mess, PG, or Laundry package below. Bookings will automatically use your verified student profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onScrollToServices) {
                    onScrollToServices();
                  } else {
                    const el = document.getElementById('core-services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  padding: '0.75rem 1.4rem',
                  backgroundColor: 'var(--color-accent-gold, #F8CE37)',
                  color: 'var(--color-brand-blue, #0F382C)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--duration-fast), box-shadow var(--duration-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(248, 206, 55, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <span>View Core Services ↓</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* NOT LOGGED IN: 3-WAY AUTH GATEWAY (GOOGLE, EMAIL, PHONE)                 */
          /* ========================================================================= */
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              backgroundColor: 'var(--color-surface-1, #FFFFFF)',
              border: '1px solid var(--color-border-subtle, #E8E4D5)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Method Selector Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                backgroundColor: '#f3fbf5',
                padding: '0.35rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-6)',
                border: '1px solid var(--color-border-subtle, #E8E4D5)',
              }}
            >
              <button
                type="button"
                onClick={() => { setAuthMethod('google'); setErrorMessage(null); }}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: authMethod === 'google' ? '#0F382C' : 'transparent',
                  color: authMethod === 'google' ? '#FFFFFF' : 'var(--color-text-secondary, #414845)',
                  fontWeight: authMethod === 'google' ? 700 : 500,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                Google
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setErrorMessage(null); }}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: authMethod === 'email' ? '#0F382C' : 'transparent',
                  color: authMethod === 'email' ? '#FFFFFF' : 'var(--color-text-secondary, #414845)',
                  fontWeight: authMethod === 'email' ? 700 : 500,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                Email
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setErrorMessage(null); }}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: authMethod === 'phone' ? '#0F382C' : 'transparent',
                  color: authMethod === 'phone' ? '#FFFFFF' : 'var(--color-text-secondary, #414845)',
                  fontWeight: authMethod === 'phone' ? 700 : 500,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                Phone Number
              </button>
            </div>

            {/* TAB 1: GOOGLE ONE-CLICK LOGIN */}
            {authMethod === 'google' && (
              <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                  Sign in with your university Google account or personal Gmail to instantly unlock verified campus rates and WhatsApp sync.
                </p>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-text-primary, #151D1A)',
                    border: '1px solid var(--color-border-subtle, #E8E4D5)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform var(--duration-fast), box-shadow var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>{loading ? 'Authenticating Google Session...' : 'Continue with Google'}</span>
                </button>

                <div style={{ marginTop: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--color-text-muted, #6B736D)' }}>
                  🔒 Secure OAuth 2.0 • No password required
                </div>
              </div>
            )}

            {/* TAB 2: EMAIL LOGIN */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label
                    htmlFor="scroll-auth-email"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', marginBottom: '0.4rem' }}
                  >
                    Institutional or Personal Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={17}
                      color="#6B736D"
                      style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      id="scroll-auth-email"
                      type="email"
                      required
                      placeholder="e.g. student@university.edu or gmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem 0.8rem 2.8rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border-subtle, #E8E4D5)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--color-text-primary, #151D1A)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label
                      htmlFor="scroll-auth-password"
                      style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)' }}
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleUseDemoAccount}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-brand-blue, #0F382C)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                      }}
                    >
                      Use Demo Account
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={17}
                      color="#6B736D"
                      style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      id="scroll-auth-password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem 0.8rem 2.8rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border-subtle, #E8E4D5)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--color-text-primary, #151D1A)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--color-brand-blue, #0F382C)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* TAB 3: PHONE NUMBER LOGIN */}
            {authMethod === 'phone' && (
              <form onSubmit={handlePhoneLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label
                    htmlFor="scroll-auth-student-name"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', marginBottom: '0.4rem' }}
                  >
                    Your Name (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={17}
                      color="#6B736D"
                      style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      id="scroll-auth-student-name"
                      type="text"
                      placeholder="e.g. Rahul Verma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem 0.8rem 2.8rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border-subtle, #E8E4D5)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--color-text-primary, #151D1A)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="scroll-auth-phone"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', marginBottom: '0.4rem' }}
                  >
                    10-Digit Mobile Number
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Phone
                        size={17}
                        color="#6B736D"
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <input
                        id="scroll-auth-phone"
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem 1rem 0.8rem 2.8rem',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--color-border-subtle, #E8E4D5)',
                          borderRadius: 'var(--radius-lg)',
                          color: 'var(--color-text-primary, #151D1A)',
                          fontSize: '0.95rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{
                        padding: '0 1rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: '#f3fbf5',
                        border: '1px solid var(--color-border-subtle, #E8E4D5)',
                        color: 'var(--color-brand-blue, #0F382C)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isOtpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {isOtpSent && (
                  <div>
                    <label
                      htmlFor="scroll-auth-otp"
                      style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary, #151D1A)', marginBottom: '0.4rem' }}
                    >
                      Enter 6-Digit OTP (Mock auto-filled: 123456)
                    </label>
                    <input
                      id="scroll-auth-otp"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border-subtle, #E8E4D5)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--color-text-primary, #151D1A)',
                        fontSize: '1.1rem',
                        letterSpacing: '0.2em',
                        textAlign: 'center',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--color-brand-blue, #0F382C)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span>{loading ? 'Verifying...' : 'Continue with Number'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* Bottom Security Assurance */}
            <div
              style={{
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--color-border-subtle, #E8E4D5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted, #6B736D)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} color="#0F382C" />
                <span>Verified Escrow Protection</span>
              </div>
              <div>
                📲 Syncs with WhatsApp Support
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
