import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/** Lien d'évitement : premier élément atteint au clavier, il saute directement au contenu. */
export default function SkipLink() {
  const { t } = useLanguage();
  return (
    <a className="evitement" href="#projets">
      {t('a11y.evitement')}
    </a>
  );
}
