import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Standings from './pages/Standings';
import Matches from './pages/Matches';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import TopScorers from './pages/TopScorers';
import HeadToHead from './pages/HeadToHead';
import PlayerDetail from './pages/PlayerDetail';

import SearchModal from './components/SearchModal';
import News from './pages/News';
import { api } from './utils/api';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [teamsCache, setTeamsCache] = useState([]);
  const [scorersCache, setScorersCache] = useState([]);

  useEffect(() => {
    api.getTeams().then(d => setTeamsCache(d?.teams || []));
    api.getTopScorers().then(d => setScorersCache(d?.scorers || []));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Prevent browser's default Cmd+K action
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(reg => console.log('PSL Hub SW registered:', reg.scope))
          .catch(err => console.warn('SW registration failed:', err));
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-psl-light">
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/standings"    element={<Standings />} />
            <Route path="/matches"      element={<Matches />} />
            <Route path="/teams"        element={<Teams />} />
            <Route path="/teams/:teamId"element={<TeamDetail />} />
            <Route path="/players/:playerId" element={<PlayerDetail />} />
            <Route path="/top-scorers"  element={<TopScorers />} />
            <Route path="/h2h"          element={<HeadToHead />} />
            <Route path="/news"         element={<News />} />
          </Routes>
        </main>

        <Footer />
      </div>

      {searchOpen && (
        <SearchModal
          teams={teamsCache}
          scorers={scorersCache}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </BrowserRouter>
  );
}
