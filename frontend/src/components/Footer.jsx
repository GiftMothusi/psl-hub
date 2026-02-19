import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="font-display text-2xl tracking-wider text-psl-gold">PSL HUB</div>
            <p className="text-xs text-gray-600 mt-1">Real-time Betway Premiership 2025/26 data</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              SuperSport.com
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              PSL.co.za
            </span>
            <span className="px-2 py-1 rounded bg-psl-gold/10 text-psl-gold/60">100% Free APIs</span>
          </div>
          <p className="text-xs text-gray-500"> 2026 PSL Hub. Not affiliated with the official PSL.</p>
        </div>
      </div>
    </footer>
  );
}
