import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';
import useDefilement from './hooks/useDefilement';
import CosmosCanvas from './cosmos/CosmosCanvas.jsx';
import SkipLink from './components/SkipLink.jsx';
import Menu from './components/Menu.jsx';
import Hud from './components/Hud.jsx';
import Curseur from './components/Curseur.jsx';
import Transition from './components/Transition.jsx';
import Ouverture from './sections/Ouverture.jsx';
import Bandeau from './sections/Bandeau.jsx';
import Projets from './sections/Projets.jsx';
import Stack from './sections/Stack.jsx';
import Parcours from './sections/Parcours.jsx';
import Contact from './sections/Contact.jsx';

/**
 * Une seule page qui défile. Chaque section est un niveau de grossissement :
 * oculaire (accueil) → constellation (projets) → galaxie (stack) → champ profond (parcours) → signal (contact).
 */
export default function App() {
  const reduit = usePrefersReducedMotion();
  useDefilement(reduit);

  return (
    <LanguageProvider>
      <SkipLink />
      <CosmosCanvas />
      <Menu />
      <Hud />
      <Curseur />
      <Ouverture />
      <main>
        <Bandeau />
        <Projets />
        <Transition vers={2} />
        <Stack />
        <Transition vers={3} />
        <Parcours />
        <Transition vers={4} />
      </main>
      <Contact />
    </LanguageProvider>
  );
}
