import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { surImage } from '../cosmos/etat';

const lisser = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Moments où la légende apparaît puis s'efface, en progression de la transition (0 → 1).
// La zone de passage est plus haute que l'écran : entre ~0,2 et ~0,75, elle occupe tout l'écran,
// la légende ne passe donc jamais par-dessus le texte des sections.
const FENETRES = { 4: [0.2, 0.3, 0.6, 0.7] }; // la dernière part avant que le fond ne devienne clair
const FENETRE = [0.2, 0.3, 0.66, 0.76];

/**
 * Zone de passage entre deux niveaux : la traverser déclenche le grossissement suivant.
 * Elle n'affiche qu'une légende, fixée en bas de l'écran pendant la transition.
 */

export default function Transition({ vers }) {
  const { t } = useLanguage();
  const ref = useRef(null);

  useEffect(
    () =>
      surImage((e) => {
        const p = e.p[vers - 1];
        const [a, b, c, d] = FENETRES[vers] ?? FENETRE;
        const opacite = lisser(a, b, p) * (1 - lisser(c, d, p));
        if (ref.current) ref.current.style.opacity = opacite.toFixed(3);
      }),
    [vers],
  );

  return (
    <div className="transition" data-transition={vers} aria-hidden="true">
      <div className="conteneur legende-cadre">
        <p className="legende" ref={ref}>
          <span className="legende-titre">{t(`transitions.${vers}.titre`)}</span>
          <span className="legende-note">{t(`transitions.${vers}.note`)}</span>
        </p>
      </div>
    </div>
  );
}
