import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { G, SERIF } from '../lib/tokens';
import { FleurDeLis, LockIcon } from './icons';

const NAV_ITEMS = [
  { label: 'Standings', path: '/' },
  { label: 'Upcoming',  path: '/upcoming' },
  { label: 'Rules',     path: '/rules' },
];

function HamburgerIcon({ open }) {
  return (
    <div style={{ width: 20, height: 14, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          display:         'block',
          height:          2,
          background:      G.gold,
          borderRadius:    1,
          transition:      'transform 0.2s, opacity 0.2s',
          transformOrigin: 'center',
          opacity:         open && i === 1 ? 0 : 1,
          transform:       open
            ? i === 0 ? 'translateY(6px) rotate(45deg)'
            : i === 2 ? 'translateY(-6px) rotate(-45deg)'
            : 'none'
            : 'none',
        }} />
      ))}
    </div>
  );
}

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const goTo = (path) => { navigate(path); setMenuOpen(false); };

  return (
    <nav ref={navRef} style={{
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
        onClick={() => goTo('/')}
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

      {/* Desktop links */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'stretch', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => goTo(item.path)}
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
          onClick={() => goTo('/admin')}
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

      {/* Mobile hamburger button */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        style={{
          display:    'none',
          alignItems: 'center',
          padding:    '0 4px',
          background: 'none',
          border:     'none',
          cursor:     'pointer',
        }}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <HamburgerIcon open={menuOpen} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          position:       'absolute',
          top:            '100%',
          left:           0,
          right:          0,
          background:     'rgba(8,10,18,0.98)',
          backdropFilter: 'blur(12px)',
          borderBottom:   `1px solid ${G.border}`,
          paddingBottom:  8,
        }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  width:       '100%',
                  padding:     '14px 24px',
                  background:  'none',
                  border:      'none',
                  borderLeft:  active ? `2px solid ${G.gold}` : `2px solid transparent`,
                  fontSize:    15,
                  fontWeight:  500,
                  color:       active ? G.gold : G.textDim,
                  cursor:      'pointer',
                  fontFamily:  "'DM Sans', sans-serif",
                  textAlign:   'left',
                }}
              >{item.label}</button>
            );
          })}
          <button
            onClick={() => goTo('/admin')}
            style={{
              display:     'flex',
              alignItems:  'center',
              width:       '100%',
              padding:     '14px 24px',
              background:  'none',
              border:      'none',
              borderLeft:  isActive('/admin') ? `2px solid ${G.gold}` : `2px solid transparent`,
              borderTop:   `1px solid ${G.border}`,
              marginTop:   8,
              gap:         8,
              fontSize:    13,
              color:       isActive('/admin') ? G.gold : G.textFaint,
              cursor:      'pointer',
              fontFamily:  "'DM Sans', sans-serif",
              letterSpacing: '0.04em',
            }}
          >
            <LockIcon size={13} />
            Admin
          </button>
        </div>
      )}
    </nav>
  );
}
