import React from 'react';

const AXES = [
  { label: 'Attack',      key: 'attack_rating',   max: 99 },
  { label: 'Defense',     key: 'defense_rating',  max: 99 },
  { label: 'Form',        key: 'form_rating',      max: 99 },
  { label: 'Win Rate',    key: 'win_rate',         max: 100 },
  { label: 'Goals/Game',  key: 'goals_per_game',   max: 3 },
  { label: 'Pts/Game',    key: 'points_per_game',  max: 3 },
];

const N = AXES.length; // 6 axes

function polar(cx, cy, r, angle) {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  };
}

function buildPolygonPoints(cx, cy, maxR, values) {
  return values
    .map((v, i) => {
      const angle = (i * 2 * Math.PI) / N;
      const pt = polar(cx, cy, v * maxR, angle);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

export default function RadarChart({ teamA, teamB, analyticsA = {}, analyticsB = {} }) {
  const SIZE = 280;    // SVG viewBox size
  const CX = SIZE / 2; // Centre X
  const CY = SIZE / 2; // Centre Y
  const MAX_R = 100;   // Maximum radius for outermost ring
  const RINGS = 4;     // Number of concentric guide rings

  const colorA = teamA?.colors?.[0] || '#D4A843';
  const colorB = teamB?.colors?.[0] || '#6366F1';

  const valuesA = AXES.map(ax =>
    Math.min(1, (analyticsA[ax.key] || 0) / ax.max)
  );
  const valuesB = AXES.map(ax =>
    Math.min(1, (analyticsB[ax.key] || 0) / ax.max)
  );

  const polygonA = buildPolygonPoints(CX, CY, MAX_R, valuesA);
  const polygonB = buildPolygonPoints(CX, CY, MAX_R, valuesB);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-1 rounded-full inline-block"
            style={{ background: colorA }}
          />
          <span className="font-medium text-gray-900">{teamA?.name || 'Team A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-1 rounded-full inline-block"
            style={{ background: colorB }}
          />
          <span className="font-medium text-gray-900">{teamB?.name || 'Team B'}</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="overflow-visible"
      >
        {[...Array(RINGS)].map((_, ri) => {
          const r = ((ri + 1) / RINGS) * MAX_R;
          const ringPoints = AXES.map((_, i) => {
            const angle = (i * 2 * Math.PI) / N;
            const pt = polar(CX, CY, r, angle);
            return `${pt.x},${pt.y}`;
          }).join(' ');
          return (
            <polygon
              key={ri}
              points={ringPoints}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
            />
          );
        })}

        {AXES.map((_, i) => {
          const angle = (i * 2 * Math.PI) / N;
          const outer = polar(CX, CY, MAX_R, angle);
          return (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={polygonA}
          fill={colorA}
          fillOpacity="0.25"
          stroke={colorA}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <polygon
          points={polygonB}
          fill={colorB}
          fillOpacity="0.25"
          stroke={colorB}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeDasharray="4 2"
        />

        {AXES.map((ax, i) => {
          const angle = (i * 2 * Math.PI) / N;
          const labelPt = polar(CX, CY, MAX_R + 22, angle);
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fontWeight="600"
              fill="#6B7280"
              fontFamily="sans-serif"
            >
              {ax.label}
            </text>
          );
        })}

        {valuesA.map((v, i) => {
          const angle = (i * 2 * Math.PI) / N;
          const pt = polar(CX, CY, v * MAX_R, angle);
          return (
            <circle
              key={i}
              cx={pt.x} cy={pt.y} r="3"
              fill={colorA}
              stroke="white"
              strokeWidth="1"
            />
          );
        })}

        {valuesB.map((v, i) => {
          const angle = (i * 2 * Math.PI) / N;
          const pt = polar(CX, CY, v * MAX_R, angle);
          return (
            <circle
              key={i}
              cx={pt.x} cy={pt.y} r="3"
              fill={colorB}
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      <div className="mt-4 w-full grid grid-cols-3 gap-y-2 text-xs text-center">
        {AXES.map((ax, i) => {
          const rawA = analyticsA[ax.key] ?? '—';
          const rawB = analyticsB[ax.key] ?? '—';
          const aWins = typeof rawA === 'number' && typeof rawB === 'number' && rawA > rawB;
          const bWins = typeof rawA === 'number' && typeof rawB === 'number' && rawB > rawA;
          return (
            <React.Fragment key={i}>
              <span className={`font-bold ${aWins ? 'text-green-600' : 'text-gray-600'}`}>
                {typeof rawA === 'number' ? rawA : rawA}
              </span>
              <span className="text-gray-500">{ax.label}</span>
              <span className={`font-bold ${bWins ? 'text-green-600' : 'text-gray-600'}`}>
                {typeof rawB === 'number' ? rawB : rawB}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}