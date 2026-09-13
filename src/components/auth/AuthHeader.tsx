import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  badge = 'Campus Identity Security',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: 'var(--space-6)' }}>
      {badge && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.55rem',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: 'var(--radius-pill)',
            color: '#FFFFFF',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            width: 'max-content',
          }}
        >
          <ShieldCheck size={12} /> {badge}
        </div>
      )}

      <h2
        style={{
          fontSize: 'clamp(1.35rem, 2.5vw, 1.65rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1.25,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
