import { useLocation, useNavigate } from 'react-router-dom';
import { G, SERIF } from '../lib/tokens';
import { FleurDeLis, LockIcon } from './icons';

const NAV_ITEMS = [
  { label: 'Standings', path: '/' },
  { label: 'Upcoming',  path: '/upcoming' },
  { label: 'Rules',     path: '/rules' },
];

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav style={{
      position:       'sticky',
      top:            0,
      zIndex:         100,
      background:     'rgba(8,10,18,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom:   `1px solid ${G.border}`,
      padding:        '0 40px',
      display:        'flex',
      alignItems:     'stretch',
      justifyContent: 'space-between',
    }} className="nav-pad">

      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        12,
          padding:    '16px 0',
          background: 'none',
          border:     'none',
          cursor:     'pointer',
        }}
      >
        <FleurDeLis size={28} />
        <span className="nav-logo" style={{
          fontFamily:    SERIF,
          fontSize:      18,
          fontWeight:    700,
          color:         G.gold,
          letterSpacing: '0.04em',
        }}>PROVIDENCE POKER</span>
        <span className="nav-year" style={{
          fontSize:      10,
          letterSpacing: '0.15em',
          color:         G.textFaint,
          paddingLeft:   6,
          borderLeft:    `1px solid ${G.border}`,
        }}>2026</span>
      </button>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding:       '0 18px',
                background:    'none',
                border:        'none',
                fontSize:      13,
                fontWeight:    500,
                letterSpacing: '0.06em',
                color:         active ? G.gold : G.textDim,
                borderBottom:  active ? `2px solid ${G.gold}` : '2px solid transparent',
                transition:    'color 0.15s, border-color 0.15s',
                cursor:        'pointer',
                fontFamily:    "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = G.text; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = G.textDim; }}
            >{item.label}</button>
          );
        })}

        <button
          onClick={() => navigate('/admin')}
          className="nav-admin"
          style={{
            padding:    '0 14px',
            background: 'none',
            border:     'none',
            display:    'flex',
            alignItems: 'center',
            gap:        5,
            fontSize:   11,
            color:      G.textFaint,
            marginLeft: 8,
            borderLeft: `1px solid ${G.border}`,
            cursor:     'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = G.textDim; }}
          onMouseLeave={e => { e.currentTarget.style.color = G.textFaint; }}
        >
          <LockIcon size={11} />
          Admin
        </button>
      </div>
    </nav>
  );
}
