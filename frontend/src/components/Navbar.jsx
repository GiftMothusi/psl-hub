import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/standings', label: 'Standings' },
  { path: '/matches', label: 'Matches' },
  { path: '/teams', label: 'Teams' },
  { path: '/top-scorers', label: 'Top Scorers' },
  { path: '/h2h', label: 'Head to Head' },
  { path: '/news', label: 'News' },
];

export default function Navbar({ onSearchOpen }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
            <img src="/psl_logo.png" alt="PSL Hub" className="h-16 w-auto" />
          <div className="hidden sm:block">
            <div className="text-[10px] text-psl-gold/70 tracking-[0.3em] uppercase">Betway Premiership 2025/26</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.path} to={n.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === n.path
                  ? 'bg-psl-gold/15 text-psl-gold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >{n.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* [CHANGE 3 — NEW] Search button with Cmd+K hint */}
          <button
            onClick={onSearchOpen}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
            title="Search (Cmd+K)"
          >
            {/* Magnifying glass icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">Search</span>
            <kbd className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-gray-200 text-gray-400">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onSearchOpen}
            className="md:hidden p-2 text-gray-600"
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 px-4 pb-4">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} onClick={() => setOpen(false)}
              className={`block py-3 px-3 rounded-lg text-sm font-medium ${
                pathname === n.path ? 'text-psl-gold bg-psl-gold/10' : 'text-gray-600'
              }`}
            >{n.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
