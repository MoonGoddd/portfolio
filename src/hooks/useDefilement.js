import { useEffect } from 'react';

let reduitCourant = false;

/**
 * Fait défiler jusqu'à un élément (ou 0 pour le haut de page).
 * Le défilement reste celui du navigateur : doux si les animations sont permises, immédiat sinon.
 */
export function allerA(cible, { decalage = 0 } = {}) {
  const el = cible === 0 ? null : typeof cible === 'string' ? document.querySelector(cible) : cible;
  if (cible !== 0 && !el) return;
  const y = cible === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY + decalage;
  window.scrollTo({ top: y, behavior: reduitCourant ? 'auto' : 'smooth' });
  // Le focus suit, pour la navigation au clavier et les lecteurs d'écran
  if (el?.hasAttribute('tabindex')) el.focus({ preventScroll: true });
}

/**
 * Défilement de la page : ancres du menu et révélations au scroll.
 * Le défilement lui-même n'est jamais modifié (pas de défilement « lissé ») : il reste naturel
 * à la souris, au pavé tactile et au doigt. En mouvement réduit, aucune révélation n'est animée.
 */
export default function useDefilement(reduit) {
  useEffect(() => {
    reduitCourant = reduit;

    const surClic = (e) => {
      const lien = e.target.closest?.('a[href^="#"]');
      if (!lien) return;
      const cible = lien.getAttribute('href');
      const el = cible.length > 1 ? document.querySelector(cible) : null;
      if (!el) return;
      e.preventDefault();
      allerA(el);
      window.history.replaceState(null, '', cible);
    };
    document.addEventListener('click', surClic);
    if (reduit) return () => document.removeEventListener('click', surClic);

    const html = document.documentElement;
    html.classList.add('anime');

    // Révélations : un léger fondu, une seule fois, quand l'élément arrive dans l'écran
    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (!entree.isIntersecting) return;
          entree.target.classList.add('revele');
          observateur.unobserve(entree.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    document.querySelectorAll('.reveler').forEach((el) => observateur.observe(el));

    return () => {
      document.removeEventListener('click', surClic);
      observateur.disconnect();
      html.classList.remove('anime');
    };
  }, [reduit]);
}
