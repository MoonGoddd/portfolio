// Champ profond (niveau 3) : des centaines de galaxies lointaines, façon Hubble.
// Plus une galaxie est loin, plus elle est petite et rouge (décalage vers le rouge).
// Le champ est peint une seule fois dans une image plus grande que l'écran.

import { hasard, melanger, TAU } from './outils';

const PROCHE = [207, 224, 255];
const MOYEN = [255, 233, 196];
const LOIN = [255, 154, 92];
const TRES_LOIN = [217, 100, 58];

function teinte(distance, alpha) {
  if (distance < 0.4) return melanger(PROCHE, MOYEN, distance / 0.4, alpha);
  if (distance < 0.75) return melanger(MOYEN, LOIN, (distance - 0.4) / 0.35, alpha);
  return melanger(LOIN, TRES_LOIN, (distance - 0.75) / 0.25, alpha);
}

export function creerChampProfond(L, H, densite = 1) {
  const marge = Math.round(H * 0.12);
  const image = document.createElement('canvas');
  image.width = L + marge * 2;
  image.height = H + marge * 2;
  const g = image.getContext('2d');
  const rnd = hasard(1380);
  const nombre = Math.round(((image.width * image.height) / 2700) * densite);

  for (let i = 0; i < nombre; i++) {
    const distance = Math.pow(rnd(), 0.55);
    const rayon = 1.6 + 24 * Math.pow(1 - distance, 4.5) + rnd() * 2;
    const alpha = (0.3 + 0.45 * (1 - distance)) * (0.5 + rnd() * 0.5);
    g.save();
    g.translate(rnd() * image.width, rnd() * image.height);
    g.rotate(rnd() * TAU);
    g.scale(1, 0.28 + rnd() * 0.72);
    const d = g.createRadialGradient(0, 0, 0, 0, 0, rayon);
    d.addColorStop(0, teinte(distance, alpha));
    d.addColorStop(0.35, teinte(distance, alpha * 0.45));
    d.addColorStop(1, teinte(distance, 0));
    g.fillStyle = d;
    g.fillRect(-rayon, -rayon, rayon * 2, rayon * 2);
    g.restore();
  }

  // quelques étoiles de premier plan, avec leurs aigrettes
  for (let i = 0; i < 7; i++) {
    // placées sur les bords, pour ne pas passer derrière le texte
    const x = (i % 2 ? 0.02 + rnd() * 0.12 : 0.86 + rnd() * 0.12) * image.width;
    const y = rnd() * image.height;
    const longueur = 10 + rnd() * 20;
    g.strokeStyle = 'rgba(210,225,255,0.4)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x - longueur, y);
    g.lineTo(x + longueur, y);
    g.moveTo(x, y - longueur);
    g.lineTo(x, y + longueur);
    g.stroke();
    const d = g.createRadialGradient(x, y, 0, x, y, longueur * 0.5);
    d.addColorStop(0, 'rgba(255,255,255,0.95)');
    d.addColorStop(0.3, 'rgba(200,220,255,0.35)');
    d.addColorStop(1, 'rgba(200,220,255,0)');
    g.fillStyle = d;
    g.fillRect(x - longueur, y - longueur, longueur * 2, longueur * 2);
  }
  return { image, marge, L, H };
}

/**
 * Dessine le champ profond. echelle : zoom autour du point (ox, oy) ; decalage : parallaxe verticale.
 */
export function dessinerChampProfond(ctx, champ, { alpha, echelle = 1, ox, oy, decalage = 0 }) {
  if (alpha <= 0.003) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(ox, oy);
  ctx.scale(echelle, echelle);
  ctx.drawImage(champ.image, -ox - champ.marge, -oy - champ.marge + decalage);
  ctx.restore();
}
