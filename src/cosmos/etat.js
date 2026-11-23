// État partagé du cosmos. La caméra l'écrit à chaque image ;
// le canvas, le HUD et les sections le lisent (sans re-rendu React).

export const etat = {
  z: 0, // niveau de grossissement continu, de 0 (oculaire) à 4 (signal)
  p: [0, 0, 0, 0], // progression des 4 transitions (0→1, 1→2, 2→3, 3→4)
  niveau: 0, // niveau entier le plus proche
  temps: 0, // secondes écoulées (figé en mouvement réduit)
  reduit: false,
  defilement: 0, // window.scrollY de l'image en cours
  vitesse: 0, // vitesse de défilement lissée (px par image)
  souris: { x: 0, y: 0, px: -9999, py: -9999, bouge: false }, // x, y dans [-1, 1] ; px, py en pixels
  oculaire: { x: 0, y: 0, r: 0 }, // cercle de l'oculaire pendant la transition 0→1
  galaxie: { ancre: null, survol: null, noms: {} },
  mesures: { ancre: null, parcours: 0, etapes: null }, // positions mises en cache par camera.mesurer()
  zCible: 0, // niveau visé par le défilement ; z le suit avec un léger amorti // élément DOM où s'amarre la galaxie, techno survolée, noms des bras
};

function canal() {
  const abonnes = new Set();
  return {
    ecouter(fn) {
      abonnes.add(fn);
      return () => abonnes.delete(fn);
    },
    emettre(valeur) {
      abonnes.forEach((fn) => fn(valeur));
    },
  };
}

const image = canal(); // à chaque image dessinée
const niveau = canal(); // quand le niveau entier change
const survol = canal(); // quand la techno survolée change

export const surImage = image.ecouter;
export const emettreImage = () => image.emettre(etat);

export const surNiveau = niveau.ecouter;
export function definirNiveau(n) {
  if (n === etat.niveau) return;
  etat.niveau = n;
  document.documentElement.dataset.niveau = String(n);
  niveau.emettre(n);
}

export const surSurvolTech = survol.ecouter;
export function definirSurvolTech(id) {
  if (id === etat.galaxie.survol) return;
  etat.galaxie.survol = id;
  survol.emettre(id);
}
