import React, { useEffect, useState, useRef } from 'react';

export const AwwwardsCustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Position and physics references for 120 FPS zero-overhead updates
  const mousePosRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const dotPosRef = useRef({ x: -100, y: -100 });
  const velocityRef = useRef({ vx: 0, vy: 0, speed: 0, angle: 0 });
  const scaleRef = useRef({ x: 1, y: 1 });
  const magneticTargetRef = useRef<{ x: number; y: number } | null>(null);

  const ringElementRef = useRef<HTMLDivElement>(null);
  const dotElementRef = useRef<HTMLDivElement>(null);
  const glowElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices or fine pointer absent
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let animationFrameId: number;
    let prevMouse = { x: -100, y: -100 };

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mousePosRef.current = { x: clientX, y: clientY };

      if (!isVisible) setIsVisible(true);

      // Calculate instantaneous mouse velocity and angle for dynamic stretch
      const vx = clientX - prevMouse.x;
      const vy = clientY - prevMouse.y;
      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx);

      velocityRef.current = { vx, vy, speed, angle };
      prevMouse = { x: clientX, y: clientY };

      // Check if hovering interactive target with magnetic snap
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, [role="button"], input, select, .prize-dock-btn, .figma-dock-btn, .awwwards-badge, .awwwards-card-spotlight'
        );

        if (interactive) {
          setIsHovered(true);
          const rect = interactive.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Magnetic attraction: pull cursor ring slightly toward center of small buttons/pills
          if (rect.width < 240 && rect.height < 90) {
            magneticTargetRef.current = {
              x: centerX,
              y: centerY,
            };
          } else {
            magneticTargetRef.current = null;
          }

          const customLabel = interactive.getAttribute('data-cursor-label');
          if (customLabel) {
            setCursorLabel(customLabel);
          } else if (interactive.classList.contains('awwwards-badge')) {
            setCursorLabel('SCORE');
          } else if (interactive.classList.contains('figma-dock-btn')) {
            setCursorLabel('TOOL');
          } else if (interactive.tagName === 'BUTTON' || interactive.getAttribute('role') === 'button') {
            setCursorLabel('TAP');
          } else if (interactive.tagName === 'A') {
            setCursorLabel('OPEN');
          } else {
            setCursorLabel('VIEW');
          }
        } else {
          setIsHovered(false);
          setCursorLabel('');
          magneticTargetRef.current = null;
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // God-level 60-120 FPS physics loop with dynamic squish/stretch & spring decay
    const renderLoop = () => {
      // 1. Target calculations (with magnetic blend if active)
      let targetX = mousePosRef.current.x;
      let targetY = mousePosRef.current.y;

      if (magneticTargetRef.current) {
        // Blend 40% towards center of button
        targetX = targetX * 0.6 + magneticTargetRef.current.x * 0.4;
        targetY = targetY * 0.6 + magneticTargetRef.current.y * 0.4;
      }

      // 2. Inner dot lerp (quick, precise: factor 0.45)
      dotPosRef.current.x += (mousePosRef.current.x - dotPosRef.current.x) * 0.45;
      dotPosRef.current.y += (mousePosRef.current.y - dotPosRef.current.y) * 0.45;

      // 3. Outer ring lerp (fluid spring: factor 0.16)
      ringPosRef.current.x += (targetX - ringPosRef.current.x) * 0.16;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * 0.16;

      // 4. Calculate dynamic velocity elongation
      const speed = velocityRef.current.speed;
      velocityRef.current.speed *= 0.85; // Decay velocity

      const maxStretch = 0.35;
      const stretch = Math.min(speed * 0.008, maxStretch);
      const targetScaleX = 1 + stretch;
      const targetScaleY = 1 - stretch * 0.5;

      scaleRef.current.x += (targetScaleX - scaleRef.current.x) * 0.2;
      scaleRef.current.y += (targetScaleY - scaleRef.current.y) * 0.2;

      // 5. Update transforms directly via CSS for peak GPU acceleration
      if (ringElementRef.current) {
        const rot = velocityRef.current.angle;
        ringElementRef.current.style.transform = `
          translate3d(${ringPosRef.current.x.toFixed(2)}px, ${ringPosRef.current.y.toFixed(2)}px, 0)
          translate(-50%, -50%)
          rotate(${rot}rad)
          scale(${scaleRef.current.x.toFixed(3)}, ${scaleRef.current.y.toFixed(3)})
        `;
      }

      if (dotElementRef.current) {
        dotElementRef.current.style.transform = `
          translate3d(${dotPosRef.current.x.toFixed(2)}px, ${dotPosRef.current.y.toFixed(2)}px, 0)
          translate(-50%, -50%)
        `;
      }

      if (glowElementRef.current) {
        glowElementRef.current.style.transform = `
          translate3d(${dotPosRef.current.x.toFixed(2)}px, ${dotPosRef.current.y.toFixed(2)}px, 0)
          translate(-50%, -50%)
        `;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', onMouseLeave);
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient Radial Spotlight Follower (Subtle background luminance) */}
      <div
        ref={glowElementRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123, 97, 255, 0.08) 0%, rgba(13, 153, 255, 0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'blur(30px)',
          willChange: 'transform',
        }}
      />

      {/* High-Precision Inner Dot */}
      <div
        ref={dotElementRef}
        className="awwwards-cursor-dot"
        style={{
          opacity: isHovered ? 0 : 1,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* God-Level Fluid Outer Ring Follower */}
      <div
        ref={ringElementRef}
        className={`awwwards-cursor-ring ${isHovered ? 'cursor-hovering' : ''}`}
        style={{
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <span
          className="awwwards-cursor-label"
          style={{
            transform: 'rotate(0deg)', // Keep label level
          }}
        >
          {cursorLabel}
        </span>
      </div>
    </>
  );
};
