// Identité, contact et réglages des niveaux de grossissement.

export const profil = {
  prenom: 'Léo',
  nom: 'Regniez',
  accroche: {
    fr: 'Développeur Java en alternance. Le jour, des applications métier qui doivent tourner sans broncher. Le soir, des jeux.',
    en: 'Java developer on a work-study track. By day, business applications that have to run without a hitch. By night, games.',
  },
  situation: {
    fr: '3e année de BUT Informatique · alternance',
    en: '3rd year of a BUT in Computer Science · work-study',
  },
  // Mots du bandeau défilant
  bandeau: {
    fr: ['Java', 'Jeux', 'Sites', 'Alternance', 'Bases de données', 'Équipe', 'React'],
    en: ['Java', 'Games', 'Websites', 'Work-study', 'Databases', 'Teamwork', 'React'],
  },
};

export const contact = {
  email: 'regniez.leo12@gmail.com',
  liens: [
    { id: 'github', nom: 'GitHub', url: 'https://github.com/MoonGoddd' },
    { id: 'linkedin', nom: 'LinkedIn', url: 'https://www.linkedin.com/in/regniez-leo/' },
  ],
  // CV selon la langue du site (chemins relatifs à la racine du site)
  cv: { fr: 'cv/CV_Regniez_Leo_FR.pdf', en: 'cv/CV_Regniez_Leo_EN.pdf' },
};

// Les cinq niveaux de grossissement. « gross » = puissance de 10 du grossissement affiché dans le HUD.
export const niveaux = [
  { id: 'oculaire', ancre: '#ouverture', gross: 0 },
  { id: 'constellation', ancre: '#projets', gross: 1.6 },
  { id: 'galaxie', ancre: '#stack', gross: 3.6 },
  { id: 'champ', ancre: '#parcours', gross: 5.6 },
  { id: 'signal', ancre: '#contact', gross: 8 },
];
