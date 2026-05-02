// ─── Scoring Engine ───────────────────────────────────────────────────────────
export const POSITION_POINTS = { 1:100, 2:75, 3:55, 4:40, 5:30, 6:22, 7:15, 8:10, 9:6, 10:3 };
export const PARTICIPATION = 5;

export function positionPoints(pos) {
  return POSITION_POINTS[pos] || 0;
}

/** Average position points across a list of positions (chop rule). */
export function chopPoints(positions) {
  const total = positions.reduce((sum, pos) => sum + positionPoints(pos), 0);
  return Math.round((total / positions.length) * 10) / 10;
}

export function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d + "T12:00:00");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function calcEventResults(event, players) {
  return event.results.map(r => {
    const player = players.find(p => p.id === r.playerId);
    const posPts = positionPoints(r.position);
    const total  = posPts + PARTICIPATION + (r.fireball || 0);
    return { ...r, player, posPts, participationPts: PARTICIPATION, total };
  }).sort((a, b) => a.position - b.position);
}

export function calcStandings(data) {
  const { players, events } = data;

  const statsMap = {};
  players.forEach(p => {
    statsMap[p.id] = {
      playerId: p.id,
      name: p.name,
      active: p.active,
      games: 0,
      scores: [],
      wins: 0,
    };
  });

  events.forEach(event => {
    event.results.forEach(r => {
      if (!statsMap[r.playerId]) return;
      const posPts = positionPoints(r.position);
      const total  = posPts + PARTICIPATION + (r.fireball || 0);
      statsMap[r.playerId].games++;
      statsMap[r.playerId].scores.push({
        eventId:  event.id,
        date:     event.date,
        name:     event.name,
        position: r.position,
        chop:     r.chop || false,
        posPts,
        fireball: r.fireball || 0,
        firenote: r.firenote || "",
        total,
      });
      if (r.position === 1) statsMap[r.playerId].wins++;
    });
  });

  const rows = Object.values(statsMap).map(s => {
    let scores = [...s.scores].sort((a, b) => a.total - b.total);
    let dropped = null;
    if (s.games >= 8) { dropped = scores[0]; scores = scores.slice(1); }
    const totalPts = scores.reduce((sum, sc) => sum + sc.total, 0);
    const avg  = s.games > 0 ? (totalPts / s.games).toFixed(1) : "0.0";
    const best = s.scores.length ? Math.min(...s.scores.map(sc => sc.position)) : null;
    return { ...s, totalPts, avg, best, dropped, allScores: s.scores };
  });

  rows.sort((a, b) => {
    if (b.totalPts !== a.totalPts) return b.totalPts - a.totalPts;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return 0;
  });

  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}
