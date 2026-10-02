import React from 'react';
import { tokenize, isWord } from '../utils.js';

// The clickable URL. Each word-part is a button; punctuation is plain text.
// selected: Set of indexes the player picked
// reveal:   { good: Set, bad: Set } shown after a round ends
export default function TokenLine({ url, selected, reveal, onPick, disabled }) {
  const toks = tokenize(url);
  return (
    <div className="tok-line">
      {toks.map((t, i) => {
        if (!isWord(t)) return <span key={i} className="tok punct">{t}</span>;
        let cls = 'tok word';
        if (selected?.has(i)) cls += ' selected';
        if (reveal?.good.has(i)) cls += ' reveal-correct';
        if (reveal?.bad.has(i)) cls += ' reveal-miss';
        return (
          <button key={i} type="button" className={cls} disabled={disabled} onClick={() => onPick?.(i, t)}>
            {t}
          </button>
        );
      })}
    </div>
  );
}
