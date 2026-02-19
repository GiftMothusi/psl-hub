import React, { useState } from 'react';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';
import RadarChart from '../components/RadarChart';
import MatchPrediction from '../components/MatchPrediction';

export default function HeadToHead() {
  const { data: teamsData } = useFetch(() => api.getTeams(), []);
  const { data: standingsData } = useFetch(() => api.getStandings(), []);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [h2h, setH2h] = useState(null);

  const teams = teamsData?.teams || [];
  const standings = standingsData?.standings || [];

  const handleCompare = async () => {
    if (teamA && teamB && teamA !== teamB) {
      setH2h(await api.getH2H(teamA, teamB));
    }
  };

  const getTeam = (id) => teams.find(t => t.id === id);

   const getAnalytics = (teamId) => {
    const s = standings.find(st => st.team_id === teamId);
    if (!s) return {};
    const p = s.played || 1;
    return {
      attack_rating:  Math.min(99, Math.round((s.goals_for / p) * 40)),
      defense_rating: Math.min(99, Math.max(20, Math.round(100 - (s.goals_against / p) * 35))),
      form_rating:    Math.min(99, Math.round((s.points / p) * 33)),
      win_rate:       Math.round((s.wins / p) * 100),
      goals_per_game: Math.round((s.goals_for / p) * 10) / 10,
      points_per_game:Math.round((s.points / p) * 100) / 100,
    };
  };

  const syntheticMatch = teamA && teamB ? {
    status: 'NS',
    home_team_id:   teamA,
    home_team_name: getTeam(teamA)?.name || '',
    away_team_id:   teamB,
    away_team_name: getTeam(teamB)?.name || '',
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ── Page header ─────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">
          Head to Head
        </h1>
        <p className="text-gray-600 mt-1">Compare two Betway Premiership teams</p>
        <div className="gold-line w-32 mt-4" />
      </div>

      {/* ── Team selector ───────────────────────────────── */}
      <div className="glass-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block">
              Home Team
            </label>
            <select
              value={teamA}
              onChange={e => setTeamA(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-psl-gold focus:outline-none"
            >
              <option value="">Select team...</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center py-2">
            <button
              onClick={handleCompare}
              disabled={!teamA || !teamB || teamA === teamB}
              className="px-6 py-3 bg-psl-gold text-psl-dark font-bold text-sm rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-psl-gold/20"
            >
              Compare
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block">
              Away Team
            </label>
            <select
              value={teamB}
              onChange={e => setTeamB(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-psl-gold focus:outline-none"
            >
              <option value="">Select team...</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Team logo display ───────────────────────────── */}
      {teamA && teamB && (
        <div className="flex items-center justify-center gap-8 mb-8">
          {[teamA, teamB].map((id, i) => {
            const t = getTeam(id);
            if (!t) return null;
            return (
              <div key={i} className="text-center">
                <img src={t.logo_url} alt={t.name} className="w-20 h-20 mx-auto logo-glow" />
                <div className="font-display text-xl text-gray-900 mt-2">{t.name}</div>
                <div className="text-xs text-gray-500">{t.city}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────
          [CHANGE 4 — NEW SECTION] Radar chart comparison
          Shows when both teams are selected (no Compare needed)
      ───────────────────────────────────────────────────────── */}
      {teamA && teamB && teamA !== teamB && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Radar chart */}
          <div className="glass-card p-6">
            <h3 className="font-display text-xl tracking-wider text-gray-900 mb-5">
              Season Comparison
            </h3>
            <RadarChart
              teamA={getTeam(teamA)}
              teamB={getTeam(teamB)}
              analyticsA={getAnalytics(teamA)}
              analyticsB={getAnalytics(teamB)}
            />
          </div>

          {/* [CHANGE 5 — NEW SECTION] Match prediction */}
          <div className="glass-card p-6">
            <h3 className="font-display text-xl tracking-wider text-gray-900 mb-5">
              Match Prediction
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Based on 2025/26 season statistics using Poisson distribution modelling.
              For informational purposes only.
            </p>
            {syntheticMatch && (
              <MatchPrediction match={syntheticMatch} standings={standings} />
            )}

            {/* Head-to-head season record summary */}
            {h2h && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Season H2H Record</div>
                <div className="text-2xl font-display text-gray-900">
                  {h2h.total_matches} match{h2h.total_matches !== 1 ? 'es' : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── H2H results list (unchanged logic) ─────────── */}
      {h2h && (
        <div className="glass-card p-6">
          <h3 className="font-display text-xl tracking-wider text-gray-900 mb-4">
            {h2h.total_matches} match{h2h.total_matches !== 1 ? 'es' : ''} found this season
          </h3>
          {h2h.recent_matches?.length > 0 ? (
            <div className="space-y-3">
              {h2h.recent_matches.map((m, i) => (
                <div key={i} className="match-card px-4 py-3 flex items-center gap-3">
                  <img src={m.home_team_logo} alt="" className="w-7 h-7" />
                  <span className="text-sm text-gray-900 flex-1">{m.home_team_name}</span>
                  <div className="px-3 py-1 rounded bg-gray-100">
                    <span className="score-text text-lg text-gray-900">
                      {m.home_goals != null ? `${m.home_goals} - ${m.away_goals}` : 'VS'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 flex-1 text-right">{m.away_team_name}</span>
                  <img src={m.away_team_logo} alt="" className="w-7 h-7" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No head-to-head matches found in current season data.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
