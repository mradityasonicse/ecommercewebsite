import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, X, RotateCw, Wifi } from 'lucide-react';

interface MobilePreviewContainerProps {
  children: React.ReactNode;
}

export const MobilePreviewContainer: React.FC<MobilePreviewContainerProps> = ({ children }) => {
  const [isMobileMode, setIsMobileMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('easehub_mobile_mode') === 'true';
    }
    return false;
  });

  const [devicePreset, setDevicePreset] = useState<'iphone' | 'android'>('android');
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Listen to custom toggle events from Navbar or any button
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled?: boolean }>;
      setIsMobileMode((prev) => {
        const next = customEvent.detail?.enabled !== undefined ? customEvent.detail.enabled : !prev;
        sessionStorage.setItem('easehub_mobile_mode', String(next));
        return next;
      });
    };

    window.addEventListener('easehub:toggle-mobile-view', handleToggle);
    return () => window.removeEventListener('easehub:toggle-mobile-view', handleToggle);
  }, []);

  const toggleMobileMode = () => {
    setIsMobileMode((prev) => {
      const next = !prev;
      sessionStorage.setItem('easehub_mobile_mode', String(next));
      return next;
    });
  };

  // On real mobile devices (< 768px), don't wrap in device chassis
  const [isRealMobile, setIsRealMobile] = useState<boolean>(false);
  useEffect(() => {
    const checkWidth = () => {
      setIsRealMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Manage body scroll and class when simulator is open
  useEffect(() => {
    if (isMobileMode && !isRealMobile) {
      document.body.classList.add('mobile-preview-active');
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.classList.remove('mobile-preview-active');
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.classList.remove('mobile-preview-active');
    }
  }, [isMobileMode, isRealMobile]);

  if (isRealMobile || !isMobileMode) {
    return <>{children}</>;
  }

  const deviceWidth = devicePreset === 'iphone' ? 390 : 412;
  const targetWidth = isLandscape ? 780 : deviceWidth;
  const targetHeight = isLandscape ? 400 : 844;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#090D16',
        backgroundImage: 'radial-gradient(ellipse at center, #1E293B 0%, #090D16 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.85rem 0.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Top Floating Control Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#1E293B',
          border: '1.5px solid #334155',
          borderRadius: '16px',
          padding: '0.5rem 1rem',
          marginBottom: '1rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Smartphone size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>
              One-Tap Mobile View Active
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
              {devicePreset === 'iphone' ? 'Apple iPhone 16 (390px)' : 'Google Pixel / Android (412px)'}
            </div>
          </div>
        </div>

        {/* Preset Switcher & Rotate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => setDevicePreset('android')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: devicePreset === 'android' ? '#15803D' : '#0F172A',
              color: devicePreset === 'android' ? '#FFFFFF' : '#94A3B8',
              border: devicePreset === 'android' ? '1.5px solid #86EFAC' : '1px solid #334155',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Android (412px)
          </button>
          <button
            type="button"
            onClick={() => setDevicePreset('iphone')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: devicePreset === 'iphone' ? '#15803D' : '#0F172A',
              color: devicePreset === 'iphone' ? '#FFFFFF' : '#94A3B8',
              border: devicePreset === 'iphone' ? '1.5px solid #86EFAC' : '1px solid #334155',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            iPhone (390px)
          </button>
          <button
            type="button"
            onClick={() => setIsLandscape(!isLandscape)}
            title="Rotate Device"
            style={{
              padding: '0.35rem 0.55rem',
              borderRadius: '8px',
              backgroundColor: '#0F172A',
              color: '#94A3B8',
              border: '1px solid #334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Exit to Full Desktop */}
        <button
          type="button"
          onClick={toggleMobileMode}
          style={{
            padding: '0.4rem 0.95rem',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
          }}
        >
          <Monitor size={14} />
          <span>Exit to Full Desktop</span>
          <X size={14} />
        </button>
      </div>

      {/* Smartphone Chassis Frame */}
      <div
        style={{
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          maxHeight: 'calc(100vh - 90px)',
          borderRadius: '44px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 0 12px #1E293B, 0 0 0 14px #475569',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transform: 'translateZ(0)',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Smartphone Hardware Status Bar (Dedicated Safe Area) */}
        <div
          style={{
            height: '42px',
            backgroundColor: '#090D16',
            color: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            fontSize: '11px',
            fontWeight: 800,
            userSelect: 'none',
            flexShrink: 0,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            zIndex: 99999,
          }}
        >
          {/* Time */}
          <span style={{ letterSpacing: '0.02em', color: '#F1F5F9' }}>9:41</span>

          {/* Centered Dynamic Island / Speaker Notch Bar */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '105px',
              height: '24px',
              backgroundColor: '#000000',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              boxSizing: 'border-box',
              pointerEvents: 'none',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E293B' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
          </div>

          {/* Connectivity Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>5G</span>
            <Wifi size={13} strokeWidth={2.5} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.2px solid #CBD5E1',
                borderRadius: '3px',
                padding: '1px 2px',
                height: '10px',
                width: '16px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: '9px', height: '5px', backgroundColor: '#10B981', borderRadius: '1px' }} />
            </div>
          </div>
        </div>

        {/* Scrollable Mobile App Surface */}
        <div
          id="easehub-mobile-simulator-viewport"
          style={{
            flex: 1,
            height: 'calc(100% - 42px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            backgroundColor: '#FFFFFF',
          }}
        >
          {children}
        </div>

        {/* Bottom Smartphone Indicator Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '110px',
            height: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '9999px',
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};
