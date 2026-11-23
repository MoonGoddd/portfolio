import React, { useEffect, useRef } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/** Réticule de télescope à la place du curseur (souris uniquement, jamais en mouvement réduit). */
export default function Curseur() {
  const sourisFine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduit = usePrefersReducedMotion();
  const ref = useRef(null);
  const actif = sourisFine && !reduit;

  useEffect(() => {
    if (!actif) return undefined;
    const el = ref.current;
    const html = document.documentElement;
    const bouger = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      html.classList.add('curseur-actif');
      el.classList.add('visible');
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.classList.toggle('grand', Boolean(e.target.closest?.('a, button, [data-cliquable]')));
    };
    const sortir = () => el.classList.remove('visible');
    window.addEventListener('pointermove', bouger, { passive: true });
    document.documentElement.addEventListener('pointerleave', sortir);
    return () => {
      window.removeEventListener('pointermove', bouger);
      document.documentElement.removeEventListener('pointerleave', sortir);
      html.classList.remove('curseur-actif');
    };
  }, [actif]);

  if (!actif) return null;
  return (
    <div ref={ref} className="curseur" aria-hidden="true">
      <span />
    </div>
  );
}
