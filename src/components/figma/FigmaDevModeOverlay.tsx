import React, { useEffect, useState } from 'react';
import { Code, Copy, Check, X } from 'lucide-react';

interface ElementInfo {
  tag: string;
  className: string;
  width: number;
  height: number;
  top: number;
  left: number;
  display: string;
  gap: string;
  padding: string;
  borderRadius: string;
  color: string;
  backgroundColor: string;
}

interface FigmaDevModeOverlayProps {
  enabled: boolean;
  onClose: () => void;
}

export const FigmaDevModeOverlay: React.FC<FigmaDevModeOverlayProps> = ({ enabled, onClose }) => {
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<ElementInfo | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<ElementInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setHoveredRect(null);
      setHoveredInfo(null);
      setSelectedInfo(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('.figma-canvas-dock') || target.closest('.figma-inspector-panel') || target.closest('.awwwards-badge-wrap')) {
        return;
      }

      const rect = target.getBoundingClientRect();
      const style = window.getComputedStyle(target);

      setHoveredRect(rect);
      setHoveredInfo({
        tag: target.tagName.toLowerCase(),
        className: target.className && typeof target.className === 'string' ? target.className.split(' ')[0] : 'element',
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        display: style.display,
        gap: style.gap !== 'normal' ? style.gap : '0px',
        padding: style.padding,
        borderRadius: style.borderRadius,
        color: style.color,
        backgroundColor: style.backgroundColor,
      });
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('.figma-canvas-dock') || target.closest('.figma-inspector-panel') || target.closest('.awwwards-badge-wrap')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      const rect = target.getBoundingClientRect();
      const style = window.getComputedStyle(target);
      setSelectedInfo({
        tag: target.tagName.toLowerCase(),
        className: target.className && typeof target.className === 'string' ? target.className.split(' ')[0] : 'element',
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        display: style.display,
        gap: style.gap !== 'normal' ? style.gap : '0px',
        padding: style.padding,
        borderRadius: style.borderRadius,
        color: style.color,
        backgroundColor: style.backgroundColor,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick, true);
    };
  }, [enabled]);

  const copyCss = () => {
    if (!selectedInfo) return;
    const css = `/* Figma Dev Mode Inspect */
.${selectedInfo.className || selectedInfo.tag} {
  display: ${selectedInfo.display};
  width: ${selectedInfo.width}px;
  height: ${selectedInfo.height}px;
  border-radius: ${selectedInfo.borderRadius};
  padding: ${selectedInfo.padding};
  gap: ${selectedInfo.gap};
  background: ${selectedInfo.backgroundColor};
}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!enabled) return null;

  return (
    <>
      {/* Dev Mode Floating Banner */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9950,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          border: '1px solid #00C980',
          borderRadius: '9999px',
          padding: '6px 18px',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          fontWeight: 600,
          boxShadow: '0 8px 30px rgba(0, 201, 128, 0.25)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#00C980',
            boxShadow: '0 0 10px #00C980',
          }}
        />
        <span style={{ color: '#00C980', fontWeight: 800 }}>FIGMA DEV MODE</span>
        <span style={{ color: '#94A3B8' }}>•</span>
        <span>Click any element to inspect auto-layout & CSS</span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            marginLeft: '4px',
          }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Hover Bounding Box */}
      {hoveredRect && hoveredInfo && (
        <div
          style={{
            position: 'fixed',
            top: `${hoveredRect.top}px`,
            left: `${hoveredRect.left}px`,
            width: `${hoveredRect.width}px`,
            height: `${hoveredRect.height}px`,
            border: '1.5px solid #0D99FF',
            backgroundColor: 'rgba(13, 153, 255, 0.05)',
            pointerEvents: 'none',
            zIndex: 9940,
            transition: 'all 0.05s ease',
          }}
        >
          {/* Top Tag */}
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: 0,
              backgroundColor: '#0D99FF',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{hoveredInfo.tag}</span>
            <span>•</span>
            <span>{hoveredInfo.width} × {hoveredInfo.height}</span>
            <span>•</span>
            <span style={{ color: '#BFDBFE' }}>gap: {hoveredInfo.gap}</span>
          </div>

          {/* Corner Resize Handles */}
          <div style={{ position: 'absolute', top: -3, left: -3, width: 6, height: 6, background: '#FFFFFF', border: '1px solid #0D99FF' }} />
          <div style={{ position: 'absolute', top: -3, right: -3, width: 6, height: 6, background: '#FFFFFF', border: '1px solid #0D99FF' }} />
          <div style={{ position: 'absolute', bottom: -3, left: -3, width: 6, height: 6, background: '#FFFFFF', border: '1px solid #0D99FF' }} />
          <div style={{ position: 'absolute', bottom: -3, right: -3, width: 6, height: 6, background: '#FFFFFF', border: '1px solid #0D99FF' }} />
        </div>
      )}

      {/* Selected Element Property Inspector (Figma Style) */}
      {selectedInfo && (
        <aside
          aria-label="Figma Properties Inspector"
          className="figma-inspector-panel"
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            width: '320px',
            backgroundColor: '#1E1E24',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '1.25rem',
            color: '#F4F4F5',
            zIndex: 9960,
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            animation: 'easehubSlideInRight 0.2s ease',
          }}
        >
          {/* Panel Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} color="#00C980" />
              <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Figma Inspect</span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.65rem', backgroundColor: '#00C980', color: '#092116', padding: '1px 5px', borderRadius: '3px', fontWeight: 800 }}>CSS</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedInfo(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A1A1AA',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Component Name */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#71717A', textTransform: 'uppercase', fontFamily: 'var(--font-mono, monospace)', marginBottom: '0.25rem' }}>Component / Node</div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0D99FF' }}>
              &lt;{selectedInfo.tag}&gt; <span style={{ color: '#A1A1AA', fontWeight: 400 }}>.{selectedInfo.className}</span>
            </div>
          </div>

          {/* Geometry Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#71717A' }}>WIDTH</span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>{selectedInfo.width}px</div>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#71717A' }}>HEIGHT</span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>{selectedInfo.height}px</div>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#71717A' }}>AUTO-LAYOUT</span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: '#00C980' }}>{selectedInfo.display}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#71717A' }}>RADIUS</span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>{selectedInfo.borderRadius || '0px'}</div>
            </div>
          </div>

          {/* Spacing & Gap */}
          <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: '#CBD5E1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: '#71717A' }}>Gap:</span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>{selectedInfo.gap}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717A' }}>Padding:</span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>{selectedInfo.padding}</span>
            </div>
          </div>

          {/* Copy CSS Button */}
          <button
            type="button"
            onClick={copyCss}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.6rem',
              borderRadius: '8px',
              backgroundColor: copied ? '#00C980' : '#0D99FF',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'CSS Copied to Clipboard!' : 'Copy Code Snippet'}</span>
          </button>
        </aside>
      )}
    </>
  );
};
