
import React from 'react';

// Props definition
interface IconProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

// 1. Root / Home Icon (Abstract Hex Command Hub)
export const NovaRoot: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
    <path d="M2 17L12 22L22 17" />
    <path d="M2 12L12 17L22 12" />
    <path d="M12 22V12" />
    <rect x="10" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.3" stroke="none" />
  </svg>
);

// 2. Personnel / Characters (ID Card + Scan Line)
export const NovaPersonnel: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M3 5H21V19H3V5Z" strokeLinejoin="miter" />
    <path d="M7 9C7 9 8 8 10 8C12 8 13 9 13 9" />
    <circle cx="10" cy="11" r="2" />
    <path d="M16 8H18" />
    <path d="M16 11H18" />
    <path d="M16 14H18" />
    <path d="M7 15H13" />
    <path d="M3 17H21" strokeOpacity="0.5" strokeDasharray="2 2" />
    <rect x="2" y="2" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="20" y="20" width="2" height="2" fill="currentColor" stroke="none" />
  </svg>
);

// 3. Data / Database (Stacked Nodes with connectors)
export const NovaData: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" strokeLinejoin="miter" />
    <path d="M3 12L12 17L21 12" />
    <path d="M3 7L12 12L21 7" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

// 4. Reader / Terminal (Screen with code lines)
export const NovaTerminal: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M4 2H20V22H4V2Z" strokeLinejoin="miter" />
    <path d="M4 6H20" strokeWidth={1} />
    <path d="M7 10H14" strokeWidth={2} />
    <path d="M7 14H17" />
    <path d="M7 18H12" />
    <rect x="15" y="17" width="2" height="2" fill="currentColor" />
    <path d="M2 2L4 4" strokeWidth={0.5} />
    <path d="M22 2L20 4" strokeWidth={0.5} />
  </svg>
);

// 5. Fragments / Side Stories (Shattered Network)
export const NovaFragments: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M8 16L16 8" />
    <path d="M12 12L16 16" />
    <circle cx="18" cy="18" r="2" />
    <path d="M6 6L8 8" />
    <rect x="4" y="4" width="3" height="3" stroke="currentColor" />
    <path d="M20 20L22 22" />
    <path d="M2 22L22 2" strokeOpacity="0.2" strokeDasharray="1 3" />
  </svg>
);

// 6. Config / Settings (Mech Gear)
export const NovaConfig: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M12 4V2" />
    <path d="M12 22V20" />
    <path d="M4 12H2" />
    <path d="M22 12H20" />
    <path d="M17.657 6.343L19.071 4.929" />
    <path d="M4.929 19.071L6.343 17.657" />
    <path d="M6.343 6.343L4.929 4.929" />
    <path d="M19.071 19.071L17.657 17.657" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3" />
    <rect x="11" y="11" width="2" height="2" fill="currentColor" stroke="none" />
  </svg>
);

// 7. Folder Icon (For volume list)
export const NovaFolder: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M2 6H10L12 8H22V20H2V6Z" strokeLinejoin="miter" />
    <path d="M2 10H22" strokeOpacity="0.5" />
    <rect x="5" y="13" width="4" height="2" fill="currentColor" stroke="none" />
  </svg>
);

// 8. Archive (File Box)
export const NovaArchive: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M21 8V21H3V8" strokeLinejoin="miter" />
    <path d="M1 3H23V8H1V3Z" strokeLinejoin="miter" />
    <path d="M10 12H14" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <path d="M6 3V8" strokeOpacity="0.3" />
    <path d="M18 3V8" strokeOpacity="0.3" />
  </svg>
);

// --- Database Minimalist Icons ---

// 8. DB: All (Hub)
export const NovaDbHub: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" />
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.5" stroke="none" />
    <circle cx="12" cy="12" r="6" strokeOpacity="0.5" strokeDasharray="2 2" />
  </svg>
);

// 9. DB: World (Planet/Orbit)
export const NovaDbWorld: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-45 12 12)" />
    <path d="M12 3V5" strokeOpacity="0.5" />
    <path d="M12 19V21" strokeOpacity="0.5" />
  </svg>
);

// 10. DB: Organization (Hierarchy)
export const NovaDbOrg: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M12 3L3 21H21L12 3Z" strokeLinejoin="miter" />
    <path d="M7.5 12H16.5" />
    <rect x="11" y="7" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="6" y="16" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="16" y="16" width="2" height="2" fill="currentColor" stroke="none" />
  </svg>
);

// 11. DB: Technology (Chip)
export const NovaDbTech: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M4 4H16L20 8V20H4V4Z" strokeLinejoin="miter" />
    <rect x="8" y="10" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="12" y="10" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="8" y="14" width="2" height="2" fill="currentColor" stroke="none" />
    <path d="M16 4V8H20" />
    <path d="M4 12H2" strokeWidth={1} />
    <path d="M4 16H2" strokeWidth={1} />
    <path d="M12 20V22" strokeWidth={1} />
  </svg>
);

// 12. DB: Society (Network/Molecular)
export const NovaDbSociety: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M12 6L6 18H18L12 6Z" strokeOpacity="0.5" />
    <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
  </svg>
);

// 13. DB: Setting (Doc/File)
export const NovaDbSetting: React.FC<IconProps> = ({ size = 24, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M5 2H15L19 6V22H5V2Z" strokeLinejoin="miter" />
    <path d="M15 2V6H19" />
    <path d="M9 10H15" />
    <path d="M9 14H15" />
    <path d="M9 18H13" />
  </svg>
);
