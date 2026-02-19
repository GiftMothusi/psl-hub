import React from 'react';

const RESULT_STYLES = {
  W: {
    bg: 'bg-green-500',
    text: 'text-white',
    ring: 'ring-green-600',
    label: 'W',
  },
  D: {
    bg: 'bg-yellow-400',
    text: 'text-gray-900',
    ring: 'ring-yellow-500',
    label: 'D',
  },
  L: {
    bg: 'bg-red-500',
    text: 'text-white',
    ring: 'ring-red-600',
    label: 'L',
  },
};

const SIZE_STYLES = {
  sm: 'w-5 h-5 text-[9px] font-bold',
  md: 'w-7 h-7 text-xs font-bold',
};


export default function FormStrip({ form = [], size = 'sm', showLabel = false }) {
  if (!form || form.length === 0) {
    return (
      <div className="flex items-center gap-1">
        {showLabel && <span className="text-[10px] text-gray-500 mr-1">Form</span>}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`${SIZE_STYLES[size]} rounded-full bg-gray-200 flex items-center justify-center`}
          >
            <span className="text-gray-400">—</span>
          </div>
        ))}
      </div>
    );
  }

  const displayForm = [...form].reverse();

  return (
    <div className="flex items-center gap-1">
      {showLabel && (
        <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Form</span>
      )}
      {displayForm.map((entry, i) => {
        const style = RESULT_STYLES[entry.result] || RESULT_STYLES['D'];

        const tooltip = `${entry.result} ${entry.score} vs ${entry.opponent_name} (${entry.date})`;

        return (
          <div
            key={i}
            title={tooltip}
            className={`
              ${SIZE_STYLES[size]}
              ${style.bg} ${style.text}
              rounded-full flex items-center justify-center
              ring-1 ${style.ring}
              cursor-default
              hover:scale-125 transition-transform duration-150
            `}
          >
            {style.label}
          </div>
        );
      })}
    </div>
  );
}