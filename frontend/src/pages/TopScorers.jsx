import React from 'react';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';

export default function TopScorers() {
  const { data, loading } = useFetch(() => api.getTopScorers(), []);
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-psl-gold border-t-transparent rounded-full animate-spin" /></div>;
  const scorers = data?.scorers || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">Top Scorers</h1>
        <p className="text-gray-600 mt-1">Betway Premiership 2025/26 Golden Boot Race</p>
        <div className="gold-line w-32 mt-4" />
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 0, 2].map((order, i) => {
          const player = scorers[order];
          if (!player) return null;
          const isFirst = order === 0;
          return (
            <div key={i} className={`glass-card p-5 text-center ${isFirst ? 'ring-1 ring-psl-gold/30 scale-105 relative z-10' : ''}`}>
              <div className="text-xs uppercase tracking-wider text-gray-600 mb-2">
                {order === 0 ? '1st' : order === 1 ? '2nd' : '3rd'}
              </div>
              <img src={player.team_logo} alt="" className="w-12 h-12 mx-auto mb-3" />
              <div className="font-display text-xl text-gray-900">{player.name}</div>
              <div className="text-xs text-gray-600 mt-1">{player.team}</div>
              <div className="mt-3">
                <span className="font-display text-4xl text-psl-gold">{player.goals}</span>
                <span className="text-xs text-gray-600 ml-1">goals</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">{player.appearances} apps</div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-white/[0.03]">
          {scorers.map((p, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 standing-row">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-psl-dark' :
                i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-psl-dark' :
                i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>{i + 1}</div>
              <img src={p.team_logo} alt="" className="w-7 h-7" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-600">{p.team} — {p.appearances} appearances</div>
              </div>
              <div className="hidden md:flex items-center gap-2 flex-1">
                <div className="flex-1 h-2 bg-psl-dark/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-psl-gold to-yellow-400 rounded-full" style={{ width: `${(p.goals / (scorers[0]?.goals || 1)) * 100}%` }} />
                </div>
              </div>
              <span className="font-display text-2xl text-psl-gold">{p.goals}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
