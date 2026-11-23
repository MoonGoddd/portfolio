// Fond diffus cosmologique (niveau 4) : la plus vieille lumière de l'univers.
// Deux textures de bruit, étirées et superposées, dérivent très lentement ; un grain fin par-dessus.
// Les teintes restent claires pour que le texte sombre du contact soit toujours lisible.

import { hasard, mixer } from './outils';

// Dégradé du froid (bleuté) au chaud (orangé), l'ambre au milieu
const RAMPE = [
  [0, [127, 166, 201]],
  [0.28, [232, 201, 143]],
  [0.5, [255, 196, 107]],
  [0.75, [247, 161, 69]],
  [1, [226, 112, 58]],
];

function couleur(v) {
  for (let i = 1; i < RAMPE.length; i++) {
    if (v <= RAMPE[i][0]) {
      const [v0, c0] = RAMPE[i - 1];
      const [v1, c1] = RAMPE[i];
      const t = (v - v0) / (v1 - v0);
      return [mixer(c0[0], c1[0], t), mixer(c0[1], c1[1], t), mixer(c0[2], c1[2], t)];
    }
  }
  return RAMPE[RAMPE.length - 1][1];
}

/** Bruit de valeur à plusieurs octaves : de grosses taches et de plus petites par-dessus. */
function texture(graine, l = 240, h = 136) {
  const rnd = hasard(graine);
  const T = 64;
  const grille = new Float32Array(T * T).map(() => rnd());
  const lire = (x, y) => grille[(y & (T - 1)) * T + (x & (T - 1))];
  const bruit = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);
    return mixer(mixer(lire(xi, yi), lire(xi + 1, yi), u), mixer(lire(xi, yi + 1), lire(xi + 1, yi + 1), u), v);
  };
  const image = document.createElement('canvas');
  image.width = l;
  image.height = h;
  const g = image.getContext('2d');
  const pixels = g.createImageData(l, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < l; x++) {
      let valeur = 0;
      let poids = 0;
      for (let o = 0, f = 5 / l, a = 1; o < 4; o++, f *= 2.1, a *= 0.55) {
        valeur += bruit(x * f + o * 17, y * f + o * 31) * a;
        poids += a;
      }
      // contraste accentué autour de la moyenne
      const v = Math.min(1, Math.max(0, 0.5 + (valeur / poids - 0.5) * 2.6));
      const [r, vert, b] = couleur(v);
      const i = (y * l + x) * 4;
      pixels.data[i] = r;
      pixels.data[i + 1] = vert;
      pixels.data[i + 2] = b;
      pixels.data[i + 3] = 255;
    }
  }
  g.putImageData(pixels, 0, 0);
  return image;
}

function grain(taille = 128) {
  const rnd = hasard(99);
  const image = document.createElement('canvas');
  image.width = image.height = taille;
  const g = image.getContext('2d');
  const pixels = g.createImageData(taille, taille);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const clair = rnd() > 0.5 ? 255 : 0;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = clair;
    pixels.data[i + 3] = rnd() * 255;
  }
  g.putImageData(pixels, 0, 0);
  return image;
}

export function creerFondDiffus() {
  return { a: texture(11), b: texture(23), grain: grain(), motif: null };
}

/** Compose le fond diffus (deux textures qui dérivent + grain) dans une image. */
function composer(fond, L, H, temps) {
  const c = (fond.image ??= document.createElement('canvas'));
  // demi-résolution : le fond est fait de grandes taches floues, la différence ne se voit pas
  const largeur = Math.ceil(L / 2);
  const hauteur = Math.ceil(H / 2);
  if (c.width !== largeur || c.height !== hauteur) {
    c.width = largeur;
    c.height = hauteur;
  }
  const g = c.getContext('2d');
  const dx = Math.sin(temps * 0.05) * 0.08 * largeur;
  const dy = Math.cos(temps * 0.04) * 0.08 * hauteur;
  g.imageSmoothingEnabled = true;
  g.globalAlpha = 1;
  g.drawImage(fond.a, -0.1 * largeur + dx, -0.1 * hauteur + dy, 1.2 * largeur, 1.2 * hauteur);
  g.globalAlpha = 0.5;
  g.drawImage(fond.b, -0.1 * largeur - dx, -0.1 * hauteur - dy * 0.7, 1.2 * largeur, 1.2 * hauteur);
  g.globalAlpha = 1;
}

/** Dessine le fond diffus. Il dérive très lentement : on ne le recompose que 8 fois par seconde. */
export function dessinerFondDiffus(ctx, fond, L, H, temps, alpha) {
  if (alpha <= 0.003) return;
  const pas = Math.floor(temps * 8);
  if (fond.pas !== pas || fond.L !== L || fond.H !== H) {
    composer(fond, L, H, temps);
    fond.pas = pas;
    fond.L = L;
    fond.H = H;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = alpha;
  ctx.drawImage(fond.image, 0, 0, L, H);
  // grain fin : il change de place à chaque recomposition
  if (!fond.motif) fond.motif = ctx.createPattern(fond.grain, 'repeat');
  ctx.save();
  ctx.globalAlpha = alpha * 0.09;
  ctx.translate(-((pas * 37) % 128), -((pas * 61) % 128));
  ctx.fillStyle = fond.motif;
  ctx.fillRect(0, 0, L + 128, H + 128);
  ctx.restore();
  ctx.globalAlpha = 1;
}
