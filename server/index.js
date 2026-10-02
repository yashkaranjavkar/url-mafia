// URL Mafia game server (defender-only trainer).
// Keeps players, scores and the live feed, and saves them to data.json.
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const DIST = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------- storage
let db = { players: {}, feed: [] };
try {
  if (fs.existsSync(DATA_FILE)) db = { ...db, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) };
} catch {
  console.warn('Could not read data.json, starting fresh.');
}
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => fs.writeFile(DATA_FILE, JSON.stringify(db), () => {}), 800);
}

const OUTCOMES = ['caught', 'wrong-part', 'missed', 'legit-ok', 'false-alarm', 'timeout'];
const clean = (s, n) => String(s ?? '').replace(/[<>]/g, '').trim().slice(0, n);
const now = () => Date.now();
const newId = () => Math.random().toString(36).slice(2, 10) + now().toString(36).slice(-4);

function pushFeed(kind, text) {
  db.feed.unshift({ id: newId(), kind, text, ts: now() });
  db.feed = db.feed.slice(0, 40);
}
function publicPlayer(p) {
  const answered = p.rounds || 0;
  return {
    id: p.id, callsign: p.callsign, score: p.score || 0, rounds: answered,
    caught: p.caught || 0, bestStreak: p.bestStreak || 0, crossed: p.crossed || 0,
    accuracy: answered ? Math.round(((p.correct || 0) / answered) * 100) : 0
  };
}

// ---------------------------------------------------------------- app
const app = express();
app.use(express.json({ limit: '10kb' }));

// Join / heartbeat
app.post('/api/hello', (req, res) => {
  const pid = clean(req.body.id, 40);
  if (!pid) return res.status(400).json({ error: 'Missing player id.' });
  const callsign = clean(req.body.callsign, 18) || 'PLAYER_' + Math.floor(Math.random() * 9000 + 1000);
  let p = db.players[pid];
  if (!p) {
    p = db.players[pid] = { id: pid, callsign, score: 0, rounds: 0, correct: 0, caught: 0, bestStreak: 0 };
    pushFeed('join', `${callsign} joined the hunt`);
  }
  p.callsign = callsign;
  p.lastSeen = now();
  save();
  res.json({ player: publicPlayer(p) });
});

// Lobby: online count, leaderboard, feed
app.get('/api/state', (req, res) => {
  const t = now();
  const all = Object.values(db.players);
  res.json({
    online: all.filter((p) => t - (p.lastSeen || 0) < 45000).length,
    leaderboard: all.filter((p) => p.rounds > 0).map(publicPlayer).sort((a, b) => b.score - a.score).slice(0, 50),
    feed: db.feed.slice(0, 12)
  });
});

// A player reports one answered URL
app.post('/api/answer', (req, res) => {
  const p = db.players[clean(req.body.playerId, 40)];
  if (!p) return res.status(400).json({ error: 'Join first.' });
  const outcome = clean(req.body.outcome, 20);
  if (!OUTCOMES.includes(outcome)) return res.status(400).json({ error: 'Unknown outcome.' });
  const points = Math.max(-25, Math.min(400, Math.round(Number(req.body.points) || 0)));
  const streak = Math.max(0, Math.min(999, Math.round(Number(req.body.streak) || 0)));

  p.score = Math.max(0, (p.score || 0) + points);
  p.rounds = (p.rounds || 0) + 1;
  if (outcome === 'caught' || outcome === 'legit-ok') p.correct = (p.correct || 0) + 1;
  if (outcome === 'caught') p.caught = (p.caught || 0) + 1;
  if (streak > (p.bestStreak || 0)) {
    p.bestStreak = streak;
    if (streak >= 5 && streak % 5 === 0) pushFeed('streak', `${p.callsign} got ${streak} right in a row`);
  }
  // A gang member crossed off the player's hit list.
  const captured = clean(req.body.captured, 30);
  if (captured) {
    p.crossed = Math.max(p.crossed || 0, Math.max(0, Math.min(7, Math.round(Number(req.body.crossed) || 0))));
    pushFeed('capture', `${p.callsign} crossed out ${captured}`);
  }
  p.lastSeen = now();
  save();
  res.json({ player: publicPlayer(p) });
});

// In production (npm run build, then npm start) the server also hosts the game itself.
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (req, res) => res.sendFile(path.join(DIST, 'index.html')));
}

app.listen(PORT, '0.0.0.0', () => console.log(`URL Mafia server running on http://localhost:${PORT}`));
