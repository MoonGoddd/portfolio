import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import useZoomLevel from '../cosmos/useZoomLevel';

const SECTIONS = ['projets', 'stack', 'parcours', 'contact'];

/** Menu fixe : les quatre ancres du site et le choix de la langue. */
export default function Menu() {
  const { t, language, changeLanguage } = useLanguage();
  const niveau = useZoomLevel();

  return (
    <nav className="menu" aria-label={t('a11y.sections')}>
      {SECTIONS.map((id, i) => (
        <a key={id} href={`#${id}`} className={niveau === i + 1 ? 'actif' : undefined}>
          {t(`nav.${id}`)}
        </a>
      ))}
      <div className="langues" role="group" aria-label={t('a11y.langue')}>
        {['fr', 'en'].map((code) => (
          <button key={code} type="button" lang={code} aria-pressed={language === code} onClick={() => changeLanguage(code)}>
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
