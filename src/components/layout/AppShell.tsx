import React from 'react';
import { type Campus } from '../../data/campuses';
import { Navbar } from '../navigation/Navbar';
import { Footer } from './Footer';
import { ScrollProgress } from '../motion/ScrollProgress';
import { PageTransition } from '../motion/PageTransition';
import { MobileBottomBar } from '../navigation/MobileBottomBar';
import { HypnoticLogoBackground } from '../effects/HypnoticLogoBackground';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export interface AppShellProps {
  children: React.ReactNode;
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
  onOpenTracker?: () => void;
  onOpenNotifications?: () => void;
  onNavigateServices?: () => void;
  onNavigateAccount?: () => void;
  onNavigateHome?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen,
  onPartnerOpen,
  onOpenTracker,
  onOpenNotifications,
  onNavigateServices,
  onNavigateAccount,
  onNavigateHome,
  className = '',
  style = {},
}) => {
  // Ultra-smooth momentum scroll
  useSmoothScroll(true);

  return (
    <div
      className={`easehub-app-shell ${className}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        ...style,
      }}
    >
      {/* Editorial Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Awwwards & Behance Organic Fine Film Grain Layer */}
      <div className="awwwards-grain" aria-hidden="true" />

      {/* Option 1: Multi-Layered Atmospheric Ambient Mesh Glow Orbs (Pure Gradient, Zero Blur Lag) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <div
          className="easehub-mesh-orb-1"
          style={{
            position: 'absolute',
            top: '6%',
            left: '10%',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.02) 45%, transparent 70%)',
          }}
        />
        <div
          className="easehub-mesh-orb-2"
          style={{
            position: 'absolute',
            top: '42%',
            right: '6%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.07) 0%, rgba(250, 204, 21, 0.02) 45%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '76%',
            left: '18%',
            width: '580px',
            height: '580px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22, 163, 74, 0.04) 0%, rgba(22, 163, 74, 0.01) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Hypnotic 3D Interactive EaseHub Logo Watermark & Orbital Aura Background */}
      <HypnoticLogoBackground />

      {/* Global Responsive Navigation Header */}
      <Navbar
        selectedCampus={selectedCampus}
        onCampusChange={onCampusChange}
        onRequestCampusOpen={onRequestCampusOpen}
        onPartnerOpen={onPartnerOpen}
        onOpenTracker={onOpenTracker}
      />

      {/* Main Page Landmark */}
      <main
        id="main-content"
        tabIndex={-1}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          paddingTop: '56px',
        }}
      >
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Global Comprehensive Footer */}
      <Footer
        onPartnerOpen={onPartnerOpen}
        onRequestCampusOpen={onRequestCampusOpen}
      />

      {/* Native-feel Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        onOpenTracker={onOpenTracker}
        onOpenNotifications={onOpenNotifications}
        onNavigateHome={onNavigateHome}
        onNavigateServices={onNavigateServices}
        onNavigateAccount={onNavigateAccount}
      />
    </div>
  );
};
