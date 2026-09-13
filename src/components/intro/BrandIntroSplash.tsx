import React, { useEffect, useState } from 'react';

interface BrandIntroSplashProps {
  onComplete: () => void;
  durationMs?: number;
}

export const BrandIntroSplash: React.FC<BrandIntroSplashProps> = ({
  onComplete,
  durationMs = 2000,
}) => {
  const [phase, setPhase] = useState<'enter' | 'active' | 'exit'>('enter');

  useEffect(() => {
    // 1. Entrance to active state
    const t1 = setTimeout(() => {
      setPhase('active');
    }, 80);

    // 2. Begin exit animation
    const t2 = setTimeout(() => {
      setPhase('exit');
    }, durationMs - 400);

    // 3. Complete and unmount
    const t3 = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    setPhase('exit');
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      role="dialog"
      aria-label="Welcome to EaseHub"
      className="easehub-intro-splash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#0A1326', // Deep Collegiate Midnight
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24, 76, 180, 0.28) 0%, rgba(250, 201, 8, 0.08) 45%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          animation: 'easehub-pulse-glow 2s infinite alternate ease-in-out',
        }}
      />

      {/* Main Logo & Wordmark Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.25rem',
          transform: phase === 'enter' ? 'translateY(18px) scale(0.92)' : 'translateY(0) scale(1)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Animated Emblem Logo Mark with Halo */}
        <div
          style={{
            position: 'relative',
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            backgroundColor: '#112758',
            border: '2px solid rgba(250, 201, 8, 0.45)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(250, 201, 8, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}
        >
          <img
            src="/easehub-mark.png"
            alt="EaseHub Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
            }}
          />
        </div>

        {/* Brand Name Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
              fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              lineHeight: 1,
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            }}
          >
            EASE<span style={{ color: '#FAC908' }}>HUB</span>
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.72rem, 1.6vw, 0.88rem)',
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            PG • LAUNDRY • MESS • &amp; MORE
          </p>
        </div>

        {/* Subtle Loading Accent Bar */}
        <div
          style={{
            width: '140px',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '0.75rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FAC908',
              borderRadius: '9999px',
              animation: 'easehub-load-slide 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
        </div>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        style={{
          position: 'absolute',
          bottom: '2rem',
          backgroundColor: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '9999px',
          color: 'rgba(255, 255, 255, 0.65)',
          padding: '0.45rem 1.15rem',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-body, sans-serif)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          letterSpacing: '0.04em',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Skip Intro &rarr;
      </button>

      <style>{`
        @keyframes easehub-pulse-glow {
          0% { transform: scale(0.92); opacity: 0.7; }
          100% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes easehub-load-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
