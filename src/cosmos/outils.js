// Petites fonctions de calcul partagées par les modules du cosmos.

export const TAU = Math.PI * 2;
export const borner = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const mixer = (a, b, t) => a + (b - a) * t;

/** Transition douce de 0 à 1 quand v va de a à b. */
export function lisser(a, b, v) {
  const t = borner((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Générateur pseudo-aléatoire reproductible (mulberry32) : même graine, même ciel. */
export function hasard(graine) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mélange deux couleurs [r, v, b] et renvoie une chaîne CSS. */
export function melanger(c1, c2, t, alpha = 1) {
  const r = Math.round(mixer(c1[0], c2[0], t));
  const v = Math.round(mixer(c1[1], c2[1], t));
  const b = Math.round(mixer(c1[2], c2[2], t));
  return alpha >= 1 ? `rgb(${r},${v},${b})` : `rgba(${r},${v},${b},${alpha})`;
}

export function hexVersRvb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Petite image d'un halo lumineux, réutilisée pour dessiner les étoiles brillantes. */
export function creerHalo(couleur = [255, 255, 255], taille = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = taille;
  const g = c.getContext('2d');
  const d = g.createRadialGradient(taille / 2, taille / 2, 0, taille / 2, taille / 2, taille / 2);
  const [r, v, b] = couleur;
  d.addColorStop(0, `rgba(${r},${v},${b},1)`);
  d.addColorStop(0.18, `rgba(${r},${v},${b},0.55)`);
  d.addColorStop(0.5, `rgba(${r},${v},${b},0.12)`);
  d.addColorStop(1, `rgba(${r},${v},${b},0)`);
  g.fillStyle = d;
  g.fillRect(0, 0, taille, taille);
  return c;
}
