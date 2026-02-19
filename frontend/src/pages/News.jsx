import React from 'react';
import { api } from '../utils/api';
import { useFetch } from '../hooks/useFetch';


const SOURCE_COLORS = {
  'supersport.com': 'bg-blue-100 text-blue-700',
  'kickoff.com':    'bg-green-100 text-green-700',
  'goal.com':       'bg-orange-100 text-orange-700',
};


function NewsCard({ article }) {
  const badgeClass = SOURCE_COLORS[article.source] || 'bg-gray-100 text-gray-600';

  let dateStr = article.date;
  try {
    dateStr = new Date(article.date).toLocaleDateString('en-ZA', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    // Keep raw string if parse fails
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-5 flex flex-col gap-3 hover:border-psl-gold/40 transition-all group"
    >
      <div className="flex items-center justify-between">
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {article.source}
        </span>
        <span className="text-xs text-gray-400">{dateStr}</span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-psl-gold transition-colors leading-snug line-clamp-2">
        {article.title}
      </h3>

      {article.summary && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {article.summary}
        </p>
      )}

      <span className="text-xs text-psl-gold/70 mt-auto">Read full article →</span>
    </a>
  );
}

function NewsSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  );
}

export default function News() {
  const { data, loading } = useFetch(() => api.getNews(18), []);
  const articles = data?.articles || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-gray-900">
          PSL News
        </h1>
        <p className="text-gray-600 mt-1">
          Latest Betway Premiership headlines from across the web
        </p>
        <div className="gold-line w-32 mt-4" />
      </div>

      {/* ── Source filter labels ─────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6 text-xs text-gray-500">
        <span>Sources:</span>
        {Object.keys(SOURCE_COLORS).map(s => (
          <span key={s} className={`px-2 py-0.5 rounded-full ${SOURCE_COLORS[s]}`}>
            {s}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? [...Array(9)].map((_, i) => <NewsSkeleton key={i} />)
          : articles.length === 0
          ? (
            <div className="col-span-3 text-center py-16 text-gray-500">
              <p className="text-lg">No news articles found at the moment.</p>
              <p className="text-sm mt-2">RSS feeds may be temporarily unavailable.</p>
            </div>
          )
          : articles.map((a, i) => <NewsCard key={i} article={a} />)
        }
      </div>
    </div>
  );
}