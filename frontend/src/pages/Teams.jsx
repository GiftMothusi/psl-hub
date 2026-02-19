import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';

export default function Teams() {
  const { data, loading } = useFetch(() => api.getTeams(), []);
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-psl-gold border-t-transparent rounded-full animate-spin" /></div>;
  const teams = data?.teams || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">All Teams</h1>
        <p className="text-gray-600 mt-1">The 16 clubs of the Betway Premiership 2025/26</p>
        <div className="gold-line w-32 mt-4" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team, i) => {
          const c1 = team.colors?.[0] || '#333';
          const c2 = team.colors?.[1] || '#666';
          return (
            <Link key={team.id} to={`/teams/${team.id}`} className="group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: `linear-gradient(145deg, ${c1}, ${c2})` }} />
              <div className="absolute inset-0 bg-psl-dark/60 group-hover:bg-psl-dark/40 transition-all" />
              <div className="relative z-10 p-6 flex flex-col items-center text-center h-[220px] justify-center">
                <img src={team.logo_url} alt={team.name} className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform duration-300 logo-glow" />
                <h3 className="font-display text-lg tracking-wider text-gray-900 group-hover:text-psl-gold transition-colors">{team.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{team.city}</p>
                {team.coach && <p className="text-[10px] text-gray-600 mt-1">Coach: {team.coach}</p>}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
