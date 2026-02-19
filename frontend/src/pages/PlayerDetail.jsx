import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';

export default function PlayerDetail() {
  const { playerId } = useParams();
  const { data: player, loading } = useFetch(() => api.getPlayer(playerId), [playerId]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-psl-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!player) return <div className="text-center py-20 text-gray-600">Player not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Photo */}
          <div className="flex-shrink-0">
            {player.photo_url ? (
              <img src={player.photo_url} alt={player.name} className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover bg-psl-card" />
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-psl-card flex items-center justify-center">
                <span className="font-display text-4xl text-gray-600">{player.name?.split(' ').map(n => n[0]).join('')}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {player.team_logo && <img src={player.team_logo} alt="" className="w-8 h-8" />}
              <span className="text-sm text-gray-600">{player.team_name}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900 mb-1">
              {player.full_name || player.name}
            </h1>
            <p className="text-lg text-psl-gold/70">{player.position}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {[
                player.number && player.number !== '-' && { l: 'Number', v: `#${player.number}` },
                player.age && { l: 'Age', v: player.age },
                player.nationality && { l: 'Nationality', v: player.nationality },
                player.height && { l: 'Height', v: player.height },
                player.preferred_foot && { l: 'Preferred Foot', v: player.preferred_foot },
                player.market_value && player.market_value !== '-' && { l: 'Market Value', v: player.market_value },
                player.date_of_birth && { l: 'Date of Birth', v: player.date_of_birth },
                player.place_of_birth && { l: 'Place of Birth', v: player.place_of_birth },
                player.contract_expires && { l: 'Contract Until', v: player.contract_expires },
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-gray-600">{item.l}</div>
                  <div className="text-sm font-semibold text-gray-900 mt-0.5">{item.v}</div>
                </div>
              ))}
            </div>

            {player.tm_url && (
              <div className="mt-6">
                <a href={player.tm_url} target="_blank" rel="noopener noreferrer" className="text-sm text-psl-gold hover:underline">
                  Full profile on Transfermarkt
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {player.team_id && (
          <Link to={`/teams/${player.team_id}`} className="text-sm text-psl-gold hover:underline">
            Back to {player.team_name}
          </Link>
        )}
      </div>
    </div>
  );
}
