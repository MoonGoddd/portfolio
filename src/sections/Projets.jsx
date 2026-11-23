import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { projets, etoileAVenir } from '../data/projets';
import { etoileParId } from '../data/lion';
import { allerA } from '../hooks/useDefilement';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import ConstellationLeo from '../components/ConstellationLeo.jsx';

const TOUTES = new Set(projets.map((p) => p.etoile));

// Le survol ne vient que de la souris : au doigt, chaque contact déclencherait un faux survol
// (et la constellation changerait d'étoile mise en avant pendant qu'on fait défiler).
const souris = (e) => e.pointerType === 'mouse';

/** Contenu déplié d'un projet sans lien direct : un court texte ou trois listes. */
function Details({ details, tx }) {
  if (details.texte) return <p className="details-texte">{tx(details.texte)}</p>;
  return (
    <div className="details-listes">
      {details.listes.map((liste) => (
        <div key={liste.titre.fr}>
          <h4>{tx(liste.titre)}</h4>
          <ul>
            {tx(liste.points).map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Niveau 1, la constellation : la liste des projets et, à côté, le Lion.
 * Chaque projet qui entre à l'écran allume son étoile ; les traits se tracent au fil de la lecture.
 */
export default function Projets() {
  const { t, tx } = useLanguage();
  const reduit = usePrefersReducedMotion();
  const [allumees, setAllumees] = useState(() => new Set());
  const [survol, setSurvol] = useState(null);
  const [ouverts, setOuverts] = useState(() => new Set());
  const [vise, setVise] = useState(null);
  const lignes = useRef({});

  const titres = useMemo(() => Object.fromEntries(projets.map((p) => [p.etoile, p.titre])), []);

  useEffect(() => {
    if (reduit) return undefined;
    const ordre = projets.map((p) => p.etoile);
    const observateur = new IntersectionObserver(
      (entrees) => {
        // Quand un projet arrive à l'écran, son étoile s'allume, ainsi que celles des projets précédents
        // (utile si l'on arrive directement au milieu de la liste par une ancre).
        const rangs = entrees.filter((e) => e.isIntersecting).map((e) => ordre.indexOf(e.target.dataset.etoile));
        if (!rangs.length) return;
        const dernier = Math.max(...rangs);
        setAllumees((avant) => {
          const suite = new Set([...avant, ...ordre.slice(0, dernier + 1)]);
          return suite.size === avant.size ? avant : suite;
        });
      },
      { rootMargin: '0px 0px -30% 0px', threshold: 0.2 },
    );
    Object.values(lignes.current).forEach((el) => el && observateur.observe(el));
    return () => observateur.disconnect();
  }, [reduit]);

  // Clic sur une étoile : on défile jusqu'à la ligne du projet et on la met en avant
  const viser = useCallback((etoile) => {
    const el = lignes.current[etoile];
    if (!el) return;
    allerA(el, { duree: 1.1, decalage: -window.innerHeight * 0.28 });
    setVise(etoile);
    setTimeout(() => setVise((actuelle) => (actuelle === etoile ? null : actuelle)), 1800);
  }, []);

  const basculer = (id) =>
    setOuverts((avant) => {
      const suite = new Set(avant);
      if (suite.has(id)) suite.delete(id);
      else suite.add(id);
      return suite;
    });

  const visibles = reduit ? TOUTES : allumees;

  return (
    <section id="projets" className="section" data-niveau-section="1" tabIndex={-1} aria-labelledby="titre-projets">
      <div className="conteneur">
        <div className="entete">
          <h2 id="titre-projets" className="titre reveler">
            {t('projets.titre')}
          </h2>
          <p className="sous-titre reveler">{t('projets.sousTitre')}</p>
        </div>

        <div className="projets-corps">
          <aside className="constellation-cadre">
            <ConstellationLeo
              allumees={visibles}
              survol={survol}
              projets={titres}
              aVenir={etoileAVenir}
              onSurvol={setSurvol}
              onViser={viser}
            />
          </aside>

          <ul className="projets-liste">
            {projets.map((p) => {
              const etoile = etoileParId[p.etoile];
              const ouvert = ouverts.has(p.id);
              const classes = ['projet', visibles.has(p.etoile) ? 'vu' : '', survol === p.etoile ? 'survol' : '', vise === p.etoile ? 'vise' : ''].join(' ');
              return (
                <li
                  key={p.id}
                  className={classes}
                  data-etoile={p.etoile}
                  ref={(el) => {
                    lignes.current[p.etoile] = el;
                  }}
                  onPointerEnter={(e) => souris(e) && setSurvol(p.etoile)}
                  onPointerLeave={(e) => souris(e) && setSurvol(null)}
                  onFocus={(e) => e.target.matches(':focus-visible') && setSurvol(p.etoile)}
                  onBlur={() => setSurvol(null)}
                >
                  <div className="projet-cat">
                    <span>{t(`categories.${p.categorie}`)}</span>
                    <span className="projet-etoile">{etoile.nom}</span>
                  </div>
                  <div className="projet-corps">
                    <h3 className="projet-titre">
                      {p.titre}
                      {p.enCours && <span className="badge pulse">{t('projets.enCours')}</span>}
                    </h3>
                    <p className="projet-desc">{tx(p.description)}</p>
                    <p className="projet-technos">{p.technos.join(', ')}</p>
                    <div className="projet-actions">
                      {p.liens.map((lien) => (
                        <a key={lien.url} className="lien" href={lien.url} target="_blank" rel="noopener noreferrer">
                          {t(`projets.liens.${lien.type}`)}
                        </a>
                      ))}
                      {p.details && (
                        <button
                          type="button"
                          className="lien lien-details"
                          aria-expanded={ouvert}
                          aria-controls={`details-${p.id}`}
                          onClick={() => basculer(p.id)}
                        >
                          {ouvert ? t('projets.fermer') : t('projets.details')}
                          <ChevronDown size={15} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    {p.details && (
                      <div id={`details-${p.id}`} className={`accordeon${ouvert ? ' ouvert' : ''}`} aria-hidden={!ouvert}>
                        <div className="accordeon-interieur">
                          <Details details={p.details} tx={tx} />
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
