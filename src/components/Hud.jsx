import React from 'react';
import { RANKS } from '../data.js';
import { rankFor } from '../utils.js';

export default function Hud({ me, callsign, lobby, screen, onBoard, onBrief, onHome }) {
  const points = me?.score ?? 0;
  const { name, next } = rankFor(points, RANKS);
  const pct = next ? Math.min(100, Math.round((points / next.at) * 100)) : 100;
  return (
    <header className="hud">
      <div className="hud-left">
        <button className="logo hud-font linkish" onClick={onHome}>
          URL <span className="blood">MAFIA</span>
        </button>
        {lobby && (
          <div className="stat online">
            <span className="live-dot" /> {lobby.online} online
          </div>
        )}
      </div>
      <div className="hud-mid">
        <div className="stat badge">★ <b>{name}</b> {callsign}</div>
        <div className="rank-bar" title={next ? `${next.at - points} pts to ${next.name}` : 'Top rank'}>
          <div className="rank-fill" style={{ width: pct + '%' }} />
        </div>
        <div className="stat small">{next ? `${next.at - points} pts to ${next.name}` : 'Top rank reached'}</div>
      </div>
      <div className="hud-right">
        <div className="stat pts">PTS <b>{points}</b></div>
        <button className="btn btn-ghost btn-sm" onClick={onBoard}>
          {screen === 'leaderboard' ? 'Back to game' : 'Leaderboard'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onBrief}>How to play</button>
      </div>
    </header>
  );
}
