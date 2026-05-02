import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../App';
import { G, SERIF } from '../lib/tokens';
import { calcStandings, fmtDate } from '../lib/scoring';
import GoldDivider from '../components/GoldDivider';
import { Trophy, ChevronRight } from '../components/icons';

function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: `linear-gradient(135deg, ${G.gold}, #e0c070)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0a0d18' }}>1</span>
      </div>
    );
  }
  return (
    <span style={{
      fontFamily: SERIF, fontSize: 15, fontWeight: 600,
      color: rank <= 3 ? G.text : G.textDim,
      width: 28, textAlign: 'center',
    }}>{rank}</span>
  );
}

export default function HomePage() {
  const { data } = useContext(DataContext);
  const navigate  = useNavigate();
  const [hovered, setHovered] = useState(null);

  const standings = calcStandings(data);
  const leader    = standings[0];

  const sortedEvents = [...data.events].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fade-in page-pad" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Season header */}
      <div className="leader-box" style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 36,
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: G.goldDim, marginBottom: 8, textTransform: 'uppercase' }}>
            2025 Season · Annual Leaderboard
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: G.text, lineHeight: 1.1 }}>
            Standings
          </h1>
        </div>

        {leader && (
          <div style={{
            background: G.goldFaint, border: `1px solid ${G.border}`,
            borderRadius: 6, padding: '12px 18px', textAlign: 'right',
          }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: G.goldDim, marginBottom: 4 }}>CURRENT LEADER</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
              <Trophy size={16} />
              <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: G.gold }}>
                {leader.name}
              </span>
            </div>
            <div style={{ fontSize: 12, color: G.textDim, marginTop: 2 }}>
              {leader.totalPts} pts · {leader.games} games
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div style={{ marginBottom: 48 }}>
        {/* Column headers */}
        <div className="lb-header" style={{
          display: 'grid',
          gridTemplateColumns: '52px 1fr 70px 90px 100px',
          padding: '0 20px 10px',
          fontSize: 9, letterSpacing: '0.18em', color: G.textFaint, textTransform: 'uppercase',
        }}>
          <span>Rank</span>
          <span>Player</span>
          <span style={{ textAlign: 'center' }}>Games</span>
          <span style={{ textAlign: 'right' }}>Points</span>
          <span className="lb-behind" style={{ textAlign: 'right' }}>Behind</span>
        </div>

        {/* Rows */}
        {standings.map(row => {
          const isFirst  = row.rank === 1;
          const behind   = leader ? leader.totalPts - row.totalPts : 0;

          return (
            <div
              key={row.playerId}
              onClick={() => navigate(`/players/${row.playerId}`)}
              onMouseEnter={() => setHovered(row.playerId)}
              onMouseLeave={() => setHovered(null)}
              className="lb-row"
              style={{
                display:         'grid',
                gridTemplateColumns: '52px 1fr 70px 90px 100px',
                alignItems:      'center',
                padding:         '14px 20px',
                cursor:          'pointer',
                borderRadius:    4,
                background:      isFirst
                  ? 'rgba(200,168,90,0.06)'
                  : hovered === row.playerId
                    ? 'rgba(200,168,90,0.04)'
                    : 'transparent',
                borderLeft:      isFirst ? `2px solid rgba(200,168,90,0.5)` : '2px solid transparent',
                transition:      'background 0.15s',
                marginBottom:    2,
              }}
            >
              <RankBadge rank={row.rank} />

              {/* Name + badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                {isFirst && <Trophy size={14} color={G.gold} />}
                <span style={{
                  fontFamily:  row.rank <= 3 ? SERIF : 'inherit',
                  fontSize:    row.rank <= 3 ? (isFirst ? 17 : 15) : 14,
                  fontWeight:  row.rank <= 3 ? 600 : 400,
                  color:       G.text,
                  overflow:    'hidden',
                  textOverflow:'ellipsis',
                  whiteSpace:  'nowrap',
                }}>{row.name}</span>
                {row.wins > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                    color: G.gold, background: 'rgba(200,168,90,0.12)',
                    border: `1px solid rgba(200,168,90,0.25)`,
                    borderRadius: 3, padding: '2px 5px', flexShrink: 0,
                  }}>{row.wins}W</span>
                )}
                {row.dropped && (
                  <span style={{
                    fontSize: 9, letterSpacing: '0.06em',
                    color: G.textFaint, background: 'rgba(232,223,200,0.06)',
                    borderRadius: 3, padding: '2px 5px', flexShrink: 0,
                  }}>DROP</span>
                )}
              </div>

              <span style={{ textAlign: 'center', fontSize: 13, color: G.textDim }}>
                {row.games}
              </span>

              <span style={{
                textAlign: 'right',
                fontFamily: isFirst ? SERIF : 'inherit',
                fontSize:   isFirst ? 18 : row.rank === 2 ? 15 : 13,
                fontWeight: row.rank <= 2 ? 600 : 400,
                color:      isFirst ? G.gold : G.text,
              }}>
                {row.totalPts}
              </span>

              <div className="lb-behind" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                {behind > 0 && (
                  <span style={{ fontSize: 13, color: G.textDim }}>−{behind}</span>
                )}
                <ChevronRight size={12} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Past games */}
      <GoldDivider label="Past Games" right={`${sortedEvents.length} games`} />
      <div style={{ marginTop: 16 }}>
        {sortedEvents.map(event => {
          const winner = event.results.find(r => r.position === 1);
          const winnerPlayer = winner ? data.players.find(p => p.id === winner.playerId) : null;

          return (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className="past-row"
              style={{
                display:       'flex',
                alignItems:    'center',
                justifyContent:'space-between',
                padding:       '14px 16px',
                borderRadius:  4,
                border:        `1px solid ${G.border}`,
                marginBottom:  8,
                cursor:        'pointer',
                transition:    'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = G.goldFaint;
                e.currentTarget.style.borderColor = G.borderHi;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = G.border;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: G.textFaint, letterSpacing: '0.06em', minWidth: 80 }}>
                  {fmtDate(event.date)}
                </span>
                <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: G.text }}>
                  {event.name}
                </span>
                <span style={{ fontSize: 11, color: G.textDim }}>
                  {event.results.length} players
                </span>
              </div>
              <div className="past-winner" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {winnerPlayer && (
                  <>
                    <Trophy size={12} />
                    <span style={{ fontSize: 12, color: G.gold }}>{winnerPlayer.name}</span>
                  </>
                )}
                <ChevronRight size={12} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
