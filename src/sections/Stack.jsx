import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { stack, langues, idTech } from '../data/stack';
import { etat, surSurvolTech, definirSurvolTech } from '../cosmos/etat';

/**
 * Niveau 2, la galaxie : la stack en grille 2×2, et à côté une spirale à quatre bras,
 * un par catégorie. Survoler une techno fait briller son étoile dans la galaxie, et inversement.
 */
export default function Stack() {
  const { t, tx } = useLanguage();
  const ancre = useRef(null);
  const [survol, setSurvol] = useState(null);

  useEffect(() => {
    // Le canvas dessine la galaxie à l'emplacement de cet élément
    etat.galaxie.ancre = ancre.current;
    const arreter = surSurvolTech(setSurvol);
    return () => {
      arreter();
      etat.galaxie.ancre = null;
    };
  }, []);

  // Les noms des bras sont écrits dans le canvas, dans la langue du site
  useEffect(() => {
    etat.galaxie.noms = Object.fromEntries(stack.map((bloc) => [bloc.id, t(`stack.categories.${bloc.id}`)]));
  }, [t]);

  return (
    <section id="stack" className="section" data-niveau-section="2" tabIndex={-1} aria-labelledby="titre-stack">
      <div className="conteneur stack-corps">
        <div className="stack-gauche">
          <div className="entete">
            <h2 id="titre-stack" className="titre reveler">
              {t('stack.titre')}
            </h2>
            <p className="sous-titre reveler">{t('stack.sousTitre')}</p>
          </div>

          <div className="stack-grille">
            {stack.map((bloc) => (
              <div key={bloc.id} className="stack-bloc reveler" style={{ '--teinte': bloc.teinte }}>
                <h3>{t(`stack.categories.${bloc.id}`)}</h3>
                <ul>
                  {bloc.elements.map((nom) => {
                    const id = idTech(nom);
                    return (
                      <li
                        key={id}
                        className={survol === id ? 'actif' : undefined}
                        onPointerEnter={(e) => e.pointerType === 'mouse' && definirSurvolTech(id)}
                        onPointerLeave={(e) => e.pointerType === 'mouse' && definirSurvolTech(null)}
                        onClick={() => definirSurvolTech(survol === id ? null : id)}
                      >
                        {nom}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div className="stack-bloc stack-langues reveler" style={{ '--teinte': 'var(--lumiere)' }}>
              <h3>{t('stack.langues')}</h3>
              <ul>
                {langues.map((langue) => (
                  <li key={langue.niveau}>
                    {tx(langue.nom)} <span className="niveau-langue">{langue.niveau}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Emplacement de la galaxie : le canvas la dessine exactement ici */}
        <div className="galaxie-ancre" ref={ancre} aria-hidden="true">
          <p className="galaxie-legende">{t('stack.legende')}</p>
        </div>
      </div>
    </section>
  );
}
