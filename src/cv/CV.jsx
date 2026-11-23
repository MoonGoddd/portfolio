import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Mail, MapPin, Phone, Printer, Globe } from 'lucide-react';
import { cv } from '../data/cv';
import { profil, contact } from '../data/profil';
import { projets, etoileAVenir } from '../data/projets';
import { stack, langues } from '../data/stack';
import { interets } from '../data/parcours';
import { etoiles, etoileParId, segments, rayonEtoile } from '../data/lion';
import photo from './photo.jpg';

const LANGUES = ['fr', 'en'];
const CLE = 'portfolio-langue'; // même réglage que le portfolio

function langueInitiale() {
  const demandee = new URLSearchParams(window.location.search).get('lang');
  if (LANGUES.includes(demandee)) return demandee;
  try {
    const memo = window.localStorage.getItem(CLE);
    if (LANGUES.includes(memo)) return memo;
  } catch {
    // stockage indisponible : français par défaut
  }
  return 'fr';
}

const CATEGORIES = {
  fr: { jeu: 'Jeu', web: 'Web', outil: 'Outil', langages: 'Langages', frameworks: 'Frameworks', donnees: 'Données', outils: 'Outils' },
  en: { jeu: 'Game', web: 'Web', outil: 'Tool', langages: 'Languages', frameworks: 'Frameworks', donnees: 'Data', outils: 'Tools' },
};

/** Petit losange à quatre branches : le repère du site (bandeau, favicon). */
const Etoile = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
  </svg>
);

/** Le Lion, en miniature et sans interaction : les étoiles des projets sont allumées. */
function Constellation({ legende }) {
  const E = 6.2;
  const px = (e) => 104 + e.x * E;
  const py = (e) => 64 + e.y * E;
  const avecProjet = new Set(projets.map((p) => p.etoile));
  return (
    <figure className="cv-lion">
      <svg viewBox="0 4 208 118" aria-hidden="true">
        {segments.map(([a, b]) => (
          <line
            key={a + b}
            x1={px(etoileParId[a])}
            y1={py(etoileParId[a])}
            x2={px(etoileParId[b])}
            y2={py(etoileParId[b])}
            className={a === etoileAVenir || b === etoileAVenir ? 'futur' : undefined}
          />
        ))}
        {etoiles.map((e) => (
          <circle
            key={e.id}
            cx={px(e)}
            cy={py(e)}
            r={rayonEtoile(e.mag) * 0.62}
            className={avecProjet.has(e.id) ? 'vive' : 'faible'}
          />
        ))}
      </svg>
      <figcaption>{legende}</figcaption>
    </figure>
  );
}

/** Une entrée datée (expérience ou formation), sur le « faisceau » vertical. */
function Etape({ e, langue, t }) {
  return (
    <li className={`cv-etape${e.enCours ? ' en-cours' : ''}`}>
      <div className="cv-etape-tete">
        <h3>
          {e.titre[langue]}
          <span className="cv-lieu">, {e.lieu}</span>
        </h3>
        <span className="cv-periode">
          {e.enCours && <span className="cv-badge">{t.enCours}</span>}
          {e.periode[langue]}
        </span>
      </div>
      <p>{e.texte[langue]}</p>
      {e.technos && <p className="cv-technos">{e.technos.join(', ')}</p>}
    </li>
  );
}

/**
 * Le CV, sur une feuille A4. Il lit les mêmes données que le portfolio :
 * un projet modifié dans src/data/projets.js change aussi ici.
 */
