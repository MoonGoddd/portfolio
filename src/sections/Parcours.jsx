import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { parcours, interets } from '../data/parcours';
import { surImage } from '../cosmos/etat';

/** « lumière émise il y a 2 ans » : temps écoulé depuis une date AAAA-MM. */
function recul(emise, t) {
  if (!emise) return t('parcours.direct');
  const [annee, mois] = emise.split('-').map(Number);
  const maintenant = new Date();
  const ecart = (maintenant.getFullYear() - annee) * 12 + (maintenant.getMonth() + 1 - mois);
  const ans = Math.round(ecart / 12);
  const duree = ecart < 12 ? `${Math.max(1, ecart)} ${t('parcours.mois')}` : `${ans} ${t(ans > 1 ? 'parcours.ans' : 'parcours.an')}`;
  return t('parcours.emise').replace('{duree}', duree);
}

/**
 * Niveau 3, le champ profond : le parcours, de l'étape en cours jusqu'au bac.
 * Plus on descend, plus la lumière est ancienne. Un faisceau relie les étapes au fil du défilement.
 */
export default function Parcours() {
  const { t, tx } = useLanguage();
  const liste = useRef(null);

  useEffect(
    () =>
      surImage((e) => {
        const el = liste.current;
        const m = e.mesures.etapes; // position relevée par la caméra, pas relue à chaque image
        if (!el || !m) return;
        const avance = e.reduit ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.62 - (m.haut - e.defilement)) / m.hauteur));
        const texte = avance.toFixed(3);
        if (texte !== el.dataset.avance) {
          el.dataset.avance = texte;
          el.style.setProperty('--avance', texte);
        }
      }),
    [],
  );

  return (
    <section id="parcours" className="section" data-niveau-section="3" tabIndex={-1} aria-labelledby="titre-parcours">
      <div className="conteneur">
        <div className="entete">
          <h2 id="titre-parcours" className="titre reveler">
            {t('parcours.titre')}
          </h2>
          <p className="sous-titre reveler">{t('parcours.sousTitre')}</p>
        </div>

        <div className="etapes" ref={liste}>
          <span className="faisceau" aria-hidden="true" />
          <ol>
          {parcours.map((etape) => (
            <li key={etape.id} className={`etape reveler${etape.enCours ? ' en-cours' : ''}`}>
              <div className="etape-date">
                <span>{tx(etape.date)}</span>
                {etape.enCours && <span className="badge pulse">{t('parcours.enCours')}</span>}
                <span className="etape-recul">{recul(etape.emise, t)}</span>
              </div>
              <div>
                <h3 className="etape-titre">{tx(etape.titre)}</h3>
                <p className="etape-phrase">{tx(etape.phrase)}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>

        <p className="interets reveler">
          <span>{t('parcours.interets')}</span> {tx(interets).join(' · ')}
        </p>
      </div>
    </section>
  );
}
