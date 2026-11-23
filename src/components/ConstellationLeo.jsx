import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { etoiles, etoileParId, segments, rayonEtoile } from '../data/lion';

// Passage des degrés du ciel aux unités du dessin
const ECHELLE = 10.6;
const CX = 180;
const CY = 108;
const px = (e) => CX + e.x * ECHELLE;
const py = (e) => CY + e.y * ECHELLE;

/**
 * La constellation du Lion, dessinée avec les vraies positions de ses étoiles.
 * - allumees : identifiants des étoiles déjà allumées (le projet est passé à l'écran)
 * - survol   : étoile mise en avant (ligne de projet survolée ou étoile pointée)
 * - projets  : { idEtoile: titre du projet } ; aVenir : étoile encore sans projet
 */
export default function ConstellationLeo({ allumees, survol, projets, aVenir, onSurvol, onViser }) {
  const { t } = useLanguage();

  // η Leonis s'allume avec Regulus, l'étoile « à venir » avec sa voisine Rasalas
  const estAllumee = (id) => {
    if (id === 'eta') return allumees.has('regulus');
    if (id === aVenir) return allumees.has('rasalas');
    return allumees.has(id);
  };

  const mise = survol ? etoileParId[survol] : null;
  const legende = mise
    ? `${mise.bayer} Leonis, ${mise.nom} : ${projets[mise.id] ?? t('projets.aVenir')}`
    : t('projets.legendeRepos');

  return (
    <figure className="constellation">
      <svg viewBox="-16 4 392 208" role="img" aria-label={t('a11y.constellation')}>
        <defs>
          <radialGradient id="halo-etoile">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="0.25" stopColor="#9CC9FF" stopOpacity="0.45" />
            <stop offset="1" stopColor="#9CC9FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {segments.map(([a, b]) => {
          const A = etoileParId[a];
          const B = etoileParId[b];
          const futur = a === aVenir || b === aVenir;
          const trace = estAllumee(a) && estAllumee(b);
          return (
            <line
              key={`${a}-${b}`}
              className={`segment${trace ? ' trace' : ''}${futur ? ' futur' : ''}`}
              x1={px(A)}
              y1={py(A)}
              x2={px(B)}
              y2={py(B)}
              pathLength="1"
            />
          );
        })}

        {etoiles.map((e) => {
          const r = rayonEtoile(e.mag);
          const lie = Boolean(projets[e.id]);
          const classes = [
            'etoile',
            estAllumee(e.id) ? 'allumee' : '',
            survol === e.id ? 'survol' : '',
            e.id === aVenir ? 'a-venir' : '',
            e.mineure ? 'mineure' : '',
          ].join(' ');
          return (
            <g
              key={e.id}
              className={classes}
              transform={`translate(${px(e).toFixed(1)} ${py(e).toFixed(1)})`}
              onPointerEnter={e.mineure ? undefined : (ev) => ev.pointerType === 'mouse' && onSurvol(e.id)}
              onPointerLeave={e.mineure ? undefined : (ev) => ev.pointerType === 'mouse' && onSurvol(null)}
              onClick={lie ? () => onViser(e.id) : undefined}
              data-cliquable={lie ? '' : undefined}
            >
              <circle className="halo" r={r * 4.2} fill="url(#halo-etoile)" />
              <circle className="coeur" r={r} />
              {!e.mineure && <circle className="cible" r="13" />}
              {!e.mineure && (
                <text x={e.dx} y={e.dy} textAnchor={e.ancre ?? 'start'}>
                  {e.nom}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="constellation-legende">{legende}</figcaption>
    </figure>
  );
}
