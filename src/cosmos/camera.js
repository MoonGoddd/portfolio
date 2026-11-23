// La caméra traduit la position de défilement en niveau de grossissement.
//  - l'accueil est épinglé : son défilement fait passer z de 0 à 1 ;
//  - chaque zone [data-transition] fait monter z d'un niveau quand le centre de l'écran la traverse.

import { etat } from './etat';

let zones = { piste: null, transitions: [], sections: [] };

const borner = (v) => Math.min(1, Math.max(0, v));

/** Relève la position des zones dans la page (à refaire quand la mise en page change). */
export function mesurer() {
  const sy = window.scrollY;
  const boite = (el) => {
    const r = el.getBoundingClientRect();
    return { haut: r.top + sy, hauteur: r.height };
  };
  const piste = document.querySelector('[data-zone="piste"]');
  zones = {
    piste: piste ? boite(piste) : null,
    transitions: [...document.querySelectorAll('[data-transition]')].map(boite),
    sections: [...document.querySelectorAll('[data-niveau-section]')].map((el) => ({
      ...boite(el),
      niveau: Number(el.dataset.niveauSection),
    })),
  };

  // Positions mises en cache pour le canvas : les relire à chaque image forcerait le navigateur
  // à recalculer la mise en page 60 fois par seconde.
  const ancre = document.querySelector('.galaxie-ancre');
  if (ancre) {
    const r = ancre.getBoundingClientRect();
    const style = getComputedStyle(ancre);
    const collante = style.position === 'sticky';
    // Un élément « collant » reste dans son parent : il commence en haut du parent, se colle à
    // `top` pendant qu'on défile, puis repart avec le bas du parent. On garde ces bornes en cache
    // pour retrouver sa position exacte à chaque image sans relire la mise en page.
    const parent = ancre.parentElement.getBoundingClientRect();
    etat.mesures.ancre = {
      gauche: r.left,
      largeur: r.width,
      hauteur: r.height,
      haut: collante ? parent.top + sy : r.top + sy,
      basParent: parent.bottom + sy,
      hautCollant: parseFloat(style.top) || 0,
      collante,
    };
  }
  const parcours = document.getElementById('parcours');
  if (parcours) etat.mesures.parcours = parcours.getBoundingClientRect().top + sy;
  const etapes = document.querySelector('.etapes');
  if (etapes) {
    const r = etapes.getBoundingClientRect();
    etat.mesures.etapes = { haut: r.top + sy, hauteur: r.height };
  }
}

/** Progressions des 4 transitions déduites d'un niveau de grossissement continu z. */
export function progressions(z) {
  return [0, 1, 2, 3].map((i) => borner(z - i));
}

/** Calcule z et les progressions pour un défilement donné. */
export function calculer(defilement, hauteurEcran, reduit) {
  if (reduit) {
    // Mouvement réduit : pas de zoom, seulement le niveau de la section au centre de l'écran.
    const centre = defilement + hauteurEcran / 2;
    let n = 0;
    for (const s of zones.sections) if (centre >= s.haut) n = s.niveau;
    return { z: n, p: [n >= 1 ? 1 : 0, n >= 2 ? 1 : 0, n >= 3 ? 1 : 0, n >= 4 ? 1 : 0] };
  }
  const { piste, transitions } = zones;
  const p0 = piste ? borner(defilement / Math.max(1, piste.hauteur - hauteurEcran)) : 1;
  const p = [p0, 0, 0, 0];
  transitions.forEach((t, i) => {
    if (i < 3) p[i + 1] = t.hauteur > 0 ? borner((defilement + hauteurEcran / 2 - t.haut) / t.hauteur) : 0;
  });
  return { z: p[0] + p[1] + p[2] + p[3], p };
}
