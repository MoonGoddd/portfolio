// Tous les textes d'interface, en français et en anglais.
// Le contenu (projets, parcours…) est dans src/data/, lui aussi en { fr, en }.

const translations = {
  fr: {
    meta: {
      titre: 'Léo Regniez | Développeur Java en alternance, portfolio',
    },
    a11y: {
      evitement: 'Aller au contenu',
      sections: 'Sections',
      langue: 'Langue du site',
      niveaux: 'Niveaux de grossissement',
      constellation: 'Constellation du Lion : chaque étoile correspond à un projet de la liste.',
      h1: 'Léo Regniez, développeur Java en alternance',
    },
    nav: { projets: 'Projets', stack: 'Stack', parcours: 'Parcours', contact: 'Contact' },
    hud: {
      niveaux: ['Oculaire', 'Constellation', 'Galaxie', 'Champ profond', 'Signal'],
      lieux: ['Mazingarbe, Terre', 'Regulus, 79 al', 'Triplet du Lion, 35 M al', 'Champ profond, 10 Md al', 'Fond diffus, 13,8 Md a.'],
      coords: ['50° 28′ N · 2° 43′ E', 'AD 10h 08m · DÉC +11° 58′', 'AD 11h 20m · DÉC +12° 59′', 'AD 11h 20m · DÉC +12° 59′', 'T = 2,725 K'],
      gross: 'Gross.',
    },
    ouverture: {
      invite: 'Défile pour coller ton œil à l’oculaire',
    },
    bandeau: { cible: 'Cible : Leo · AD 10h 08m · DÉC +11° 58′' },
    projets: {
      titre: 'Projets',
      sousTitre: 'Des jeux surtout, quelques sites, et un outil de gestion. Chaque étoile est un projet.',
      details: 'Détails',
      fermer: 'Refermer',
      enCours: 'en cours',
      liens: { code: 'Code', jouer: 'Jouer', site: 'Voir le site' },
      aVenir: 'à venir',
      legendeRepos: 'Le Lion · Leo',
    },
    categories: { jeu: 'Jeu', web: 'Web', outil: 'Outil' },
    stack: {
      titre: 'Stack',
      sousTitre: 'Ce que j’ai vraiment utilisé, en cours, en entreprise ou à la maison.',
      categories: { langages: 'Langages', frameworks: 'Frameworks', donnees: 'Données', outils: 'Outils' },
      langues: 'Langues',
      legende: 'M66, dans le Triplet du Lion. Un bras par catégorie.',
    },
    parcours: {
      titre: 'Parcours',
      sousTitre: 'Regarder loin, c’est regarder dans le passé.',
      enCours: 'en cours',
      direct: 'lumière reçue en direct',
      emise: 'lumière émise il y a {duree}',
      an: 'an',
      ans: 'ans',
      mois: 'mois',
      interets: 'Hors orbite',
    },
    transitions: {
      2: { titre: 'Sous le ventre du Lion, trois galaxies.', note: 'Triplet du Lion · 35 millions d’années-lumière' },
      3: { titre: 'Plus loin, donc plus tôt.', note: 'Champ profond · des milliards d’années-lumière' },
      4: { titre: 'La plus vieille lumière de l’univers.', note: 'Fond diffus cosmologique · 13,8 milliards d’années' },
    },
    contact: {
      titre: ['Établissons', 'le contact.'],
      phrase: 'Une question, un projet, une opportunité ? Le plus simple reste un e-mail.',
      cv: 'Télécharger le CV',
      voirCv: 'Voir le CV en ligne',
      retour: 'Retour à l’oculaire',
    },
  },
  en: {
    meta: {
      titre: 'Léo Regniez | Java developer on a work-study track, portfolio',
    },
    a11y: {
      evitement: 'Skip to content',
      sections: 'Sections',
      langue: 'Site language',
      niveaux: 'Magnification levels',
      constellation: 'The constellation Leo: each star matches a project in the list.',
      h1: 'Léo Regniez, Java developer on a work-study track',
    },
    nav: { projets: 'Projects', stack: 'Stack', parcours: 'Background', contact: 'Contact' },
    hud: {
      niveaux: ['Eyepiece', 'Constellation', 'Galaxy', 'Deep field', 'Signal'],
      lieux: ['Mazingarbe, Earth', 'Regulus, 79 ly', 'Leo Triplet, 35 M ly', 'Deep field, 10 bn ly', 'Background, 13.8 bn yr'],
      coords: ['50° 28′ N · 2° 43′ E', 'RA 10h 08m · DEC +11° 58′', 'RA 11h 20m · DEC +12° 59′', 'RA 11h 20m · DEC +12° 59′', 'T = 2.725 K'],
      gross: 'Magn.',
    },
    ouverture: {
      invite: 'Scroll to put your eye to the eyepiece',
    },
    bandeau: { cible: 'Target: Leo · RA 10h 08m · DEC +11° 58′' },
    projets: {
      titre: 'Projects',
      sousTitre: 'Mostly games, a few websites, and one management tool. Each star is a project.',
      details: 'Details',
      fermer: 'Close',
      enCours: 'in progress',
      liens: { code: 'Code', jouer: 'Play', site: 'Visit the site' },
      aVenir: 'coming up',
      legendeRepos: 'The Lion · Leo',
    },
    categories: { jeu: 'Game', web: 'Web', outil: 'Tool' },
    stack: {
      titre: 'Stack',
      sousTitre: 'What I have actually used, in class, at work or at home.',
      categories: { langages: 'Languages', frameworks: 'Frameworks', donnees: 'Data', outils: 'Tools' },
      langues: 'Spoken languages',
      legende: 'M66, in the Leo Triplet. One arm per category.',
    },
    parcours: {
      titre: 'Background',
      sousTitre: 'Looking far away means looking into the past.',
      enCours: 'ongoing',
      direct: 'light received live',
      emise: 'light emitted {duree} ago',
      an: 'year',
      ans: 'years',
      mois: 'months',
      interets: 'Off orbit',
    },
    transitions: {
      2: { titre: 'Under the Lion’s belly, three galaxies.', note: 'Leo Triplet · 35 million light-years' },
      3: { titre: 'Farther, therefore earlier.', note: 'Deep field · billions of light-years' },
      4: { titre: 'The oldest light in the universe.', note: 'Cosmic microwave background · 13.8 billion years' },
    },
    contact: {
      titre: ['Let’s make', 'contact.'],
      phrase: 'A question, a project, an opportunity? An e-mail is still the easiest way.',
      cv: 'Download my CV',
      voirCv: 'View the CV online',
      retour: 'Back to the eyepiece',
    },
  },
};

export default translations;
