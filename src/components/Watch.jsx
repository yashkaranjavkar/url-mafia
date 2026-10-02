import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { CANNED_BANK, HIT_LIST, LIVES, PEOPLE, brandById, mobsterById } from '../data.js';
import { indicesForTell, store } from '../utils.js';
import TokenLine from './TokenLine.jsx';
import Mugshot from './Mugshot.jsx';
import Diary from './Diary.jsx';

const LEGIT_SHARE = 0.35; // about a third of URLs are genuine, so "always say fake" doesn't pay
const FREE_SECONDS = 30;  // after the whole list is crossed out
const FRESH_HUNT = { level: 0, hits: 0, lives: LIVES };

// Draw the next URL for this target without repeats until that pool is used up.
// Fakes come from the target's own trick; the Boss (and free play) draws from every trick.
function nextUrl(target) {
  const wantLegit = Math.random() < LEGIT_SHARE;
  const onlyTrick = target && target.id !== 'boss' ? target.id : null;
  const seen = new Set(store.get('um_seen', []));
  const pool = CANNED_BANK.map((c, i) => ({ ...c, i }))
    .filter((c) => (wantLegit ? !c.isPhishing : c.isPhishing && (!onlyTrick || c.technique === onlyTrick)));
  let fresh = pool.filter((c) => !seen.has(c.i));
  if (fresh.length === 0) {
    pool.forEach((c) => seen.delete(c.i));
    fresh = pool;
  }
  const item = fresh[Math.floor(Math.random() * fresh.length)];
  seen.add(item.i);
  store.set('um_seen', [...seen]);
  const person = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
  return { ...item, person, good: indicesForTell(item.url, item.tell) };
}

const BASE = { caught: 100, 'legit-ok': 60, 'wrong-part': 30, missed: -25, 'false-alarm': -25, timeout: 0 };
const COSTS_LIFE = { missed: true, 'false-alarm': true, timeout: true };
// What happened to the person who asked, per outcome.
const HEADLINE = {
  caught: (n) => `Cracked it! ${n} is safe.`,
  'legit-ok': (n) => `Correct, it's real. ${n} can go ahead.`,
  'wrong-part': () => `Right, it's fake. But that's not the giveaway.`,
  missed: (n) => `It was fake. ${n} got scammed.`,
  'false-alarm': (n) => `That one was real. ${n} missed a real message.`,
  timeout: (n) => `Time's up. ${n} couldn't wait.`
};

const Hearts = ({ lives }) => (
  <span className="hearts" aria-label={`${lives} of ${LIVES} lives left`}>
    {Array.from({ length: LIVES }, (_, k) => <i key={k} className={k < lives ? 'on' : ''}>♥</i>)}
  </span>
);

