import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// --- Avatar ---
export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Student',
  size = 'md',
  status,
  className = '',
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { size: 28, font: '0.75rem' };
      case 'lg': return { size: 44, font: '1.1rem' };
      case 'xl': return { size: 56, font: '1.35rem' };
      case 'md': default: return { size: 36, font: '0.875rem' };
    }
  };

  const { size: dimension, font } = getDimensions();

  const getInitials = (n: string) => {
    return n.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  };

  const getStatusColor = () => {
    if (status === 'online') return 'var(--color-semantic-success)';
    if (status === 'busy') return 'var(--color-brand-red)';
    return 'var(--color-text-muted)';
  };

  return (
    <div
      className={`easehub-avatar ${className}`}
      style={{
        position: 'relative',
        width: `${dimension}px`,
        height: `${dimension}px`,
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--color-surface-3)',
        border: '1px solid var(--color-border-default)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        flexShrink: 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-pill)',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: font,
            color: 'var(--color-text-primary)',
          }}
        >
          {getInitials(name)}
        </span>
      )}

      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: `${Math.max(dimension / 3.5, 8)}px`,
            height: `${Math.max(dimension / 3.5, 8)}px`,
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            border: '2px solid var(--color-bg-primary)',
          }}
        />
      )}
    </div>
  );
};

// --- Skeleton ---
export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'pill';
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  radius = 'sm',
  className = '',
  style = {},
}) => {
  const getRadius = () => {
    switch (radius) {
      case 'xs': return 'var(--radius-xs)';
      case 'md': return 'var(--radius-md)';
      case 'lg': return 'var(--radius-lg)';
      case 'pill': return 'var(--radius-pill)';
      case 'sm': default: return 'var(--radius-sm)';
    }
  };

  return (
    <div
      className={`easehub-skeleton ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: getRadius(),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.03) 100%)',
        backgroundSize: '200% 100%',
        animation: 'easehubShimmer 1.8s infinite linear',
        ...style,
      }}
    >
      <style>{`
        @keyframes easehubShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

// --- Spinner ---
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'var(--color-brand-blue)',
}) => {
  const getDimension = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 32;
      case 'md': default: return 22;
    }
  };
  const dim = getDimension();

  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: `${dim}px`,
        height: `${dim}px`,
        border: `2.5px solid rgba(255, 255, 255, 0.15)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'easehubSpin 0.7s linear infinite',
      }}
    />
  );
};

// --- Tooltip ---
export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [visible, setVisible] = useState(false);

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'bottom':
        return { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' };
      case 'top':
      default:
        return { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 100,
            whiteSpace: 'nowrap',
            padding: '0.3rem 0.6rem',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            fontSize: 'var(--text-caption)',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--color-border-strong)',
            boxShadow: 'var(--shadow-md)',
            pointerEvents: 'none',
            animation: 'easehubFadeIn 0.15s ease-out',
            ...getPositionStyles(),
          }}
        >
          {content}
        </div>
      )}
      <style>{`
        @keyframes easehubFadeIn {
          from { opacity: 0; transform: translate(-50%, 2px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

// --- Toast ---
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="var(--color-semantic-success)" />;
      case 'error': return <XCircle size={18} color="var(--color-semantic-error)" />;
      case 'warning': return <AlertTriangle size={18} color="var(--color-semantic-warning)" />;
      case 'info': default: return <Info size={18} color="var(--color-semantic-info)" />;
    }
  };

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-surface-2)',
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: '280px',
        maxWidth: '400px',
      }}
    >
      <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <h6 style={{ margin: 0, fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {title}
        </h6>
        {message && (
          <p style={{ margin: '0.2rem 0 0', fontSize: 'var(--text-caption)', color: 'var(--color-text-secondary)' }}>
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss toast"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

// --- Tabs ---
export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
}) => {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: variant === 'pill' ? '0.35rem' : '1.5rem',
        borderBottom: variant === 'underline' ? '1px solid var(--color-border-default)' : 'none',
        backgroundColor: variant === 'pill' ? 'var(--color-surface-1)' : 'transparent',
        padding: variant === 'pill' ? '0.3rem' : '0',
        borderRadius: variant === 'pill' ? 'var(--radius-md)' : '0',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: variant === 'pill' ? '0.4rem 0.85rem' : '0.65rem 0.2rem',
              borderRadius: variant === 'pill' ? 'var(--radius-sm)' : '0',
              backgroundColor: variant === 'pill' && isActive ? 'var(--color-brand-blue)' : 'transparent',
              color: isActive ? (variant === 'pill' ? '#FFFFFF' : 'var(--color-brand-blue)') : 'var(--color-text-secondary)',
              border: 'none',
              borderBottom: variant === 'underline' && isActive ? '2px solid var(--color-brand-blue)' : '2px solid transparent',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-body-xs)',
              fontWeight: 600,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.4 : 1,
              transition: 'all var(--duration-fast) var(--ease-standard)',
              outline: 'none',
            }}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: isActive && variant === 'pill' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  color: isActive && variant === 'pill' ? '#FFFFFF' : 'var(--color-text-muted)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// --- Breadcrumb ---
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: 'var(--text-body-xs)',
          fontFamily: 'var(--font-display)',
        }}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              {isLast ? (
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color var(--duration-fast)' }}
                >
                  {item.label}
                </a>
              )}
              {!isLast && <span style={{ color: 'var(--color-text-disabled)' }}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
