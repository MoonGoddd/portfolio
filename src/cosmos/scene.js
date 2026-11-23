// La scène : ce que le canvas dessine pour un niveau de grossissement z donné.
//   z = 0      ciel au-dessus de l'horizon ; l'oculaire s'ouvre de 0 à 1
//   z = 1      champ d'étoiles (la constellation elle-même est un SVG dans la page)
//   z = 1 → 2  plongée dans le Lion jusqu'au Triplet, une galaxie spirale grandit
//   z = 2 → 3  la galaxie s'éloigne et se perd dans le champ profond
//   z = 3 → 4  les galaxies convergent, la lumière du fond diffus envahit l'écran

import { etat, definirSurvolTech } from './etat';
import { TAU, borner, mixer, lisser, hasard, creerHalo } from './outils';
import { creerEtoiles, dessinerEtoiles } from './starfield';
import { creerGalaxie, dessinerGalaxie, techSousPointeur } from './galaxy';
import { creerChampProfond, dessinerChampProfond } from './deepField';
import { creerFondDiffus, dessinerFondDiffus } from './cmb';
import { etoiles as etoilesLion, etoileParId, segments, triplet, rayonEtoile } from '../data/lion';
import { stack } from '../data/stack';

const FONDS = [
  [5, 6, 11],
  [5, 6, 11],
  [11, 10, 26],
  [14, 11, 8],
  [14, 11, 8],
];
const ZETA_REPOS = 0.5; // grossissement du ciel vu à l'œil nu
const ZOOM_OCULAIRE = 2.4; // ce que l'on gagne en entrant dans l'oculaire
const ZOOM_TRIPLET = 3.3; // puis en plongeant vers le Triplet du Lion
const M66 = triplet[0];
const CENTRE_TRIPLET = {
  x: (triplet[0].x + triplet[1].x + triplet[2].x) / 3,
  y: (triplet[0].y + triplet[1].y + triplet[2].y) / 3,
};

function couleurFond(z) {
  const i = Math.min(3, Math.floor(z));
  const t = z - i;
  const a = FONDS[i];
  const b = FONDS[i + 1];
  return `rgb(${Math.round(mixer(a[0], b[0], t))},${Math.round(mixer(a[1], b[1], t))},${Math.round(mixer(a[2], b[2], t))})`;
}

