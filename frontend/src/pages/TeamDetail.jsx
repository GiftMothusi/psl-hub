import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';

function StatBar({ label, value, max = 99 }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= 70 ? 'from-green-500 to-emerald-400' : pct >= 45 ? 'from-yellow-500 to-amber-400' : 'from-red-500 to-orange-400';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-900 w-10 text-right">{value}</span>
    </div>
  );
}

function AnalyticsPanel({ analytics, standing }) {
  if (!analytics) return null;
  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-xl tracking-wider text-gray-900 mb-5">Season Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Win Rate', value: `${analytics.win_rate}%`, color: analytics.win_rate >= 50 ? 'text-green-600' : 'text-gray-900' },
          { label: 'Pts/Game', value: analytics.points_per_game, color: 'text-psl-gold' },
          { label: 'Goals/Game', value: analytics.goals_per_game, color: 'text-gray-900' },
          { label: 'Projected Pts', value: analytics.projected_points, color: 'text-psl-gold' },
        ].map((s, i) => (
          <div key={i} className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <div className="text-[10px] tracking-[0.15em] text-gray-600 uppercase">{s.label}</div>
            <div className={`font-display text-2xl mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <StatBar label="Form Rating" value={analytics.form_rating} />
        <StatBar label="Attack" value={analytics.attack_rating} />
        <StatBar label="Defense" value={analytics.defense_rating} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="font-display text-xl text-green-400">{standing.wins || 0}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">Wins</div>
        </div>
        <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="font-display text-xl text-yellow-400">{standing.draws || 0}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">Draws</div>
        </div>
        <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="font-display text-xl text-red-400">{standing.losses || 0}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">Losses</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Season projection: </span>
        <span className="text-sm font-semibold text-psl-gold">{analytics.projected_finish}</span>
      </div>
    </div>
  );
}

function RosterPanel({ roster, teamId }) {
  if (!roster || roster.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="font-display text-xl tracking-wider text-gray-900 mb-4">Squad Roster</h3>
        <p className="text-gray-600 text-sm">Loading roster from Transfermarkt...</p>
      </div>
    );
  }

  const positions = ['Goalkeeper', 'Centre-Back', 'Left-Back', 'Right-Back', 'Defensive Midfield', 'Central Midfield', 'Attacking Midfield', 'Right Midfield', 'Left Winger', 'Right Winger', 'Centre-Forward'];
  const grouped = {};
  const posCategory = (pos) => {
    if (/goal/i.test(pos)) return 'Goalkeepers';
    if (/back|centre-b/i.test(pos)) return 'Defenders';
    if (/mid/i.test(pos)) return 'Midfielders';
    return 'Forwards';
  };
  roster.forEach(p => {
    const cat = posCategory(p.position);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl tracking-wider text-gray-900">Squad Roster</h3>
        <span className="text-xs text-gray-600">{roster.length} players</span>
      </div>
      {Object.entries(grouped).map(([category, players]) => (
        <div key={category} className="mb-6 last:mb-0">
          <h4 className="text-xs uppercase tracking-[0.2em] text-psl-gold/70 font-semibold mb-3 pb-2 border-b border-white/5">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {players.map((p, i) => (
              <Link key={i} to={p.id ? `/players/${p.id}` : '#'}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:border-psl-gold/20 hover:bg-white/[0.04] transition-all group"
              >
                {p.photo_url ? (
                  <img src={p.photo_url} alt={p.name} className="w-10 h-10 rounded-full object-cover bg-psl-card" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 ${p.photo_url ? 'hidden' : ''}`}>
                  {p.number !== '-' ? `#${p.number}` : p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-psl-gold transition-colors truncate">{p.name}</div>
                  <div className="text-xs text-gray-600">{p.position}{p.age ? `, ${p.age} yrs` : ''}{p.nationality ? ` · ${p.nationality}` : ''}</div>
                </div>
                {p.market_value && p.market_value !== '-' && (
                  <span className="text-xs text-psl-gold/60 shrink-0">{p.market_value}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TeamDetail() {
  const { teamId } = useParams();
  const [tab, setTab] = useState('overview');
  const { data: team, loading } = useFetch(() => api.getTeam(teamId), [teamId]);
  const { data: rosterData } = useFetch(() => api.getTeamRoster(teamId), [teamId]);
  const { data: matchData } = useFetch(() => api.getMatches(`team_id=${teamId}`), [teamId]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-psl-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!team) return <div className="text-center py-20 text-gray-600">Team not found</div>;

  const c1 = team.colors?.[0] || '#333';
  const c2 = team.colors?.[1] || '#666';
  const standing = team.standing || {};
  const analytics = team.analytics || {};
  const roster = rosterData?.players || [];
  const matches = matchData?.matches || [];
  const results = matches.filter(m => m.status === 'FT').slice(0, 6);
  const upcoming = matches.filter(m => m.status === 'NS').slice(0, 4);
  const trophies = team.trophies || {};
  const totalTrophies = Object.values(trophies).reduce((s, v) => s + v, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl h-[260px] md:h-[300px] mb-6">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c1}CC, ${c2}88, #0A0E17)` }} />
        <div className="absolute inset-0 bg-psl-dark/30" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.15]">
          <img src={team.logo_url} alt="" className="w-[220px] md:w-[280px]" />
        </div>
        <div className="relative z-10 h-full flex items-center px-8 md:px-12">
          <div className="flex items-center gap-6">
            <img src={team.logo_url} alt={team.name} className="w-24 h-24 md:w-28 md:h-28 logo-glow" />
            <div>
              <h1 className="font-display text-4xl md:text-6xl tracking-wider text-gray-900">{team.name}</h1>
              <p className="text-base text-gray-600 mt-1">{team.nickname}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-gray-600">
                <span>{team.stadium} ({team.capacity?.toLocaleString()} seats)</span>
                <span>{team.city}</span>
                <span>Est. {team.founded}</span>
                <span>Coach: {team.coach}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key stats strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {[
          { l: 'Position', v: standing.rank ? `#${standing.rank}` : '-', c: standing.rank <= 3 ? 'text-psl-gold' : 'text-white' },
          { l: 'Points', v: standing.points ?? '-', c: 'text-psl-gold' },
          { l: 'Played', v: standing.played ?? '-', c: 'text-white' },
          { l: 'Squad Value', v: team.squad_value || '-', c: 'text-white' },
          { l: 'Avg Age', v: team.avg_age || '-', c: 'text-white' },
          { l: 'Trophies', v: totalTrophies, c: totalTrophies > 0 ? 'text-psl-gold' : 'text-gray-500' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-3 text-center">
            <div className="text-[9px] tracking-[0.15em] uppercase text-gray-500 font-semibold">{s.l}</div>
            <div className={`font-display text-lg mt-0.5 ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-psl-navy/50 p-1 rounded-xl w-fit">
        {['overview', 'roster', 'analytics', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t ? 'bg-psl-gold text-psl-dark shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Recent Results */}
            <div className="glass-card p-6">
              <h3 className="font-display text-xl tracking-wider text-white mb-4">Recent Results</h3>
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((m, i) => (
                    <div key={i} className="match-card px-4 py-3 flex items-center gap-3">
                      <img src={m.home_team_logo} alt="" className="w-6 h-6" />
                      <span className="text-xs text-white flex-1 truncate">{m.home_team_name}</span>
                      <div className="px-2 py-1 rounded bg-psl-dark/60">
                        <span className="score-text text-base text-white">{m.home_goals} - {m.away_goals}</span>
                      </div>
                      <span className="text-xs text-white flex-1 truncate text-right">{m.away_team_name}</span>
                      <img src={m.away_team_logo} alt="" className="w-6 h-6" />
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">No recent results available</p>}
            </div>
            {/* Upcoming */}
            <div className="glass-card p-6">
              <h3 className="font-display text-xl tracking-wider text-white mb-4">Upcoming Fixtures</h3>
              {upcoming.length > 0 ? (
                <div className="space-y-2">
                  {upcoming.map((m, i) => (
                    <div key={i} className="match-card px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={m.home_team_logo} alt="" className="w-6 h-6" />
                        <span className="text-xs text-white flex-1 truncate">{m.home_team_name}</span>
                        <span className="text-xs text-psl-gold font-bold px-2">VS</span>
                        <span className="text-xs text-white flex-1 truncate text-right">{m.away_team_name}</span>
                        <img src={m.away_team_logo} alt="" className="w-6 h-6" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{m.date} — {m.venue}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">No upcoming fixtures</p>}
            </div>
          </div>
          <div className="space-y-6">
            <AnalyticsPanel analytics={analytics} standing={standing} />
          </div>
        </div>
      )}

      {tab === 'roster' && <RosterPanel roster={roster} teamId={teamId} />}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsPanel analytics={analytics} standing={standing} />
          <div className="glass-card p-6">
            <h3 className="font-display text-xl tracking-wider text-white mb-5">Goal Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Goals Scored</span>
                  <span className="text-green-400 font-bold">{standing.goals_for || 0}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: `${Math.min(100, (standing.goals_for || 0) / 30 * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Goals Conceded</span>
                  <span className="text-red-400 font-bold">{standing.goals_against || 0}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full" style={{ width: `${Math.min(100, (standing.goals_against || 0) / 30 * 100)}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-3">Win/Draw/Loss Breakdown</h4>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div className="bg-green-500 transition-all" style={{ width: `${analytics.win_rate || 0}%` }} />
                <div className="bg-yellow-500 transition-all" style={{ width: `${analytics.draw_rate || 0}%` }} />
                <div className="bg-red-500 transition-all" style={{ width: `${analytics.loss_rate || 0}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>W {analytics.win_rate}%</span>
                <span>D {analytics.draw_rate}%</span>
                <span>L {analytics.loss_rate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="glass-card p-6">
          <h3 className="font-display text-xl tracking-wider text-white mb-5">Club History</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">{team.description}</p>
          {totalTrophies > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-3">Trophy Cabinet</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {trophies.league > 0 && (
                  <div className="text-center p-4 bg-psl-gold/5 rounded-xl border border-psl-gold/10">
                    <div className="font-display text-3xl text-psl-gold">{trophies.league}</div>
                    <div className="text-xs text-gray-400 mt-1">League Titles</div>
                  </div>
                )}
                {trophies.nedbank_cup > 0 && (
                  <div className="text-center p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="font-display text-3xl text-white">{trophies.nedbank_cup}</div>
                    <div className="text-xs text-gray-400 mt-1">Nedbank Cup</div>
                  </div>
                )}
                {trophies.mtn8 > 0 && (
                  <div className="text-center p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="font-display text-3xl text-white">{trophies.mtn8}</div>
                    <div className="text-xs text-gray-400 mt-1">MTN8</div>
                  </div>
                )}
                {trophies.caf_cl > 0 && (
                  <div className="text-center p-4 bg-psl-gold/5 rounded-xl border border-psl-gold/10">
                    <div className="font-display text-3xl text-psl-gold">{trophies.caf_cl}</div>
                    <div className="text-xs text-gray-400 mt-1">CAF Champions League</div>
                  </div>
                )}
              </div>
            </div>
          )}
          {team.tm_url && (
            <div className="mt-6 pt-4 border-t border-white/5">
              <a href={team.tm_url} target="_blank" rel="noopener noreferrer" className="text-sm text-psl-gold hover:underline">
                View full profile on Transfermarkt
              </a>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <Link to="/teams" className="text-sm text-psl-gold hover:underline">Back to all teams</Link>
      </div>
    </div>
  );
}
