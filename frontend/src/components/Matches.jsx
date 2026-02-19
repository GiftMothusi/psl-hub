import React, { useState } from 'react';
import { api } from '../utils/api';
import { useFetch, useLiveFetch } from '../hooks/useFetch';
import MatchPrediction from '../components/MatchPrediction';


export default function Matches() {
  const [tab, setTab] = useState('results');

  const { data, loading } = useFetch(() => api.getMatches(), []);

  const { data: standingsData } = useFetch(() => api.getStandings(), []);

  const { data: liveData, isLive } = useLiveFetch(() => api.getLiveScores(), 60000);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-psl-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const all = data?.matches || [];
  const standings = standingsData?.standings || [];
  const liveMatches = liveData?.matches || [];

  const results = all.filter(m => m.status === 'FT')
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const upcoming = all.filter(m => m.status === 'NS')
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const display =
    tab === 'results' ? results :
    tab === 'live' ? liveMatches :
    upcoming;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">Matches</h1>
        <p className="text-gray-600 mt-1">Betway Premiership 2025/26</p>
        <div className="gold-line w-32 mt-4" />
      </div>

      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl w-fit shadow-inner">
        {[
          { key: 'results',  label: 'Results' },
          { key: 'upcoming', label: 'Fixtures' },
          { key: 'live',     label: 'Live', badge: isLive },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all flex items-center gap-1.5 ${
              tab === t.key
                ? 'bg-white text-psl-gold shadow-sm border border-psl-gold/20'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {t.label}
            {t.badge && (
              <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {display.map((m, i) => (
          <div key={i} className="match-card p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-600">{m.venue || 'TBC'}</span>
              <div className="flex items-center gap-2">
                {(m.status === 'LIVE' || m.status === 'HT') && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 pulse-dot">
                    {m.status === 'HT' ? 'HT' : `${m.minute || 'LIVE'}'`}
                  </span>
                )}
                <span className="text-xs text-psl-gold/60 font-medium">{m.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3 justify-end">
                <span className="text-base font-semibold text-gray-900 text-right">
                  {m.home_team_name}
                </span>
                <img src={m.home_team_logo} alt="" className="w-10 h-10 flex-shrink-0 logo-glow" />
              </div>

              {m.status === 'FT' || m.status === 'LIVE' || m.status === 'HT' ? (
                <div className="flex-shrink-0 px-5 py-2 rounded-xl bg-gray-100 border border-gray-200 min-w-[90px] text-center shadow-sm">
                  <span className="score-text text-3xl text-gray-900">{m.home_goals}</span>
                  <span className="text-gray-600 mx-2 text-sm">-</span>
                  <span className="score-text text-3xl text-gray-900">{m.away_goals}</span>
                  <div className={`text-[10px] mt-0.5 font-semibold ${
                    m.status === 'FT' ? 'text-green-600' : 'text-red-500 pulse-dot'
                  }`}>
                    {m.status}
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0 px-5 py-3 rounded-xl bg-psl-gold/10 border border-psl-gold/20 min-w-[90px] text-center">
                  <span className="text-sm text-psl-gold font-bold tracking-wider">VS</span>
                </div>
              )}

              <div className="flex-1 flex items-center gap-3">
                <img src={m.away_team_logo} alt="" className="w-10 h-10 flex-shrink-0 logo-glow" />
                <span className="text-base font-semibold text-gray-900">
                  {m.away_team_name}
                </span>
              </div>
            </div>

            {m.status === 'NS' && standings.length > 0 && (
              <MatchPrediction match={m} standings={standings} />
            )}
          </div>
        ))}
      </div>

      {display.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          {tab === 'live' ? 'No live matches right now.' : 'No matches to display'}
        </div>
      )}
    </div>
  );
}