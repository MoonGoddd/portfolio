// Galaxie spirale à quatre bras (niveau 2). Chaque bras correspond à une catégorie de la stack
// et porte une étoile par techno. La spirale est peinte une seule fois dans une image,
// puis cette image tourne lentement : c'est très léger à afficher.

import { hasard, hexVersRvb, melanger, creerHalo, TAU } from './outils';
import { idTech } from '../data/stack';

const INCLINAISON = -0.42; // orientation du grand axe à l'écran
const APLATISSEMENT = 0.6; // la galaxie est vue de trois quarts
const ENROULEMENT = 3.3; // angle parcouru par un bras, du centre au bord
const TAILLE = 880;
const RAYON = (TAILLE / 2) * 0.94;

/** Position (rayon, angle) d'un point du bras k, pour t allant de 0 (centre) à 1 (bord). */
function pointDuBras(k, t) {
  return [RAYON * (0.09 + 0.91 * t), (k * TAU) / 4 + ENROULEMENT * Math.pow(t, 0.8)];
}

export function creerGalaxie(categories, particules) {
  const image = document.createElement('canvas');
  image.width = image.height = TAILLE;
  const g = image.getContext('2d');
  const rnd = hasard(42);
  const gauss = () => rnd() + rnd() + rnd() + rnd() - 2;
  const c = TAILLE / 2;
  const blanc = [220, 230, 255];
  const teintes = categories.map((cat) => melanger(blanc, hexVersRvb(cat.teinte), 0.5));

  g.globalCompositeOperation = 'lighter';

  // disque diffus
  let d = g.createRadialGradient(c, c, 0, c, c, RAYON);
  d.addColorStop(0, 'rgba(150,170,255,0.22)');
  d.addColorStop(0.5, 'rgba(110,130,230,0.09)');
  d.addColorStop(1, 'rgba(90,110,220,0)');
  g.fillStyle = d;
  g.fillRect(0, 0, TAILLE, TAILLE);

  for (let i = 0; i < particules; i++) {
    const k = i % 4;
    const tirage = rnd();
    let r;
    let a;
    let taille;
    let alpha;
    let dx = 0;
    let dy = 0;
    if (tirage < 0.72) {
      // étoiles des bras
      const t = Math.pow(rnd(), 0.85);
      [r, a] = pointDuBras(k, t);
      const dispersion = RAYON * (0.016 + 0.05 * t);
      dx = gauss() * dispersion;
      dy = gauss() * dispersion;
      g.fillStyle = teintes[k];
      alpha = 0.16 + rnd() * 0.5;
      taille = 0.8 + Math.pow(rnd(), 3) * 2.2;
    } else if (tirage < 0.9) {
      // étoiles du disque, entre les bras
      r = RAYON * Math.pow(rnd(), 0.7);
      a = rnd() * TAU;
      g.fillStyle = '#afc3ff';
      alpha = 0.07 + rnd() * 0.2;
      taille = 0.8 + rnd();
    } else {
      // bulbe central, plus chaud
      r = Math.abs(gauss()) * RAYON * 0.16;
      a = rnd() * TAU;
      g.fillStyle = '#ffe3b5';
      alpha = 0.2 + rnd() * 0.4;
      taille = 1 + rnd() * 1.4;
    }
    g.globalAlpha = alpha;
    g.fillRect(c + r * Math.cos(a) + dx - taille / 2, c + r * Math.sin(a) + dy - taille / 2, taille, taille);
  }

  // nébuleuses roses le long des bras
  g.globalAlpha = 1;
  for (let i = 0; i < 46; i++) {
    const [r, a] = pointDuBras(i % 4, 0.2 + rnd() * 0.75);
    const x = c + r * Math.cos(a) + gauss() * 8;
    const y = c + r * Math.sin(a) + gauss() * 8;
    const rayon = 3 + rnd() * 5;
    d = g.createRadialGradient(x, y, 0, x, y, rayon);
    d.addColorStop(0, 'rgba(255,150,180,0.55)');
    d.addColorStop(1, 'rgba(255,150,180,0)');
    g.fillStyle = d;
    g.fillRect(x - rayon, y - rayon, rayon * 2, rayon * 2);
  }

  // cœur lumineux
  d = g.createRadialGradient(c, c, 0, c, c, RAYON * 0.26);
  d.addColorStop(0, 'rgba(255,244,222,0.95)');
  d.addColorStop(0.3, 'rgba(255,216,165,0.5)');
  d.addColorStop(1, 'rgba(255,190,130,0)');
  g.fillStyle = d;
  g.fillRect(0, 0, TAILLE, TAILLE);

  // une étoile par techno, posée sur l'axe de son bras
  const techs = [];
  categories.forEach((cat, k) => {
    cat.elements.forEach((nom, j) => {
      const [r, a] = pointDuBras(k, 0.3 + (0.64 * (j + 0.5)) / cat.elements.length);
      techs.push({ id: idTech(nom), nom, bras: k, r: r / RAYON, a, x: 0, y: 0 });
    });
  });
  const bras = categories.map((cat, k) => {
    const [r, a] = pointDuBras(k, 1);
    return { id: cat.id, teinte: cat.teinte, r: (r / RAYON) * 1.1, a, halo: creerHalo(hexVersRvb(cat.teinte)) };
  });

  return { image, techs, bras, rotation: 0 };
}

