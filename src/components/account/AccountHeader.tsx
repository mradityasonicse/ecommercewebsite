import React from 'react';
import { LogOut, ShieldCheck, Building, User as UserIcon } from 'lucide-react';
import type { User } from '../../types/auth';
import { Button } from '../ui/Button';

interface AccountHeaderProps {
  user: User;
  onSignOut: () => void;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({ user, onSignOut }) => {
  return (
    <div
      style={{
        padding: 'clamp(1rem, 3vw, 1.75rem)',
        borderRadius: 'var(--radius-2xl)',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* Avatar circle */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-3)',
            border: '2px solid var(--color-brand-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-blue-light)',
            boxShadow: '0 0 20px var(--color-blue-glow)',
          }}
        >
          <UserIcon size={28} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--color-text-primary, #0F172A)',
                margin: 0,
              }}
            >
              {user.name}
            </h1>

            {user.emailVerified ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#22C55E',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                <ShieldCheck size={11} /> Verified Student
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#F59E0B',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Verification Pending
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {user.email}
            </span>
            {user.phone && (
              <>
                <span style={{ color: 'var(--color-border-default)' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  {user.phone}
                </span>
              </>
            )}
            <span style={{ color: 'var(--color-border-default)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-blue-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Building size={12} /> {user.campusName || 'Campus Living'}
            </span>
          </div>
        </div>
      </div>

      {/* Action: Sign Out */}
      <Button
        variant="secondary"
        size="md"
        icon={<LogOut size={14} />}
        iconPosition="left"
        onClick={onSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};
