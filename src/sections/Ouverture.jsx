import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { profil } from '../data/profil';
import { etat, surImage } from '../cosmos/etat';
import NomGeant from '../components/NomGeant.jsx';

const lisser = (t) => t * t * (3 - 2 * t);

/** L'horizon et le télescope, en silhouette (dessin original). */
function Paysage({ refOculaire }) {
  return (
    <svg className="paysage" viewBox="0 0 1440 400" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
      {/* colline lointaine */}
      <path d="M0 400V318C210 262 420 300 640 286C860 272 1010 214 1180 226C1290 234 1380 262 1440 282V400Z" fill="#070912" />
      {/* colline du télescope */}
      <path
        d="M0 400V346C240 316 520 344 760 284C940 239 1080 186 1210 184C1300 183 1380 199 1440 219V400Z"
        fill="#020308"
        stroke="rgba(156,201,255,0.22)"
        strokeWidth="1.5"
      />
      {/* télescope : trépied, monture, tube pointé vers le Lion */}
      <g fill="#020308" stroke="rgba(156,201,255,0.5)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M1205 118L1164 187M1205 118L1207 189M1205 118L1247 186" fill="none" strokeWidth="3" />
        <rect x="1196" y="104" width="18" height="20" rx="3" />
        <g transform="translate(1205 100) rotate(38)">
          <rect x="-104" y="-15" width="18" height="30" rx="4" />
          <rect x="-92" y="-12" width="150" height="24" rx="5" />
          <rect x="-46" y="-23" width="52" height="8" rx="4" />
          <rect x="56" y="-7" width="20" height="14" rx="3" />
          <rect x="63" y="-25" width="10" height="20" rx="3" />
          <circle ref={refOculaire} cx="68" cy="-27" r="3.5" fill="#FFC46B" stroke="none" className="oculaire-point" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Niveau 0, l'oculaire : accroche, situation, télescope et nom géant.
 * L'accueil reste épinglé pendant qu'on défile : un cercle part de l'oculaire du télescope
 * et s'agrandit jusqu'à remplir l'écran, pendant que l'accueil s'efface. On est alors « dans » le télescope.
 */
export default function Ouverture() {
  const { t, tx } = useLanguage();
  const contenu = useRef(null);
  const oculaire = useRef(null);

  useEffect(() => {
    // Position de l'oculaire à l'écran : l'accueil est épinglé (sticky, en haut), elle ne bouge donc pas
    // pendant l'animation. On la relève une fois, puis à chaque redimensionnement.
    let point = null;
    const relever = () => {
      point = null;
    };
    window.addEventListener('resize', relever);

    let fondu = false;
    const arreter = surImage((e) => {
      const el = contenu.current;
      if (!el || !oculaire.current) return;
      const p = e.p[0];
      if (e.reduit || p <= 0.002) {
        if (fondu) {
          el.style.opacity = '';
          el.style.transform = '';
          el.style.visibility = '';
          fondu = false;
        }
        etat.oculaire.r = 0;
        point = null; // l'accueil est au repos : on pourra relever la position exacte
        return;
      }
      if (!point) {
        const r = oculaire.current.getBoundingClientRect();
        point = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      fondu = true;
      const L = window.innerWidth;
      const H = window.innerHeight;
      // Le cercle (dessiné par le canvas) part de l'oculaire et glisse vers le centre en grandissant
      const k = lisser(Math.min(1, p * 1.15));
      const x = point.x + (L / 2 - point.x) * k;
      const y = point.y + (H / 2 - point.y) * k;
      const rMax = Math.hypot(Math.max(x, L - x), Math.max(y, H - y)) + 60;
      etat.oculaire.x = x;
      etat.oculaire.y = y;
      etat.oculaire.r = p >= 1 ? rMax : 10 + (rMax - 10) * Math.pow(p, 2.1);
      // L'accueil s'efface et grossit légèrement vers l'oculaire, comme si on y collait l'œil.
      // (opacité et transformation : le navigateur les anime sans redessiner la page)
      const f = lisser(Math.min(1, p / 0.55));
      el.style.opacity = (1 - f).toFixed(3);
      el.style.transformOrigin = `${point.x}px ${point.y}px`;
      el.style.transform = `scale(${(1 + f * 0.35).toFixed(4)})`;
      el.style.visibility = f >= 0.999 ? 'hidden' : '';
    });
    return () => {
      arreter();
      window.removeEventListener('resize', relever);
    };
  }, []);

  return (
    <header id="ouverture" className="ouverture-piste" data-zone="piste" data-niveau-section="0" tabIndex={-1}>
      <div className="ouverture">
        <div className="ouverture-contenu" ref={contenu}>
          <Paysage refOculaire={oculaire} />
          <div className="accroche-cadre">
            <div className="conteneur">
              <div className="accroche">
                <p className="phrase">{tx(profil.accroche)}</p>
                <p className="situation">{tx(profil.situation)}</p>
                <p className="invite" aria-hidden="true">
                  {t('ouverture.invite')}
                  <span className="invite-fleche">↓</span>
                </p>
              </div>
            </div>
          </div>
          <NomGeant />
        </div>
      </div>
    </header>
  );
}
