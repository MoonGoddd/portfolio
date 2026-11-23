// Champ d'étoiles à grossissement continu.
// Les étoiles sont réparties en couches : quand le grossissement (zeta) augmente, chaque couche
// s'écarte du centre puis s'efface, pendant qu'une autre apparaît. On peut donc zoomer sans fin.

import { hasard, lisser, creerHalo, TAU } from './outils';

const TEINTES = ['#ffffff', '#cfe2ff', '#9cc9ff', '#ffe3b8'];
const COUCHES = 3;

export function creerEtoiles(nombre, graine = 7) {
  const rnd = hasard(graine);
  const liste = [];
  for (let i = 0; i < nombre; i++) {
    const tirage = rnd();
    liste.push({
      x: rnd() * 2 - 1,
      y: rnd() * 2 - 1,
      couche: i % COUCHES,
      rayon: 0.55 + Math.pow(rnd(), 4) * 1.9,
      eclat: 0.35 + rnd() * 0.65,
      phase: rnd() * TAU,
      rythme: 0.4 + rnd() * 1.6,
      teinte: tirage < 0.55 ? 0 : tirage < 0.8 ? 1 : tirage < 0.93 ? 2 : 3,
    });
  }
  return { liste, halo: creerHalo() };
}

const MARGE = 16; // marge autour de l'écran, pour la parallaxe de la souris
const BRILLANTES = 160; // étoiles qui scintillent une à une ; les autres sont pré-dessinées, fixes

/**
 * Dessine les étoiles une par une.
 * filtre : 'toutes', 'faibles' (pour le calque pré-dessiné, sans scintillement) ou 'brillantes'.
 */
function dessinerUneParUne(ctx, champ, { cx, cy, demi, zeta, alpha, temps, trainee = 0, L, H }, filtre = 'toutes') {
  const etirement = Math.min(0.3, trainee * 5);
  const liste = filtre === 'brillantes' ? champ.brillantes : champ.liste;
  for (const e of liste) {
    if (filtre === 'faibles' && e.brillante) continue;
    let f = ((zeta + e.couche) % COUCHES) / COUCHES;
    if (f < 0) f += 1;
    const echelle = Math.pow(2, f * COUCHES);
    const x = cx + e.x * demi * echelle;
    const y = cy + e.y * demi * echelle;
    if (x < -30 || x > L + 30 || y < -30 || y > H + 30) continue;
    const fenetre = lisser(0, 0.2, f) * (1 - lisser(0.6, 1, f));
    const scintillement = filtre === 'faibles' ? 0.86 : 0.72 + 0.28 * Math.sin(temps * e.rythme + e.phase);
    const a = alpha * e.eclat * fenetre * scintillement;
    if (a < 0.02) continue;
    const r = e.rayon * (0.85 + 0.6 * f);
    ctx.globalAlpha = a;
    ctx.fillStyle = TEINTES[e.teinte];
    if (etirement > 0.004) {
      ctx.strokeStyle = TEINTES[e.teinte];
      ctx.lineWidth = Math.max(1, r);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (x - cx) * etirement, y - (y - cy) * etirement);
      ctx.stroke();
    }
    if (r < 1.3) {
      ctx.fillRect(x - r * 0.7, y - r * 0.7, r * 1.4, r * 1.4);
    } else {
      ctx.drawImage(champ.halo, x - r * 4.5, y - r * 4.5, r * 9, r * 9);
      ctx.beginPath();
      ctx.arc(x, y, r * 0.75, 0, TAU);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

/**
 * Dessine le champ d'étoiles.
 * cx, cy : centre du grossissement ; demi : demi-largeur du champ à l'échelle 1 ;
 * zeta : grossissement ; trainee : vitesse du zoom (étire les étoiles en traits).
 * Tant que le grossissement ne change pas, les étoiles faibles sont pré-dessinées dans un calque
 * (une seule copie d'image) et seules les plus brillantes scintillent une à une.
 */
export function dessinerEtoiles(ctx, champ, options) {
  const { cx, cy, demi, zeta, alpha, trainee = 0, L, H, cxRepos = L / 2, cyRepos = H / 2 } = options;
  if (alpha <= 0.003) return;
  if (!champ.brillantes) {
    // les plus grosses étoiles, celles dont le scintillement se voit
    champ.brillantes = [...champ.liste].sort((a, b) => b.rayon * b.eclat - a.rayon * a.eclat).slice(0, BRILLANTES);
    champ.brillantes.forEach((e) => {
      e.brillante = true;
    });
  }
  const cle = `${zeta.toFixed(4)}|${L}|${H}|${demi.toFixed(1)}|${cxRepos.toFixed(1)}|${cyRepos.toFixed(1)}`;
  const stable = trainee < 0.0002 && champ.derniereCle === cle;
  champ.derniereCle = cle;
  if (!stable) {
    dessinerUneParUne(ctx, champ, options);
    return;
  }
  if (champ.pret?.cle !== cle) {
    // pré-dessin, centré sur la position de repos : la parallaxe n'est ensuite qu'un décalage
    const largeur = Math.ceil(L + MARGE * 2);
    const hauteur = Math.ceil(H + MARGE * 2);
    const c = (champ.calque ??= document.createElement('canvas'));
    if (c.width !== largeur || c.height !== hauteur) {
      c.width = largeur;
      c.height = hauteur;
    }
    const g = c.getContext('2d');
    g.clearRect(0, 0, largeur, hauteur);
    dessinerUneParUne(g, champ, { cx: cxRepos + MARGE, cy: cyRepos + MARGE, demi, zeta, alpha: 1, temps: 0, L: largeur, H: hauteur }, 'faibles');
    champ.pret = { cle, cx: cxRepos, cy: cyRepos };
  }
  ctx.globalAlpha = alpha;
  ctx.drawImage(champ.calque, cx - champ.pret.cx - MARGE, cy - champ.pret.cy - MARGE);
  ctx.globalAlpha = 1;
  dessinerUneParUne(ctx, champ, options, 'brillantes');
}
