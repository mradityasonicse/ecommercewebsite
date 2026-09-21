import React, { useRef, useEffect } from 'react';
import easehubMark from '../../assets/easehub-mark.png';

export const HypnoticLogoBackground: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);

  // Throttled, zero-react-render mouse parallax on GPU transform
  useEffect(() => {
    let animFrame: number | null = null;
    const orb = orbRef.current;
    if (!orb) return;

    const onMouseMove = (e: MouseEvent) => {
      if (animFrame !== null) return;
      animFrame = requestAnimationFrame(() => {
        animFrame = null;
        if (!orb) return;
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        const normX = (e.clientX - halfW) / halfW;
        const normY = (e.clientY - halfH) / halfH;
        orb.style.transform = `translate(-50%, -50%) translate3d(${normX * 16}px, ${normY * 16}px, 0) rotateX(${-normY * 8}deg) rotateY(${normX * 8}deg)`;
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animFrame !== null) cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        perspective: '1200px',
        contain: 'strict',
      }}
    >
      {/* 1. Large Central Ambient Hologram Orb & Emblem */}
      <div
        ref={orbRef}
        style={{
          position: 'absolute',
          top: '32%',
          left: '50%',
          width: '560px',
          height: '560px',
          transform: 'translate(-50%, -50%)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ambient Ring 1 */}
        <div
          className="easehub-gpu-ring-1"
          style={{
            position: 'absolute',
            width: '580px',
            height: '580px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(22, 163, 74, 0.12)',
            willChange: 'transform',
          }}
        />

        {/* Ambient Ring 2 */}
        <div
          className="easehub-gpu-ring-2"
          style={{
            position: 'absolute',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            border: '1px solid rgba(250, 204, 21, 0.18)',
            willChange: 'transform',
          }}
        />

        {/* Soft Radial Glow (Pure Gradient - Zero Blur Filter Lag) */}
        <div
          style={{
            position: 'absolute',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, rgba(22, 163, 74, 0.04) 40%, transparent 70%)',
          }}
        />

        {/* Watermark 3D Floating EaseHub Emblem */}
        <div
          style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.07,
            transform: 'translateZ(30px)',
          }}
        >
          <img
            src={easehubMark}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />
        </div>
      </div>

      {/* 2. Secondary Corner Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '4%',
          width: '300px',
          height: '300px',
          opacity: 0.035,
          userSelect: 'none',
        }}
      >
        <img
          src={easehubMark}
          alt=""
          loading="lazy"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      <style>{`
        @keyframes easehub-gpu-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes easehub-gpu-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .easehub-gpu-ring-1 {
          animation: easehub-gpu-spin-cw 60s linear infinite;
        }
        .easehub-gpu-ring-2 {
          animation: easehub-gpu-spin-ccw 50s linear infinite;
        }
      `}</style>
    </div>
  );
};

