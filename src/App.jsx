import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api.js';
import { playerId, rankFor, store } from './utils.js';
import { RANKS } from './data.js';
import Landing from './components/Landing.jsx';
import CallsignModal from './components/CallsignModal.jsx';
import Briefing from './components/Briefing.jsx';
import Hud from './components/Hud.jsx';
import Feed from './components/Feed.jsx';
import Watch from './components/Watch.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Toasts from './components/Toasts.jsx';

export default function App() {
  const id = useRef(playerId()).current;
  const [screen, setScreen] = useState('landing'); // landing | briefing | watch | leaderboard
  const [callsign, setCallsign] = useState(() => store.get('um_callsign', ''));
  const [me, setMe] = useState(null);       // my stats as the server sees them
  const [lobby, setLobby] = useState(null); // online count, leaderboard, feed
  const [offline, setOffline] = useState(false);
  const [askName, setAskName] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [briefed, setBriefed] = useState(() => store.get('um_briefed', false));

  const toast = useCallback((text, tone = 'gold') => {
    const t = { id: Math.random(), text, tone };
    setToasts((xs) => [...xs, t]);
    setTimeout(() => setToasts((xs) => xs.filter((x) => x.id !== t.id)), 3000);
  }, []);

  // Refresh the lobby every 4 seconds so the leaderboard and feed stay live.
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const s = await api.state();
      if (!alive) return;
      setOffline(!!s.offline);
      if (!s.error) setLobby(s);
    };
    tick();
    const t = setInterval(tick, 4000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  // Heartbeat so others see you on watch.
  useEffect(() => {
    if (!callsign) return;
    const beat = async () => {
      const r = await api.hello(id, callsign);
      if (r.player) setMe(r.player);
    };
    beat();
    const t = setInterval(beat, 15000);
    return () => clearInterval(t);
  }, [id, callsign]);

  // Announce promotions. The first score we see only sets the baseline.
  const lastRank = useRef(null);
  useEffect(() => {
    if (!me) return;
    const rank = rankFor(me.score, RANKS).name;
    if (lastRank.current && lastRank.current !== rank) toast(`★ Promoted to ${rank}`);
    lastRank.current = rank;
  }, [me, toast]);

  const start = () => setScreen(briefed ? 'watch' : 'briefing');

  const chooseCallsign = (name) => {
    setCallsign(name);
    store.set('um_callsign', name);
    setAskName(false);
    start();
  };

  const finishBriefing = () => {
    setBriefed(true);
    store.set('um_briefed', true);
    setScreen('watch');
  };

  const inGame = callsign && (screen === 'watch' || screen === 'leaderboard');

  return (
    <div id="app">
      {offline && (
        <div className="offline-bar">
          Game server offline, so scores won't save. Check that "npm run dev" is still running in VS Code.
        </div>
      )}

      {screen === 'landing' && (
        <Landing
          lobby={lobby}
          callsign={callsign}
          onStart={() => (callsign ? start() : setAskName(true))}
          onBoard={() => setScreen('leaderboard')}
          onRename={() => setAskName(true)}
        />
      )}

      {screen === 'briefing' && <Briefing onDone={finishBriefing} onExit={() => setScreen('landing')} />}

      {inGame && (
        <>
          <Hud
            me={me}
            callsign={callsign}
            lobby={lobby}
            screen={screen}
            onHome={() => setScreen('landing')}
            onBoard={() => setScreen(screen === 'leaderboard' ? 'watch' : 'leaderboard')}
            onBrief={() => setScreen('briefing')}
          />
          <Feed feed={lobby?.feed || []} />
        </>
      )}

      {screen === 'watch' && <Watch playerId={id} onScore={setMe} toast={toast} />}

      {screen === 'leaderboard' && (
        <Leaderboard
          lobby={lobby}
          myId={id}
          showBar={!inGame}
          onBack={() => setScreen(callsign ? 'watch' : 'landing')}
        />
      )}

      {askName && <CallsignModal initial={callsign} onCancel={() => setAskName(false)} onDone={chooseCallsign} />}
      <Toasts toasts={toasts} />
    </div>
  );
}
