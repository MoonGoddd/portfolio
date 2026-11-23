// Stack : quatre catégories, une par bras de la galaxie (section « Stack »).
// « teinte » colore le titre du bloc et les étoiles du bras correspondant.

export const stack = [
  {
    id: 'langages',
    teinte: '#9CC9FF',
    elements: ['Java', 'JavaScript / TypeScript', 'Python', 'PHP', 'HTML / CSS', 'Bash'],
  },
  {
    id: 'frameworks',
    teinte: '#C3B1FF',
    elements: ['React', 'JavaFX', 'Tailwind CSS', 'Flask', 'Vaadin', 'Drools'],
  },
  {
    id: 'donnees',
    teinte: '#8FE8D8',
    elements: ['SQL', 'SQLite', 'MySQL', 'PostgreSQL', 'Hibernate'],
  },
  {
    id: 'outils',
    teinte: '#FFC46B',
    elements: ['Git', 'GitLab', 'IntelliJ IDEA', 'VS Code', 'Eclipse', 'Maven', 'WildFly', 'SVN'],
  },
];

/** Identifiant stable d'une techno (lien entre la liste et son étoile dans la galaxie). */
export const idTech = (nom) => nom.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const langues = [
  { nom: { fr: 'Anglais', en: 'English' }, niveau: 'B2' },
  { nom: { fr: 'Espagnol', en: 'Spanish' }, niveau: 'A2' },
];
