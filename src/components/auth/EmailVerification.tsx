import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import type { EmailVerificationState, AuthViewMode } from '../../types/auth';

interface EmailVerificationProps {
  token?: string;
  onSuccess?: () => void;
  onSwitchMode: (mode: AuthViewMode) => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  token = 'valid_demo_token',
  onSuccess,
  onSwitchMode,
}) => {
  const { verifyEmail, resendVerificationEmail, user } = useAuth();

  const [state, setState] = useState<EmailVerificationState>('verifying');
  const [message, setMessage] = useState<string>('Verifying your campus institutional credentials...');
  const [resendEmail, setResendEmail] = useState<string>(user?.email || 'student@easehub.in');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const performVerification = async () => {
      setState('verifying');
      const result = await verifyEmail(token);
      if (!isMounted) return;
      setState(result.state);
      setMessage(result.message);
    };

    performVerification();

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmail]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    setResendSuccess(null);
    const result = await resendVerificationEmail(resendEmail.trim());
    setIsResending(false);
    setResendSuccess(result.message);
  };

  // State: Verifying in progress
  if (state === 'verifying') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center', alignItems: 'center', width: '100%', padding: 'var(--space-4) 0' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        >
          <RefreshCw size={24} className="animate-spin" style={{ animation: 'easehubSpin 1s linear infinite' }} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-2) 0' }}>
            Authenticating Domain
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Verifying your student email token against campus directory records...
          </p>
        </div>
      </div>
    );
  }

  // State: Success
  if (state === 'success') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22C55E',
          }}
        >
          <CheckCircle2 size={26} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-2) 0' }}>
            Email Verified Successfully
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {message}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<ArrowRight size={14} />}
          iconPosition="right"
          fullWidth
          onClick={() => {
            if (onSuccess) onSuccess();
            else onSwitchMode('sign-in');
          }}
        >
          Proceed to Student Account
        </Button>
      </div>
    );
  }

  // State: Already Verified
  if (state === 'already_verified') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981',
          }}
        >
          <ShieldCheck size={26} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-2) 0' }}>
            Email Already Verified
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {message}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onSwitchMode('sign-in')}
        >
          Sign In to EaseHub
        </Button>
      </div>
    );
  }

  // State: Expired or Invalid Token
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F59E0B',
        }}
      >
        {state === 'expired' ? <Clock size={26} /> : <AlertCircle size={26} />}
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-2) 0' }}>
          {state === 'expired' ? 'Verification Link Expired' : 'Invalid Verification Link'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {message}
        </p>
      </div>

      {resendSuccess && (
        <div
          role="status"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
            color: '#22C55E',
            fontSize: '0.8rem',
            width: '100%',
          }}
        >
          {resendSuccess}
        </div>
      )}

      {/* Resend Form */}
      <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
            <Mail size={16} />
          </div>
          <input
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="student@university.edu or gmail"
            required
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.4rem',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="md"
          loading={isResending}
          fullWidth
          icon={<RefreshCw size={14} />}
          iconPosition="left"
        >
          Resend Verification Token
        </Button>
      </form>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSwitchMode('sign-in')}
      >
        Return to Sign In
      </Button>
    </div>
  );
};
