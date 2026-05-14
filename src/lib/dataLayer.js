import { supabase } from './supabase.js'

function dbRowToResult(row) {
  return {
    playerId: row.player_id,
    position: row.position,
    chop:     row.chop,
    fireball: row.fireball,
    firenote: row.firenote,
  }
}

function resultToDbRow(eventId, r) {
  return {
    event_id:  eventId,
    player_id: r.playerId,
    position:  r.position,
    chop:      r.chop,
    fireball:  r.fireball || 0,
    firenote:  r.firenote || '',
  }
}

async function fetchAll() {
  const [
    { data: players,  error: pe },
    { data: events,   error: ee },
    { data: results,  error: re },
    { data: upcoming, error: ue },
  ] = await Promise.all([
    supabase.from('players').select('*').order('id'),
    supabase.from('events').select('*').order('date', { ascending: false }),
    supabase.from('event_results').select('*'),
    supabase.from('upcoming').select('*').order('id'),
  ])

  if (pe || ee || re || ue) throw pe || ee || re || ue

  const eventsWithResults = events.map(event => ({
    id:      event.id,
    date:    event.date,
    name:    event.name,
    results: results
      .filter(r => r.event_id === event.id)
      .sort((a, b) => a.position - b.position)
      .map(dbRowToResult),
  }))

  return { players, events: eventsWithResults, upcoming }
}

async function _saveEventToDb(event) {
  const { results, ...eventRow } = event

  const { error: ee } = await supabase.from('events').upsert(eventRow)
  if (ee) throw ee

  const { error: de } = await supabase.from('event_results').delete().eq('event_id', event.id)
  if (de) throw de

  if (results.length > 0) {
    const { error: re } = await supabase.from('event_results')
      .insert(results.map(r => resultToDbRow(event.id, r)))
    if (re) throw re
  }
}

export async function getData() {
  return fetchAll()
}

export async function saveData(data) {
  const { error: pe } = await supabase.from('players').upsert(data.players)
  if (pe) throw pe

  // Delete events removed from the local state (cascade removes their results)
  const keepIds = data.events.map(e => e.id)
  if (keepIds.length > 0) {
    const { error: de } = await supabase.from('events')
      .delete()
      .not('id', 'in', `(${keepIds.join(',')})`)
    if (de) throw de
  } else {
    const { error: de } = await supabase.from('events').delete().neq('id', '')
    if (de) throw de
  }

  for (const event of data.events) {
    await _saveEventToDb(event)
  }

  const upcomingRows = data.upcoming.map(u => ({
    id:        u.id,
    month:     u.month,
    host:      u.host  || null,
    date:      u.date  || null,
    confirmed: u.confirmed,
  }))
  const { error: ue } = await supabase.from('upcoming').upsert(upcomingRows)
  if (ue) throw ue

  return data
}

export async function saveEvent(event) {
  await _saveEventToDb(event)
  return fetchAll()
}

export async function getPlayers() {
  const { data, error } = await supabase.from('players').select('*').order('id')
  if (error) throw error
  return data
}

export async function getEvents() {
  const { events } = await fetchAll()
  return events
}

export async function getUpcoming() {
  const { data, error } = await supabase.from('upcoming').select('*').order('id')
  if (error) throw error
  return data
}

export async function deleteEvent(eventId) {
  const { error } = await supabase.from('events').delete().eq('id', eventId)
  if (error) throw error
  return fetchAll()
}

export async function deletePlayer(playerId) {
  const { error: re } = await supabase.from('event_results').delete().eq('player_id', playerId)
  if (re) throw re
  const { error: pe } = await supabase.from('players').delete().eq('id', playerId)
  if (pe) throw pe
  return fetchAll()
}

export async function savePlayers(players) {
  const { error } = await supabase.from('players').upsert(players)
  if (error) throw error
  return fetchAll()
}

export async function saveUpcoming(upcoming) {
  const rows = upcoming.map(u => ({
    id:        u.id,
    month:     u.month,
    host:      u.host  || null,
    date:      u.date  || null,
    confirmed: u.confirmed,
  }))
  const { error } = await supabase.from('upcoming').upsert(rows)
  if (error) throw error
  return fetchAll()
}
