const BASE = '/api';

async function fetchJson(path) {
  try {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`API error: ${path}`, e);
    return null;
  }
}

export const api = {
  getStandings: () => fetchJson('/standings/'),
  getTopScorers: () => fetchJson('/standings/top-scorers'),
  getTeams: () => fetchJson('/teams/'),
  getTeam: (id) => fetchJson(`/teams/${id}`),
  getTeamRoster: (id) => fetchJson(`/teams/${id}/roster`),
  getMatches: (params = '') => fetchJson(`/matches/${params ? '?' + params : ''}`),
  getLive: () => fetchJson('/matches/live'),
  getFormFire: () => fetchJson('/features/form-fire'),
  getH2H: (a, b) => fetchJson(`/features/h2h?team_a=${a}&team_b=${b}`),
  getPlayer: (id) => fetchJson(`/players/${id}`),
};
