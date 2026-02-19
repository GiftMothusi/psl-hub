import React from 'react';

export default function SeasonHeatmap({ teamId, matches = [] }) {
  const teamMatches = matches
    .filter(
      m =>
        m.status === 'FT' &&
        (m.home_team_id === teamId || m.away_team_id === teamId)
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  if (teamMatches.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No match data available for heatmap.</p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-500 inline-block" /> Win
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> Draw
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500 inline-block" /> Loss
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {teamMatches.map((m, i) => {
          const isHome = m.home_team_id === teamId;

          const gf = isHome ? m.home_goals : m.away_goals;
          const ga = isHome ? m.away_goals : m.home_goals;

          const result = gf > ga ? 'W' : gf === ga ? 'D' : 'L';
          const opponent = isHome ? m.away_team_name : m.home_team_name;
          const venue = isHome ? 'H' : 'A'; // home or away indicator

          const bg =
            result === 'W'
              ? 'bg-green-500 hover:bg-green-400'
              : result === 'D'
              ? 'bg-yellow-400 hover:bg-yellow-300'
              : 'bg-red-500 hover:bg-red-400';

          const textColor = result === 'D' ? 'text-gray-900' : 'text-white';

          const tooltip = `[${venue}] ${result} ${gf}–${ga} vs ${opponent} — ${m.date}`;

          return (
            <div
              key={i}
              title={tooltip}
              className={`
                w-8 h-8 rounded-lg ${bg} ${textColor}
                flex flex-col items-center justify-center
                cursor-default select-none
                hover:scale-125 transition-transform duration-150
                shadow-sm
              `}
            >
              <span className="text-[10px] font-bold leading-none">{result}</span>
              <span className="text-[8px] leading-none opacity-80">{gf}–{ga}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span>
          <span className="font-semibold text-green-600">
            {teamMatches.filter(m => {
              const isH = m.home_team_id === teamId;
              const gf = isH ? m.home_goals : m.away_goals;
              const ga = isH ? m.away_goals : m.home_goals;
              return gf > ga;
            }).length}W
          </span>
        </span>
        <span>
          <span className="font-semibold text-yellow-500">
            {teamMatches.filter(m => {
              const isH = m.home_team_id === teamId;
              return (isH ? m.home_goals : m.away_goals) ===
                     (isH ? m.away_goals : m.home_goals);
            }).length}D
          </span>
        </span>
        <span>
          <span className="font-semibold text-red-500">
            {teamMatches.filter(m => {
              const isH = m.home_team_id === teamId;
              const gf = isH ? m.home_goals : m.away_goals;
              const ga = isH ? m.away_goals : m.home_goals;
              return gf < ga;
            }).length}L
          </span>
        </span>
        <span className="ml-auto">{teamMatches.length} matches played</span>
      </div>
    </div>
  );
}