import { G } from '../../lib/tokens';

export const FleurDeLis = ({ size = 24, color = G.gold, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={color} opacity={opacity}>
    <path d="M50 5 C45 20 30 25 30 40 C30 52 40 57 50 57 C60 57 70 52 70 40 C70 25 55 20 50 5Z"/>
    <path d="M50 57 C50 57 35 62 28 72 C22 80 30 88 38 85 C44 83 50 75 50 75 C50 75 56 83 62 85 C70 88 78 80 72 72 C65 62 50 57 50 57Z"/>
    <ellipse cx="50" cy="62" rx="8" ry="5"/>
    <path d="M15 35 C8 30 5 22 12 18 C18 15 25 20 28 30 C30 38 25 45 20 48 C18 42 18 40 15 35Z"/>
    <path d="M85 35 C92 30 95 22 88 18 C82 15 75 20 72 30 C70 38 75 45 80 48 C82 42 82 40 85 35Z"/>
  </svg>
);

export const Trophy = ({ size = 18, color = G.gold }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M5 3H3v4c0 2.2 1.4 4 3.3 4.7C7 13.5 8.4 14.7 10 15v2H8v2h8v-2h-2v-2c1.6-.3 3-1.5 3.7-3.3C19.6 11 21 9.2 21 7V3h-2v4c0 1.1-.5 2-1.3 2.6C17.5 8.2 17 7 17 6V3H7v3c0 1-.5 2.2-1.7 3.6C4.5 9 4 8.1 4 7V3H5zm2 0h10v3c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4V3z"/>
    <path d="M12 17v2m-2 2h4" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

export const ChevronRight = ({ size = 14, color = G.goldDim }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

export const ArrowLeft = ({ size = 16, color = G.goldDim }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
  </svg>
);

export const LockIcon = ({ size = 14, color = G.textFaint }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C9.8 2 8 3.8 8 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2v2h-4V6c0-1.1.9-2 2-2zm0 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
  </svg>
);

export const CalendarIcon = ({ size = 16, color = G.goldDim }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

export const UserIcon = ({ size = 16, color = G.goldDim }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

export const CheckIcon = ({ size = 14, color = G.gold }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 13l4 4L19 7"/>
  </svg>
);
