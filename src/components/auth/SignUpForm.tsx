import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Lock, Building, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { CAMPUSES } from '../../data/campuses';
import type { AuthViewMode } from '../../types/auth';

interface SignUpFormProps {
  returnTo?: string;
  onSuccess?: () => void;
  onSwitchMode: (mode: AuthViewMode) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  returnTo,
  onSuccess,
  onSwitchMode,
}) => {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [campusId, setCampusId] = useState(CAMPUSES[0].id);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMessage('Please fill out all required registration fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the EaseHub Student Terms of Service.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await signUp({
      name,
      email,
      phone,
      password,
      campusId,
    });

    setIsLoading(false);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else if (returnTo) {
        window.location.hash = returnTo.replace(/^#\/?/, '');
      } else {
        window.location.hash = 'account';
      }
    } else {
      setErrorMessage(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {errorMessage && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #F87171',
            color: '#B91C1C',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Full Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="signup-name"
          style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Full Name
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
            <UserIcon size={16} />
          </div>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aditya Soni"
            required
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.4rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              color: '#0F172A',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Email */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="signup-email"
          style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          University Email
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
            <Mail size={16} />
          </div>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. student@university.edu or gmail"
            required
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.4rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              color: '#0F172A',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Phone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="signup-phone"
          style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Mobile Number
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
            <Phone size={16} />
          </div>
          <input
            id="signup-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            required
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.4rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              color: '#0F172A',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Campus */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="signup-campus"
          style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          University Campus
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
            <Building size={16} />
          </div>
          <select
            id="signup-campus"
            value={campusId}
            onChange={(e) => setCampusId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.4rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              color: '#0F172A',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {CAMPUSES.map((c) => (
              <option key={c.id} value={c.id} style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Password with Strength Meter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="signup-password"
          style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Create Password
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
            <Lock size={16} />
          </div>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            required
            autoComplete="new-password"
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.4rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              color: '#0F172A',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <PasswordStrengthMeter password={password} />
      </div>

      {/* Terms checkbox */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.25rem' }}>
        <input
          id="terms-check"
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          style={{ accentColor: '#16A34A', marginTop: '2px', cursor: 'pointer' }}
        />
        <label htmlFor="terms-check" style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4, cursor: 'pointer' }}>
          I confirm I am an enrolled student and agree to EaseHub Student Terms &amp; Campus Service Standards.
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
        style={{ marginTop: '0.35rem', backgroundColor: '#15803D' }}
      >
        Complete Registration
      </Button>

      {/* Switch to Sign In */}
      <div style={{ textAlign: 'center', marginTop: '0.25rem', fontSize: '0.82rem', color: '#64748B' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('sign-in')}
          style={{
            background: 'none',
            border: 'none',
            color: '#15803D',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};
