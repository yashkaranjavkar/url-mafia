// Small helpers shared across the game.

// Split a URL into word-parts and punctuation, e.g. "a.b-c/d" -> a . b - c / d
export function tokenize(url) {
  return url.split(/(?<=[/.\-_:?&=@])|(?=[/.\-_:?&=@])/).filter((x) => x.length > 0);
}
export const isWord = (t) => /^[\p{L}\p{N}%]+$/u.test(t);

export function rankFor(points, table) {
  let r = table[0][1];
  let next = null;
  for (const [p, name] of table) {
    if (points >= p) r = name;
    else if (next === null) next = { at: p, name };
  }
  return { name: r, next };
}

// Index positions of tokens whose text is in a list (used by archive URLs).
export function indicesForTell(url, tell) {
  const set = new Set((tell || []).map((t) => t.toLowerCase()));
  return tokenize(url).map((t, i) => (isWord(t) && set.has(t.toLowerCase()) ? i : -1)).filter((i) => i >= 0);
}

// localStorage that never crashes (private windows can block it).
export const store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }
};

export function playerId() {
  let id = store.get('um_id');
  if (!id) {
    id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    store.set('um_id', id);
  }
  return id;
}

export function timeAgo(ts) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  return `${Math.round(s / 3600)}h ago`;
}