export function creerScene() {
  const petitEcran = Math.min(window.innerWidth, window.innerHeight) < 700;
  const modeste = petitEcran || (navigator.hardwareConcurrency || 4) <= 4;
  const qualite = modeste ? 0.6 : 1;

  const champ = creerEtoiles(Math.round(2100 * qualite));
  // le ciel vu dans l'oculaire a son propre cache (il n'a pas le même grossissement que le ciel autour)
  const champOculaire = { liste: champ.liste, halo: champ.halo };
  const haloBlanc = creerHalo();
  const rnd = hasard(2026);
  let galaxie = null;
  let profond = null;
  let fondDiffus = null;
  let L = 0;
  let H = 0;
  let zetaPrecedent = null;
  let filante = null;
  let prochaineFilante = 4;
  let survolCanvas = false;
  let m66Ecran = [0, 0];

  const obtenirGalaxie = () => (galaxie ??= creerGalaxie(stack, Math.round(5200 * qualite)));
  const obtenirProfond = () => {
    if (!profond || profond.L !== L || profond.H !== H) profond = creerChampProfond(L, H, qualite);
    return profond;
  };
  const obtenirFondDiffus = () => (fondDiffus ??= creerFondDiffus());

  // ---------------------------------------------------------------- niveau 0
  function lueurHorizon(ctx) {
    const d = ctx.createLinearGradient(0, H * 0.45, 0, H);
    d.addColorStop(0, 'rgba(30,48,110,0)');
    d.addColorStop(1, 'rgba(38,60,132,0.45)');
    ctx.fillStyle = d;
    ctx.fillRect(0, H * 0.45, L, H * 0.55);
  }

  function etoileFilante(ctx, t) {
    if (!filante && t > prochaineFilante) {
      filante = { t0: t, x: L * (0.15 + rnd() * 0.6), y: H * (0.05 + rnd() * 0.25), angle: 0.35 + rnd() * 0.4, longueur: 140 + rnd() * 160 };
    }
    if (!filante) return;
    const k = (t - filante.t0) / 0.9;
    if (k >= 1) {
      filante = null;
      prochaineFilante = t + 6 + rnd() * 9;
      return;
    }
    const avance = k * 520;
    const x = filante.x + Math.cos(filante.angle) * avance;
    const y = filante.y + Math.sin(filante.angle) * avance;
    const qx = x - Math.cos(filante.angle) * filante.longueur;
    const qy = y - Math.sin(filante.angle) * filante.longueur;
    const d = ctx.createLinearGradient(x, y, qx, qy);
    d.addColorStop(0, `rgba(255,255,255,${0.9 * Math.sin(k * Math.PI)})`);
    d.addColorStop(1, 'rgba(156,201,255,0)');
    ctx.strokeStyle = d;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(qx, qy);
    ctx.stroke();
  }

  // ------------------------------------------------- transition 1 → 2 : le Lion
  function plongeeDansLeLion(ctx, p) {
    const unite = Math.min((L * 0.8) / 31, (H * 0.6) / 15); // pixels par degré de ciel
    // Zoom en trois temps : on approche du Triplet, on s'y attarde, puis on plonge vers M66
    const zoom = Math.exp(Math.log(11) * lisser(0.14, 0.44, p) + Math.log(14 / 11) * lisser(0.44, 0.56, p) + Math.log(5) * lisser(0.56, 0.85, p));
    const versTriplet = lisser(0.14, 0.42, p);
    const versM66 = lisser(0.54, 0.72, p);
    const fx = CENTRE_TRIPLET.x * versTriplet + (M66.x - CENTRE_TRIPLET.x) * versM66;
    const fy = CENTRE_TRIPLET.y * versTriplet + (M66.y - CENTRE_TRIPLET.y) * versM66;
    const placer = (pt) => [L / 2 + (pt.x - fx) * unite * zoom, H / 2 + (pt.y - fy) * unite * zoom];
    m66Ecran = placer(M66);

    const figure = lisser(0, 0.12, p) * (1 - lisser(0.26, 0.42, p));
    if (figure > 0.01) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(156,201,255,${0.5 * figure})`;
      ctx.beginPath();
      for (const [a, b] of segments) {
        const [x1, y1] = placer(etoileParId[a]);
        const [x2, y2] = placer(etoileParId[b]);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
      ctx.font = '500 11px "JetBrains Mono Variable", ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      for (const e of etoilesLion) {
        const [x, y] = placer(e);
        const r = rayonEtoile(e.mag) * 1.5;
        ctx.globalAlpha = figure;
        ctx.drawImage(haloBlanc, x - r * 4, y - r * 4, r * 8, r * 8);
        if (!e.mineure) {
          ctx.globalAlpha = figure * 0.7 * (1 - lisser(0.14, 0.3, p));
          ctx.fillStyle = '#8a8fa3';
          ctx.fillText(e.nom, x + r * 2 + 6, y);
        }
      }
    }

    // les trois galaxies du Triplet : d'abord de simples taches floues
    const apparition = lisser(0.3, 0.44, p);
    if (apparition > 0.01 && p < 0.82) {
      triplet.forEach((gal, i) => {
        // M66 laisse la place à la galaxie détaillée, les deux autres sortent de l'écran
        const taches = apparition * (1 - lisser(i === 0 ? 0.56 : 0.66, i === 0 ? 0.7 : 0.82, p));
        if (taches < 0.01) return;
        const [x, y] = placer(gal);
        const r = 7 + zoom * 1.5;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.42 + i * 1.1);
        ctx.scale(1, i === 2 ? 0.26 : 0.55);
        const d = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        d.addColorStop(0, `rgba(235,240,255,${0.9 * taches})`);
        d.addColorStop(0.35, `rgba(175,195,255,${0.32 * taches})`);
        d.addColorStop(1, 'rgba(150,170,255,0)');
        ctx.fillStyle = d;
        ctx.fillRect(-r, -r, r * 2, r * 2);
        ctx.restore();
      });
    }
    ctx.globalAlpha = 1;
  }

  // -------------------------------------------------------- niveau 2 : galaxie
  /** Emplacement de la galaxie dans la page : celui de son ancre, dans la section Stack. */
  function amarrage() {
    const ancre = etat.mesures.ancre; // relevé par camera.mesurer(), pas relu à chaque image
    if (!ancre || ancre.largeur === 0) return { x: L * 0.68, y: H * 0.5, rayon: Math.min(L, H) * 0.34, fixe: true };
    const rayon = (Math.min(ancre.largeur, ancre.hauteur) / 2) * 0.98;
    const x = ancre.gauche + ancre.largeur / 2;
    let haut = ancre.haut - etat.defilement; // position à l'écran si l'emplacement défile normalement
    if (ancre.collante) {
      // Grand écran : l'emplacement se colle en haut de l'écran pendant que la section défile,
      // puis repart avec la fin de la section. La galaxie le suit exactement, légende comprise.
      // Avant l'arrivée de la section, la galaxie l'attend déjà à sa place (la légende arrive dessous).
      haut = Math.min(ancre.hautCollant, ancre.basParent - etat.defilement - ancre.hauteur);
      return { x, y: haut + ancre.hauteur / 2 - 10, rayon, fixe: true };
    }
    // Petit écran : il suit simplement la page.
    return { x, y: haut + ancre.hauteur / 2 - 10, rayon: rayon * 0.84, fixe: false };
  }

  return {
    redimensionner(largeur, hauteur) {
      L = largeur;
      H = hauteur;
    },

    /** Prépare à l'avance les images lourdes, pour ne pas ralentir le défilement. */
    preparer() {
      obtenirGalaxie();
      obtenirProfond();
      obtenirFondDiffus();
    },

    dessiner(ctx, t) {
      const { z, p, souris, reduit } = etat;
      const [p0, pLion, p2, p3] = p;
      // La plongée dans le Lion ne commence qu'une fois les projets sortis de l'écran
      // (début de la zone de passage) : rien de chargé ne se dessine derrière leur texte.
      const p1 = borner((pLion - 0.18) / 0.82);
      // légère parallaxe : le ciel bouge un peu à l'opposé de la souris
      const decX = souris.x * -9;
      const decY = souris.y * -7;
      const cx = L / 2 + decX;
      const cy = H / 2 + decY;
      const demi = Math.max(L, H) * 0.52;

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = couleurFond(z);
      ctx.fillRect(0, 0, L, H);

      const zeta = ZETA_REPOS + ZOOM_OCULAIRE * lisser(0, 1, p0) + ZOOM_TRIPLET * lisser(0.05, 0.95, p1);
      const vitesseZoom = zetaPrecedent === null || reduit ? 0 : Math.abs(zeta - zetaPrecedent);
      zetaPrecedent = zeta;

      // ---- étoiles
      if (p0 < 1) {
        const o = etat.oculaire;
        // quand le cercle de l'oculaire couvre tout l'écran, le ciel autour ne se voit plus
        const couvert = o.r > 0 && Math.hypot(Math.max(o.x, L - o.x), Math.max(o.y, H - o.y)) < o.r;
        if (!couvert) {
          lueurHorizon(ctx);
          dessinerEtoiles(ctx, champ, { cx, cy: cy * 0.9, cyRepos: (H / 2) * 0.9, demi, zeta: ZETA_REPOS, alpha: 1, temps: t, L, H });
          if (!reduit) etoileFilante(ctx, t);
        }
        if (o.r > 0) {
          // dans le cercle de l'oculaire : le même ciel, grossi
          ctx.save();
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r, 0, TAU);
          ctx.clip();
          // rectangle du cercle, limité à l'écran (inutile de peindre hors champ)
          const x0 = Math.max(0, o.x - o.r);
          const y0 = Math.max(0, o.y - o.r);
          const x1 = Math.min(L, o.x + o.r);
          const y1 = Math.min(H, o.y + o.r);
          if (!couvert) {
            ctx.fillStyle = '#05060b';
            ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
          }
          dessinerEtoiles(ctx, champOculaire, { cx: o.x + decX, cy: o.y + decY, cxRepos: o.x, cyRepos: o.y, demi, zeta, alpha: 1, temps: t, trainee: vitesseZoom, L, H });
          const ombre = 0.92 * (1 - lisser(0.7, 1, p0));
          if (ombre > 0.01) {
            const d = ctx.createRadialGradient(o.x, o.y, o.r * 0.6, o.x, o.y, o.r);
            d.addColorStop(0, 'rgba(0,0,0,0)');
            d.addColorStop(1, `rgba(0,0,0,${ombre})`);
            ctx.fillStyle = d;
            ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
          }
          ctx.restore();
          ctx.strokeStyle = 'rgba(156,201,255,0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(o.x, o.y, Math.max(0, o.r - 1), 0, TAU);
          ctx.stroke();
        }
      } else if (z < 3) {
        const alpha = z <= 2 ? 1 - 0.55 * lisser(0.5, 1, p1) : 0.45 * (1 - lisser(0, 0.7, p2));
        dessinerEtoiles(ctx, champ, { cx, cy, cyRepos: H / 2, demi, zeta, alpha, temps: t, trainee: vitesseZoom, L, H });
      }

      // ---- transition vers la galaxie
      if (p1 > 0 && p1 < 1) plongeeDansLeLion(ctx, p1);

      // ---- champ profond (dessiné sous la galaxie qui s'y perd)
      const creneau = { x: L * 0.66, y: H * 0.36 }; // place de « notre » galaxie dans le champ profond
      let decalageProfond = 0;
      if (p2 > 0.15 && p3 < 0.9) {
        const c = obtenirProfond();
        decalageProfond = borner((etat.mesures.parcours - etat.defilement) * 0.06, -c.marge, c.marge);
        if (z < 3) {
          dessinerChampProfond(ctx, c, { alpha: lisser(0.2, 0.85, p2), echelle: mixer(2.2, 1, lisser(0, 1, p2)), ox: creneau.x, oy: creneau.y, decalage: decalageProfond });
        } else {
          const fuite = Math.exp(Math.log(0.02) * Math.pow(lisser(0, 0.85, p3), 1.6));
          dessinerChampProfond(ctx, c, { alpha: 1 - lisser(0.55, 0.85, p3), echelle: fuite, ox: L / 2, oy: H / 2, decalage: decalageProfond });
        }
      }

      // ---- galaxie
      if (p1 > 0.5 && p3 < 0.9) {
        const g = obtenirGalaxie();
        if (!reduit) g.rotation = t * 0.026;
        const port = amarrage();
        const vue = { x: port.x, y: port.y, rayon: port.rayon, rotation: g.rotation, alpha: 1 };
        let details = 1;
        if (z < 2) {
          // elle naît à la place de M66, puis rejoint son amarrage
          const k = lisser(0.66, 1, p1);
          vue.x = mixer(m66Ecran[0], port.x, k);
          vue.y = mixer(m66Ecran[1], port.y, k);
          vue.rayon = port.rayon * mixer(0.035, 1, 1 - Math.pow(1 - lisser(0.56, 1, p1), 2));
          vue.alpha = lisser(0.54, 0.7, p1);
          details = lisser(0.92, 1, p1);
        } else if (z < 3) {
          // elle rapetisse et rejoint sa place parmi les autres galaxies
          const k = lisser(0, 1, p2);
          const horsChamp = port.y < -port.rayon * 0.5; // petit écran : elle est déjà sortie par le haut
          vue.x = horsChamp ? creneau.x : mixer(port.x, creneau.x, k);
          vue.y = horsChamp ? creneau.y : mixer(port.y, creneau.y, k);
          vue.rayon = port.rayon * Math.exp(Math.log(0.035) * k);
          vue.alpha = (1 - 0.3 * k) * (horsChamp ? lisser(0.3, 0.7, p2) : 1);
          details = 1 - lisser(0, 0.12, p2);
        } else {
          const fuite = Math.exp(Math.log(0.02) * Math.pow(lisser(0, 0.85, p3), 1.6));
          vue.x = L / 2 + (creneau.x - L / 2) * fuite;
          vue.y = H / 2 + (creneau.y + decalageProfond - H / 2) * fuite;
          vue.rayon = port.rayon * 0.035 * Math.max(0.3, fuite);
          vue.alpha = 0.7 * (1 - lisser(0.55, 0.85, p3));
          details = 0;
        }
        dessinerGalaxie(ctx, g, vue, { details, survol: etat.galaxie.survol, noms: etat.galaxie.noms, largeur: L });
        ctx.globalCompositeOperation = 'source-over';

        // survol d'une étoile de techno dans la galaxie
        if (details > 0.9) {
          const id = techSousPointeur(g, souris.px, souris.py);
          if (id) {
            survolCanvas = true;
            definirSurvolTech(id);
          } else if (survolCanvas) {
            survolCanvas = false;
            definirSurvolTech(null);
          }
        }
      }

      // ---- fond diffus : une lueur chaude naît au centre, là où les galaxies convergent,
      //      puis la plus vieille lumière de l'univers remplit l'écran
      if (p3 > 0.3) {
        const lueur = lisser(0.3, 0.6, p3);
        const rayon = Math.hypot(L, H) * 0.8 * Math.pow(lisser(0.3, 0.8, p3), 1.4);
        if (rayon > 1 && p3 < 1) {
          const d = ctx.createRadialGradient(L / 2, H / 2, 0, L / 2, H / 2, rayon);
          d.addColorStop(0, `rgba(255,226,170,${lueur})`);
          d.addColorStop(0.3, `rgba(255,200,115,${lueur * 0.75})`);
          d.addColorStop(0.65, `rgba(240,150,70,${lueur * 0.28})`);
          d.addColorStop(1, 'rgba(226,112,58,0)');
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = d;
          ctx.fillRect(0, 0, L, H);
          ctx.globalCompositeOperation = 'source-over';
        }
        dessinerFondDiffus(ctx, obtenirFondDiffus(), L, H, t, lisser(0.56, 0.7, p3));
      }
    },
  };
}