export default function Watch({ playerId, onScore, toast }) {
  const [hunt, setHunt] = useState(() => ({ ...FRESH_HUNT, ...store.get('um_hunt', {}) }));
  const target = HIT_LIST[hunt.level] || null; // null = free play after the list is done
  // intro: target dossier · play · captured: strike the name · escaped · done: whole list crossed out
  const [phase, setPhase] = useState(() => (target && hunt.hits === 0 && hunt.lives === LIVES ? 'intro' : 'play'));
  const [round, setRound] = useState(() => nextUrl(target));
  const seconds = target?.seconds ?? FREE_SECONDS;
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(() => store.get('um_streak', 0));
  const [hard, setHard] = useState(() => store.get('um_hard', false));
  const [session, setSession] = useState({ rounds: 0, right: 0, pts: 0 });
  const done = useRef(false);

  const saveHunt = (h) => { setHunt(h); store.set('um_hunt', h); };
  const brand = brandById(round.brandId);
  const culprit = round.isPhishing ? mobsterById(round.technique) : null;
  const hideHint = hard || !!target?.hideHint;

  const resolve = useCallback(
    (pick) => {
      if (done.current) return;
      done.current = true;

      let outcome;
      if (pick.type === 'timeout') outcome = 'timeout';
      else if (pick.type === 'legit') outcome = round.isPhishing ? 'missed' : 'legit-ok';
      else if (!round.isPhishing) outcome = 'false-alarm';
      else outcome = round.good.includes(pick.idx) ? 'caught' : 'wrong-part';

      const success = outcome === 'caught' || outcome === 'legit-ok';
      const newStreak = success ? streak + 1 : 0;
      const mult = (newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1) * (hideHint ? 1.25 : 1);
      const speed = success ? timeLeft * 3 : 0;
      const points = BASE[outcome] > 0 ? Math.round((BASE[outcome] + speed) * mult) : BASE[outcome];

      setStreak(newStreak);
      store.set('um_streak', newStreak);
      setSession((s) => ({ rounds: s.rounds + 1, right: s.right + (success ? 1 : 0), pts: s.pts + points }));

      // Move the hunt along. `after` is what the target bar shows on this result;
      // `nextHunt` is saved now (so a refresh keeps it) and shown once the player moves on.
      let after = hunt, nextHunt = hunt, captured = false, escaped = false;
      if (target) {
        after = {
          ...hunt,
          hits: hunt.hits + (outcome === 'caught' ? 1 : 0),
          lives: hunt.lives - (COSTS_LIFE[outcome] ? 1 : 0)
        };
        captured = after.hits >= target.goal;
        escaped = !captured && after.lives <= 0;
        nextHunt = captured ? { level: hunt.level + 1, hits: 0, lives: LIVES } : escaped ? { ...hunt, hits: 0, lives: LIVES } : after;
        store.set('um_hunt', nextHunt);
        if (!captured && !escaped) setHunt(nextHunt);
      }
      setResult({ outcome, points, picked: pick.idx, success, speed, mult, after, nextHunt, captured, escaped, lostLife: !!(target && COSTS_LIFE[outcome]) });

      if (newStreak === 3 || newStreak === 5 || (newStreak > 5 && newStreak % 5 === 0)) toast(`🔥 ${newStreak} in a row`);

      api.answer({
        playerId, outcome, points, streak: newStreak,
        ...(captured && { captured: target.alias, crossed: nextHunt.level })
      }).then((r) => {
        if (r.player) onScore(r.player);
      });
    },
    [round, streak, hideHint, timeLeft, hunt, target, playerId, onScore, toast]
  );

  // The countdown only runs while a link is on screen.
  useEffect(() => {
    if (phase !== 'play' || result) return;
    if (timeLeft <= 0) { resolve({ type: 'timeout' }); return; }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, result, resolve]);

  const next = useCallback((level) => {
    const t = HIT_LIST[level] || null;
    done.current = false;
    setRound(nextUrl(t));
    setResult(null);
    setTimeLeft(t?.seconds ?? FREE_SECONDS);
  }, []);

  // After a result: either the next link, or a story beat (capture / escape).
  const advance = useCallback(() => {
    if (result?.captured) { setHunt(result.nextHunt); setPhase('captured'); return; }
    if (result?.escaped) { setHunt(result.nextHunt); setPhase('escaped'); return; }
    next(hunt.level);
  }, [result, hunt.level, next]);

  const startHunt = (h = hunt) => { next(h.level); setPhase('play'); };

  // Keyboard: L = safe, Enter or N = next link.
  useEffect(() => {
    if (phase !== 'play') return;
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (!result && (e.key === 'l' || e.key === 'L')) resolve({ type: 'legit' });
      if (result && (e.key === 'Enter' || e.key === 'n' || e.key === 'N')) advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, result, resolve, advance]);

  const toggleHard = () => {
    setHard((h) => { store.set('um_hard', !h); return !h; });
  };

  const reveal = result
    ? {
        good: new Set(round.good),
        bad: result.picked !== undefined && !round.good.includes(result.picked) ? new Set([result.picked]) : new Set()
      }
    : null;
  const pctLeft = (timeLeft / seconds) * 100;
  const low = timeLeft <= 4 && !result;
  const bar = result ? result.after : hunt; // what the target bar shows right now
  const barTarget = HIT_LIST[bar.level] || null;
  const prevTarget = HIT_LIST[hunt.level - 1];

  return (
    <main className="arena">
      {barTarget ? (
        <div className="target-bar">
          <Mugshot who={barTarget} tag={`0${bar.level + 1}`} size={46} />
          <div className="target-info">
            <span className="target-kicker">Target {bar.level + 1} of {HIT_LIST.length}</span>
            <b>{barTarget.alias}</b>
            <span className="small muted">{barTarget.trick}</span>
          </div>
          <div className="target-stats">
            <span className="mono small muted">Cracked</span>
            <span className="pips big">
              {Array.from({ length: barTarget.goal }, (_, k) => <i key={k} className={k < bar.hits ? 'on' : ''} />)}
            </span>
          </div>
          <div className="target-stats">
            <span className="mono small muted">Lives</span>
            <Hearts lives={bar.lives} />
          </div>
        </div>
      ) : (
        <div className="target-bar free">
          <b>Free hunt</b>
          <span className="small muted">Every name is crossed out. Links now use every trick.</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { saveHunt(FRESH_HUNT); setPhase('intro'); }}>New hunt</button>
        </div>
      )}

      <div className="session-strip mono">
        <span>People protected: <b>{session.right}</b>/<b>{session.rounds}</b> · <b>{session.pts}</b> pts</span>
        <span className={streak >= 3 ? 'streak hot' : 'streak'}>
          {streak >= 3 ? '🔥 ' : ''}Streak {streak}{streak >= 5 ? ' ×2' : streak >= 3 ? ' ×1.5' : ''}
        </span>
        <label className="hard-toggle" title={target?.hideHint ? 'The Boss always hides the real website' : !result && !hard ? 'Switch on between links' : 'Hides the real website'}>
          <input id="hard-mode" type="checkbox" checked={hideHint} onChange={toggleHard} disabled={!!target?.hideHint || (!result && !hard)} />
          Hard mode ×1.25
        </label>
      </div>

      <section className="paper round-card">
        <div className="case-head">
          <span className="asker">
            <span className="asker-avatar">{round.person.name[0]}</span>
            <span><b>{round.person.name}</b> <span className="ink-muted">in {round.person.city}</span></span>
          </span>
          <span className={`timer-num mono ${low ? 'warn' : ''}`}>{result ? '—' : `0:${String(timeLeft).padStart(2, '0')}`}</span>
        </div>
        <div className="fuse" aria-hidden="true">
          <div className={`fuse-fill ${low ? 'warn' : ''} ${result ? 'out' : ''}`} style={{ width: (result ? 0 : pctLeft) + '%' }} />
        </div>

        <p className="ask-bubble">I got this message. Is the link safe to tap?</p>

        <div className="intercept">
          <div className="intercept-label">The message</div>
          <div className="msg-from">
            <span className="msg-avatar">{brand.name[0]}</span>
            <div>
              <b>{brand.name}</b> <span className="ink-muted small">· {brand.kind}</span>
              {!hideHint && <div className="ink-muted small mono">Real website: {brand.domain}</div>}
            </div>
          </div>
          <p className="msg-body">“{brand.bait}”</p>
        </div>

        <div className="link-head">
          <span className="field-label">The link</span>
          {!result && <span className="tap-hint">Tap the fake part 👆</span>}
        </div>
        <TokenLine url={round.url} reveal={reveal} disabled={!!result || phase !== 'play'} onPick={(idx) => resolve({ type: 'token', idx })} />

        {!result && (
          <div className="action-row">
            <button className="btn btn-clean" onClick={() => resolve({ type: 'legit' })} disabled={phase !== 'play'}>✔ It's safe <kbd>L</kbd></button>
          </div>
        )}

        {result && (
          <>
            <div className={`stamp ${round.isPhishing ? 'forged' : 'clean'}`} aria-hidden="true">
              {round.isPhishing ? 'Fake' : 'Safe'}
            </div>
            <div className={`verdict ${result.success ? 'good' : 'bad'}`}>
              <div className="score-pop">
                {HEADLINE[result.outcome](round.person.name)} <span className="pts">{result.points > 0 ? '+' : ''}{result.points}</span>
              </div>
              {result.lostLife && <div className="life-lost mono">−1 life</div>}
              {result.success && (result.speed > 0 || result.mult > 1) && (
                <div className="ink-muted small mono">
                  {result.speed > 0 && `speed +${result.speed}`}{result.mult > 1 && ` · ×${result.mult}`}
                </div>
              )}
              <div className="explain">{round.explain}</div>
              {culprit && (
                <div className="culprit">
                  <Mugshot who={culprit} tag="SUSPECT" size={40} />
                  <div>
                    <div>Trick: <b>{culprit.alias}</b> · {culprit.trick}</div>
                    <div className="ink-muted small">{culprit.tip}</div>
                  </div>
                </div>
              )}
              <div className="action-row">
                <button className="btn btn-red btn-sm" onClick={advance} autoFocus>
                  {result.captured ? `✎ Cross out ${target.alias}` : result.escaped ? 'Continue' : 'Next link →'} <kbd>Enter</kbd>
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {phase === 'play' && <Diary level={hunt.level} compact />}

      {phase === 'intro' && target && (
        <div className="overlay">
          <div className="paper dossier">
            <div className="file-tab">Target {hunt.level + 1} of {HIT_LIST.length}</div>
            <div className="dossier-top">
              <Mugshot who={target} tag={`0${hunt.level + 1}`} size={92} />
              <div>
                <h2>{target.alias}</h2>
                <p className="taunt">“{target.taunt}”</p>
              </div>
            </div>
            <div className="dossier-row"><span className="field-label">Their trick</span><span>{target.mo}</span></div>
            <div className="dissect mono">
              {target.ex.map((s, k) => <span key={k} className={`seg ${s.c === 'danger' ? 'mark-danger' : 'dim'}`}>{s.t}</span>)}
            </div>
            <ul className="dossier-rules">
              <li>Crack <b>{target.goal}</b> of their fake links to capture them.</li>
              <li><b>{LIVES}</b> mistakes and they escape.</li>
              <li><b>{target.seconds}</b> seconds per link{target.hideHint ? ', and the real website is hidden' : ''}.</li>
            </ul>
            <button className="btn btn-red" onClick={() => startHunt()} autoFocus>Start the hunt</button>
          </div>
        </div>
      )}

      {phase === 'captured' && prevTarget && (
        <div className="overlay">
          <div className="beat">
            <h2 className="beat-title">{prevTarget.alias} <span className="blood">captured.</span></h2>
            <Diary level={hunt.level} striking={hunt.level - 1} />
            {hunt.level >= HIT_LIST.length ? (
              <button className="btn btn-red" onClick={() => setPhase('done')} autoFocus>Close the diary</button>
            ) : (
              <button className="btn btn-red" onClick={() => setPhase('intro')} autoFocus>Next target: {HIT_LIST[hunt.level].alias} →</button>
            )}
          </div>
        </div>
      )}

      {phase === 'escaped' && target && (
        <div className="overlay">
          <div className="paper dossier escaped">
            <Mugshot who={target} tag="ESCAPED" size={80} />
            <h2>{target.alias} got away.</h2>
            <p className="taunt">“{target.taunt}”</p>
            <p>Three mistakes. The trail is still fresh, so start this hunt again.</p>
            <button className="btn btn-red" onClick={() => startHunt()} autoFocus>Hunt again</button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="overlay">
          <div className="beat">
            <h2 className="beat-title">The URL Mafia is <span className="blood">finished.</span></h2>
            <Diary level={HIT_LIST.length} />
            <p className="beat-sub">Every name is crossed out. The world's phones are a little safer.</p>
            <div className="row-gap center">
              <button className="btn btn-red" onClick={() => startHunt({ level: HIT_LIST.length })} autoFocus>Keep playing</button>
              <button className="btn btn-ghost" onClick={() => { saveHunt(FRESH_HUNT); setPhase('intro'); next(0); }}>Start a new hunt</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
