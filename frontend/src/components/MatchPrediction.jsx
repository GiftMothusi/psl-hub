import React, { useMemo } from 'react';
import { predictMatch } from '../utils/predict';

export default function MatchPrediction({ match, standings = [] }) {
  const prediction = useMemo(() => {
    if (!match || standings.length === 0) return null;

    const homeStanding = standings.find(s => s.team_id === match.home_team_id);
    const awayStanding = standings.find(s => s.team_id === match.away_team_id);

    return predictMatch(homeStanding, awayStanding, standings);
  }, [match, standings]);

  if (!prediction) return null;

  const { homeWin, draw, awayWin, predictedScore, confidence } = prediction;

  const confColor =
    confidence === 'High' ? 'text-green-600' :
    confidence === 'Medium' ? 'text-yellow-600' : 'text-gray-500';

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          Prediction
        </span>
        <span className={`text-[10px] font-semibold ${confColor}`}>
          {confidence} confidence
        </span>
      </div>

      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span className="font-medium">{match.home_team_name}</span>
        <span className="text-gray-400">Draw</span>
        <span className="font-medium">{match.away_team_name}</span>
      </div>

      <div className="flex h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-green-500 transition-all duration-700"
          style={{ width: `${homeWin}%` }}
        />
        <div
          className="bg-yellow-400 transition-all duration-700"
          style={{ width: `${draw}%` }}
        />
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${awayWin}%` }}
        />
      </div>

      <div className="flex justify-between mt-1 text-[10px] font-bold">
        <span className="text-green-600">{homeWin}%</span>
        <span className="text-yellow-500">
          {draw}% · Predicted: <span className="text-psl-gold">{predictedScore}</span>
        </span>
        <span className="text-blue-600">{awayWin}%</span>
      </div>
    </div>
  );
}