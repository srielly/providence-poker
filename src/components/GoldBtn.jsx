import { G } from '../lib/tokens';

export default function GoldBtn({ children, onClick, small, ghost, disabled, style: sx }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding:      small ? '7px 16px' : '11px 24px',
        background:   ghost
          ? 'transparent'
          : disabled
            ? 'rgba(200,168,90,0.15)'
            : 'linear-gradient(135deg, #c8a85a, #e0c070)',
        border:       ghost ? `1px solid ${G.borderHi}` : 'none',
        borderRadius: 4,
        color:        ghost ? G.gold : '#0a0d18',
        fontSize:     small ? 12 : 13,
        fontWeight:   600,
        letterSpacing:'0.06em',
        cursor:       disabled ? 'not-allowed' : 'pointer',
        opacity:      disabled ? 0.5 : 1,
        transition:   'opacity 0.15s, transform 0.1s',
        fontFamily:   "'DM Sans', sans-serif",
        ...sx,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1'; }}
    >{children}</button>
  );
}
