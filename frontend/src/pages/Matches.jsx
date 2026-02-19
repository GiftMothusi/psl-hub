import React, { useState } from 'react';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';

export default function Matches() {
  const [tab, setTab] = useState('results');
  const { data, loading } = useFetch(() => api.getMatches(), []);
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-psl-gold border-t-transparent rounded-full animate-spin" /></div>;
  const all = data?.matches || [];
  const results = all.filter(m => m.status === 'FT').sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const upcoming = all.filter(m => m.status === 'NS').sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const display = tab === 'results' ? results : upcoming;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">Matches</h1>
        <p className="text-gray-600 mt-1">Betway Premiership 2025/26</p>
        <div className="gold-line w-32 mt-4" />
      </div>
      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl w-fit shadow-inner">
        {['results', 'upcoming'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t 
                ? 'bg-white text-psl-gold shadow-sm border border-psl-gold/20' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >{t}</button>
        ))}
      </div>
      <div className="space-y-3">
        {display.map((m, i) => (
          <div key={i} className="match-card p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-600">{m.venue || 'TBC'}</span>
              <span className="text-xs text-psl-gold/60 font-medium">{m.date}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3 justify-end">
                <span className="text-base font-semibold text-gray-900 text-right">{m.home_team_name}</span>
                <img src={m.home_team_logo} alt="" className="w-10 h-10 flex-shrink-0 logo-glow" />
              </div>
              {m.status === 'FT' ? (
                <div className="flex-shrink-0 px-5 py-2 rounded-xl bg-gray-100 border border-gray-200 min-w-[90px] text-center shadow-sm">
                  <span className="score-text text-3xl text-gray-900">{m.home_goals}</span>
                  <span className="text-gray-600 mx-2 text-sm">-</span>
                  <span className="score-text text-3xl text-gray-900">{m.away_goals}</span>
                  <div className="text-[10px] text-green-600 mt-0.5 font-semibold">FT</div>
                </div>
              ) : (
                <div className="flex-shrink-0 px-5 py-3 rounded-xl bg-psl-gold/10 border border-psl-gold/20 min-w-[90px] text-center">
                  <span className="text-sm text-psl-gold font-bold tracking-wider">VS</span>
                </div>
              )}
              <div className="flex-1 flex items-center gap-3">
                <img src={m.away_team_logo} alt="" className="w-10 h-10 flex-shrink-0 logo-glow" />
                <span className="text-base font-semibold text-gray-900">{m.away_team_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {display.length === 0 && <div className="text-center py-12 text-gray-600">No matches to display</div>}
    </div>
  );
}
