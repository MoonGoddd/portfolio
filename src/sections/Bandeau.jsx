import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { profil } from '../data/profil';
import { surImage } from '../cosmos/etat';

const Etoile = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
  </svg>
);

/** Bandeau défilant : la télémétrie du télescope et quelques mots-clés. Purement décoratif. */
export default function Bandeau() {
  const { t, tx } = useLanguage();
  const piste = useRef(null);
  const mots = tx(profil.bandeau);

  // Le bandeau accélère un peu quand on défile vite
  useEffect(
    () =>
      surImage((e) => {
        const animation = piste.current?.getAnimations?.()[0];
        if (animation) animation.playbackRate = 1 + Math.min(5, Math.abs(e.vitesse) / 14);
      }),
    [],
  );

  return (
    <div className="bandeau" aria-hidden="true">
      <div className="bandeau-piste" ref={piste}>
        {[0, 1].map((serie) => (
          <div className="bandeau-serie" key={serie}>
            {[0, 1].map((tour) => (
              <React.Fragment key={tour}>
                <span className="bandeau-cible">{t('bandeau.cible')}</span>
                {mots.map((mot) => (
                  <span className="bandeau-mot" key={mot}>
                    <Etoile />
                    {mot}
                  </span>
                ))}
                <Etoile />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
