import seed from '../data/seed.json';

const STORAGE_KEY = 'providence-poker-data';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Read full state — seeds from JSON on first load */
export async function getData() {
  let data = load();
  if (!data) {
    data = seed;
    save(data);
  }
  return data;
}

/** Persist full state */
export async function saveData(data) {
  save(data);
  return data;
}

export async function getPlayers()  { return (await getData()).players; }
export async function getEvents()   { return (await getData()).events; }
export async function getUpcoming() { return (await getData()).upcoming; }

export async function savePlayers(players) {
  const data = await getData();
  const updated = { ...data, players };
  save(updated);
  return updated;
}

export async function saveEvent(event) {
  const data = await getData();
  const idx  = data.events.findIndex(e => e.id === event.id);
  const events = idx >= 0
    ? data.events.map(e => e.id === event.id ? event : e)
    : [event, ...data.events];
  const updated = { ...data, events };
  save(updated);
  return updated;
}

export async function saveUpcoming(upcoming) {
  const data = await getData();
  const updated = { ...data, upcoming };
  save(updated);
  return updated;
}
