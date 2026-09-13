import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import type { AuthViewMode } from '../../types/auth';

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: AuthViewMode) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchMode }) => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    const result = await requestPasswordReset(email.trim());
    setIsLoading(false);
    setSuccessMessage(result.message);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
      {successMessage ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'center', alignItems: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22C55E',
            }}
          >
            <CheckCircle2 size={28} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Check Your Email
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {successMessage}
          </p>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            icon={<ArrowLeft size={16} />}
            iconPosition="left"
            onClick={() => onSwitchMode('sign-in')}
            style={{ marginTop: 'var(--space-3)' }}
          >
            Return to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 var(--space-2) 0' }}>
              Reset Your Password
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Enter the university or personal email associated with your account. We'll send instructions to securely set a new password.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label
              htmlFor="reset-email"
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
              }}
            >
              Registered Email
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Mail size={16} />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@university.edu or gmail"
                required
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            fullWidth
            icon={<ArrowRight size={16} />}
          >
            Send Reset Instructions
          </Button>

          <button
            type="button"
            onClick={() => onSwitchMode('sign-in')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginTop: 'var(--space-1)',
            }}
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </form>
      )}
    </div>
  );
};
