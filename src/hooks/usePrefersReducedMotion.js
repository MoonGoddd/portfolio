import useMediaQuery from './useMediaQuery';

/** Vrai si le visiteur a demandé moins d'animations (réglage du système). */
export default function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
