import { useState, useContext, useRef } from 'react';
import { DataContext } from '../App';
import { G, SERIF } from '../lib/tokens';
import GoldDivider from '../components/GoldDivider';
import GoldBtn from '../components/GoldBtn';
import { FleurDeLis, LockIcon, CheckIcon } from '../components/icons';
import { saveData, saveUpcoming } from '../lib/dataLayer';
import { calcEventResults, positionPoints, PARTICIPATION } from '../lib/scoring';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'poker2025';

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw,  setPw]  = useState('');
  const [err, setErr] = useState(false);

  function attempt() {
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setErr(true);
      setPw('');
      setTimeout(() => setErr(false), 2000);
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 24,
    }}>
      <FleurDeLis size={48} opacity={0.6} />
      <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: G.text }}>
        Admin Login
      </h2>
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{ border: err ? `1px solid rgba(255,80,80,0.6)` : undefined }}
          autoFocus
        />
        {err && <div style={{ fontSize: 12, color: 'rgba(255,100,100,0.8)', textAlign: 'center' }}>Incorrect password</div>}
        <GoldBtn onClick={attempt}>Enter</GoldBtn>
      </div>
    </div>
  );
}

// ─── Tab: Enter Results ────────────────────────────────────────────────────────
function EnterResultsTab() {
  const { data, setData } = useContext(DataContext);
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [query,     setQuery]     = useState('');
  const [results,   setResults]   = useState([]); // { playerId, chop, fireball, firenote }
  const [preview,   setPreview]   = useState(false);
  const [saved,     setSaved]     = useState(false);

  const activePlayers = data.players.filter(p => p.active);
  const used          = new Set(results.map(r => r.playerId));
  const suggestions   = activePlayers.filter(p =>
    !used.has(p.id) && p.name.toLowerCase().includes(query.toLowerCase())
  );

  function addPlayer(player) {
    setResults(prev => [...prev, {
      playerId: player.id,
      position: prev.length + 1,
      chop:     false,
      fireball: 0,
      firenote: '',
    }]);
    setQuery('');
  }

  function removePlayer(idx) {
    setResults(prev => {
      const next = prev.filter((_, i) => i !== idx);
      return next.map((r, i) => ({ ...r, position: i + 1 }));
    });
  }

  function updateResult(idx, field, value) {
    setResults(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  async function handleSave() {
    if (!eventDate || !eventName || results.length === 0) return;
    const newEvent = {
      id:      `e-${Date.now()}`,
      date:    eventDate,
      name:    eventName,
      results: results.map(r => ({
        playerId: r.playerId,
        position: r.position,
        chop:     r.chop,
        fireball: Number(r.fireball) || 0,
        firenote: r.firenote,
      })),
    };
    const updated = { ...data, events: [newEvent, ...data.events] };
    await saveData(updated);
    setData(updated);
    setSaved(true);
    setResults([]);
    setEventDate('');
    setEventName('');
    setPreview(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function calcTotal(r) {
    return positionPoints(r.position) + PARTICIPATION + (Number(r.fireball) || 0);
  }

  return (
    <div>
      <GoldDivider label="New Event" />

      {saved && (
        <div style={{
          background: 'rgba(80,200,100,0.08)', border: '1px solid rgba(80,200,100,0.25)',
          borderRadius: 6, padding: '10px 16px', marginTop: 16,
          fontSize: 13, color: 'rgba(120,220,130,0.9)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckIcon size={14} color="rgba(120,220,130,0.9)" />
          Event saved and leaderboard updated!
        </div>
      )}

      <div className="admin-form-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 12, marginTop: 16,
      }}>
        <div>
          <label style={{ fontSize: 10, color: G.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Date</label>
          <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: G.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Event Name</label>
          <input
            placeholder="e.g. May Game"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
          />
        </div>
      </div>

      {/* Player search */}
      <div style={{ marginTop: 24, position: 'relative' }}>
        <label style={{ fontSize: 10, color: G.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Add Players (in finishing order)</label>
        <input
          placeholder="Search player name…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
            background: '#0e1120', border: `1px solid ${G.border}`,
            borderRadius: 4, marginTop: 2, overflow: 'hidden',
          }}>
            {suggestions.map(p => (
              <div
                key={p.id}
                onClick={() => addPlayer(p)}
                style={{
                  padding: '10px 14px', fontSize: 13, color: G.text, cursor: 'pointer',
                  borderBottom: `1px solid rgba(200,168,90,0.07)`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = G.goldFaint; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results list */}
      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="admin-res-header" style={{
            display: 'grid', gridTemplateColumns: '36px 1fr 80px 80px 80px 28px',
            padding: '0 8px 8px',
            fontSize: 9, letterSpacing: '0.14em', color: G.textFaint, textTransform: 'uppercase',
          }}>
            <span>Pos</span>
            <span>Player</span>
            <span style={{ textAlign: 'center' }}>Chop</span>
            <span style={{ textAlign: 'center' }}>🔥 Pts</span>
            <span className="admin-note">Note</span>
            <span />
          </div>

          {results.map((r, idx) => {
            const player = data.players.find(p => p.id === r.playerId);
            return (
              <div
                key={r.playerId}
                className="admin-res-row"
                style={{
                  display: 'grid', gridTemplateColumns: '36px 1fr 80px 80px 80px 28px',
                  alignItems: 'center', gap: 8,
                  padding: '8px',
                  background: idx % 2 === 0 ? 'rgba(200,168,90,0.02)' : 'transparent',
                  borderRadius: 4, marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 13, color: G.textDim, textAlign: 'center' }}>{r.position}</span>
                <span style={{ fontSize: 13, color: G.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {player?.name}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    checked={r.chop}
                    onChange={e => updateResult(idx, 'chop', e.target.checked)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  value={r.fireball || ''}
                  placeholder="0"
                  onChange={e => updateResult(idx, 'fireball', e.target.value)}
                  style={{ padding: '6px 10px', fontSize: 13, textAlign: 'center' }}
                />
                <input
                  className="admin-note"
                  placeholder="reason…"
                  value={r.firenote}
                  onChange={e => updateResult(idx, 'firenote', e.target.value)}
                  style={{ padding: '6px 10px', fontSize: 12 }}
                />
                <button
                  onClick={() => removePlayer(idx)}
                  style={{
                    background: 'none', border: 'none', color: G.textFaint,
                    cursor: 'pointer', fontSize: 16, lineHeight: 1,
                    padding: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,100,100,0.7)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = G.textFaint; }}
                >×</button>
              </div>
            );
          })}

          {/* Preview */}
          {preview && (
            <div style={{
              marginTop: 16, background: G.goldFaint, border: `1px solid ${G.border}`,
              borderRadius: 6, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', color: G.goldDim, marginBottom: 10, textTransform: 'uppercase' }}>
                Points Preview
              </div>
              {results.map(r => {
                const player = data.players.find(p => p.id === r.playerId);
                const total  = calcTotal(r);
                return (
                  <div key={r.playerId} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 13, padding: '4px 0',
                    borderBottom: `1px solid rgba(200,168,90,0.07)`,
                  }}>
                    <span style={{ color: G.textDim }}>{r.position}. {player?.name}</span>
                    <span style={{ color: G.gold }}>{total} pts</span>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <GoldBtn onClick={handleSave} disabled={!eventDate || !eventName || results.length === 0}>
              Save & Publish
            </GoldBtn>
            <GoldBtn ghost small onClick={() => setPreview(p => !p)}>
              {preview ? 'Hide' : 'Preview'} Points
            </GoldBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Players ─────────────────────────────────────────────────────────────
function PlayersTab() {
  const { data, setData } = useContext(DataContext);
  const [adding,   setAdding]   = useState(false);
  const [newName,  setNewName]  = useState('');

  async function addPlayer() {
    if (!newName.trim()) return;
    const player = {
      id:     Math.max(0, ...data.players.map(p => p.id)) + 1,
      name:   newName.trim(),
      active: true,
    };
    const updated = { ...data, players: [...data.players, player] };
    await saveData(updated);
    setData(updated);
    setNewName('');
    setAdding(false);
  }

  async function toggleActive(playerId) {
    const players = data.players.map(p =>
      p.id === playerId ? { ...p, active: !p.active } : p
    );
    const updated = { ...data, players };
    await saveData(updated);
    setData(updated);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <GoldDivider label="Players" right={`${data.players.length} total`} />
        <GoldBtn small onClick={() => setAdding(a => !a)} style={{ marginLeft: 16, flexShrink: 0 }}>
          + Add Player
        </GoldBtn>
      </div>

      {adding && (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <input
            placeholder="Player name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPlayer()}
            autoFocus
          />
          <GoldBtn small onClick={addPlayer} disabled={!newName.trim()}>Add</GoldBtn>
          <GoldBtn small ghost onClick={() => { setAdding(false); setNewName(''); }}>Cancel</GoldBtn>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.players.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            background: p.active ? G.goldFaint : 'rgba(232,223,200,0.02)',
            border: `1px solid ${p.active ? 'rgba(200,168,90,0.18)' : G.border}`,
            borderRadius: 6,
            opacity: p.active ? 1 : 0.55,
          }}>
            <span style={{ fontSize: 14, color: G.text }}>{p.name}</span>
            <GoldBtn small ghost onClick={() => toggleActive(p.id)}>
              {p.active ? 'Deactivate' : 'Reactivate'}
            </GoldBtn>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Schedule ────────────────────────────────────────────────────────────
function ScheduleTab() {
  const { data, setData } = useContext(DataContext);

  async function clearHost(slotId) {
    const upcoming = data.upcoming.map(u =>
      u.id === slotId ? { ...u, host: null, date: null, confirmed: false } : u
    );
    const updated = await saveUpcoming(upcoming);
    setData(updated);
  }

  return (
    <div>
      <GoldDivider label="Upcoming Schedule" />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.upcoming.map(slot => (
          <div key={slot.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            background: slot.confirmed ? G.goldFaint : 'rgba(232,223,200,0.02)',
            border: `1px solid ${slot.confirmed ? 'rgba(200,168,90,0.2)' : G.border}`,
            borderRadius: 6,
          }}>
            <div>
              <div style={{ fontSize: 14, color: G.text, marginBottom: 2 }}>{slot.month}</div>
              {slot.host && (
                <div style={{ fontSize: 12, color: G.textDim }}>
                  Host: <span style={{ color: G.gold }}>{slot.host}</span>
                  {slot.date && ` · ${slot.date}`}
                </div>
              )}
              {!slot.host && (
                <div style={{ fontSize: 12, color: G.textFaint }}>No host yet</div>
              )}
            </div>
            {slot.confirmed && (
              <GoldBtn small ghost onClick={() => clearHost(slot.id)}>Clear</GoldBtn>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
const TABS = ['Enter Results', 'Players', 'Schedule'];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab,    setTab]    = useState(0);

  if (!authed) return (
    <div className="fade-in page-pad" style={{ maxWidth: 480, margin: '0 auto', padding: '60px 24px' }}>
      <LoginScreen onLogin={() => setAuthed(true)} />
    </div>
  );

  return (
    <div className="fade-in page-pad" style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: G.goldDim, marginBottom: 8, textTransform: 'uppercase' }}>
          Commissioner Dashboard
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: G.text }}>Admin</h1>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 28,
        borderBottom: `1px solid ${G.border}`,
      }}>
        {TABS.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            style={{
              padding:       '10px 18px',
              background:    'none',
              border:        'none',
              fontSize:      13,
              fontWeight:    500,
              color:         tab === i ? G.gold : G.textDim,
              borderBottom:  tab === i ? `2px solid ${G.gold}` : '2px solid transparent',
              cursor:        'pointer',
              fontFamily:    "'DM Sans', sans-serif",
              letterSpacing: '0.04em',
              transition:    'color 0.15s',
            }}
          >{label}</button>
        ))}
      </div>

      {tab === 0 && <EnterResultsTab />}
      {tab === 1 && <PlayersTab />}
      {tab === 2 && <ScheduleTab />}
    </div>
  );
}
