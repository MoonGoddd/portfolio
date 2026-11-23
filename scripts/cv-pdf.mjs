// Régénère les PDF du CV (FR et EN) à partir de cv.html, pour qu'ils suivent toujours
// les données du portfolio (src/data/). À lancer après `npm run build` :
//   npm run cv:pdf
// Utilise un navigateur de la famille Chrome déjà installé (Chromium, Chrome, Brave, Edge, Vivaldi).
// Pour en indiquer un autre : CHROME_PATH=/chemin/vers/le/navigateur npm run cv:pdf

import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { preview } from 'vite';

const RACINE = resolve(import.meta.dirname, '..');
const PORT = 4318;
const FICHIERS = { fr: 'CV_Regniez_Leo_FR.pdf', en: 'CV_Regniez_Leo_EN.pdf' };
const CANDIDATS = [
  process.env.CHROME_PATH,
  'chromium',
  'chromium-browser',
  'google-chrome-stable',
  'google-chrome',
  'brave',
  'brave-browser',
  'microsoft-edge-stable',
  'vivaldi-stable',
].filter(Boolean);

function trouverNavigateur() {
  for (const nom of CANDIDATS) {
    if (nom.includes('/') && existsSync(nom)) return nom;
    const r = spawnSync('which', [nom], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  return null;
}

const navigateur = trouverNavigateur();
if (!navigateur) {
  console.error('✗ Aucun navigateur Chrome/Chromium trouvé : les PDF du CV ne sont pas régénérés.');
  console.error('  Installe-en un (sudo pacman -S chromium) ou indique-le avec CHROME_PATH=…');
  process.exit(1);
}
if (!existsSync(resolve(RACINE, 'dist/cv.html'))) {
  console.error('✗ dist/cv.html introuvable : lance d’abord npm run build.');
  process.exit(1);
}

/** Lance le navigateur sans bloquer, et attend qu'il ait fini (60 s au plus). */
function imprimer(commande, options) {
  return new Promise((fin) => {
    const processus = spawn(commande, options, { stdio: 'ignore' });
    const limite = setTimeout(() => processus.kill(), 60000);
    processus.on('exit', () => {
      clearTimeout(limite);
      fin();
    });
    processus.on('error', () => {
      clearTimeout(limite);
      fin();
    });
  });
}

const serveur = await preview({ root: RACINE, logLevel: 'silent', preview: { host: '127.0.0.1', port: PORT, strictPort: true } });
let erreur = false;
try {
  for (const [langue, fichier] of Object.entries(FICHIERS)) {
    const sortie = resolve(RACINE, 'dist/cv', fichier);
    mkdirSync(resolve(RACINE, 'dist/cv'), { recursive: true });
    const avant = existsSync(sortie) ? statSync(sortie).mtimeMs : 0;
    // lancement asynchrone : le serveur de prévisualisation tourne dans ce même processus
    // et doit pouvoir répondre au navigateur pendant qu'il imprime
    await imprimer(navigateur, [
      '--headless=new',
      '--disable-gpu',
      // Chrome refuse de démarrer en administrateur (root) sans cette option
      ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []),
      '--no-first-run',
      '--no-pdf-header-footer',
      '--print-to-pdf-no-header',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=10000',
      `--print-to-pdf=${sortie}`,
      `http://127.0.0.1:${PORT}/cv.html?lang=${langue}`,
    ]);
    if (!existsSync(sortie) || statSync(sortie).mtimeMs === avant) {
      console.error(`✗ Le PDF ${fichier} n’a pas été créé.`);
      erreur = true;
      continue;
    }
    // copie aussi dans public/cv/, pour que le dépôt contienne la dernière version
    copyFileSync(sortie, resolve(RACINE, 'public/cv', fichier));
    console.log(`✓ ${fichier}`);
  }
} finally {
  await new Promise((fin) => serveur.httpServer.close(fin));
}
process.exit(erreur ? 1 : 0);
