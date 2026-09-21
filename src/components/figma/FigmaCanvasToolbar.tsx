import React, { useState, useEffect } from 'react';
import {
  MousePointer,
  Grid,
  Code2,
  Users,
  Compass,
  ChevronDown,
} from 'lucide-react';

export type CanvasGridMode = 'clean' | 'dots' | 'blueprint';

interface FigmaCanvasToolbarProps {
  devMode: boolean;
  onToggleDevMode: () => void;
  multiplayer: boolean;
  onToggleMultiplayer: () => void;
  gridMode: CanvasGridMode;
  onGridModeChange: (mode: CanvasGridMode) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const FigmaCanvasToolbar: React.FC<FigmaCanvasToolbarProps> = ({
  devMode,
  onToggleDevMode,
  multiplayer,
  onToggleMultiplayer,
  gridMode,
  onGridModeChange,
  onNavigateSection,
}) => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isFrameMenuOpen, setIsFrameMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'hand' | 'frame'>('select');

  // Track live mouse coordinates
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCoordinates({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Global hotkeys: D for dev mode, G for grid, M for multiplayer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onToggleDevMode();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        const nextMode = gridMode === 'clean' ? 'dots' : gridMode === 'dots' ? 'blueprint' : 'clean';
        onGridModeChange(nextMode);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onToggleMultiplayer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gridMode, onToggleDevMode, onGridModeChange, onToggleMultiplayer]);

  const scrollToFrame = (id: string) => {
    setIsFrameMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <nav aria-label="Figma Canvas Controls" className="figma-canvas-dock">
        {/* Tool: Move / Select Pointer */}
        <button
          type="button"
          onClick={() => setActiveTool('select')}
          className={`figma-dock-btn ${activeTool === 'select' ? 'active' : ''}`}
          title="Select Tool (V)"
          data-cursor-label="SELECT"
        >
          <MousePointer size={14} />
          <span className="figma-dock-hide-mobile">Move</span>
        </button>

        {/* Frame Navigator Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsFrameMenuOpen(!isFrameMenuOpen)}
            className={`figma-dock-btn ${isFrameMenuOpen ? 'active' : ''}`}
            title="Frame Navigator (F)"
            data-cursor-label="FRAMES"
          >
            <Compass size={14} />
            <span className="figma-dock-hide-mobile">Frames</span>
            <ChevronDown size={12} style={{ opacity: 0.7 }} />
          </button>

          {isFrameMenuOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '44px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '210px',
                backgroundColor: 'rgba(24, 24, 27, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '12px',
                padding: '6px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(16px)',
                zIndex: 9900,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.65rem',
                  color: '#71717A',
                  padding: '4px 8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '4px',
                }}
              >
                PAGE FRAMES (CANVAS)
              </div>
              {[
                { id: 'hero', label: '#01 Hero Living OS' },
                { id: 'services', label: '#02 Core Services' },
                { id: 'campus-bento', label: '#03 Campus Bento' },
                { id: 'bundles', label: '#04 Living Bundles' },
              ].map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => scrollToFrame(frame.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#E4E4E7',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span>{frame.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: '#71717A' }}>FRAME</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="figma-dock-divider" />

        {/* Dev Mode Inspector Toggle */}
        <button
          type="button"
          onClick={onToggleDevMode}
          className={`figma-dock-btn ${devMode ? 'active-dev' : ''}`}
          title="Toggle Figma Dev Mode (Press D)"
          data-cursor-label="DEV MODE"
        >
          <Code2 size={14} />
          <span>Dev Mode</span>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.62rem',
              backgroundColor: devMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              padding: '1px 5px',
              borderRadius: '4px',
            }}
          >
            D
          </span>
        </button>

        {/* Multiplayer Cursors Toggle */}
        <button
          type="button"
          onClick={onToggleMultiplayer}
          className={`figma-dock-btn ${multiplayer ? 'active' : ''}`}
          title="Toggle Multiplayer Cursors (M)"
          data-cursor-label="TEAM"
        >
          <Users size={14} />
          <span className="figma-dock-hide-mobile">Team (3)</span>
        </button>

        {/* Canvas Grid Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextMode = gridMode === 'clean' ? 'dots' : gridMode === 'dots' ? 'blueprint' : 'clean';
            onGridModeChange(nextMode);
          }}
          className={`figma-dock-btn ${gridMode !== 'clean' ? 'active' : ''}`}
          title="Toggle Canvas Grid (G)"
          data-cursor-label="GRID"
        >
          <Grid size={14} />
          <span className="figma-dock-hide-mobile">
            {gridMode === 'clean' ? 'Grid: Off' : gridMode === 'dots' ? 'Dot Grid' : 'Blueprint'}
          </span>
        </button>

        <div className="figma-dock-divider figma-dock-hide-mobile" />

        {/* Live Coordinates Readout */}
        <div className="figma-dock-badge figma-dock-hide-mobile" title="Canvas Pointer Coordinates">
          X: {coordinates.x} Y: {coordinates.y}
        </div>

        {/* Zoom Level Indicator */}
        <div
          className="figma-dock-badge"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '2px 6px',
            fontWeight: 700,
            color: '#E4E4E7',
          }}
          title="Canvas Scale"
        >
          100%
        </div>
      </nav>
    </>
  );
};
