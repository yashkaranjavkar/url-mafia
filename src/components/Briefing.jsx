import React, { useState } from 'react';
import { BRIEFING } from '../data.js';
import { indicesForTell } from '../utils.js';
import TokenLine from './TokenLine.jsx';
import Diary from './Diary.jsx';

const segClass = (c) => (c === 'domain' ? 'mark-domain' : c === 'danger' ? 'mark-danger' : 'dim');

export default function Briefing({ onDone, onExit }) {
  const [i, setI] = useState(0);
  const [practice, setPractice] = useState(null); // { picked, ok, good }
  const s = BRIEFING[i];
  const isLast = i === BRIEFING.length - 1;

  const go = (n) => { setI(n); setPractice(null); };

  const pickPractice = (idx) => {
    const good = indicesForTell(s.practice.url, s.practice.answer);
    setPractice({ picked: idx, ok: good.includes(idx), good: new Set(good) });
  };

  return (
    <div className="briefing">
      <div className="paper case-file" key={i}>
        <div className="file-tab">How to play · {i + 1}/{BRIEFING.length}</div>
        <div className="kicker">{s.kicker}</div>
        <h3>{s.title}</h3>
        <p>{s.body}</p>

        {s.dissect && (
          <div className="dissect mono">
            {s.dissect.map((seg, k) => <span key={k} className={`seg ${segClass(seg.c)}`}>{seg.t}</span>)}
          </div>
        )}

        {s.diary && <Diary level={0} compact />}

        {s.practice && (
          <div className="practice">
            <TokenLine
              url={s.practice.url}
              onPick={pickPractice}
              disabled={practice?.ok}
              reveal={practice ? { good: practice.ok ? practice.good : new Set(), bad: practice.ok ? new Set() : new Set([practice.picked]) } : null}
            />
            {practice && (
              <div className={`practice-msg ${practice.ok ? 'good' : 'bad'}`}>
                {practice.ok
                  ? 'Correct! refund-desk.top is the real website. That\'s The Mask\'s trick.'
                  : 'Not quite. Find the first single slash, then read backwards.'}
              </div>
            )}
          </div>
        )}

        {s.scoring && (
          <div className="score-table">
            {s.scoring.map(([what, pts]) => (
              <div className="score-row" key={what}>
                <span>{what}</span>
                <b className={`mono ${pts.startsWith('−') ? 'neg' : ''}`}>{pts}</b>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nav-row">
        <button className="btn btn-ghost" onClick={() => (i === 0 ? onExit() : go(i - 1))}>
          {i === 0 ? '← Home' : 'Back'}
        </button>
        <div className="slide-progress">
          {BRIEFING.map((_, k) => (
            <button key={k} className={`dot ${k <= i ? 'on' : ''}`} onClick={() => go(k)} aria-label={`Page ${k + 1}`} />
          ))}
        </div>
        <div className="row-gap">
          {!isLast && <button className="btn btn-ghost btn-sm" onClick={onDone}>Skip</button>}
          <button className="btn btn-red" onClick={() => (isLast ? onDone() : go(i + 1))}>
            {isLast ? 'Start playing' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
