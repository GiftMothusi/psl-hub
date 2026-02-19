const _factCache = [1];
function factorial(n) {
  if (n < 0) return 1;
  for (let i = _factCache.length; i <= n; i++) {
    _factCache[i] = _factCache[i - 1] * i;
  }
  return _factCache[Math.min(n, 20)]; // cap at 20! to avoid Infinity
}


// ─────────────────────────────────────────────────────────────
// HELPER: Poisson probability mass function
// P(X = k) = (λ^k * e^-λ) / k!
// ─────────────────────────────────────────────────────────────
function poisson(k, lambda) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}


export function predictMatch(homeStanding, awayStanding, allStandings) {
  if (
    !homeStanding || !awayStanding ||
    homeStanding.played < 3 || awayStanding.played < 3
  ) {
    return null;
  }


  const totalGoals = allStandings.reduce((s, t) => s + (t.goals_for || 0), 0);
  const totalPlayed = allStandings.reduce((s, t) => s + (t.played || 0), 0);
  const avgGoalsPerGame = totalGoals / (totalPlayed / 2 || 1);


  const homeAttack = (homeStanding.goals_for / homeStanding.played) / avgGoalsPerGame;
  const homeDefence = (homeStanding.goals_against / homeStanding.played) / avgGoalsPerGame;
  const awayAttack = (awayStanding.goals_for / awayStanding.played) / avgGoalsPerGame;
  const awayDefence = (awayStanding.goals_against / awayStanding.played) / avgGoalsPerGame;

  const HOME_ADVANTAGE = 1.15;
  const lambdaHome = homeAttack * awayDefence * avgGoalsPerGame * HOME_ADVANTAGE;
  const lambdaAway = awayAttack * homeDefence * avgGoalsPerGame;

  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;

  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const p = poisson(h, lambdaHome) * poisson(a, lambdaAway);
      if (h > a) homeWinProb += p;
      else if (h === a) drawProb += p;
      else awayWinProb += p;
    }
  }

  const total = homeWinProb + drawProb + awayWinProb;
  const homeWin = Math.round((homeWinProb / total) * 100);
  const draw = Math.round((drawProb / total) * 100);
  const awayWin = 100 - homeWin - draw; // ensures exact 100

  const predictedScore = `${Math.round(lambdaHome)}-${Math.round(lambdaAway)}`;

  const minPlayed = Math.min(homeStanding.played, awayStanding.played);
  const confidence = minPlayed >= 14 ? 'High' : minPlayed >= 8 ? 'Medium' : 'Low';

  return {
    homeWin,
    draw,
    awayWin,
    predictedScore,
    lambdaHome: Math.round(lambdaHome * 10) / 10,
    lambdaAway: Math.round(lambdaAway * 10) / 10,
    confidence,
  };
}