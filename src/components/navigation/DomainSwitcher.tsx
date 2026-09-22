import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Utensils, Home, Shirt, Building } from 'lucide-react';
import { useDomain } from '../../context/DomainContext';
import { type DomainId } from '../../config/domainConfig';

interface DomainSwitcherProps {
  variant?: 'default' | 'compact';
}

export const DomainSwitcher: React.FC<DomainSwitcherProps> = ({ variant = 'default' }) => {
  const { currentDomain, domainConfig, setDomain, allDomains } = useDomain();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDomainIcon = (id: DomainId) => {
    switch (id) {
      case 'dining':
        return Utensils;
      case 'housing':
        return Home;
      case 'laundry':
        return Shirt;
      case 'campus':
        return Building;
      default:
        return Globe;
    }
  };

  const CurrentIcon = getDomainIcon(currentDomain);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Switch Domain Configuration"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: variant === 'compact' ? '0.35rem 0.65rem' : '0.4rem 0.75rem',
          backgroundColor: domainConfig.accentBg,
          border: `1.5px solid ${domainConfig.accentBorder}`,
          borderRadius: '9999px',
          color: domainConfig.accentColor,
          fontSize: variant === 'compact' ? '0.74rem' : '0.78rem',
          fontWeight: 800,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
        }}
      >
        <CurrentIcon size={13} strokeWidth={2.5} />
        <span>{domainConfig.brandName}</span>
        <ChevronDown
          size={12}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.18s ease',
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '260px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 16px 40px -8px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.04)',
            zIndex: 99999,
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            animation: 'easehubFadeSlideDown 0.15s ease-out forwards',
          }}
        >
          <div
            style={{
              padding: '0.35rem 0.65rem 0.25rem',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Active Domain Home View:
          </div>

          {allDomains.map((d) => {
            const isSelected = currentDomain === d.id;
            const Icon = getDomainIcon(d.id);

            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setDomain(d.id);
                  setIsOpen(false);
                  if (window.location.hash && window.location.hash !== '#home') {
                    window.location.hash = '';
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? d.accentBg : 'transparent',
                  border: isSelected ? `1px solid ${d.accentBorder}` : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.12s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? d.accentColor : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={13} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                      {d.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      {d.subdomains[0]}.easehub.in
                    </div>
                  </div>
                </div>

                {isSelected && <Check size={14} color={d.accentColor} />}
              </button>
            );
          })}

          <div
            style={{
              margin: '0.35rem 0.25rem 0.25rem',
              paddingTop: '0.4rem',
              borderTop: '1px solid #E2E8F0',
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Direct Partner Portals:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
            <a
              href="#pg-portal"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.5rem',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                fontSize: '0.72rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Home size={12} />
              <span>PG Portal</span>
            </a>
            <a
              href="#mess-portal"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.5rem',
                borderRadius: '8px',
                backgroundColor: '#FFFBEB',
                color: '#B45309',
                fontSize: '0.72rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Utensils size={12} />
              <span>Mess Portal</span>
            </a>
            <a
              href="#laundry-portal"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.5rem',
                borderRadius: '8px',
                backgroundColor: '#ECFDF5',
                color: '#047857',
                fontSize: '0.72rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Shirt size={12} />
              <span>Laundry</span>
            </a>
            <a
              href="#admin"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.5rem',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                color: '#334155',
                fontSize: '0.72rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Globe size={12} />
              <span>Admin HQ</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
