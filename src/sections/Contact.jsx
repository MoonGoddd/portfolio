import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { profil, contact } from '../data/profil';
import { allerA } from '../hooks/useDefilement';

/**
 * Niveau 4, le signal : on est arrivé à la plus vieille lumière de l'univers.
 * Il ne reste qu'à renvoyer un signal : un e-mail.
 */
export default function Contact() {
  const { t, language } = useLanguage();
  const titre = useRef(null);
  const [vu, setVu] = useState(false);

  // Le titre s'allume lettre par lettre à son arrivée, comme le nom de l'accueil
  useEffect(() => {
    const observateur = new IntersectionObserver(([entree]) => entree.isIntersecting && setVu(true), { threshold: 0.4 });
    observateur.observe(titre.current);
    return () => observateur.disconnect();
  }, []);

  let rang = 0;
  const lignes = t('contact.titre');

  return (
    <footer id="contact" className="cloture" data-niveau-section="4" tabIndex={-1} aria-labelledby="titre-contact">
      <div className="conteneur">
        <h2 id="titre-contact" ref={titre} className={`cloture-titre${vu ? ' vu' : ''}`} aria-label={lignes.join(' ')}>
          {lignes.map((ligne) => (
            <span key={ligne} className="cloture-ligne" aria-hidden="true">
              {[...ligne].map((lettre) => {
                const i = rang++;
                return (
                  <span key={i} className="lettre" style={{ '--i': i }}>
                    {lettre === ' ' ? ' ' : lettre}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
        <p className="cloture-phrase">{t('contact.phrase')}</p>

        <a className="courriel" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>

        <ul className="pilules">
          {contact.liens.map((lien) => (
            <li key={lien.id}>
              <a className="pilule" href={lien.url} target="_blank" rel="noopener noreferrer">
                {lien.nom}
              </a>
            </li>
          ))}
          <li>
            <a className="pilule" href={`${import.meta.env.BASE_URL}${contact.cv[language] ?? contact.cv.fr}`} download>
              <Download size={16} aria-hidden="true" />
              {t('contact.cv')}
            </a>
          </li>
          <li>
            <a className="pilule" href={`${import.meta.env.BASE_URL}cv.html?lang=${language}`}>
              {t('contact.voirCv')}
            </a>
          </li>
        </ul>

        <div className="pied">
          <p>
            {profil.prenom} {profil.nom}, {new Date().getFullYear()}
          </p>
          <button type="button" className="retour" onClick={() => allerA(0, { duree: 1.6 })}>
            <ArrowUp size={16} aria-hidden="true" />
            {t('contact.retour')}
          </button>
        </div>
      </div>
    </footer>
  );
}
