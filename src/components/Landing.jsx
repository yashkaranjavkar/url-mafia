import React from 'react';
import { store } from '../utils.js';
import Diary from './Diary.jsx';

const STEPS = [
  { n: '1', title: 'Pick a target', text: 'Seven gang members, weakest first. Each one has a trick.' },
  { n: '2', title: 'Crack their links', text: 'People ask you if a link is safe. Spot the fake part.' },
  { n: '3', title: 'Cross them out', text: 'Crack enough and their name is struck from your diary.' }
];

export default function Landing({ lobby, onStart, onBoard, callsign, onRename }) {
  const online = lobby?.online ?? 0;
  return (
    <div className="landing">
      <div className="eyebrow">A scam-spotting game</div>
      <h1>
        URL <span className="blood">Mafia</span>
      </h1>
      <p className="tag">
        A gang is sending fake links to phones around the world.
        <br />
        You have their names. Hunt them down, one by one.
      </p>

      <ol className="steps">
        {STEPS.map((s) => (
          <li key={s.n}>
            <span className="step-n">{s.n}</span>
            <b>{s.title}</b>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>

      <div className="cta-row">
        <button className="btn btn-red" onClick={onStart}>Start playing</button>
        <button className="btn btn-ghost" onClick={onBoard}>Leaderboard</button>
      </div>
      {callsign && (
        <p className="welcome mono">
          Playing as <b>{callsign}</b> · <button className="linkish" onClick={onRename}>change</button>
        </p>
      )}
      <div className="live-row mono">
        <span className="live-dot" /> {online} player{online === 1 ? '' : 's'} online
      </div>

      <section className="wanted">
        <Diary level={store.get('um_hunt', { level: 0 }).level} />
      </section>

      <p className="footer-note">All brands, people and gang members are made up. No link here can be opened.</p>
    </div>
  );
}
