import { useEffect, useState } from 'react';

/** Suit une media query CSS (ex. '(min-width: 1100px)'). */
export default function useMediaQuery(requete) {
  const [vrai, setVrai] = useState(() => window.matchMedia(requete).matches);
  useEffect(() => {
    const mq = window.matchMedia(requete);
    const maj = () => setVrai(mq.matches);
    maj();
    mq.addEventListener('change', maj);
    return () => mq.removeEventListener('change', maj);
  }, [requete]);
  return vrai;
}
