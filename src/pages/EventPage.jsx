import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../App';
import { G, SERIF } from '../lib/tokens';
import { calcEventResults, fmtDate, ordinal } from '../lib/scoring';
import { ArrowLeft, Trophy } from '../components/icons';

export default function EventPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { data } = useContext(DataContext);

  const event = data.events.find(e => e.id === id);
  if (!event) return <div style={{ padding: 40, color: G.textDim }}>Event not found.</div>;

  const results = calcEventResults(event, data.players);

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

      {/* Event header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: G.text, marginBottom: 8 }}>
          {event.name}
        </h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: G.textDim }}>
          <span>{fmtDate(event.date)}</span>
          <span>·</span>
          <span>{results.length} players</span>
        </div>
      </div>

      {/* Results table */}
      <div style={{
        background: G.goldFaint, border: `1px solid ${G.border}`,
        borderRadius: 8, overflow: 'hidden',
      }}>
        {/* Header */}
        <div className="ev-header" style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 80px 80px 80px 80px',
          padding: '12px 20px',
          fontSize: 9, letterSpacing: '0.15em', color: G.textFaint, textTransform: 'uppercase',
          borderBottom: `1px solid ${G.border}`,
        }}>
          <span>Pos</span>
          <span>Player</span>
          <span style={{ textAlign: 'right' }}>Pos Pts</span>
          <span style={{ textAlign: 'right' }}>Bonus</span>
          <span className="ev-fireball" style={{ textAlign: 'right' }}>Fireball</span>
          <span style={{ textAlign: 'right' }}>Total</span>
        </div>

        {results.map((r, idx) => {
          const isFirst   = r.position === 1;
          const isLast    = idx === results.length - 1;

          return (
            <div
              key={r.playerId}
              className="ev-row"
              style={{
                display:     'grid',
                gridTemplateColumns: '60px 1fr 80px 80px 80px 80px',
                alignItems:  'center',
                padding:     '14px 20px',
                borderBottom: isLast ? 'none' : `1px solid rgba(200,168,90,0.07)`,
                background:  isFirst ? 'rgba(200,168,90,0.06)' : 'transparent',
              }}
            >
              {/* Position badge */}
              <div>
                {isFirst ? (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${G.gold}, #e0c070)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0a0d18' }}>1</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 14, color: G.textDim }}>{ordinal(r.position)}</span>
                )}
              </div>

              {/* Player name + badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isFirst && <Trophy size={14} />}
                <span style={{
                  fontFamily: isFirst ? SERIF : 'inherit',
                  fontSize:   isFirst ? 16 : 14,
                  fontWeight: isFirst ? 600 : 400,
                  color:      G.text,
                }}>
                  {r.player ? r.player.name : `Player ${r.playerId}`}
                </span>
                {r.chop && (
                  <span style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.06em',
                    color: G.gold, background: 'rgba(200,168,90,0.12)',
                    border: `1px solid rgba(200,168,90,0.25)`,
                    borderRadius: 3, padding: '2px 5px',
                  }}>CHOP</span>
                )}
                {r.firenote && (
                  <span style={{ fontSize: 11, color: G.textFaint, fontStyle: 'italic' }}>
                    🔥 {r.firenote}
                  </span>
                )}
              </div>

              <span style={{ textAlign: 'right', fontSize: 13, color: G.text }}>{r.posPts}</span>
              <span style={{ textAlign: 'right', fontSize: 13, color: G.textDim }}>5</span>
              <span className="ev-fireball" style={{
                textAlign: 'right', fontSize: 13,
                color: r.fireball ? G.gold : G.textFaint,
              }}>
                {r.fireball || '—'}
              </span>
              <span style={{
                textAlign:  'right',
                fontFamily: isFirst ? SERIF : 'inherit',
                fontSize:   isFirst ? 16 : 13,
                fontWeight: isFirst ? 600 : 400,
                color:      isFirst ? G.gold : G.text,
              }}>
                {r.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
