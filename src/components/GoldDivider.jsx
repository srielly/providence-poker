import { G } from '../lib/tokens';

export default function GoldDivider({ label, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 4px' }}>
      <div style={{ width: 3, height: 16, background: G.gold, borderRadius: 2, flexShrink: 0 }} />
      <span style={{
        fontSize: 10, letterSpacing: '0.18em', color: G.goldDim,
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: G.border }} />
      {right && (
        <span style={{ fontSize: 10, color: G.textFaint, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
          {right}
        </span>
      )}
    </div>
  );
}
