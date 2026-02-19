import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';

const HERO_SLIDES = [
  {
    name: "Relebohile Mofokeng", team: "Orlando Pirates", tagline: "The Future of SA Football",
    stat: "5 Goals, 16 Appearances", bg: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #D4A843 100%)",
    logo: "https://images.supersport.com/media/wkfgti45/orlando-pirates.png",
  },
  {
    name: "Iqraam Rayners", team: "Mamelodi Sundowns", tagline: "Golden Boot Contender",
    stat: "6 Goals, 14 Appearances", bg: "linear-gradient(135deg, #059669 0%, #10B981 50%, #FCD34D 100%)",
    logo: "https://images.supersport.com/media/hiklyiw5/mamelodi_sundowns_fc_logo_200x200.png",
  },
  {
    name: "Ashley Du Preez", team: "Kaizer Chiefs", tagline: "Amakhosi's Talisman",
    stat: "5 Goals, 14 Appearances", bg: "linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #FCD34D 100%)",
    logo: "https://images.supersport.com/media/snyn3ar5/kaizerchiefs_new-logo_200x200.png",
  },
  {
    name: "Junior Dion", team: "Golden Arrows", tagline: "Leading the Golden Boot Race",
    stat: "8 Goals, 17 Appearances", bg: "linear-gradient(135deg, #059669 0%, #10B981 50%, #FCD34D 100%)",
    logo: "https://images.supersport.com/media/ou1p0ums/lamontville-golden-arrows.png",
  },
  {
    name: "Bradley Grobler", team: "Sekhukhune United", tagline: "The Veteran Marksman",
    stat: "7 Goals, 16 Appearances", bg: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #D4A843 100%)",
    logo: "https://images.supersport.com/media/ysvjj3ep/sekhuk-united.png",
  },
];

