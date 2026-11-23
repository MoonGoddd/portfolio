import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relative : le dossier dist/ se déploie tel quel (Vercel, Netlify, GitHub Pages, OVH…)
// Deux pages : le portfolio (index.html) et le CV (cv.html), qui partagent les données de src/data/.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        portfolio: 'index.html',
        cv: 'cv.html',
      },
    },
  },
});
