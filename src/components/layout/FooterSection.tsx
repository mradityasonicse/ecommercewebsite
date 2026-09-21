import React from 'react';
import type { FooterColumn } from '../../config/navigation';

export interface FooterSectionProps {
  column: FooterColumn;
  onLinkClick?: (href: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  column,
  onLinkClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const cleanHash = href.replace('#', '');
      const [targetId] = cleanHash.split('?');
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      } else {
        e.preventDefault();
        window.location.hash = href;
      }
    }
    onLinkClick?.(href);
  };

  return (
    <div className="easehub-footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <h6
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-eyebrow)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--color-text-primary)',
          margin: 0,
        }}
      >
        {column.title}
      </h6>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
        }}
      >
        {column.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              style={{
                fontSize: 'var(--text-body-xs)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-brand-blue, #15803D)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '0.05rem 0.4rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: '#FEF08A',
                    color: '#854D0E',
                    border: '1px solid #FDE047',
                  }}
                >
                  {link.badge}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
