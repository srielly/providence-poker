import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../App';
import { G, SERIF } from '../lib/tokens';
import { calcStandings, fmtDate, ordinal } from '../lib/scoring';
import GoldDivider from '../components/GoldDivider';
import { ArrowLeft } from '../components/icons';

function StatBox({ label, value, gold }) {
  return (
    <div style={{
      background: G.goldFaint, border: `1px solid ${G.border}`,
      borderRadius: 6, padding: '16px 20px',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '0.16em', color: G.textFaint, marginBottom: 6, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{
        fontFamily: SERIF, fontSize: 24, fontWeight: 700,
        color: gold ? G.gold : G.text,
      }}>{value}</div>
    </div>
  );
}

export default function PlayerPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { data } = useContext(DataContext);

  const standings = calcStandings(data);
  const row       = standings.find(r => String(r.playerId) === String(id));

  if (!row) return (
    <div style={{ padding: 40, color: G.textDim }}>Player not found.</div>
  );

  // Build chronological scores with running total
  const chronoScores = [...row.allScores].sort((a, b) => new Date(a.date) - new Date(b.date));
  let running = 0;
  const scoredRows = chronoScores.map(sc => {
    const isDropped = row.dropped && row.dropped.eventId === sc.eventId;
    if (!isDropped) running += sc.total;
    return { ...sc, isDropped, running };
  });

  const bestFinish = row.best ? ordinal(row.best) : '—';
  const avg = row.games > 0 ? (row.totalPts / row.games).toFixed(1) : '0.0';

  return (
    <div className="fade-in page-pad" style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          color: G.textDim, fontSize: 13, marginBottom: 24,
          fontFamily: "'DM Sans', sans-serif",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = G.text; }}
        onMouseLeave={e => { e.currentTarget.style.color = G.textDim; }}
      >
        <ArrowLeft size={16} />
        Standings
      </button>

      {/* Header card */}
      <div style={{
        background: G.goldFaint, border: `1px solid ${G.border}`,
        borderRadius: 8, padding: '24px 28px', marginBottom: 28,
      }}>
        <div className="player-header-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <h1 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: G.text, marginBottom: 6 }}>
              {row.name}
            </h1>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: G.textDim }}>
              <span>Rank #{row.rank}</span>
              <span>·</span>
              <span style={{ color: G.gold }}>Active</span>
            </div>
          </div>
          <div className="player-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 280 }}>
            <StatBox label="Total Points"  value={row.totalPts} gold />
            <StatBox label="Games Played"  value={row.games} />
            <StatBox label="Best Finish"   value={bestFinish} />
            <StatBox label="Avg Points"    value={avg} />
          </div>
        </div>
      </div>

      {/* Drop rule banner */}
      {row.dropped && (
        <div style={{
          background: 'rgba(200,168,90,0.06)', border: `1px solid rgba(200,168,90,0.2)`,
          borderRadius: 6, padding: '10px 16px', marginBottom: 24,
          fontSize: 12, color: G.textDim,
        }}>
          <span style={{ color: G.gold, fontWeight: 600 }}>Drop rule applied</span>
          {' '}— lowest game ({row.dropped.name}, {row.dropped.total} pts) excluded from total.
        </div>
      )}

      {/* Points breakdown */}
      <GoldDivider label="Points Breakdown" right={`${row.games} games`} />
      <div style={{ marginTop: 16 }}>

        {/* Header */}
        <div className="bd-header" style={{
          display: 'grid',
          gridTemplateColumns: '110px 80px 80px 80px 80px 80px 80px',
          padding: '0 16px 10px',
          fontSize: 9, letterSpacing: '0.15em', color: G.textFaint, textTransform: 'uppercase',
        }}>
          <span>Date</span>
          <span>Finish</span>
          <span style={{ textAlign: 'right' }}>Pos Pts</span>
          <span style={{ textAlign: 'right' }}>Bonus</span>
          <span style={{ textAlign: 'right' }}>Fireball</span>
          <span style={{ textAlign: 'right' }}>Total</span>
          <span className="bd-running" style={{ textAlign: 'right' }}>Running</span>
        </div>

        {scoredRows.map(sc => (
          <div
            key={sc.eventId}
            className="bd-row"
            onClick={() => navigate(`/events/${sc.eventId}`)}
            style={{
              display:     'grid',
              gridTemplateColumns: '110px 80px 80px 80px 80px 80px 80px',
              alignItems:  'center',
              padding:     '12px 16px',
              borderRadius: 4,
              opacity:     sc.isDropped ? 0.45 : 1,
              cursor:      'pointer',
              transition:  'background 0.15s',
              marginBottom: 2,
              border:      `1px solid transparent`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = G.goldFaint;
              e.currentTarget.style.borderColor = G.border;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: G.text }}>{fmtDate(sc.date)}</div>
              <div style={{ fontSize: 10, color: G.textFaint, marginTop: 1 }}>{sc.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: G.text }}>{ordinal(sc.position)}</span>
              {sc.isDropped && (
                <span style={{
                  fontSize: 9, color: G.textFaint,
                  background: 'rgba(232,223,200,0.06)',
                  borderRadius: 2, padding: '1px 4px',
                }}>DROP</span>
              )}
            </div>
            <span style={{ textAlign: 'right', fontSize: 13, color: G.text }}>{sc.posPts}</span>
            <span style={{ textAlign: 'right', fontSize: 13, color: G.textDim }}>5</span>
            <span style={{ textAlign: 'right', fontSize: 13, color: sc.fireball ? G.gold : G.textFaint }}>
              {sc.fireball || '—'}
            </span>
            <span style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: G.text }}>
              {sc.total}
            </span>
            <span className="bd-running" style={{ textAlign: 'right', fontSize: 12, color: G.textDim }}>
              {sc.isDropped ? '—' : sc.running}
            </span>
          </div>
        ))}

        {/* Season total */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '110px 80px 80px 80px 80px 80px 80px',
          padding: '14px 16px',
          borderTop: `1px solid ${G.border}`,
          marginTop: 4,
        }}>
          <span style={{ fontSize: 11, color: G.textFaint, gridColumn: '1 / 6' }}>Season total</span>
          <span style={{ textAlign: 'right', fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: G.gold }}>
            {row.totalPts}
          </span>
          <span className="bd-running" />
        </div>
      </div>
    </div>
  );
}
