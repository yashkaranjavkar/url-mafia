import React, { useState } from 'react';
import { HIT_LIST, RANKS } from '../data.js';
import { rankFor } from '../utils.js';

const SORTS = [
  { id: 'score', label: 'Points' },
  { id: 'accuracy', label: 'Accuracy' },
  { id: 'crossed', label: 'Hit list' },
  { id: 'bestStreak', label: 'Best streak' }
];

export default function Leaderboard({ lobby, myId, onBack, showBar }) {
  const [sort, setSort] = useState('score');
  const rows = [...(lobby?.leaderboard || [])]
    .filter((p) => sort !== 'accuracy' || p.rounds >= 10) // accuracy needs at least 10 answers to count
    .sort((a, b) => b[sort] - a[sort] || b.score - a.score);

  return (
    <main className="arena">
      {showBar && (
        <header className="hud">
          <div className="hud-left"><div className="logo hud-font">URL <span className="blood">MAFIA</span></div></div>
        </header>
      )}
      <section className="paper lb-wrap">
        <div className="lb-top">
          <h2 className="hud-font">Leaderboard</h2>
          <div className="seg-tabs" role="tablist">
            {SORTS.map((s) => (
              <button key={s.id} role="tab" aria-selected={sort === s.id} className={sort === s.id ? 'on' : ''} onClick={() => setSort(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        {sort === 'accuracy' && <p className="ink-muted small">Only players with 10+ links checked are ranked by accuracy.</p>}
        <div className="lb-scroll">
          <div className="lb-row head">
            <span>#</span><span>Player</span><span>Rank</span><span>Points</span><span>Acc.</span><span>List</span><span>Best</span>
          </div>
          {!lobby && <div className="empty">Loading…</div>}
          {lobby && rows.length === 0 && <div className="empty">Nobody on the board yet. Be the first.</div>}
          {rows.map((p, i) => (
            <div key={p.id} className={`lb-row ${p.id === myId ? 'me' : ''}`}>
              <span className="lb-rank">{i + 1}</span>
              <span className="lb-name">{p.callsign}{p.id === myId && <em> (you)</em>}</span>
              <span className="ink-muted">{rankFor(p.score, RANKS).name}</span>
              <span className="c-gold">{p.score}</span>
              <span>{p.accuracy}%</span>
              <span>{p.crossed || 0}/{HIT_LIST.length}</span>
              <span>{p.bestStreak}</span>
            </div>
          ))}
        </div>
      </section>
      <button className="btn btn-ghost" onClick={onBack}>← Back</button>
    </main>
  );
}
