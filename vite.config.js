import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The game server runs on port 3001. During development, Vite forwards
// every /api request to it, so the browser only ever talks to port 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // lets phones/laptops on the same Wi-Fi join
    port: 5173,
    proxy: { '/api': 'http://localhost:3001' }
  }
});
