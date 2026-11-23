import { useSyncExternalStore } from 'react';
import { etat, surNiveau } from './etat';

/** Niveau de grossissement entier (0 à 4) de la zone visible. */
export default function useZoomLevel() {
  return useSyncExternalStore(surNiveau, () => etat.niveau);
}
