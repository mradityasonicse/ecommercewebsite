import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { Container } from '../primitives/Container';
import { DEFAULT_WHATSAPP_ADMIN_NUMBER } from '../../utils/whatsapp';

export interface FooterProps {
  onPartnerOpen?: () => void;
  onRequestCampusOpen?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onPartnerOpen: _onPartnerOpen,
  onRequestCampusOpen: _onRequestCampusOpen,
}) => {
  const whatsappNumber = DEFAULT_WHATSAPP_ADMIN_NUMBER.replace(/\D/g, '');

  return (
    <footer
      role="contentinfo"
      className="easehub-global-footer"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border-subtle)',
        paddingTop: 'var(--space-6)',
        paddingBottom: 'var(--space-6)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Container variant="wide">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Left: Brand Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <BrandLogo variant="compact" showTagline={false} />
            <span
              style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-muted)',
                borderLeft: '1px solid var(--color-border-subtle)',
                paddingLeft: '1rem',
              }}
            >
              PG • Laundry • Mess • &amp; More
            </span>
          </div>

          {/* Center: Streamlined Navigation Links */}
          <nav
            aria-label="Footer Quick Links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-body)',
            }}
          >
            <a
              href="#core-services"
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color var(--duration-fast)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            >
              Services
            </a>
            <a
              href="#bundles"
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color var(--duration-fast)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            >
              Smart Bundles
            </a>
          </nav>

          {/* Right: WhatsApp Direct Connect & Copyright */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent('Hi EaseHub, I want to inquire about campus services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#EDF6EF',
                border: '1px solid var(--color-border-subtle)',
                color: '#0F382C',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2EAE4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EDF6EF';
              }}
            >
              <MessageCircle size={14} color="#0F382C" />
              <span>WhatsApp Support</span>
            </a>

            <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
              © {new Date().getFullYear()} EaseHub • Collegiate Living
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
