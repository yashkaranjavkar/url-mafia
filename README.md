# URL Mafia · Phishing Spotter

A multiplayer scam-spotting game. A gang called the URL Mafia sends fake links to people around the world, and you have their hit list. Hunt the seven members one by one, weakest first: each level shows fake links using that member's trick (with less time as you climb), and the Boss uses every trick with the real website hidden. Crack enough of a member's links to capture them and strike their name from your diary; make three mistakes and they escape.

## Run it (development)

1. Install Node.js (LTS) from https://nodejs.org
2. Open this folder in VS Code (File → Open Folder)
3. Open a terminal (Terminal → New Terminal) and run:

```
npm install
npm run dev
```

4. Open http://localhost:5173

Other people on the same Wi-Fi can join using the "Network" address Vite prints in the terminal.

## Run it like a real server

```
npm run build
npm start
```

Then open http://localhost:3001. The server hosts the game and the API on one port.

## Where things live

- `src/data.js` — brands, the URL bank, the hit list (`FAMILY` and `BOSS`: each member's trick, links to crack, seconds per link), the people who ask you, How to play pages, ranks. Add more URLs here.
- `src/components/Diary.jsx`, `Mugshot.jsx` — the hit-list diary and mugshots.
- `src/components/Watch.jsx` — the hunt: levels, lives, captures, rounds and scoring.
- `server/index.js` — players, scores, leaderboard and live feed. Saves to `server/data.json`.
- `src/styles.css` — all the styling.

To reset the leaderboard, stop the server and delete `server/data.json`.
