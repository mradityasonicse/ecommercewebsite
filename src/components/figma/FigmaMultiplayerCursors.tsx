import React, { useEffect, useState, useRef } from 'react';

interface CursorState {
  id: string;
  name: string;
  role: string;
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotation: number;
  message?: string;
  speed: number;
}

interface FigmaMultiplayerCursorsProps {
  enabled: boolean;
}

export const FigmaMultiplayerCursors: React.FC<FigmaMultiplayerCursorsProps> = ({ enabled }) => {
  const [cursors, setCursors] = useState<CursorState[]>([
    {
      id: 'aditya',
      name: 'Aditya',
      role: 'Design Lead',
      color: '#7B61FF',
      x: 320,
      y: 280,
      targetX: 320,
      targetY: 280,
      rotation: 0,
      speed: 0.045,
      message: 'Inspecting campus layout ✨',
    },
    {
      id: 'sneha',
      name: 'Sneha',
      role: 'Campus Scout',
      color: '#00C980',
      x: 780,
      y: 390,
      targetX: 780,
      targetY: 390,
      rotation: 0,
      speed: 0.038,
      message: 'Verified 24 new PG rooms!',
    },
    {
      id: 'rahul',
      name: 'Rahul',
      role: 'Hostel Ops',
      color: '#FF7262',
      x: 540,
      y: 520,
      targetX: 540,
      targetY: 520,
      rotation: 0,
      speed: 0.052,
      message: 'Checking night canteen 🍕',
    },
  ]);

  const cursorsRef = useRef(cursors);
  cursorsRef.current = cursors;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let animId: number;
    let time = 0;

    const messages = [
      'Inspecting campus layout ✨',
      'Verified 24 new PG rooms!',
      'Checking night canteen 🍕',
      'Laundry same-day slots synced 👕',
      '0% Brokerage verified 🛡️',
      'Figma tokens linked to code',
    ];

    const updateLoop = () => {
      time += 0.012;
      const width = window.innerWidth;
      const height = window.innerHeight;

      setCursors((prev) =>
        prev.map((c, idx) => {
          let targetX = c.targetX;
          let targetY = c.targetY;

          // Organic harmonic trajectory
          if (idx === 0) {
            targetX = width * 0.35 + Math.sin(time * 1.1) * (width * 0.22) + Math.cos(time * 0.5) * 60;
            targetY = height * 0.38 + Math.cos(time * 0.9) * 140;
          } else if (idx === 1) {
            targetX = width * 0.68 + Math.cos(time * 0.8) * (width * 0.18) + Math.sin(time * 0.4) * 80;
            targetY = height * 0.48 + Math.sin(time * 1.2) * 130;
          } else {
            targetX = width * 0.5 + Math.sin(time * 0.95) * (width * 0.24);
            targetY = height * 0.62 + Math.cos(time * 1.05) * 110;
          }

          // Smooth exponential spring lerp
          const lerpFactor = c.speed;
          const newX = c.x + (targetX - c.x) * lerpFactor;
          const newY = c.y + (targetY - c.y) * lerpFactor;

          // Subtle bank angle based on horizontal velocity
          const dx = newX - c.x;
          const targetRot = Math.max(-14, Math.min(14, dx * 3.5));
          const newRot = c.rotation + (targetRot - c.rotation) * 0.15;

          // Dynamic periodic status updates
          const showMessage = Math.sin(time * 0.8 + idx * 2.5) > 0.4;
          const message = showMessage ? messages[(Math.floor(time * 0.25) + idx) % messages.length] : undefined;

          return {
            ...c,
            x: newX,
            y: newY,
            targetX,
            targetY,
            rotation: newRot,
            message,
          };
        })
      );

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none' }}>
      {cursors.map((c) => (
        <div
          key={c.id}
          className="figma-remote-cursor"
          style={{
            transform: `translate3d(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px, 0)`,
            willChange: 'transform',
          }}
        >
          {/* Figma Arrow Pointer with dynamic banking rotation */}
          <svg
            className="figma-cursor-pointer"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: `rotate(${c.rotation.toFixed(1)}deg)`,
              transformOrigin: '0 0',
              transition: 'transform 0.1s ease-out',
            }}
          >
            <path
              d="M0.5 0.5L6.5 15.5L9.5 9.5L15.5 6.5L0.5 0.5Z"
              fill={c.color}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>

          {/* User Name & Role Pill */}
          <div
            className="figma-cursor-pill"
            style={{
              backgroundColor: c.color,
            }}
          >
            <span>{c.name}</span>
            <span style={{ opacity: 0.8, fontSize: '0.6rem', fontWeight: 500 }}>({c.role})</span>
          </div>

          {/* Live Message Bubble */}
          {c.message && (
            <div className="figma-cursor-chat-bubble">
              <span>{c.message}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
