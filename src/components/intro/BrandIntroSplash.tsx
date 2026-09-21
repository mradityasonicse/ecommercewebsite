import React, { useEffect, useState, useRef, useCallback } from 'react';
import easehubMark from '../../assets/easehub-mark.png';
import {
  PgLivingIcon,
  MessCulinaryIcon,
  LaundryAquaIcon,
} from '../icons/ProfessionalCategoryIcons';
import { ArrowRight, Sparkles, X, ShieldCheck, Zap } from 'lucide-react';

interface BrandIntroSplashProps {
  onComplete: () => void;
  autoCloseMs?: number; // Default 7000ms
}

export const BrandIntroSplash: React.FC<BrandIntroSplashProps> = ({
  onComplete,
  autoCloseMs = 7000,
}) => {
  const [phase, setPhase] = useState<'enter' | 'active' | 'open_out'>('enter');
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // 3D Card Gyroscope / Tilt State for God-level Desktop Feel
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  const handleEnterPlatform = useCallback(() => {
    if (phase === 'open_out') return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch {
      // Haptics unavailable
    }
    setPhase('open_out');
    setTimeout(() => {
      onComplete();
    }, 420);
  }, [phase, onComplete]);

  // Handle Entrance Timing and Auto-Enter Progress Bar
  useEffect(() => {
    // 1. Smooth entrance stagger
    const entranceTimer = setTimeout(() => {
      setPhase('active');
    }, 40);

    // 2. High-precision RAF loop for buttery 60/120fps progress bar
    let rafId: number;
    startTimeRef.current = Date.now() - elapsedRef.current;

    const tick = () => {
      if (!isHovered && phase !== 'open_out') {
        const now = Date.now();
        elapsedRef.current = now - startTimeRef.current;
        const pct = Math.min(100, (elapsedRef.current / (autoCloseMs - 350)) * 100);
        setProgress(pct);

        if (elapsedRef.current >= autoCloseMs) {
          handleEnterPlatform();
          return;
        }
      } else {
        // When hovered, pause elapsed timer
        startTimeRef.current = Date.now() - elapsedRef.current;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(entranceTimer);
      cancelAnimationFrame(rafId);
    };
  }, [autoCloseMs, isHovered, phase, handleEnterPlatform]);

  // Keyboard Accessibility: Enter, Space, Escape to launch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handleEnterPlatform();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnterPlatform]);

  // Smooth 3D Mouse Tilt Calculation with Specular Glare
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === 'undefined') return;
    if (window.innerWidth < 768) return; // Disable tilt on mobile for peak performance

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6.5; // Max 6.5deg
    const rotateY = ((x - centerX) / centerX) * 6.5;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
    setIsHovered(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Welcome to EaseHub"
      className="easehub-intro-gateway"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vw, 1.5rem)',
        opacity: phase === 'open_out' ? 0 : 1,
        transform: phase === 'open_out' ? 'scale(1.06)' : 'scale(1)',
        filter: phase === 'open_out' ? 'blur(16px)' : 'none',
        transition: 'opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), filter 0.42s ease',
        overflow: 'hidden',
        userSelect: 'none',
        perspective: '1200px',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* 1. Sunlight Radial Ambient Aura */}
      <div
        style={{
          position: 'absolute',
          width: 'clamp(320px, 90vw, 900px)',
          height: 'clamp(320px, 90vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.12) 0%, rgba(250, 204, 21, 0.15) 38%, rgba(22, 163, 74, 0.05) 65%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          animation: 'easehub-aurora-pulse 5s infinite alternate ease-in-out',
          transform: phase === 'open_out' ? 'scale(1.3)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
      />

      {/* 2. Delicate Green & Yellow Orbit Rings */}
      <div
        style={{
          position: 'absolute',
          width: 'min(78vw, 420px)',
          height: 'min(78vw, 420px)',
          borderRadius: '50%',
          border: '1.5px dashed rgba(22, 163, 74, 0.28)',
          animation: 'easehub-orbit-spin 24s linear infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 'min(94vw, 540px)',
          height: 'min(94vw, 540px)',
          borderRadius: '50%',
          border: '1px solid rgba(250, 204, 21, 0.35)',
          animation: 'easehub-orbit-spin-reverse 32s linear infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 'min(110vw, 680px)',
          height: 'min(110vw, 680px)',
          borderRadius: '50%',
          border: '1px dotted rgba(22, 163, 74, 0.2)',
          animation: 'easehub-orbit-spin 45s linear infinite',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Floating Stardust Particles */}
      <div className="easehub-stardust-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '18%', left: '15%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A', opacity: 0.35, animation: 'easehub-float-p1 6s infinite ease-in-out' }} />
        <div style={{ position: 'absolute', top: '25%', right: '18%', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FACC15', opacity: 0.45, animation: 'easehub-float-p2 7s infinite ease-in-out' }} />
        <div style={{ position: 'absolute', bottom: '22%', left: '22%', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#22C55E', opacity: 0.35, animation: 'easehub-float-p3 8s infinite ease-in-out' }} />
        <div style={{ position: 'absolute', bottom: '16%', right: '20%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EAB308', opacity: 0.4, animation: 'easehub-float-p1 9s infinite ease-in-out' }} />
      </div>

      {/* 4. Top Quick Skip Button */}
      <button
        type="button"
        onClick={handleEnterPlatform}
        aria-label="Skip intro and enter"
        style={{
          position: 'absolute',
          top: 'clamp(1rem, 3vw, 2rem)',
          right: 'clamp(1rem, 3vw, 2rem)',
          zIndex: 10,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.95rem',
          borderRadius: '9999px',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          boxShadow: '0 2px 8px rgba(15, 81, 50, 0.08)',
          color: '#334155',
          fontSize: '0.78rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F8FAF7';
          e.currentTarget.style.borderColor = '#16A34A';
          e.currentTarget.style.color = '#15803D';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.borderColor = 'rgba(22, 163, 74, 0.25)';
          e.currentTarget.style.color = '#334155';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span>Skip</span>
        <X size={13} />
      </button>

      {/* 5. Centered Masterpiece Gateway Card */}
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: 'min(92vw, 520px)',
          maxHeight: 'min(92vh, 740px)',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: 'clamp(20px, 4vw, 30px)',
          border: '1.5px solid rgba(22, 163, 74, 0.22)',
          padding: 'clamp(1.4rem, 3.8vw, 2.5rem) clamp(1.1rem, 3.8vw, 2.2rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 60px -10px rgba(15, 81, 50, 0.12), 0 0 35px rgba(250, 204, 21, 0.08)',
          transform:
            phase === 'enter'
              ? 'scale(0.88) translateY(35px)'
              : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0)`,
          opacity: phase === 'enter' ? 0 : 1,
          transition:
            phase === 'enter'
              ? 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease',
          zIndex: 2,
          scrollbarWidth: 'none',
        }}
      >
        {/* Dynamic Specular Sheen on Desktop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(22, 163, 74, 0.06) 0%, transparent 65%)`,
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Floating 3D Emblem Container */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(74px, 12vw, 92px)',
            height: 'clamp(74px, 12vw, 92px)',
            borderRadius: '24px',
            background: '#FFFFFF',
            border: '2px solid rgba(22, 163, 74, 0.25)',
            boxShadow: '0 12px 28px rgba(15, 81, 50, 0.1), 0 0 30px rgba(250, 204, 21, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(10px, 2vw, 14px)',
            marginBottom: 'clamp(0.9rem, 2vw, 1.25rem)',
            animation: 'easehub-emblem-float 3.5s ease-in-out infinite',
            flexShrink: 0,
          }}
        >
          {/* Luminous Core Glow around Logo */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.3), rgba(250, 204, 21, 0.35))',
              filter: 'blur(12px)',
              opacity: 0.8,
              zIndex: -1,
            }}
          />

          <img
            src={easehubMark}
            alt="EaseHub Logo"
            onError={(e) => {
              if (e.currentTarget.src !== window.location.origin + '/easehub-mark.png') {
                e.currentTarget.src = '/easehub-mark.png';
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(22, 163, 74, 0.15))',
            }}
          />
        </div>

        {/* Live Campus Operating System Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem clamp(0.6rem, 1.5vw, 0.85rem)',
            borderRadius: '9999px',
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            marginBottom: 'clamp(0.6rem, 1.5vw, 0.85rem)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              display: 'inline-block',
              boxShadow: '0 0 6px rgba(22, 163, 74, 0.6)',
              animation: 'easehub-live-blink 2s infinite',
            }}
          />
          <span
            style={{
              fontSize: 'clamp(0.64rem, 1.6vw, 0.72rem)',
              fontWeight: 800,
              color: '#15803D',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            CAMPUS OPERATING SYSTEM
          </span>
        </div>

        {/* Dynamic Brand Title */}
        <h1
          style={{
            margin: '0 0 0.4rem 0',
            fontSize: 'clamp(2.1rem, 6.2vw, 3.2rem)',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#0F172A',
            lineHeight: 1.05,
            flexShrink: 0,
          }}
        >
          EASE<span style={{ color: '#EAB308' }}>HUB</span>
        </h1>

        {/* Editorial Subtitle */}
        <p
          style={{
            margin: '0 0 clamp(1rem, 2.5vw, 1.4rem) 0',
            fontSize: 'clamp(0.82rem, 2vw, 0.92rem)',
            color: '#475569',
            lineHeight: 1.55,
            maxWidth: '430px',
            flexShrink: 0,
          }}
        >
          Your all-in-one student living network for Rungta, BIT &amp; Bhilai campuses. Verified accommodations, pure veg mess, &amp; doorstep laundry.
        </p>

        {/* 3 Core Service Pillar Chips (Auto-Wrapping & Responsive) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(0.4rem, 1.5vw, 0.6rem)',
            flexWrap: 'wrap',
            marginBottom: 'clamp(1.2rem, 3vw, 1.65rem)',
            width: '100%',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem clamp(0.55rem, 1.5vw, 0.75rem)',
              borderRadius: '9999px',
              backgroundColor: '#DCFCE7',
              border: '1px solid #86EFAC',
              color: '#15803D',
              fontSize: 'clamp(0.72rem, 1.8vw, 0.78rem)',
              fontWeight: 700,
            }}
          >
            <PgLivingIcon size={14} color="#15803D" secondaryColor="#16A34A" />
            Verified PGs
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem clamp(0.55rem, 1.5vw, 0.75rem)',
              borderRadius: '9999px',
              backgroundColor: '#FEF08A',
              border: '1px solid #FDE047',
              color: '#854D0E',
              fontSize: 'clamp(0.72rem, 1.8vw, 0.78rem)',
              fontWeight: 700,
            }}
          >
            <MessCulinaryIcon size={14} color="#854D0E" secondaryColor="#CA8A04" />
            Daily Mess
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem clamp(0.55rem, 1.5vw, 0.75rem)',
              borderRadius: '9999px',
              backgroundColor: '#EFF5EC',
              border: '1px solid rgba(22, 163, 74, 0.28)',
              color: '#15803D',
              fontSize: 'clamp(0.72rem, 1.8vw, 0.78rem)',
              fontWeight: 700,
            }}
          >
            <LaundryAquaIcon size={14} color="#15803D" secondaryColor="#16A34A" />
            Doorstep Laundry
          </span>
        </div>

        {/* Primary Enter Action Button (Tactile 3D Feedback) */}
        <button
          type="button"
          onClick={handleEnterPlatform}
          onMouseDown={() => setIsButtonPressed(true)}
          onMouseUp={() => setIsButtonPressed(false)}
          onTouchStart={() => setIsButtonPressed(true)}
          onTouchEnd={() => setIsButtonPressed(false)}
          style={{
            width: '100%',
            padding: 'clamp(0.85rem, 2.5vw, 1.05rem) clamp(1.2rem, 3vw, 1.75rem)',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: 'clamp(0.92rem, 2.2vw, 1.02rem)',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            boxShadow: isButtonPressed
              ? '0 4px 12px rgba(21, 128, 61, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
              : '0 12px 28px -4px rgba(22, 163, 74, 0.45)',
            transform: isButtonPressed ? 'scale(0.97)' : 'scale(1)',
            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!isButtonPressed) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 16px 36px -4px rgba(22, 163, 74, 0.55)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(22, 163, 74, 0.45)';
          }}
        >
          <Sparkles size={18} style={{ color: '#FEF08A' }} />
          <span>Enter EaseHub Campus Platform</span>
          <ArrowRight size={18} style={{ transition: 'transform 0.2s ease' }} />
        </button>

        {/* High Precision Smooth Progress Loading Bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#EFF5EC',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: 'clamp(0.9rem, 2vw, 1.25rem)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #16A34A, #FACC15, #15803D)',
              borderRadius: '9999px',
              transition: isHovered ? 'none' : 'width 0.05s linear',
            }}
          />
        </div>

        {/* Footer Meta Row with Hover Pause Indicator */}
        <div
          style={{
            fontSize: 'clamp(0.68rem, 1.8vw, 0.74rem)',
            color: '#64748B',
            marginTop: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexShrink: 0,
            gap: '0.5rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: isHovered ? '#B45309' : '#64748B', transition: 'color 0.2s ease' }}>
            {isHovered ? (
              <>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#EAB308' }} />
                Timer paused — click anytime
              </>
            ) : (
              <>
                <Zap size={12} color="#16A34A" />
                Auto-launching in a moment...
              </>
            )}
          </span>
          <span style={{ color: '#334155', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={13} color="#16A34A" />
            Zero Brokerage
          </span>
        </div>
      </div>

      {/* Global CSS for Animations & Keyframes */}
      <style>{`
        @keyframes easehub-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes easehub-orbit-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes easehub-emblem-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-7px) scale(1.025); }
        }
        @keyframes easehub-aurora-pulse {
          0% { transform: scale(0.92); opacity: 0.65; }
          100% { transform: scale(1.10); opacity: 0.95; }
        }
        @keyframes easehub-live-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes easehub-float-p1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-18px) translateX(8px); opacity: 0.85; }
        }
        @keyframes easehub-float-p2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-24px) translateX(-10px); opacity: 0.9; }
        }
        @keyframes easehub-float-p3 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.35; }
          50% { transform: translateY(-15px) translateX(12px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
