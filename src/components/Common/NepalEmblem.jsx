import React from "react";

/**
 * Official Coat of Arms of Nepal (नेपालको निशान छाप)
 * Authentic vector representation featuring:
 * - Mt. Everest & Himalayan snow peaks
 * - Handshake representing gender equality and fraternity
 * - Golden yellow ears of paddy / grains
 * - Red Rhododendron (Lali Gurans - national flower) garland
 * - National Flag of Nepal
 * - Golden scroll with national motto: जननी जन्मभूमिश्च स्वर्गादपि गरीयसी
 */
export default function NepalEmblem({ size = 52, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="नेपालको निशान छाप (Coat of Arms of Nepal)"
    >
      {/* Outer circular glow / base */}
      <circle cx="60" cy="60" r="56" fill="#F8F9FA" stroke="#D1D5DB" strokeWidth="1.5" />

      {/* Rhododendron Garland Ring (Crimson / Red) */}
      <circle cx="60" cy="58" r="48" stroke="#DC2626" strokeWidth="5" strokeDasharray="3 4" fill="none" opacity="0.9" />
      <circle cx="60" cy="58" r="44" stroke="#B91C1C" strokeWidth="2.5" fill="none" />

      {/* Sky / Himalayan Blue Background */}
      <ellipse cx="60" cy="56" rx="42" ry="38" fill="#E0F2FE" />

      {/* Mt. Everest & Himalayan peaks */}
      {/* Background peaks */}
      <polygon points="26,64 42,42 56,64" fill="#94A3B8" />
      <polygon points="62,64 78,38 94,64" fill="#94A3B8" />
      {/* Central Mt. Everest Peak */}
      <polygon points="40,64 60,30 80,64" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      {/* Snow Shadows */}
      <polygon points="60,30 60,64 76,64" fill="#E2E8F0" />
      <polygon points="48,46 60,30 54,64" fill="#FFFFFF" />

      {/* Green Hills of Nepal */}
      <path d="M22,76 Q42,58 60,70 Q78,58 98,76 L98,82 L22,82 Z" fill="#15803D" />
      <path d="M22,80 Q60,68 98,80 L98,86 L22,86 Z" fill="#166534" />

      {/* Hands shaking in equality (White / Golden) */}
      <g transform="translate(42, 68) scale(0.6)">
        <path
          d="M6,10 Q14,4 24,10 L30,16 Q34,20 28,24 L22,26 L14,20 Z"
          fill="#FEF3C7"
          stroke="#D97706"
          strokeWidth="1.5"
        />
        <path
          d="M54,10 Q46,4 36,10 L30,16 Q26,20 32,24 L38,26 L46,20 Z"
          fill="#FEF3C7"
          stroke="#D97706"
          strokeWidth="1.5"
        />
        <rect x="25" y="13" width="10" height="9" rx="3" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
      </g>

      {/* Nepal National Flag at the summit */}
      <g transform="translate(56, 12) scale(0.7)">
        {/* Flag Pole */}
        <line x1="0" y1="0" x2="0" y2="22" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        {/* Double Pennon Flag Body */}
        <path
          d="M1,0 L14,9 L5,9 L14,19 L1,19 Z"
          fill="#DC2626"
          stroke="#1E40AF"
          strokeWidth="1.2"
        />
        {/* Moon in upper pennon */}
        <circle cx="5" cy="5" r="1.8" fill="#FFFFFF" />
        {/* Sun in lower pennon */}
        <circle cx="5" cy="14" r="2.2" fill="#FFFFFF" />
      </g>

      {/* Golden Ears of Paddy / Wheat framing base */}
      <path
        d="M26,72 Q20,86 36,94 Q50,98 60,98 Q70,98 84,94 Q100,86 94,72"
        stroke="#F59E0B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Red Ribbon with Motto at the bottom (जननी जन्मभूमिश्च स्वर्गादपि गरीयसी) */}
      <g id="motto-banner">
        {/* Ribbon banner end folds */}
        <polygon points="12,101 4,105 12,109 16,105" fill="#7F1D1D" />
        <polygon points="108,101 116,105 108,109 104,105" fill="#7F1D1D" />
        
        {/* Main Ribbon curved banner */}
        <path
          d="M14,97 C38,101 82,101 106,97 L106,109 C82,113 38,113 14,109 Z"
          fill="#DC2626"
          stroke="#991B1B"
          strokeWidth="0.8"
        />

        {/* Elegant gold trim along top and bottom edges */}
        <path d="M16,98.2 C38,102 82,102 104,98.2" stroke="#FDE047" strokeWidth="0.5" fill="none" opacity="0.85" />
        <path d="M16,107.8 C38,111.8 82,111.8 104,107.8" stroke="#FDE047" strokeWidth="0.5" fill="none" opacity="0.85" />

        {/* Motto Devanagari text: precisely centered, baseline balanced, fitting within ribbon width */}
        <text
          x="60"
          y="103.8"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FEF08A"
          fontSize="4.2"
          fontWeight="700"
          fontFamily="'Mukta', -apple-system, sans-serif"
          textLength="78"
          lengthAdjust="spacing"
          letterSpacing="0.1"
          style={{ userSelect: "none" }}
        >
          जननी जन्मभूमिश्च स्वर्गादपि गरीयसी
        </text>
      </g>
    </svg>
  );
}
