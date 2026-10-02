import React, { useState } from 'react';

export default function CallsignModal({ initial, onCancel, onDone }) {
  const [value, setValue] = useState(initial || '');
  const go = (e) => {
    e.preventDefault();
    const v = value.trim().replace(/[<>]/g, '') || 'PLAYER_' + Math.floor(Math.random() * 9000 + 1000);
    onDone(v.slice(0, 18));
  };
  return (
    <div className="modal-back" onClick={onCancel}>
      <form className="paper modal" onClick={(e) => e.stopPropagation()} onSubmit={go}>
        <h2 className="hud-font">Pick a name</h2>
        <p>This is how you'll show on the leaderboard.</p>
        <input
          id="callsign"
          className="mono"
          autoFocus
          maxLength={18}
          placeholder="e.g. NIGHT_OWL"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="row-end">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-red">Start</button>
        </div>
      </form>
    </div>
  );
}
