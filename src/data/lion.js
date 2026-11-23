// Constellation du Lion : positions réelles (J2000) des étoiles principales.
// ad = ascension droite en heures, dec = déclinaison en degrés, mag = magnitude apparente.
// Les coordonnées sont projetées à plat autour du centre de la figure.

const AD0 = 10.75; // centre de la projection
const DEC0 = 18.5;
const K = 15 * Math.cos((DEC0 * Math.PI) / 180); // degrés d'arc par heure d'AD à cette déclinaison

/** Projette (ad, dec) en degrés sur un plan : l'est est à gauche, le nord en haut, comme dans le ciel. */
export function projeter(ad, dec) {
  return { x: -(ad - AD0) * K, y: -(dec - DEC0) };
}

const brutes = [
  { id: 'regulus', nom: 'Regulus', bayer: 'α', ad: 10.1395, dec: 11.967, mag: 1.4, dx: 9, dy: 4 },
  { id: 'denebola', nom: 'Denebola', bayer: 'β', ad: 11.8177, dec: 14.572, mag: 2.1, dx: 2, dy: 15, ancre: 'middle' },
  { id: 'algieba', nom: 'Algieba', bayer: 'γ', ad: 10.3328, dec: 19.842, mag: 2.0, dx: 9, dy: 4 },
  { id: 'zosma', nom: 'Zosma', bayer: 'δ', ad: 11.2351, dec: 20.524, mag: 2.6, dx: 0, dy: -9, ancre: 'middle' },
  { id: 'chertan', nom: 'Chertan', bayer: 'θ', ad: 11.2373, dec: 15.43, mag: 3.3, dx: 8, dy: 12 },
  { id: 'adhafera', nom: 'Adhafera', bayer: 'ζ', ad: 10.2782, dec: 23.417, mag: 3.4, dx: -8, dy: -2, ancre: 'end' },
  { id: 'rasalas', nom: 'Rasalas', bayer: 'μ', ad: 9.8794, dec: 26.007, mag: 3.9, dx: 0, dy: -8, ancre: 'middle' },
  { id: 'algenubi', nom: 'Algenubi', bayer: 'ε', ad: 9.7642, dec: 23.774, mag: 3.0, dx: 0, dy: 15, ancre: 'middle' },
  // η Leonis : un nœud de la « faucille », sans projet associé
  { id: 'eta', nom: 'η Leonis', bayer: 'η', ad: 10.1222, dec: 16.763, mag: 3.5, mineure: true },
];

export const etoiles = brutes.map((e) => ({ ...e, ...projeter(e.ad, e.dec) }));
export const etoileParId = Object.fromEntries(etoiles.map((e) => [e.id, e]));

// Tracé classique : la faucille (tête et crinière), puis le corps et l'arrière-train.
export const segments = [
  ['regulus', 'eta'],
  ['eta', 'algieba'],
  ['algieba', 'adhafera'],
  ['adhafera', 'rasalas'],
  ['rasalas', 'algenubi'],
  ['regulus', 'chertan'],
  ['chertan', 'denebola'],
  ['denebola', 'zosma'],
  ['zosma', 'algieba'],
  ['zosma', 'chertan'],
];

// Le Triplet du Lion, trois galaxies situées sous Chertan (cible du grossissement vers le niveau 2).
export const triplet = [
  { id: 'm66', nom: 'M66', ...projeter(11.3375, 12.99) },
  { id: 'm65', nom: 'M65', ...projeter(11.3155, 13.092) },
  { id: 'ngc3628', nom: 'NGC 3628', ...projeter(11.338, 13.589) },
];

/** Rayon d'affichage d'une étoile selon sa magnitude (plus brillante = plus grosse). */
export function rayonEtoile(mag) {
  return 1.6 + (4.2 - Math.min(mag, 4.2)) * 1.25;
}
