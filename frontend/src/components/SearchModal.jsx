import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function SearchModal({ teams = [], scorers = [], onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const teamResults = teams
      .filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.city?.toLowerCase().includes(q) ||
          t.nickname?.toLowerCase().includes(q) ||
          t.coach?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(t => ({
        type: 'team',
        label: t.name,
        sub: `${t.city} · Coach: ${t.coach}`,
        to: `/teams/${t.id}`,
        logo: t.logo_url,
        id: t.id,
      }));

    const playerResults = scorers
      .filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map(p => ({
        type: 'player',
        label: p.name,
        sub: `${p.team} · ${p.goals} goals`,
        to: `/players/${p.id || p.name}`,
        logo: p.team_logo,
        id: p.name,
      }));

    return [...teamResults, ...playerResults];
  }, [query, teams, scorers]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl mx-4 glass-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search teams, players, cities..."
            className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
          />

          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs text-gray-500 bg-gray-100 border border-gray-200">
            ESC
          </kbd>
        </div>

        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No results for <strong>"{query}"</strong>
              </p>
            ) : (
              <div className="p-2">
                {results.map((r, i) => (
                  <Link
                    key={i}
                    to={r.to}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-psl-gold/10 transition-colors group"
                  >
                    {r.logo ? (
                      <img src={r.logo} alt="" className="w-8 h-8 rounded-full object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-500">{r.label[0]}</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-psl-gold transition-colors truncate">
                        {r.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{r.sub}</div>
                    </div>

                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-psl-gold/30 text-psl-gold/60 flex-shrink-0">
                      {r.type}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="px-4 py-5 text-center text-sm text-gray-400">
            Type a team name, city or player...
          </div>
        )}
      </div>
    </div>
  );
}