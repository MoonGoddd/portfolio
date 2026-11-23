// Parcours, du plus récent au plus ancien : plus on regarde loin, plus on remonte le temps.
// « emise » = date (AAAA-MM) à laquelle « la lumière a été émise » ; null = étape en cours.

export const parcours = [
  {
    id: 'alternance',
    emise: null,
    enCours: true,
    date: { fr: '3e année', en: '3rd year' },
    titre: { fr: 'Alternance chez Lenrek Informatique', en: 'Work-study at Lenrek Informatique' },
    phrase: {
      fr: 'Dans la continuité du stage : une partie du temps à l’IUT, l’autre en entreprise, à développer des applications web en Java.',
      en: 'Following on from the internship: part of the time at the IUT, the rest at the company, building web applications in Java.',
    },
  },
  {
    id: 'annee-2',
    emise: '2026-06',
    date: { fr: '2e année', en: '2nd year' },
    titre: { fr: 'Stage chez Lenrek Informatique', en: 'Internship at Lenrek Informatique' },
    phrase: {
      fr: 'Huit semaines (avril – juin 2026) à moderniser l’interface web d’un logiciel hospitalier, en Java avec Vaadin. Et la première version de ce site, en React.',
      en: 'Eight weeks (April – June 2026) modernising the web interface of a hospital software, in Java with Vaadin. And the first version of this site, in React.',
    },
  },
  {
    id: 'annee-1',
    emise: '2025-06',
    date: { fr: '1re année', en: '1st year' },
    titre: { fr: 'Java et premiers projets d’équipe', en: 'Java and the first team projects' },
    phrase: { fr: 'BomberMan, O’De France, Chess, UniqDay.', en: 'BomberMan, O’De France, Chess, UniqDay.' },
  },
  {
    id: 'entree-but',
    emise: '2024-09',
    date: { fr: '2024', en: '2024' },
    titre: { fr: 'Entrée en BUT Informatique', en: 'Starting a BUT in Computer Science' },
    phrase: { fr: 'IUT de Lens.', en: 'IUT de Lens, a three-year French university degree.' },
  },
  {
    id: 'bac',
    emise: '2021-09',
    date: { fr: '2021 – 2024', en: '2021 – 2024' },
    titre: { fr: 'Baccalauréat général', en: 'General baccalauréat' },
    phrase: {
      fr: 'Lycée Auguste Béhal, Lens. Spécialités Physique-Chimie et Informatique.',
      en: 'Lycée Auguste Béhal, Lens. Majors in Physics-Chemistry and Computer Science.',
    },
  },
];

export const interets = {
  fr: ['Cinéma', 'Musculation', 'Jeux vidéo', 'Musique'],
  en: ['Cinema', 'Weight training', 'Video games', 'Music'],
};
