import { useState, useContext } from 'react';
import { DataContext } from '../App';
import { G, SERIF } from '../lib/tokens';
import GoldDivider from '../components/GoldDivider';
import GoldBtn from '../components/GoldBtn';
import { CheckIcon, CalendarIcon, UserIcon } from '../components/icons';
import { saveUpcoming } from '../lib/dataLayer';

export default function UpcomingPage() {
  const { data, setData } = useContext(DataContext);
  const [claimingId, setClaimingId] = useState(null);
  const [hostName,   setHostName]   = useState('');
  const [hostDate,   setHostDate]   = useState('');
  const [flashId,    setFlashId]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [saveError,  setSaveError]  = useState(null);

  const confirmed = data.upcoming.filter(u => u.confirmed);
  const open      = data.upcoming.filter(u => !u.confirmed);

  async function handleClaim(slotId) {
    if (!hostName.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = data.upcoming.map(u =>
        u.id === slotId
          ? { ...u, host: hostName.trim(), date: hostDate || null, confirmed: true }
          : u
      );
      const newData = await saveUpcoming(updated);
      setData(newData);
      setClaimingId(null);
      setHostName('');
      setHostDate('');
      setFlashId(slotId);
      setTimeout(() => setFlashId(null), 3000);
    } catch (err) {
      setSaveError(err?.message || 'Failed to save — please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in page-pad" style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: G.goldDim, marginBottom: 8, textTransform: 'uppercase' }}>
          2026 Season
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: G.text, lineHeight: 1.1, marginBottom: 12 }}>
          Upcoming Games
        </h1>
        <p style={{ fontSize: 14, color: G.textDim, lineHeight: 1.6, maxWidth: 560 }}>
          Claim a month to host the next game. Once confirmed, your slot will appear on the schedule.
        </p>
      </div>

      {/* Confirmed */}
      {confirmed.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <GoldDivider label="Confirmed" right={`${confirmed.length} scheduled`} />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {confirmed.map(slot => (
              <div
                key={slot.id}
                className="upcoming-row"
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'space-between',
                  padding:      '16px 20px',
                  background:   G.goldFaint,
                  border:       `1px solid rgba(200,168,90,0.25)`,
                  borderRadius: 8,
                  position:     'relative',
                  overflow:     'hidden',
                }}
              >
                {/* Gold check circle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${G.gold}, #e0c070)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CheckIcon size={16} color="#0a0d18" />
                  </div>
                  <div>
                    <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: G.text }}>
                      {slot.month}
                    </div>
                    {slot.date && (
                      <div style={{ fontSize: 12, color: G.textDim, marginTop: 2 }}>{slot.date}</div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserIcon size={14} />
                  <span style={{ fontSize: 13, color: G.gold }}>{slot.host}</span>
                </div>

                {flashId === slot.id && (
                  <div style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 11, color: G.gold, background: 'rgba(200,168,90,0.12)',
                    borderRadius: 4, padding: '4px 10px',
                  }}>Claimed!</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open */}
      {open.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <GoldDivider label="Open — Claim a Month" />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {open.map(slot => (
              <div key={slot.id}>
                <div
                  className="upcoming-row"
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'space-between',
                    padding:      '16px 20px',
                    border:       `1px dashed ${G.border}`,
                    borderRadius: 8,
                    transition:   'border-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      border: `1.5px dashed ${G.goldDim}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <CalendarIcon size={14} />
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: G.textDim }}>
                      {slot.month}
                    </div>
                  </div>
                  <GoldBtn
                    small
                    ghost
                    onClick={() => {
                      setClaimingId(claimingId === slot.id ? null : slot.id);
                      setHostName('');
                      setHostDate('');
                    }}
                  >
                    {claimingId === slot.id ? 'Cancel' : 'Claim This Month'}
                  </GoldBtn>
                </div>

                {/* Inline claim form */}
                {claimingId === slot.id && (
                  <div style={{
                    background: G.goldFaint,
                    border: `1px solid ${G.border}`,
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    padding: '16px 20px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                  }}>
                    <input
                      placeholder="Your name"
                      value={hostName}
                      onChange={e => setHostName(e.target.value)}
                      autoFocus
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: G.goldDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Proposed Date (optional)
                      </label>
                      <input
                        type="date"
                        value={hostDate}
                        onChange={e => setHostDate(e.target.value)}
                      />
                    </div>
                    {saveError && (
                      <div style={{ fontSize: 12, color: '#e05a5a', padding: '4px 0' }}>{saveError}</div>
                    )}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <GoldBtn
                        small
                        onClick={() => handleClaim(slot.id)}
                        disabled={!hostName.trim() || saving}
                      >
                        {saving ? 'Saving…' : 'Confirm'}
                      </GoldBtn>
                      <GoldBtn
                        small ghost
                        onClick={() => { setClaimingId(null); setHostName(''); setHostDate(''); setSaveError(null); }}
                        disabled={saving}
                      >
                        Cancel
                      </GoldBtn>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info box */}
      <div style={{
        background: 'rgba(232,223,200,0.03)', border: `1px solid ${G.border}`,
        borderRadius: 6, padding: '14px 18px',
        fontSize: 12, color: G.textFaint, lineHeight: 1.6,
      }}>
        <strong style={{ color: G.textDim }}>How claiming works:</strong> Tap "Claim This Month" and enter your name to volunteer as host. The admin can make changes from the Admin dashboard.
      </div>
    </div>
  );
}
