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
            padding: '0.25rem 0.65rem',
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            borderRadius: '9999px',
            color: '#15803D',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            width: 'max-content',
          }}
        >
          <ShieldCheck size={12} color="#15803D" /> {badge}
        </div>
      )}

      <h2
        style={{
          fontSize: 'clamp(1.35rem, 2.5vw, 1.65rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: '#0F172A',
          margin: 0,
          lineHeight: 1.25,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: '0.88rem',
          color: '#64748B',
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
