import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface ServiceBreadcrumbProps {
  serviceName: string;
  onNavigateHome: () => void;
  onNavigateServices: () => void;
}

export const ServiceBreadcrumb: React.FC<ServiceBreadcrumbProps> = ({
  serviceName,
  onNavigateHome,
  onNavigateServices,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        padding: 'var(--space-4) 0',
      }}
    >
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.45rem',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-display)',
        }}
      >
        <li>
          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              fontFamily: 'inherit',
              transition: 'color var(--duration-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            <Home size={13} />
            <span>Home</span>
          </button>
        </li>

        <li aria-hidden="true" style={{ color: 'var(--color-border-subtle)', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={13} />
        </li>

        <li>
          <button
            type="button"
            onClick={onNavigateServices}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              fontFamily: 'inherit',
              transition: 'color var(--duration-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            Services
          </button>
        </li>

        <li aria-hidden="true" style={{ color: 'var(--color-border-subtle)', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={13} />
        </li>

        <li>
          <span
            aria-current="page"
            style={{
              color: 'var(--color-blue-light)',
              fontWeight: 600,
            }}
          >
            {serviceName}
          </span>
        </li>
      </ol>
    </nav>
  );
};
