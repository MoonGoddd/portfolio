// Informations propres au CV (cv.html).
// Tout le reste du CV vient des mêmes fichiers que le portfolio :
//   projets.js (projets), stack.js (compétences, langues), parcours.js (centres d'intérêt),
//   profil.js (nom, e-mail, liens). Modifier un projet là-bas le modifie aussi sur le CV.

export const cv = {
  titre: {
    fr: 'Développeur Java en alternance',
    en: 'Java developer on a work-study track',
  },
  sousTitre: {
    fr: '3e année de BUT Informatique, IUT de Lens',
    en: '3rd year of a BUT in Computer Science, IUT de Lens',
  },
  // Le téléphone n'apparaît que sur le CV, pas sur le site.
  telephone: '06 41 25 29 54',
  telephoneLien: '+33641252954',
  ville: { fr: 'Mazingarbe (62)', en: 'Mazingarbe, France' },
  site: 'regniezleo.fr',

  experiences: [
    {
      id: 'alternance',
      periode: { fr: 'Depuis sept. 2026', en: 'Since Sept. 2026' },
      enCours: true,
      titre: { fr: 'Développeur en alternance', en: 'Work-study developer' },
      lieu: 'Lenrek Informatique',
      texte: {
        fr: 'Dans la continuité du stage : développement d’applications web métier en Java, en alternance avec la 3e année de BUT.',
        en: 'Following on from the internship: building business web applications in Java, alongside the 3rd year of the BUT.',
      },
      technos: ['Java', 'Vaadin', 'Hibernate', 'Maven'],
    },
    {
      id: 'stage-lenrek',
      // source : rapport de stage de BUT 2 (stage du 13 avril au 5 juin 2026)
      periode: { fr: 'Avr. – juin 2026', en: 'Apr. – June 2026' },
      titre: { fr: 'Développeur stagiaire', en: 'Developer intern' },
      lieu: 'Lenrek Informatique',
      texte: {
        fr: 'Stage de 8 semaines : migration de l’interface web de THEO, logiciel de transports hospitaliers, de JSP vers Vaadin 23. Profil et préférences utilisateur, formulaire de transport de biens, page DIM/GEF avec export Excel, refonte du style du formulaire de transport patient.',
        en: '8-week internship: migrating the web interface of THEO, a hospital transport software, from JSP to Vaadin 23. User profile and preferences, goods transport form, DIM/GEF page with Excel export, restyling of the patient transport form.',
      },
      technos: ['Java', 'Vaadin 23', 'Hibernate', 'PostgreSQL', 'WildFly', 'SVN'],
    },
    {
      id: 'leroy-merlin',
      periode: { fr: 'Mai – juin 2021', en: 'May – June 2021' },
      titre: { fr: 'Vendeur cuisines et rangements', en: 'Kitchen and storage sales assistant' },
      lieu: 'Leroy Merlin, Vendin-le-Vieil',
      texte: { fr: 'Stage de troisième.', en: 'Middle-school work placement.' },
    },
  ],

  formations: [
    {
      id: 'but',
      periode: { fr: '2024 – 2027', en: '2024 – 2027' },
      enCours: true,
      titre: { fr: 'BUT Informatique', en: 'BUT in Computer Science' },
      lieu: 'IUT de Lens',
      texte: {
        fr: '3e année, en alternance.',
        en: 'Three-year French university degree. 3rd year, work-study.',
      },
    },
    {
      id: 'bac',
      periode: { fr: '2021 – 2024', en: '2021 – 2024' },
      titre: { fr: 'Baccalauréat général', en: 'General baccalauréat' },
      lieu: 'Lycée Auguste Béhal, Lens',
      texte: {
        fr: 'Spécialités Physique-Chimie et Informatique.',
        en: 'Majors in Physics-Chemistry and Computer Science.',
      },
    },
  ],

  textes: {
    fr: {
      titrePage: 'CV de Léo Regniez, développeur Java en alternance',
      experience: 'Expérience',
      formation: 'Formation',
      projets: 'Projets',
      projetsNote: 'Détails et code sur regniezleo.fr',
      contact: 'Contact',
      competences: 'Compétences',
      langues: 'Langues',
      interets: 'Centres d’intérêt',
      enCours: 'en cours',
      constellation: 'Le Lion : chaque étoile est un projet.',
      portfolio: 'Retour au portfolio',
      pdf: 'Télécharger le PDF',
      imprimer: 'Imprimer',
      photo: 'Photo de Léo Regniez',
    },
    en: {
      titrePage: 'CV of Léo Regniez, Java developer on a work-study track',
      experience: 'Experience',
      formation: 'Education',
      projets: 'Projects',
      projetsNote: 'Details and code at regniezleo.fr',
      contact: 'Contact',
      competences: 'Skills',
      langues: 'Languages',
      interets: 'Interests',
      enCours: 'ongoing',
      constellation: 'Leo: each star is a project.',
      portfolio: 'Back to the portfolio',
      pdf: 'Download the PDF',
      imprimer: 'Print',
      photo: 'Photo of Léo Regniez',
    },
  },
};
