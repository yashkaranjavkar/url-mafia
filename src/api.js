// Every call to the game server goes through here.
// Each function resolves to the server's JSON, or { error } if the server can't be reached.

async function call(path, options) {
  try {
    const res = await fetch('/api' + path, { headers: { 'Content-Type': 'application/json' }, ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error || `Server said ${res.status}` };
    return data;
  } catch {
    return { error: 'Cannot reach the game server.', offline: true };
  }
}
const post = (path, body) => call(path, { method: 'POST', body: JSON.stringify(body) });

export const api = {
  hello: (id, callsign) => post('/hello', { id, callsign }),
  state: () => call('/state'),
  answer: (payload) => post('/answer', payload)
};
