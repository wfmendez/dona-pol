import React from 'react';

/**
 * Polygon network visualization — pure SVG/CSS, no external images.
 * Shows animated nodes connected by glowing edges, evoking a blockchain network.
 */
const PolygonArt = () => (
  <div className="relative w-full h-full min-h-[260px] overflow-hidden rounded-3xl bg-surface-container-lowest">
    {/* Ambient glow layers */}
    <div className="absolute inset-0">
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-[50%] bg-primary-container/20 blur-[60px]" />
      <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-[50%] bg-secondary-container/20 blur-[50px]" />
      <div className="absolute top-[50%] left-[10%] w-[20%] h-[20%] rounded-[50%] bg-tertiary/10 blur-[40px]" />
    </div>

    {/* Network SVG */}
    <svg
      viewBox="0 0 400 260"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* Glowing edge gradient */}
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8247e5" stopOpacity="0" />
          <stop offset="50%"  stopColor="#d4bbff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8247e5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="edgeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ffb871" stopOpacity="0" />
          <stop offset="50%"  stopColor="#ffb871" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8247e5" stopOpacity="0" />
        </linearGradient>
        {/* Node glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowStrong" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Edges (connections between nodes) ── */}
      <g opacity="0.6">
        <line x1="200" y1="130" x2="80"  y2="60"  stroke="url(#edgeGrad)" strokeWidth="1" />
        <line x1="200" y1="130" x2="320" y2="60"  stroke="url(#edgeGrad)" strokeWidth="1" />
        <line x1="200" y1="130" x2="340" y2="190" stroke="url(#edgeGrad)" strokeWidth="1" />
        <line x1="200" y1="130" x2="60"  y2="200" stroke="url(#edgeGrad)" strokeWidth="1" />
        <line x1="200" y1="130" x2="200" y2="230" stroke="url(#edgeGrad)" strokeWidth="1" />
        <line x1="80"  y1="60"  x2="320" y2="60"  stroke="url(#edgeGrad)" strokeWidth="0.5" />
        <line x1="80"  y1="60"  x2="60"  y2="200" stroke="url(#edgeGrad)" strokeWidth="0.5" />
        <line x1="320" y1="60"  x2="340" y2="190" stroke="url(#edgeGrad)" strokeWidth="0.5" />
        <line x1="340" y1="190" x2="200" y2="230" stroke="url(#edgeGrad2)" strokeWidth="0.5" />
        <line x1="60"  y1="200" x2="200" y2="230" stroke="url(#edgeGrad2)" strokeWidth="0.5" />
        {/* Outer fringe nodes */}
        <line x1="80"  y1="60"  x2="30"  y2="30"  stroke="url(#edgeGrad)" strokeWidth="0.4" opacity="0.4" />
        <line x1="320" y1="60"  x2="370" y2="30"  stroke="url(#edgeGrad)" strokeWidth="0.4" opacity="0.4" />
        <line x1="340" y1="190" x2="390" y2="210" stroke="url(#edgeGrad)" strokeWidth="0.4" opacity="0.4" />
        <line x1="60"  y1="200" x2="10"  y2="230" stroke="url(#edgeGrad)" strokeWidth="0.4" opacity="0.4" />
      </g>

      {/* ── Traveling pulse dots ── */}
      <circle r="2.5" fill="#d4bbff" opacity="0.9">
        <animateMotion dur="3s" repeatCount="indefinite" path="M200,130 L80,60" />
      </circle>
      <circle r="2" fill="#ffb871" opacity="0.8">
        <animateMotion dur="4s" repeatCount="indefinite" begin="1s" path="M200,130 L320,60" />
      </circle>
      <circle r="2" fill="#d4bbff" opacity="0.7">
        <animateMotion dur="3.5s" repeatCount="indefinite" begin="0.5s" path="M200,130 L340,190" />
      </circle>
      <circle r="1.5" fill="#10B981" opacity="0.8">
        <animateMotion dur="5s" repeatCount="indefinite" begin="2s" path="M80,60 L320,60" />
      </circle>
      <circle r="1.5" fill="#d4bbff" opacity="0.6">
        <animateMotion dur="4.5s" repeatCount="indefinite" begin="1.5s" path="M200,130 L60,200" />
      </circle>

      {/* ── Main hub (Polygon logo-ish hexagon) ── */}
      <g transform="translate(200,130)" filter="url(#glowStrong)">
        <polygon
          points="0,-18 15.6,-9 15.6,9 0,18 -15.6,9 -15.6,-9"
          fill="#8247e5"
          opacity="0.9"
        />
        <polygon
          points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6"
          fill="#d4bbff"
          opacity="0.7"
        />
        <circle r="4" fill="white" opacity="0.9" />
        <animateTransform attributeName="transform" type="rotate"
          from="0" to="360" dur="20s" repeatCount="indefinite" />
      </g>

      {/* ── Secondary nodes ── */}
      {[
        { cx: 80,  cy: 60,  r: 8,  fill: '#8247e5', delay: '0s' },
        { cx: 320, cy: 60,  r: 8,  fill: '#6f00be', delay: '0.8s' },
        { cx: 340, cy: 190, r: 7,  fill: '#8247e5', delay: '1.4s' },
        { cx: 60,  cy: 200, r: 7,  fill: '#9e5c00', delay: '2s' },
        { cx: 200, cy: 230, r: 6,  fill: '#6f00be', delay: '2.6s' },
      ].map((n, i) => (
        <g key={i} filter="url(#glow)">
          <circle cx={n.cx} cy={n.cy} r={n.r + 4} fill={n.fill} opacity="0.15">
            <animate attributeName="opacity" values="0.15;0.35;0.15"
              dur="2.5s" begin={n.delay} repeatCount="indefinite" />
          </circle>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} opacity="0.85" />
          <circle cx={n.cx} cy={n.cy} r={n.r * 0.45} fill="white" opacity="0.6" />
        </g>
      ))}

      {/* ── Fringe mini-nodes ── */}
      {[
        { cx: 30,  cy: 30  },
        { cx: 370, cy: 30  },
        { cx: 390, cy: 210 },
        { cx: 10,  cy: 230 },
      ].map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r="3" fill="#4a4454" opacity="0.6" />
      ))}

      {/* ── "POLYGON" text label ── */}
      <text x="200" y="255" textAnchor="middle"
        fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="9"
        letterSpacing="4" fill="#d4bbff" opacity="0.5">
        POLYGON NETWORK
      </text>
    </svg>

    {/* Corner badge */}
    <div className="absolute top-4 right-4 bg-primary-container/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/20">
      <span className="text-primary text-xs font-bold uppercase tracking-widest">14 days left</span>
    </div>
  </div>
);

export default PolygonArt;
