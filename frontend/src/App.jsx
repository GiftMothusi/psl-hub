import React from 'react';
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-psl-light">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
            <Route path="/players/:playerId" element={<PlayerDetail />} />
            <Route path="/top-scorers" element={<TopScorers />} />
            <Route path="/h2h" element={<HeadToHead />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
