import React from 'react';

// A fedora silhouette against a height chart. Each gang member gets their own hat-band colour.
export default function Mugshot({ who, tag, busted, size = 64 }) {
  return (
    <span className={`mug ${busted ? 'busted' : ''}`} style={{ width: size }}>
      <svg viewBox="10 12 60 78" width={size} height={size * 1.3} role="img" aria-label={who.alias + (busted ? ', caught' : '')}>
        <rect x="10" y="12" width="60" height="78" fill="#2a2520" />
        {[14, 30, 46, 62].map((y) => (
          <line key={y} x1="0" x2="80" y1={y} y2={y} stroke="#3d362e" strokeWidth="1" />
        ))}
        <ellipse cx="40" cy="102" rx="31" ry="26" fill="#0b0a09" />
        <rect x="34" y="58" width="12" height="16" fill="#0b0a09" />
        <ellipse cx="40" cy="48" rx="13" ry="15" fill="#0b0a09" />
        <path d="M27 37 Q26 19 40 20 Q54 19 53 37 Z" fill="#0b0a09" />
        <rect x="27" y="31" width="26" height="4.5" fill={who.band} />
        <ellipse cx="40" cy="37.5" rx="22" ry="3.8" fill="#0b0a09" />
        <rect x="22" y="76" width="36" height="12" fill="#ebe2cc" />
        <text x="40" y="85" textAnchor="middle" fontSize="8" fontFamily="'Special Elite', monospace" fill="#1e1a15">
          {tag}
        </text>
      </svg>
      {busted && <span className="mug-stamp">Caught</span>}
    </span>
  );
}
