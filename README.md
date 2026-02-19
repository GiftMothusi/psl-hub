# PSL Hub v3.0 — Betway Premiership 2025/26

A Revamp of the South African Premier Soccer League website using modern UX/UI design. Zero API keys required.

## Features

### Core Data
- **League Standings** — Full 16-team table with real data (SuperSport.com source, verified fallback)
- **Match Centre** — Recent results and upcoming fixtures with scores, venues, dates
- **Team Profiles** — All 16 clubs with logos, history, trophy cabinets, stadium info, coaching staff
- **Squad Rosters** — Full player rosters scraped from Transfermarkt with photos, positions, ages, nationalities, market values
- **Player Profiles** — Individual player pages with detailed biographical info from Transfermarkt
- **Top Scorers** — Golden Boot leaderboard with goal tallies and appearance counts

### Analytics
- **Team Analytics** — Points per game, win rate, goals per game, projected season finish
- **Form/Attack/Defense ratings** — Computed from actual match data
- **Goal distribution** — Scored vs conceded with visual breakdowns
- **Season projections** — Projected final points total and finishing position
- **Win/Draw/Loss breakdown** — Visual percentage bars

### Other
- **Head to Head** — Compare any two teams from the league
- **Team History** — Club descriptions, founding year, trophy count

## Data Sources

| Source | What | Method |
|--------|------|--------|
| SuperSport.com | Standings, team logos | HTML scraping |
| Transfermarkt.co.za | Squad rosters, player photos, market values | HTML scraping |
| PSL.co.za | Fixtures, results, news | HTML scraping |
| Verified Data | Standings, fixtures fallback | Hardcoded (Feb 15 2026) |

All free. No API keys. No paid subscriptions.

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Runs on http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Vite, React Router
- **Backend**: Python, FastAPI, httpx, BeautifulSoup4, lxml
- **Design**: Dark theme, gold accents, glassmorphism, team-colored gradients
- **Architecture**: REST API with in-memory caching, async HTTP, graceful fallbacks
