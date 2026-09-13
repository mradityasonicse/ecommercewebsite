import React from 'react';
import { type Campus } from '../../data/campuses';
import { Navbar } from '../navigation/Navbar';
import { Footer } from './Footer';
import { ScrollProgress } from '../motion/ScrollProgress';

import { PageTransition } from '../motion/PageTransition';
import { CampusChatWidget } from '../chat/CampusChatWidget';

export interface AppShellProps {
  children: React.ReactNode;
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen?: () => void;
  onPartnerOpen?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen,
  onPartnerOpen,
  className = '',
  style = {},
}) => {
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

      {/* Global Responsive Navigation Header */}
      <Navbar
        selectedCampus={selectedCampus}
        onCampusChange={onCampusChange}
        onRequestCampusOpen={onRequestCampusOpen}
        onPartnerOpen={onPartnerOpen}
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

      {/* Persistent Responsive Campus Live Chat & WhatsApp Helpdesk (Desktop + Mobile) */}
      <CampusChatWidget selectedCampus={selectedCampus} />
    </div>
  );
};
