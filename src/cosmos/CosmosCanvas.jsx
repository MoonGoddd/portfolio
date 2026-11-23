import React, { useEffect, useRef } from 'react';
import { etat, emettreImage, definirNiveau } from './etat';
import { mesurer, calculer, progressions } from './camera';
import { creerScene } from './scene';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const PIXELS_MAX = 2_600_000; // au-delà, on réduit la définition du canvas pour rester fluide
const DENSITE_MAX = 1.5; // les étoiles sont de petits points flous : au-delà, la différence ne se voit pas

// La caméra suit le défilement avec un léger amorti (quelques centièmes de seconde) :
// la scène ne prend jamais de retard sur le contenu. La lisibilité des transitions vient
// de la longueur des zones de passage, vides de texte (voir .transition dans index.css).
const AMORTI = 14; // plus c'est grand, plus la caméra colle au défilement

// Au repos (ni défilement, ni souris, ni transition en cours), on dessine moins souvent.
const IPS_REPOS = 30;
const IPS_REPOS_SIGNAL = 8; // le fond diffus du contact dérive très lentement

/**
 * Le cosmos : un seul canvas fixe derrière la page. À chaque image, la caméra lit le défilement,
 * en déduit le niveau de grossissement, prévient le HUD et les sections, puis la scène est dessinée.
 * En mouvement réduit, il n'y a pas de boucle : une image fixe est redessinée quand on défile.
 */
export default function CosmosCanvas() {
  const ref = useRef(null);
  const reduit = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;
    const html = document.documentElement;
    const scene = creerScene();
    let L = 0;
    let H = 0;
    let dpr = 1;
    let densiteDemandee = 0;
    let boucle = 0;
    let dernier = 0;
    let defilementPrecedent = window.scrollY;
    let enAttente = false;

    etat.reduit = reduit;

    // Taille du canvas = sa taille CSS (100lvh de haut : la plus grande fenêtre possible).
    // Elle ne change pas quand la barre d'adresse d'un téléphone apparaît ou disparaît :
    // on ne réalloue le canvas (ce qui l'efface) que si sa taille change vraiment.
    const tailler = () => {
      const largeur = canvas.clientWidth || window.innerWidth;
      const hauteur = canvas.clientHeight || window.innerHeight;
      const densite = Math.min(window.devicePixelRatio || 1, DENSITE_MAX);
      if (largeur === L && hauteur === H && densite === densiteDemandee && canvas.width > 0) {
        mesurer();
        return false;
      }
      L = largeur;
      H = hauteur;
      densiteDemandee = densite;
      dpr = densite;
      if (L * H * dpr * dpr > PIXELS_MAX) dpr = Math.max(1, Math.sqrt(PIXELS_MAX / (L * H)));
      canvas.width = Math.round(L * dpr);
      canvas.height = Math.round(H * dpr);
      scene.redimensionner(L, H);
      mesurer();
      return true;
    };

    const debut = performance.now();
    let calme = 0; // secondes depuis le dernier mouvement
    let dernierDessin = 0;

    const image = (instant, force = false) => {
      const dt = Math.min(0.05, (instant - (dernier || instant)) / 1000);
      dernier = instant;

      const defilement = window.scrollY;
      etat.vitesse += (defilement - defilementPrecedent - etat.vitesse) * 0.2;
      const bouge = defilement !== defilementPrecedent;
      defilementPrecedent = defilement;
      etat.defilement = defilement;

      const cible = calculer(defilement, H, reduit).z;
      etat.zCible = cible;
      const ecart = cible - etat.z;
      if (reduit || instant - debut < 700) {
        // arrivée sur la page (le navigateur peut restaurer la position de défilement) ou
        // mouvement réduit : on se place directement au bon niveau, sans rejouer de transition
        etat.z = cible;
      } else if (Math.abs(ecart) > 1.2) {
        // long saut (lien du menu) : on arrive directement sur la bonne scène,
        // sans rejouer les transitions intermédiaires par-dessus le contenu
        etat.z = cible;
      } else if (ecart !== 0) {
        etat.z += Math.abs(ecart) < 0.0004 ? ecart : ecart * (1 - Math.exp(-dt * AMORTI));
      }
      const z = etat.z;
      const p = progressions(z);
      etat.p = p;

      // Cadence réduite au repos
      calme = bouge || Math.abs(cible - z) > 0.0005 || etat.souris.bouge ? 0 : calme + dt;
      etat.souris.bouge = false;
      if (!force && !reduit && calme > 0.4) {
        const ips = z > 3.95 ? IPS_REPOS_SIGNAL : IPS_REPOS;
        if (instant - dernierDessin < 1000 / ips - 2) return;
      }
      if (!reduit) etat.temps += Math.min(0.05, (instant - (dernierDessin || instant)) / 1000);
      dernierDessin = instant;
      // le niveau 4 (fond clair) ne commence que lorsque la lumière a envahi l'écran
      definirNiveau(p[3] > 0.64 ? 4 : Math.round(Math.min(z, 3)));
      emettreImage();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.dessiner(ctx, etat.temps);
    };

    const tourner = (instant) => {
      image(instant);
      boucle = requestAnimationFrame(tourner);
    };
    // Mouvement réduit : une seule image, redessinée à la demande
    const demander = () => {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame((instant) => {
        enAttente = false;
        image(instant);
      });
    };
    const demarrer = () => {
      cancelAnimationFrame(boucle);
      dernier = 0;
      if (reduit) demander();
      else if (!document.hidden) boucle = requestAnimationFrame(tourner);
    };

    // Parallaxe et survol des étoiles : souris uniquement (au doigt, ils feraient bouger le ciel en défilant)
    const surSouris = (e) => {
      if (e.pointerType !== 'mouse') return;
      etat.souris.px = e.clientX;
      etat.souris.py = e.clientY;
      etat.souris.x = (e.clientX / L) * 2 - 1;
      etat.souris.y = (e.clientY / H) * 2 - 1;
      etat.souris.bouge = true;
    };
    let attente = 0;
    const surRedimension = () => {
      clearTimeout(attente);
      attente = setTimeout(() => {
        tailler();
        if (reduit) demander();
      }, 120);
    };
    // La hauteur de la page change (polices chargées, accordéon ouvert…) : on remesure les zones
    const observateur = new ResizeObserver(() => {
      mesurer();
      if (reduit) demander();
    });

    tailler();
    html.classList.add('cosmos-pret');
    html.dataset.niveau = String(etat.niveau);
    demarrer();

    window.addEventListener('resize', surRedimension);
    window.addEventListener('pointermove', surSouris, { passive: true });
    document.addEventListener('visibilitychange', demarrer);
    if (reduit) window.addEventListener('scroll', demander, { passive: true });
    observateur.observe(document.body);
    // Les images lourdes (galaxie, champ profond, fond diffus) sont préparées pendant un temps mort
    const preparer = window.requestIdleCallback
      ? window.requestIdleCallback(() => scene.preparer(), { timeout: 3000 })
      : setTimeout(() => scene.preparer(), 1500);

    return () => {
      cancelAnimationFrame(boucle);
      clearTimeout(attente);
      if (window.cancelIdleCallback) window.cancelIdleCallback(preparer);
      else clearTimeout(preparer);
      observateur.disconnect();
      window.removeEventListener('resize', surRedimension);
      window.removeEventListener('pointermove', surSouris);
      document.removeEventListener('visibilitychange', demarrer);
      window.removeEventListener('scroll', demander);
      html.classList.remove('cosmos-pret');
    };
  }, [reduit]);

  return <canvas ref={ref} className="cosmos" aria-hidden="true" />;
}
