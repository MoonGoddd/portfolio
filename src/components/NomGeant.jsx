import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { profil } from '../data/profil';

/** Le nom en très grand, en bas de l'accueil : ses lettres s'allument une à une comme des étoiles. */
export default function NomGeant() {
  const { t } = useLanguage();
  let rang = 0;
  const lettres = (mot) =>
    [...mot].map((lettre) => {
      const i = rang++;
      return (
        <span key={i} className="lettre" style={{ '--i': i }}>
          {lettre}
        </span>
      );
    });

  return (
    <h1 className="nom">
      <span className="sr-only">{t('a11y.h1')}</span>
      <span className="nom-visuel" aria-hidden="true">
        <span className="nom-mot">{lettres(profil.prenom)}</span> <span className="nom-mot">{lettres(profil.nom)}</span>
      </span>
    </h1>
  );
}
