import React from 'react';
import { HIT_LIST } from '../data.js';

// The detective's diary: the hit list, handwritten. Captured names are struck through in red.
// level    = index of the member being hunted now (HIT_LIST.length = everyone captured)
// striking = index whose strike-through should animate right now (just captured)
export default function Diary({ level, striking = -1, compact = false }) {
  return (
    <div className={`diary ${compact ? 'compact' : ''}`}>
      <div className="diary-title">Hit list</div>
      <ol>
        {HIT_LIST.map((m, i) => {
          const state = i < level ? 'done' : i === level ? 'current' : 'locked';
          return (
            <li key={m.id} className={`diary-row ${state} ${i === striking ? 'striking' : ''}`}>
              <span className="diary-n">{i + 1}.</span>
              <span className="diary-name">{m.alias}</span>
              <span className="diary-note">
                {state === 'done' ? 'captured' : state === 'current' ? '← hunting' : m.id === 'boss' ? 'the Boss' : ''}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