function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[idx];

  return (
    <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 transition-all duration-1000" style={{ background: s.bg }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-[0.12] transition-all duration-1000">
        <img src={s.logo} alt="" className="w-[300px] md:w-[400px]" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
        <div className="flex items-center gap-3 mb-4">
          <img src={s.logo} alt={s.team} className="w-14 h-14 md:w-16 md:h-16 logo-glow" />
          <span className="text-xs uppercase tracking-[0.3em] text-psl-gold/80 font-semibold">{s.team}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-white">{s.name}</h1>
        <p className="text-xl md:text-2xl text-white/90 mt-2 font-light">{s.tagline}</p>
        <p className="text-sm text-yellow-200 mt-3 tracking-wide">{s.stat}</p>
        <div className="flex gap-3 mt-8">
          <Link to="/standings" className="px-6 py-3 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all shadow-lg">
            View Standings
          </Link>
          <Link to="/matches" className="px-6 py-3 border border-white/30 text-white font-medium text-sm rounded-xl hover:bg-white/20 transition-all">
            Fixtures
          </Link>
        </div>
      </div>
      <div className="absolute bottom-6 left-8 md:left-16 flex gap-2 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? 'w-10 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

function StandingsPreview({ data }) {
  if (!data?.standings) return null;
  const top6 = data.standings.slice(0, 6);
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl tracking-wider text-gray-900">League Table</h2>
        <Link to="/standings" className="text-xs text-psl-gold hover:underline">Full Table</Link>
      </div>
      <div className="grid grid-cols-[28px_1fr_36px_36px_44px] gap-2 text-xs text-gray-600 pb-2 border-b border-gray-200 font-medium">
        <span>#</span><span>Team</span><span className="text-center">P</span><span className="text-center">GD</span><span className="text-right">Pts</span>
      </div>
      {top6.map((s, i) => (
        <Link to={`/teams/${s.team_id}`} key={i} className="grid grid-cols-[28px_1fr_36px_36px_44px] gap-2 items-center py-3 standing-row border-b border-gray-100">
          <span className={`text-sm font-bold ${i === 0 ? 'text-psl-gold' : 'text-gray-600'}`}>{s.rank}</span>
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={s.team_logo} alt="" className="w-6 h-6 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900 truncate">{s.team_name}</span>
          </div>
          <span className="text-sm text-gray-600 text-center">{s.played}</span>
          <span className={`text-sm text-center font-medium ${s.goal_difference > 0 ? 'text-green-600' : s.goal_difference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {s.goal_difference > 0 ? '+' : ''}{s.goal_difference}
          </span>
          <span className="text-sm font-bold text-gray-900 text-right">{s.points}</span>
        </Link>
      ))}
    </div>
  );
}

function RecentResults({ data }) {
  if (!data?.matches) return null;
  const results = data.matches.filter(m => m.status === 'FT').slice(0, 5);
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl tracking-wider text-gray-900">Recent Results</h2>
        <Link to="/matches" className="text-xs text-psl-gold hover:underline">All Matches</Link>
      </div>
      <div className="space-y-3">
        {results.map((m, i) => (
          <div key={i} className="match-card px-4 py-3 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 justify-end text-right min-w-0">
              <span className="text-sm text-gray-900 truncate">{m.home_team_name}</span>
              <img src={m.home_team_logo} alt="" className="w-7 h-7 flex-shrink-0" />
            </div>
            <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-100 min-w-[70px] text-center">
              <span className="score-text text-xl text-gray-900">{m.home_goals}</span>
              <span className="text-xs text-gray-600 mx-1">-</span>
              <span className="score-text text-xl text-gray-900">{m.away_goals}</span>
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <img src={m.away_team_logo} alt="" className="w-7 h-7 flex-shrink-0" />
              <span className="text-sm text-gray-900 truncate">{m.away_team_name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingFixtures({ data }) {
  if (!data?.matches) return null;
  const upcoming = data.matches.filter(m => m.status === 'NS').slice(0, 5);
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl tracking-wider text-gray-900">Upcoming Fixtures</h2>
      </div>
      <div className="space-y-3">
        {upcoming.map((m, i) => (
          <div key={i} className="match-card px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 justify-end text-right min-w-0">
                <span className="text-sm text-gray-900 truncate">{m.home_team_name}</span>
                <img src={m.home_team_logo} alt="" className="w-7 h-7 flex-shrink-0" />
              </div>
              <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-psl-gold/10 border border-psl-gold/20 min-w-[60px] text-center">
                <span className="text-xs text-psl-gold font-bold">VS</span>
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <img src={m.away_team_logo} alt="" className="w-7 h-7 flex-shrink-0" />
                <span className="text-sm text-gray-900 truncate">{m.away_team_name}</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-gray-600">{m.venue}</span>
              <span className="text-xs text-psl-gold/70">{m.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopScorersWidget({ data }) {
  if (!data?.scorers) return null;
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl tracking-wider text-gray-900">Top Scorers</h2>
        <Link to="/top-scorers" className="text-xs text-psl-gold hover:underline">Full List</Link>
      </div>
      <div className="space-y-3">
        {data.scorers.slice(0, 5).map((p, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i === 0 ? 'bg-psl-gold text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>{i + 1}</div>
            <img src={p.team_logo} alt="" className="w-6 h-6" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
              <div className="text-xs text-gray-600">{p.team}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-display text-psl-gold">{p.goals}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStats({ standings }) {
  if (!standings?.standings) return null;
  const s = standings.standings;
  const totalGoals = s.reduce((sum, t) => sum + t.goals_for, 0);
  const totalMatches = Math.round(s.reduce((sum, t) => sum + t.played, 0) / 2);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: 'TEAMS', value: '16', sub: 'Betway Premiership' },
        { label: 'LEADER', value: s[0]?.team_name?.split(' ').pop(), sub: `${s[0]?.points} pts` },
        { label: 'TOTAL GOALS', value: totalGoals, sub: 'This Season' },
        { label: 'MATCHDAY', value: Math.round(totalMatches / 16), sub: 'of 30 rounds' },
      ].map((item, i) => (
        <div key={i} className="glass-card px-4 py-4 text-center">
          <div className="text-[10px] tracking-[0.2em] text-gray-600 uppercase font-semibold">{item.label}</div>
          <div className="font-display text-3xl text-psl-gold mt-1">{item.value}</div>
          <div className="text-xs text-gray-600 mt-0.5">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: standings } = useFetch(() => api.getStandings(), []);
  const { data: matches } = useFetch(() => api.getMatches(), []);
  const { data: scorers } = useFetch(() => api.getTopScorers(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <HeroSlideshow />
      <QuickStats standings={standings} />
      <div className="gold-line w-full opacity-40" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StandingsPreview data={standings} />
        <RecentResults data={matches} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingFixtures data={matches} />
        <TopScorersWidget data={scorers} />
      </div>
    </div>
  );
}
