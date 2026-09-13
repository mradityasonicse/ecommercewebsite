import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import type { AuthViewMode } from '../../types/auth';

interface SignInFormProps {
  returnTo?: string;
  onSuccess?: () => void;
  onSwitchMode: (mode: AuthViewMode) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  returnTo,
  onSuccess,
  onSwitchMode,
}) => {
  const { signIn, signInWithGoogle, signInWithPhone } = useAuth();

  // Login Mode: 'otp' | 'password'
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // Password Login State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Login State
  const [otpType, setOtpType] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('123456');
  const [countdown, setCountdown] = useState<number>(30);
  const [isCounting, setIsCounting] = useState<boolean>(false);

  // Global UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const handleRouteSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else if (returnTo) {
      window.location.hash = returnTo.replace(/^#\/?/, '');
    } else {
      window.location.hash = 'account';
    }
  };

  // Google Direct Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        handleRouteSuccess();
      } else {
        setErrorMessage(result.error || 'Google sign-in could not be completed.');
      }
    } catch {
      setErrorMessage('Google Authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Step 1: Send OTP (Mobile / Email)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const target = otpType === 'phone' ? phoneNumber.trim() : emailAddress.trim();
    if (!target) {
      setErrorMessage(otpType === 'phone' ? 'Please enter a valid 10-digit mobile number.' : 'Please enter a valid email address.');
      return;
    }

    if (otpType === 'phone' && target.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a full 10-digit mobile number.');
      return;
    }

    if (otpType === 'email' && !target.includes('@')) {
      setErrorMessage('Please enter a valid collegiate or personal email.');
      return;
    }

    setIsLoading(true);

    // Simulate OTP dispatch (or trigger backend API)
    await new Promise((r) => setTimeout(r, 600));

    // Simulated test OTP for immediate verification
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpStep('verify');
    setIsLoading(false);
    setCountdown(30);
    setIsCounting(true);
    setSuccessInfo(
      otpType === 'phone'
        ? `Verification code sent to +91 ${target}.`
        : `Verification code sent to ${target}.`
    );
  };

  // Step 2: Verify OTP & Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode.trim() || otpCode.length < 4) {
      setErrorMessage('Please enter the verification code received.');
      return;
    }

    // In demo environment, allow generated OTP or universal demo '123456'
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456') {
      setErrorMessage('Invalid verification code. Please check and try again.');
      return;
    }

    setIsLoading(true);
    const target = otpType === 'phone' ? phoneNumber.trim() : emailAddress.trim();
    const result = await signInWithPhone(target, 'Verified Scholar');
    setIsLoading(false);

    if (result.success) {
      handleRouteSuccess();
    } else {
      setErrorMessage(result.error || 'Verification failed. Please try again.');
    }
  };

  // Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      setErrorMessage('Please enter your email or mobile and your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await signIn({
      emailOrPhone,
      password,
      rememberMe,
    });

    setIsLoading(false);

    if (result.success) {
      handleRouteSuccess();
    } else {
      setErrorMessage(result.error || 'The email or password is incorrect.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
      {/* 1. DIRECT GOOGLE SIGN-IN BUTTON */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="easehub-btn-tactile"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 'var(--radius-md, 10px)',
          fontWeight: 700,
          fontSize: '0.92rem',
          fontFamily: 'var(--font-display, sans-serif)',
          cursor: isGoogleLoading ? 'wait' : 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F9FAFB';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
        }}
      >
        {/* Official Google 'G' Multi-Color SVG Logo */}
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-subtle, rgba(255, 255, 255, 0.12))' }} />
        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Or Sign In With
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-subtle, rgba(255, 255, 255, 0.12))' }} />
      </div>

      {/* 2. AUTH METHOD TAB SELECTOR (OTP vs Password) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--color-surface-2, rgba(255, 255, 255, 0.05))',
          padding: '4px',
          borderRadius: 'var(--radius-md, 10px)',
          border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.1))',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setAuthMethod('otp');
            setErrorMessage(null);
          }}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: authMethod === 'otp' ? 'var(--color-brand-blue, #2563EB)' : 'transparent',
            color: authMethod === 'otp' ? '#FFFFFF' : 'var(--color-text-secondary)',
            fontWeight: authMethod === 'otp' ? 700 : 500,
            fontSize: '0.84rem',
            fontFamily: 'var(--font-display, sans-serif)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          <span>OTP Login (Fast)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMethod('password');
            setErrorMessage(null);
          }}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: authMethod === 'password' ? 'var(--color-brand-blue, #2563EB)' : 'transparent',
            color: authMethod === 'password' ? '#FFFFFF' : 'var(--color-text-secondary)',
            fontWeight: authMethod === 'password' ? 700 : 500,
            fontSize: '0.84rem',
            fontFamily: 'var(--font-display, sans-serif)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          <span>Password</span>
        </button>
      </div>

      {/* ERROR ALERT */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            fontSize: '0.82rem',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SUCCESS INFO TOAST (E.G. DEMO OTP HINT) */}
      {successInfo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ADE80',
            fontSize: '0.82rem',
          }}
        >
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{successInfo}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* METHOD A: OTP LOGIN (MOBILE NUMBER OR EMAIL ADDRESS)                      */}
      {/* ========================================================================= */}
      {authMethod === 'otp' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Sub-toggle: Mobile Number vs Email */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Send OTP via:
            </span>
            <button
              type="button"
              onClick={() => {
                setOtpType('phone');
                setOtpStep('input');
                setSuccessInfo(null);
                setErrorMessage(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: otpType === 'phone' ? 'var(--color-brand-gold, #FAC908)' : 'var(--color-text-secondary)',
                fontWeight: otpType === 'phone' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: otpType === 'phone' ? 'underline' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Phone size={12} /> Mobile Number
            </button>
            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
            <button
              type="button"
              onClick={() => {
                setOtpType('email');
                setOtpStep('input');
                setSuccessInfo(null);
                setErrorMessage(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: otpType === 'email' ? 'var(--color-brand-gold, #FAC908)' : 'var(--color-text-secondary)',
                fontWeight: otpType === 'email' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: otpType === 'email' ? 'underline' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Mail size={12} /> Email Address
            </button>
          </div>

          {/* Step 1 Form: Enter Destination */}
          {otpStep === 'input' && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {otpType === 'phone' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label
                    htmlFor="otp-phone"
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    10-Digit Mobile Number
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        padding: '0.75rem 0.85rem',
                        backgroundColor: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        userSelect: 'none',
                      }}
                    >
                      <span>🇮🇳 +91</span>
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input
                        id="otp-phone"
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9876543210"
                        autoComplete="tel-national"
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: 'var(--color-surface-2)',
                          border: '1px solid var(--color-border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          letterSpacing: '0.05em',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label
                    htmlFor="otp-email"
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    University or Personal Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                      <Mail size={16} />
                    </div>
                    <input
                      id="otp-email"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="e.g. student@easehub.in"
                      autoComplete="email"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.4rem',
                        backgroundColor: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                fullWidth
                icon={<ArrowRight size={16} />}
                style={{ marginTop: '0.5rem' }}
              >
                Send Verification Code
              </Button>
            </form>
          )}

          {/* Step 2 Form: Enter & Verify OTP */}
          {otpStep === 'verify' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label
                  htmlFor="auth-otp-code"
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Enter 6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('input');
                    setOtpCode('');
                    setSuccessInfo(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-brand-gold)',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Change {otpType === 'phone' ? 'Number' : 'Email'}
                </button>
              </div>

              <input
                id="auth-otp-code"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-brand-blue, #2563EB)',
                  borderRadius: 'var(--radius-md)',
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  textAlign: 'center',
                  letterSpacing: '0.35em',
                  fontWeight: 800,
                  outline: 'none',
                  boxShadow: '0 0 16px rgba(37, 99, 235, 0.25)',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  Didn't receive code?
                </span>
                {isCounting ? (
                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleSendOtp(e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-brand-gold, #FAC908)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                fullWidth
                icon={<ArrowRight size={16} />}
                style={{ marginTop: '0.25rem' }}
              >
                Verify &amp; Sign In
              </Button>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* METHOD B: PASSWORD LOGIN (AS SHOWN IN USER SCREENSHOT)                     */}
      {/* ========================================================================= */}
      {authMethod === 'password' && (
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Email / Phone Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label
              htmlFor="auth-email"
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              University Email or Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Mail size={16} />
              </div>
              <input
                id="auth-email"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. student@easehub.in"
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label
                htmlFor="auth-password"
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => onSwitchMode('forgot-password')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-blue-light, #93C5FD)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Lock size={16} />
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.6rem 0.75rem 2.4rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: 'var(--color-brand-blue, #2563EB)',
                width: '15px',
                height: '15px',
                cursor: 'pointer',
              }}
            />
            <label htmlFor="remember-me" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            fullWidth
            icon={<ArrowRight size={16} />}
            style={{ marginTop: '0.25rem' }}
          >
            Sign In to EaseHub
          </Button>
        </form>
      )}

      {/* Switch to Sign Up */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-2)', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
        New to EaseHub?{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('sign-up')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-blue-light, #93C5FD)',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Create Student Account
        </button>
      </div>
    </div>
  );
};
