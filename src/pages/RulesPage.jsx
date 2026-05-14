import { G, SERIF } from '../lib/tokens';
import GoldDivider from '../components/GoldDivider';
import { POSITION_POINTS } from '../lib/scoring';
import { FleurDeLis } from '../components/icons';

function PosPtsCard({ pos, pts }) {
  const isTop3 = pos <= 3;
  return (
    <div style={{
      background:   isTop3 ? G.goldFaint : 'rgba(232,223,200,0.03)',
      border:       `1px solid ${isTop3 ? 'rgba(200,168,90,0.25)' : G.border}`,
      borderRadius: 6,
      padding:      '12px 16px',
      display:      'flex',
      justifyContent: 'space-between',
      alignItems:   'center',
    }}>
      <span style={{ fontSize: 14, color: G.textDim }}>
        {pos === 1 ? '1st' : pos === 2 ? '2nd' : pos === 3 ? '3rd' : `${pos}th`} place
      </span>
      <span style={{
        fontFamily: SERIF, fontSize: 18, fontWeight: 600,
        color: isTop3 ? G.gold : G.text,
      }}>{pts}</span>
    </div>
  );
}

function BulletItem({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <FleurDeLis size={14} opacity={0.5} />
      <span style={{ fontSize: 13, color: G.textDim, lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

export default function RulesPage() {
  return (
    <div className="fade-in page-pad" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: G.goldDim, marginBottom: 8, textTransform: 'uppercase' }}>
          Providence Poker League
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: G.text, lineHeight: 1.1 }}>
          Scoring Rules
        </h1>
      </div>

      {/* Position Points */}
      <div style={{ marginBottom: 40 }}>
        <GoldDivider label="Position Points" />
        <div className="rules-pos-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginTop: 16,
        }}>
          {Object.entries(POSITION_POINTS).map(([pos, pts]) => (
            <PosPtsCard key={pos} pos={Number(pos)} pts={pts} />
          ))}
        </div>
      </div>

      {/* Bonus Points */}
      <div style={{ marginBottom: 40 }}>
        <GoldDivider label="Bonus Points" />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: G.goldFaint, border: `1px solid rgba(200,168,90,0.2)`,
            borderRadius: 6, padding: '14px 18px',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.text, marginBottom: 2 }}>Attendance</div>
              <div style={{ fontSize: 12, color: G.textFaint }}>Awarded to every player — the only points for 7th place and beyond</div>
            </div>
            <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: G.gold }}>+5</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(232,223,200,0.03)', border: `1px solid ${G.border}`,
            borderRadius: 6, padding: '14px 18px',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.text, marginBottom: 2 }}>🔥 Fireball</div>
              <div style={{ fontSize: 12, color: G.textFaint }}>Voted by the host for exceptional tomfoolery</div>
            </div>
            <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: G.gold }}>Variable</span>
          </div>
        </div>
      </div>

      {/* Chop Rules */}
      <div style={{ marginBottom: 40 }}>
        <GoldDivider label="Chop Rules" />
        <div style={{ marginTop: 16 }}>
          <BulletItem>
            When two or more players chop, the points for the chopped positions are averaged equally among them.
          </BulletItem>
          <BulletItem>
            Each chopped player also receives the +5 attendance bonus.
          </BulletItem>
          <BulletItem>
            Example: 3-way chop of 1st/2nd/3rd = (100 + 75 + 55) ÷ 3 = <strong style={{ color: G.gold }}>76.7 pts</strong> each.
          </BulletItem>

          {/* Example box */}
          <div style={{
            background: G.goldFaint, border: `1px solid ${G.border}`,
            borderRadius: 6, padding: '16px 20px', marginTop: 12,
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: G.goldDim, marginBottom: 10, textTransform: 'uppercase' }}>
              Worked Example
            </div>
            {[
              ['1st place points', '100'],
              ['2nd place points', '75'],
              ['3rd place points', '55'],
              ['Total pool', '230'],
              ['÷ 3 players', '76.7 pts each'],
            ].map(([label, val]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 13, padding: '4px 0',
                borderBottom: label === '÷ 3 players' ? `1px solid ${G.border}` : 'none',
                color: label === '÷ 3 players' ? G.gold : G.textDim,
                fontWeight: label === '÷ 3 players' ? 600 : 400,
                marginTop: label === '÷ 3 players' ? 8 : 0,
              }}>
                <span>{label}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annual Rules */}
      <div style={{ marginBottom: 40 }}>
        <GoldDivider label="Annual Ranking Rules" />
        <div style={{ marginTop: 16 }}>
          <BulletItem>
            Points accumulate across all games in the season (September–August).
          </BulletItem>
          <BulletItem>
            <strong style={{ color: G.text }}>Drop rule:</strong> If a player has played 8 or more games, their single lowest-scoring game is dropped from the total.
          </BulletItem>
          <BulletItem>
            <strong style={{ color: G.text }}>Tiebreaker:</strong> In case of equal total points, the player with more wins (1st-place finishes) ranks higher. If still tied, 2nd-place finishes are used.
          </BulletItem>
          <BulletItem>
            The season trophy goes to the player with the highest point total at year-end.
          </BulletItem>
        </div>
      </div>
    </div>
  );
}