export default function CV() {
  const [langue, setLangue] = useState(langueInitiale);
  const t = cv.textes[langue];
  const cat = CATEGORIES[langue];
  const cadre = useRef(null);
  const feuille = useRef(null);

  useEffect(() => {
    document.documentElement.lang = langue;
    document.title = t.titrePage;
    try {
      window.localStorage.setItem(CLE, langue);
    } catch {
      // tant pis
    }
  }, [langue, t.titrePage]);

  // À l'écran, la feuille A4 est réduite pour tenir dans la largeur (téléphone)
  useLayoutEffect(() => {
    const ajuster = () => {
      const f = feuille.current;
      const c = cadre.current;
      if (!f || !c) return;
      const k = Math.min(1, (c.clientWidth - 24) / f.offsetWidth);
      c.style.setProperty('--echelle', String(k));
      c.style.height = `${f.offsetHeight * k + 48}px`;
    };
    ajuster();
    window.addEventListener('resize', ajuster);
    return () => window.removeEventListener('resize', ajuster);
  }, []);

  const pdf = `${import.meta.env.BASE_URL}${contact.cv[langue] ?? contact.cv.fr}`;

  return (
    <>
      <nav className="cv-barre" aria-label="CV">
        <a href={import.meta.env.BASE_URL}>
          <ArrowLeft size={16} aria-hidden="true" />
          {t.portfolio}
        </a>
        <div className="cv-barre-droite">
          <div className="cv-langues" role="group" aria-label="Langue">
            {LANGUES.map((code) => (
              <button key={code} type="button" lang={code} aria-pressed={langue === code} onClick={() => setLangue(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <button type="button" className="cv-bouton secondaire" onClick={() => window.print()}>
            <Printer size={16} aria-hidden="true" />
            {t.imprimer}
          </button>
          <a className="cv-bouton" href={pdf} download>
            <Download size={16} aria-hidden="true" />
            {t.pdf}
          </a>
        </div>
      </nav>

      <div className="cv-cadre" ref={cadre}>
        <article className="cv-feuille" ref={feuille} aria-label={t.titrePage}>
          {/* ------------------------------------------------------------ colonne sombre */}
          <aside className="cv-cote">
            <div className="cv-photo">
              <img src={photo} alt={t.photo} width="240" height="240" />
              <span className="cv-orbite" aria-hidden="true" />
            </div>

            <section>
              <h2>{t.contact}</h2>
              <ul className="cv-contact">
                <li>
                  <Mail size={13} aria-hidden="true" />
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
                <li>
                  <Phone size={13} aria-hidden="true" />
                  <a href={`tel:${cv.telephoneLien}`}>{cv.telephone}</a>
                </li>
                <li>
                  <MapPin size={13} aria-hidden="true" />
                  {cv.ville[langue]}
                </li>
                <li>
                  <Globe size={13} aria-hidden="true" />
                  <a href={`https://${cv.site}`}>{cv.site}</a>
                </li>
              </ul>
              <p className="cv-reseaux">
                {contact.liens.map((lien) => (
                  <a key={lien.id} href={lien.url}>
                    {lien.nom}
                  </a>
                ))}
              </p>
            </section>

            <section>
              <h2>{t.competences}</h2>
              <dl className="cv-stack">
                {stack.map((bloc) => (
                  <div key={bloc.id} style={{ '--teinte': bloc.teinte }}>
                    <dt>{cat[bloc.id]}</dt>
                    <dd>{bloc.elements.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2>{t.langues}</h2>
              <ul className="cv-langues-parlees">
                {langues.map((l) => (
                  <li key={l.niveau}>
                    {l.nom[langue]} <span>{l.niveau}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>{t.interets}</h2>
              <p className="cv-interets">{interets[langue].join(', ')}</p>
            </section>

            <Constellation legende={t.constellation} />
          </aside>

          {/* ------------------------------------------------------------ colonne principale */}
          <div className="cv-principal">
            <header className="cv-entete">
              <h1>
                {profil.prenom} {profil.nom}
              </h1>
              <p className="cv-titre">{cv.titre[langue]}</p>
              <p className="cv-sous-titre">{cv.sousTitre[langue]}</p>
            </header>

            <section>
              <h2>
                <Etoile className="cv-repere" />
                {t.experience}
              </h2>
              <ol className="cv-etapes">
                {cv.experiences.map((e) => (
                  <Etape key={e.id} e={e} langue={langue} t={t} />
                ))}
              </ol>
            </section>

            <section>
              <h2>
                <Etoile className="cv-repere" />
                {t.formation}
              </h2>
              <ol className="cv-etapes">
                {cv.formations.map((e) => (
                  <Etape key={e.id} e={e} langue={langue} t={t} />
                ))}
              </ol>
            </section>

            <section>
              <h2>
                <Etoile className="cv-repere" />
                {t.projets}
                <span className="cv-note">{t.projetsNote}</span>
              </h2>
              <ul className="cv-projets">
                {projets.map((p) => (
                  <li key={p.id}>
                    <div className="cv-projet-tete">
                      <h3>
                        {p.titre}
                        {p.enCours && <span className="cv-badge">{t.enCours}</span>}
                      </h3>
                      <span className="cv-projet-cat">
                        {cat[p.categorie]} <span className="cv-projet-etoile">{etoileParId[p.etoile]?.nom}</span>
                      </span>
                    </div>
                    <p>{p.description[langue]}</p>
                    <p className="cv-technos">{p.technos.join(', ')}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
