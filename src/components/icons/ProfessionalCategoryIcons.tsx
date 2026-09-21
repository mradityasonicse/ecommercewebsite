import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
}

/**
 * 1. Professional PG & Hostels Icon (Modern Architectural Living Suite)
 */
export const PgLivingIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = '#10B981',
  secondaryColor = '#34D399',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Outer Modern Building Frame */}
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Balcony / Window Accent */}
      <rect
        x="7"
        y="8.5"
        width="10"
        height="4"
        rx="1"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeOpacity="0.85"
      />
      {/* Keyhole Verified Doorway */}
      <path
        d="M10 21V16C10 14.8954 10.8954 14 12 14C13.1046 14 14 14.8954 14 16V21"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11.5" r="1" fill={secondaryColor} />
    </svg>
  );
};

/**
 * 2. Professional Daily Mess & Culinary Icon (Steam Cloche & Gourmet Cutlery)
 */
export const MessCulinaryIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = '#F59E0B',
  secondaryColor = '#FBBF24',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Cloche Base Plate */}
      <path
        d="M2 19H22M4 19C4.5 19 5 18 5.5 17C6.5 15 8 13.5 12 13.5C16 13.5 17.5 15 18.5 17C19 18 19.5 19 20 19"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dome Top Handle */}
      <circle cx="12" cy="11" r="1.5" stroke={secondaryColor} strokeWidth="1.5" />
      {/* Rising Hot Fresh Steam Waves */}
      <path
        d="M8.5 7.5C8.5 6 9.5 5 9.5 3.5"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 8C12 6.5 13 5.5 13 4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15.5 7.5C15.5 6 16.5 5 16.5 3.5"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * 3. Professional Doorstep Laundry Icon (Aqua Hydro-Drum & Crisp Press)
 */
export const LaundryAquaIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = '#06B6D4',
  secondaryColor = '#38BDF8',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Washing Appliance Body */}
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Control Knob & LED Display */}
      <circle cx="8" cy="6.5" r="1" fill={secondaryColor} />
      <line x1="12" y1="6.5" x2="16" y2="6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Hydro Wave Washing Drum Circle */}
      <circle cx="12" cy="14" r="4.5" stroke={color} strokeWidth="1.8" />
      {/* Swirling Water Wave */}
      <path
        d="M9.5 14C10.5 12.5 11.5 15.5 13 14C13.8 13.2 14.2 14 14.5 14.5"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Fresh Sparkle Accent */}
      <path
        d="M19 2L19.5 3.5L21 4L19.5 4.5L19 6L18.5 4.5L17 4L18.5 3.5L19 2Z"
        fill={secondaryColor}
      />
    </svg>
  );
};

/**
 * 4. Professional Live Fulfillment Tracker Beacon Icon
 */
export const LiveTrackerIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = '#3B82F6',
  secondaryColor = '#60A5FA',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Center Satellite Core */}
      <circle cx="12" cy="12" r="3" fill={color} />
      {/* Inner Broadcast Wave */}
      <path
        d="M7.8 7.8C10.1 5.5 13.9 5.5 16.2 7.8M16.2 16.2C13.9 18.5 10.1 18.5 7.8 16.2"
        stroke={secondaryColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Outer Telemetry Ring */}
      <path
        d="M4.9 4.9C8.8 1 15.2 1 19.1 4.9M19.1 19.1C15.2 23 8.8 23 4.9 19.1"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      {/* Pulse Dot */}
      <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * 5. Professional Extra Campus Services Icon (Modular 3D Ecosystem)
 */
export const ExtraServicesGridIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = '#818CF8',
  secondaryColor = '#A5B4FC',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      <rect x="3" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="2" stroke={secondaryColor} strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="2" stroke={secondaryColor} strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="2" stroke={color} strokeWidth="1.8" />
      <circle cx="6.5" cy="6.5" r="1" fill={color} />
      <circle cx="17.5" cy="17.5" r="1" fill={color} />
    </svg>
  );
};

/**
 * 6. Professional Verified Support & Helpdesk Icon
 */
export const VerifiedSupportIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = '#EC4899',
  secondaryColor = '#F472B6',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Headset Arch */}
      <path
        d="M3 14V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V14"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Left Ear Cushion */}
      <rect x="2" y="13" width="3.5" height="6" rx="1.5" fill={color} stroke={color} />
      {/* Right Ear Cushion */}
      <rect x="18.5" y="13" width="3.5" height="6" rx="1.5" fill={color} stroke={color} />
      {/* Microphone Arm & Tip */}
      <path
        d="M19 18V19C19 20.1046 18.1046 21 17 21H14"
        stroke={secondaryColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="13" cy="21" r="1.2" fill={secondaryColor} />
    </svg>
  );
};

/**
 * 7. Professional Boys Residences Badge Icon
 */
export const BoysResidenceBadgeIcon: React.FC<IconProps> = ({
  size = 22,
  className = '',
  color = '#38BDF8',
}) => {
  return (
    <div
      className={className}
      style={{
        width: `${size + 14}px`,
        height: `${size + 14}px`,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(2, 132, 199, 0.08))',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 4px 14px rgba(14, 165, 233, 0.15)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.8" />
        <path d="M4 21V18C4 15.7909 5.79086 14 8 14H16C18.2091 14 20 15.7909 20 18V21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 4L20 4M20 4V8M20 4L15.5 8.5" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/**
 * 8. Professional Girls Residences Badge Icon (CCTV / Security Shield)
 */
export const GirlsResidenceBadgeIcon: React.FC<IconProps> = ({
  size = 22,
  className = '',
  color = '#F472B6',
}) => {
  return (
    <div
      className={className}
      style={{
        width: `${size + 14}px`,
        height: `${size + 14}px`,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.08))',
        border: '1px solid rgba(244, 114, 182, 0.4)',
        boxShadow: '0 4px 14px rgba(236, 72, 153, 0.15)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 5V11C4 16.5228 7.41828 20.8407 12 22C16.5817 20.8407 20 16.5228 20 11V5L12 2Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" stroke="#FDA4AF" strokeWidth="1.5" />
        <path d="M12 12.5V17M10 15H14" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/**
 * 9. Professional Independent Co-Living Badge Icon
 */
export const IndependentLivingBadgeIcon: React.FC<IconProps> = ({
  size = 22,
  className = '',
  color = '#818CF8',
}) => {
  return (
    <div
      className={className}
      style={{
        width: `${size + 14}px`,
        height: `${size + 14}px`,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.2), rgba(99, 102, 241, 0.08))',
        border: '1px solid rgba(129, 140, 248, 0.4)',
        boxShadow: '0 4px 14px rgba(129, 140, 248, 0.15)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21H21M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <rect x="8" y="7" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.8" />
        <rect x="13.5" y="7" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.8" />
        <rect x="8" y="12" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.8" />
        <rect x="13.5" y="12" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.8" />
      </svg>
    </div>
  );
};
