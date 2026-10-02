import React from 'react';
import { timeAgo } from '../utils.js';

const ICON = { join: '★', streak: '🔥', capture: '✎' };

// A thin live ticker of what's happening across the game.
export default function Feed({ feed }) {
  if (!feed.length) return null;
  return (
    <div className="feed mono">
      <span className="feed-label">Live</span>
      {feed.slice(0, 6).map((f) => (
        <span key={f.id} className={`feed-item ${f.kind}`}>
          {ICON[f.kind] || '·'} {f.text} <i>{timeAgo(f.ts)}</i>
        </span>
      ))}
    </div>
  );
}