/** Passe d'un point de la galaxie (rayon, angle) à sa position à l'écran. */
function projeter(vue, rayon, angle) {
  const lx = rayon * vue.rayon * Math.cos(angle + vue.rotation);
  const ly = rayon * vue.rayon * Math.sin(angle + vue.rotation) * APLATISSEMENT;
  return [
    vue.x + lx * Math.cos(INCLINAISON) - ly * Math.sin(INCLINAISON),
    vue.y + lx * Math.sin(INCLINAISON) + ly * Math.cos(INCLINAISON),
  ];
}

/**
 * Dessine la galaxie. vue = { x, y, rayon, rotation, alpha }.
 * details (0 à 1) : visibilité des étoiles de techno et des noms de bras.
 * survol : identifiant de la techno mise en avant ; noms : { idCategorie: nom affiché } ;
 * largeur : largeur de l'écran, pour que les noms des bras n'en sortent pas.
 */
export function dessinerGalaxie(ctx, galaxie, vue, { details = 0, survol = null, noms = {}, largeur = Infinity } = {}) {
  if (vue.alpha <= 0.003 || vue.rayon < 1) return;
  const cote = (vue.rayon * 2) / 0.94;
  ctx.save();
  ctx.translate(vue.x, vue.y);
  ctx.rotate(INCLINAISON);
  ctx.scale(1, APLATISSEMENT);
  ctx.rotate(vue.rotation);
  ctx.globalAlpha = vue.alpha;
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(galaxie.image, -cote / 2, -cote / 2, cote, cote);
  ctx.restore();
  if (details <= 0.01) return;

  ctx.font = '500 11px "JetBrains Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';

  // noms des bras, au bout de chacun
  ctx.textAlign = 'center';
  for (const b of galaxie.bras) {
    const [x, y] = projeter(vue, b.r, b.a);
    ctx.globalAlpha = details * 0.9;
    ctx.fillStyle = b.teinte;
    const nom = noms[b.id] ?? b.id;
    const demi = ctx.measureText(nom).width / 2 + 6;
    ctx.fillText(nom, Math.min(largeur - demi, Math.max(demi, x)), y);
  }

  // étoiles des technos
  let enAvant = null;
  for (const t of galaxie.techs) {
    [t.x, t.y] = projeter(vue, t.r, t.a);
    const b = galaxie.bras[t.bras];
    if (t.id === survol) {
      enAvant = t;
      continue;
    }
    ctx.globalAlpha = details * 0.95;
    ctx.drawImage(b.halo, t.x - 9, t.y - 9, 18, 18);
  }
  if (enAvant) {
    const b = galaxie.bras[enAvant.bras];
    const { x, y } = enAvant;
    ctx.globalAlpha = details;
    ctx.drawImage(b.halo, x - 26, y - 26, 52, 52);
    ctx.strokeStyle = b.teinte;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, TAU);
    ctx.stroke();
    // étiquette lisible, sur un fond sombre
    ctx.font = '600 12px "JetBrains Mono Variable", ui-monospace, monospace';
    const largeur = ctx.measureText(enAvant.nom).width + 16;
    const aGauche = x + 18 + largeur > vue.x + vue.rayon * 1.15;
    const ex = aGauche ? x - 18 - largeur : x + 18;
    ctx.fillStyle = 'rgba(5,6,11,0.86)';
    ctx.beginPath();
    ctx.roundRect(ex, y - 12, largeur, 24, 12);
    ctx.fill();
    ctx.fillStyle = b.teinte;
    ctx.textAlign = 'left';
    ctx.fillText(enAvant.nom, ex + 8, y + 0.5);
  }
  ctx.globalAlpha = 1;
}

/** Techno dont l'étoile est sous le pointeur (ou null). */
export function techSousPointeur(galaxie, px, py) {
  let meilleure = null;
  let distance = 20;
  for (const t of galaxie.techs) {
    const d = Math.hypot(t.x - px, t.y - py);
    if (d < distance) {
      distance = d;
      meilleure = t.id;
    }
  }
  return meilleure;
}
