import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import translations from './translations';

const LanguageContext = createContext(null);
const CLE = 'portfolio-langue';
const LANGUES = ['fr', 'en'];

function langueInitiale() {
  try {
    const memo = window.localStorage.getItem(CLE);
    if (LANGUES.includes(memo)) return memo;
  } catch {
    // stockage indisponible (navigation privée…) : on reste en français
  }
  return 'fr';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(langueInitiale);

  // t('projets.titre') : lit une clé dans translations.js (repli sur le français)
  const t = useCallback(
    (cle) => {
      const lire = (racine) => cle.split('.').reduce((v, k) => v?.[k], racine);
      return lire(translations[language]) ?? lire(translations.fr) ?? cle;
    },
    [language],
  );

  // tx({ fr, en }) : choisit le texte d'un contenu bilingue de src/data/
  const tx = useCallback((objet) => objet?.[language] ?? objet?.fr ?? '', [language]);

  const changeLanguage = useCallback((code) => {
    if (!LANGUES.includes(code)) return;
    setLanguage(code);
    try {
      window.localStorage.setItem(CLE, code);
    } catch {
      // tant pis : la langue ne sera pas mémorisée
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = translations[language].meta.titre;
  }, [language]);

  const valeur = useMemo(() => ({ language, t, tx, changeLanguage }), [language, t, tx, changeLanguage]);
  return <LanguageContext.Provider value={valeur}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const contexte = useContext(LanguageContext);
  if (!contexte) throw new Error('useLanguage doit être utilisé dans un LanguageProvider');
  return contexte;
}
