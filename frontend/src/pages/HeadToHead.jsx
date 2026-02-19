import React, { useState } from 'react';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';

export default function HeadToHead() {
  const { data: teamsData } = useFetch(() => api.getTeams(), []);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [h2h, setH2h] = useState(null);
  const teams = teamsData?.teams || [];
  const handleCompare = async () => {
    if (teamA && teamB && teamA !== teamB) {
      setH2h(await api.getH2H(teamA, teamB));
    }
  };
  const getTeam = (id) => teams.find(t => t.id === id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">Head to Head</h1>
        <p className="text-gray-600 mt-1">Compare two Betway Premiership teams</p>
        <div className="gold-line w-32 mt-4" />
      </div>
      <div className="glass-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block">Home Team</label>
            <select value={teamA} onChange={e => setTeamA(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-psl-gold focus:outline-none">
              <option value="">Select team...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-center py-2">
            <button onClick={handleCompare} disabled={!teamA || !teamB || teamA === teamB}
              className="px-6 py-3 bg-psl-gold text-psl-dark font-bold text-sm rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-psl-gold/20"
            >Compare</button>
          </div>
          <div>
            <label className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block">Away Team</label>
            <select value={teamB} onChange={e => setTeamB(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-psl-gold focus:outline-none">
              <option value="">Select team...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      {teamA && teamB && (
        <div className="flex items-center justify-center gap-8 mb-8">
          {[teamA, teamB].map((id, i) => {
            const t = getTeam(id);
            if (!t) return null;
            return (
              <div key={i} className="text-center">
                <img src={t.logo_url} alt={t.name} className="w-20 h-20 mx-auto logo-glow" />
                <div className="font-display text-xl text-gray-900 mt-2">{t.name}</div>
              </div>
            );
          })}
        </div>
      )}
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
                    <span className="score-text text-lg text-gray-900">{m.home_goals != null ? `${m.home_goals} - ${m.away_goals}` : 'VS'}</span>
                  </div>
                  <span className="text-sm text-gray-900 flex-1 text-right">{m.away_team_name}</span>
                  <img src={m.away_team_logo} alt="" className="w-7 h-7" />
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No head-to-head matches found in current season data.</p>}
        </div>
      )}
    </div>
  );
}
