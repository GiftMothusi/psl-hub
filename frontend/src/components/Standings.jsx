import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';
import FormStrip from '../components/FormStrip';


function buildFormMap(matches) {
  const map = {};

  const finished = matches.filter(m => m.status === 'FT');

  const teamIds = new Set();
  finished.forEach(m => {
    teamIds.add(m.home_team_id);
    teamIds.add(m.away_team_id);
  });

  teamIds.forEach(teamId => {
    const teamMatches = finished
      .filter(m => m.home_team_id === teamId || m.away_team_id === teamId)
      .sort((a, b) => b.date.localeCompare(a.date)) // newest first
      .slice(0, 5);

    map[teamId] = teamMatches.map(m => {
      const isHome = m.home_team_id === teamId;
      const gf = isHome ? m.home_goals : m.away_goals;
      const ga = isHome ? m.away_goals : m.home_goals;
      const result = gf > ga ? 'W' : gf === ga ? 'D' : 'L';
      return {
        result,
        score: `${gf}-${ga}`,
        opponent_name: isHome ? m.away_team_name : m.home_team_name,
        date: m.date,
      };
    });
  });

  return map;
}


export default function Standings() {
  const { data, loading } = useFetch(() => api.getStandings(), []);

  const { data: matchData } = useFetch(() => api.getMatches(), []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-psl-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const standings = data?.standings || [];
  const matches = matchData?.matches || [];

  const formMap = useMemo(() => buildFormMap(matches), [matches]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">
          League Standings
        </h1>
        <p className="text-gray-600 mt-1">Betway Premiership 2025/26</p>
        <div className="gold-line w-32 mt-4" />
      </div>

      {/* Zone legend */}
      <div className="flex gap-4 mb-6 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded bg-blue-500" /> CAF Champions League
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded bg-orange-500" /> CAF Confederation Cup
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded bg-red-500" /> Relegation
        </span>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Form'].map((h, i) => (
                  <th
                    key={h}
                    className={`
                      ${i <= 1 ? 'text-left' : 'text-center'}
                      px-3 py-3 text-xs text-gray-600 font-semibold
                      ${i >= 6 && i <= 7 ? 'hidden md:table-cell' : ''}
                      ${i === 10 ? 'hidden lg:table-cell' : ''}
                    `}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {standings.map((s, i) => {
                const zoneBorder =
                  i < 2 ? 'border-l-2 border-l-blue-500' :
                  i === 2 ? 'border-l-2 border-l-orange-500' :
                  i >= 14 ? 'border-l-2 border-l-red-500' : '';

                const teamForm = formMap[s.team_id] || [];

                return (
                  <tr
                    key={i}
                    className={`standing-row border-b border-white/[0.03] ${zoneBorder}`}
                  >
                    <td className="px-3 py-3">
                      <span className={`text-sm font-bold ${
                        i === 0 ? 'text-psl-gold' :
                        i < 3 ? 'text-blue-400' :
                        i >= 14 ? 'text-red-400' : 'text-gray-500'
                      }`}>
                        {s.rank}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/teams/${s.team_id}`} className="flex items-center gap-3 group">
                        <img
                          src={s.team_logo}
                          alt=""
                          className="w-7 h-7 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-psl-gold transition-colors">
                          {s.team_name}
                        </span>
                      </Link>
                    </td>
                    <td className="text-center px-3 py-3 text-sm text-gray-600">{s.played}</td>
                    <td className="text-center px-3 py-3 text-sm text-gray-600">{s.wins}</td>
                    <td className="text-center px-3 py-3 text-sm text-gray-600">{s.draws}</td>
                    <td className="text-center px-3 py-3 text-sm text-gray-600">{s.losses}</td>
                    <td className="text-center px-3 py-3 text-sm text-gray-600 hidden md:table-cell">{s.goals_for}</td>
                    <td className="text-center px-3 py-3 text-sm text-gray-600 hidden md:table-cell">{s.goals_against}</td>
                    <td className="text-center px-3 py-3">
                      <span className={`text-sm font-medium ${
                        s.goal_difference > 0 ? 'text-green-600' :
                        s.goal_difference < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {s.goal_difference > 0 ? '+' : ''}{s.goal_difference}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className="text-sm font-bold text-gray-900">{s.points}</span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <FormStrip form={teamForm} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-600">
        Source:{' '}
        {standings[0]?.source === 'supersport_live'
          ? 'SuperSport.com (Live)'
          : 'Verified data, Feb 15 2026'}
      </div>
    </div>
  );
}