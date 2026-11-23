import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { niveaux } from '../data/profil';
import { surImage } from '../cosmos/etat';
import useZoomLevel from '../cosmos/useZoomLevel';

/** Grossissement affiché pour un niveau continu z (interpolation sur une échelle logarithmique). */
function grossissement(z, langue) {
  const i = Math.min(niveaux.length - 2, Math.floor(z));
  const exposant = niveaux[i].gross + (niveaux[i + 1].gross - niveaux[i].gross) * (z - i);
  const valeur = Number((10 ** exposant).toPrecision(2));
  return `×${valeur.toLocaleString(langue === 'fr' ? 'fr-FR' : 'en-GB')}`;
}

/** HUD du télescope : règle des cinq niveaux, grossissement, distance et coordonnées. */
export default function Hud() {
  const { t, language } = useLanguage();
  const niveau = useZoomLevel();
  const refGross = useRef(null);
  const refBarre = useRef(null);

  useEffect(() => {
    let dernier = '';
    const maj = (e) => {
      const texte = grossissement(e.z, language);
      if (texte !== dernier && refGross.current) {
        refGross.current.textContent = texte;
        dernier = texte;
      }
      if (refBarre.current) refBarre.current.style.transform = `scaleX(${(e.z / 4).toFixed(4)})`;
    };
    return surImage(maj);
  }, [language]);

  return (
    <aside className="hud" aria-label={t('a11y.niveaux')}>
      <div className="hud-barre" aria-hidden="true">
        <span ref={refBarre} />
      </div>
      <ol className="hud-regle">
        {niveaux.map((n, i) => (
          <li key={n.id} className={i === niveau ? 'actif' : undefined}>
            <a href={n.ancre} aria-current={i === niveau ? 'true' : undefined}>
              <span className="hud-trait" aria-hidden="true" />
              <span className="hud-nom">{t(`hud.niveaux.${i}`)}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="hud-mesures" aria-hidden="true">
        <span>
          {t('hud.gross')} <span ref={refGross}>×1</span>
        </span>
        {[...t(`hud.lieux.${niveau}`).split(', '), ...t(`hud.coords.${niveau}`).split(' · ')].map((ligne) => (
          <span key={ligne}>{ligne}</span>
        ))}
      </p>
    </aside>
  );
}
