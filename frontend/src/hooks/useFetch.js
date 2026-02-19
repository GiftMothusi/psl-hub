import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error, refetch: () => fetcher().then(setData) };
}


export function useLiveFetch(fetcher, intervalMs = 60000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const doFetch = useCallback(() => {
    fetcher()
      .then(d => {
        setData(d);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    doFetch();

    const interval = setInterval(doFetch, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  const matches = data?.matches || [];
  const isLive = matches.some(m => m.status === 'LIVE' || m.status === 'HT');

  return { data, loading, lastUpdated, isLive };
}
