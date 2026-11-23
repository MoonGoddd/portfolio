// Projets affichés dans la section « Projets ». Chaque projet est rattaché à une étoile du Lion.
// Les textes sont en { fr, en }. « details » alimente l'accordéon des projets sans lien direct.

export const projets = [
  {
    id: 'shinobi-path-td',
    etoile: 'regulus',
    categorie: 'jeu',
    titre: 'Shinobi Path TD',
    enCours: true,
    description: {
      fr: "Un tower defense inspiré de PokePath TD, transposé dans l'univers de Naruto : on obtient les ninjas par des rouleaux, on recrute les ennemis vaincus, et les cartes de combat reprennent les lieux de l'anime.",
      en: 'A tower defense inspired by PokePath TD, moved into the world of Naruto: ninjas come from scrolls, defeated enemies can be recruited, and the battle maps follow places from the anime.',
    },
    technos: ['TypeScript', 'Vite', 'Preact', 'Canvas'],
    liens: [],
    details: {
      texte: {
        fr: "Le jeu se joue en local, dans le navigateur. Quatre régions suivent la chronologie de l'anime : 15 cartes et 75 ninjas à recruter puis à faire évoluer. Chaque rouleau propose un ninja à choisir parmi trois. Le rendu passe par Canvas et les sons sont synthétisés avec la Web Audio API.",
        en: 'The game runs locally, in the browser. Four regions follow the timeline of the anime: 15 maps and 75 ninjas to recruit and level up. Each scroll offers a choice of one ninja out of three. Rendering is done on Canvas and the sounds are synthesised with the Web Audio API.',
      },
    },
  },
  {
    id: 'narutodle',
    etoile: 'denebola',
    categorie: 'jeu',
    titre: 'Narutodle',
    description: {
      fr: 'Un jeu de devinette sur les personnages de Naruto, version locale.',
      en: 'A guessing game about Naruto characters, local version.',
    },
    technos: ['HTML', 'CSS', 'JavaScript'],
    liens: [],
    details: {
      texte: {
        fr: "Quatre modes : Classique, Citation, Jutsu et Œil. Chacun se joue en défi du jour ou en mode infini, avec une série et un record. Le tout tient en HTML, CSS et JavaScript, sans framework.",
        en: 'Four modes: Classic, Quote, Jutsu and Eye. Each one can be played as a daily challenge or in endless mode, with a streak and a record. All of it is plain HTML, CSS and JavaScript, with no framework.',
      },
    },
  },
  {
    id: 'bomberman',
    etoile: 'algieba',
    categorie: 'jeu',
    titre: 'BomberMan',
    description: {
      fr: 'Le classique recréé en JavaFX : explosions en chaîne, ennemis dotés d’une IA simple, bonus de portée et de vitesse.',
      en: 'The classic rebuilt in JavaFX: chain explosions, enemies with a simple AI, range and speed power-ups.',
    },
    technos: ['Java', 'JavaFX'],
    liens: [],
    details: {
      listes: [
        {
          titre: { fr: 'Objectifs', en: 'Goals' },
          points: {
            fr: ['Recréer le gameplay classique de BomberMan', 'Mettre en place un système de collision efficace', 'Gérer les animations et les effets visuels'],
            en: ['Recreate the classic BomberMan gameplay', 'Build an efficient collision system', 'Handle animations and visual effects'],
          },
        },
        {
          titre: { fr: 'Fonctionnalités', en: 'Features' },
          points: {
            fr: ['Gameplay fidèle au jeu original', 'Bombes avec explosions en chaîne', 'Collisions avec les murs et les obstacles', 'Ennemis avec une IA basique', 'Plusieurs niveaux de difficulté', 'Bonus : portée de bombe, vitesse…'],
            en: ['Gameplay faithful to the original', 'Bombs with chain explosions', 'Collisions with walls and obstacles', 'Enemies with a basic AI', 'Several difficulty levels', 'Power-ups: bomb range, speed…'],
          },
        },
        {
          titre: { fr: 'Ce que j’y ai appris', en: 'What I learned' },
          points: {
            fr: ['Game design et boucle de jeu', 'Collisions 2D', 'Animation et rendu avec JavaFX', 'Programmation d’une IA simple', 'Optimisation des performances'],
            en: ['Game design and the game loop', '2D collisions', 'Animation and rendering with JavaFX', 'Programming a simple AI', 'Performance tuning'],
          },
        },
      ],
    },
  },
  {
    id: 'odefrance',
    etoile: 'zosma',
    categorie: 'outil',
    titre: 'O’De France',
    description: {
      fr: 'L’application de gestion d’une entreprise fictive de vente d’eau de source : produits, commandes et formulaires, en architecture MVC avec FXML. Projet d’équipe.',
      en: 'The management app of a fictional spring water company: products, orders and forms, built as MVC with FXML. A team project.',
    },
    technos: ['Java', 'JavaFX', 'FXML'],
    liens: [],
    details: {
      listes: [
        {
          titre: { fr: 'Objectifs', en: 'Goals' },
          points: {
            fr: ['Concevoir une identité visuelle complète', 'Développer une application de gestion avec interface graphique', 'Simuler la gestion d’une entreprise'],
            en: ['Design a complete visual identity', 'Build a management application with a graphical interface', 'Simulate how a company is run'],
          },
        },
        {
          titre: { fr: 'Fonctionnalités', en: 'Features' },
          points: {
            fr: ['Interface graphique en JavaFX', 'Navigation fluide entre plusieurs écrans', 'Gestion des produits', 'Formulaires de contact et de commande', 'Interface et logique séparées grâce à FXML'],
            en: ['Graphical interface in JavaFX', 'Smooth navigation across several screens', 'Product management', 'Contact and order forms', 'Interface and logic kept apart with FXML'],
          },
        },
        {
          titre: { fr: 'Ce que j’y ai appris', en: 'What I learned' },
          points: {
            fr: ['Interfaces graphiques avec JavaFX', 'Architecture MVC', 'Conception d’écrans en FXML', 'Travail en équipe et gestion de projet'],
            en: ['Graphical interfaces with JavaFX', 'MVC architecture', 'Designing screens in FXML', 'Teamwork and project management'],
          },
        },
      ],
    },
  },
  {
    id: 'chess',
    etoile: 'chertan',
    categorie: 'jeu',
    titre: 'Chess',
    description: {
      fr: 'Un jeu d’échecs complet : déplacements validés selon les règles, détection de l’échec et du mat, historique des coups.',
      en: 'A complete chess game: moves validated against the rules, check and checkmate detection, move history.',
    },
    technos: ['Java', 'HTML', 'CSS'],
    liens: [],
    details: {
      listes: [
        {
          titre: { fr: 'Objectifs', en: 'Goals' },
          points: {
            fr: ['Implémenter les règles complètes des échecs', 'Créer une interface intuitive', 'Gérer les déplacements valides de chaque pièce'],
            en: ['Implement the full rules of chess', 'Create an intuitive interface', 'Handle the valid moves of every piece'],
          },
        },
        {
          titre: { fr: 'Fonctionnalités', en: 'Features' },
          points: {
            fr: ['Échiquier interactif en glisser-déposer', 'Validation des coups selon les règles', 'Détection de l’échec et de l’échec et mat', 'Historique des coups joués', 'Interface responsive'],
            en: ['Interactive drag-and-drop board', 'Moves validated against the rules', 'Check and checkmate detection', 'History of the moves played', 'Responsive interface'],
          },
        },
        {
          titre: { fr: 'Ce que j’y ai appris', en: 'What I learned' },
          points: {
            fr: ['Programmation orientée objet en Java', 'Logique algorithmique', 'Intégration web en HTML et CSS', 'Gestion des événements utilisateur'],
            en: ['Object-oriented programming in Java', 'Algorithmic logic', 'Web integration in HTML and CSS', 'Handling user events'],
          },
        },
      ],
    },
  },
  {
    id: 'uniqday',
    etoile: 'adhafera',
    categorie: 'web',
    titre: 'UniqDay',
    description: {
      fr: 'Le site vitrine d’une agence fictive d’organisation de mariages : services, galerie, témoignages et demande de devis. Responsive.',
      en: 'The showcase site of a fictional wedding planning agency: services, gallery, testimonials and quote requests. Responsive.',
    },
    technos: ['HTML', 'CSS'],
    liens: [],
    details: {
      listes: [
        {
          titre: { fr: 'Objectifs', en: 'Goals' },
          points: {
            fr: ['Créer un site attractif et professionnel', 'Mettre en valeur les services proposés', 'Concevoir un parcours fluide pour le visiteur'],
            en: ['Create an attractive, professional site', 'Showcase the services on offer', 'Design a smooth journey for the visitor'],
          },
        },
        {
          titre: { fr: 'Fonctionnalités', en: 'Features' },
          points: {
            fr: ['Page d’accueil présentant les services', 'Galerie photo des événements', 'Témoignages de clients', 'Formulaire de contact et de demande de devis', 'Mise en page adaptée à tous les écrans'],
            en: ['Home page presenting the services', 'Photo gallery of the events', 'Client testimonials', 'Contact and quote request form', 'Layout that adapts to every screen'],
          },
        },
        {
          titre: { fr: 'Ce que j’y ai appris', en: 'What I learned' },
          points: {
            fr: ['Intégration HTML et CSS', 'Responsive et mobile-first', 'Accessibilité web', 'Bases du design UX/UI', 'Bases du référencement'],
            en: ['HTML and CSS integration', 'Responsive, mobile-first layout', 'Web accessibility', 'UX/UI design basics', 'SEO basics'],
          },
        },
      ],
    },
  },
  {
    id: 'portfolio',
    etoile: 'rasalas',
    categorie: 'web',
    titre: 'Portfolio',
    description: {
      fr: 'Ce site, où l’on traverse l’espace par grossissements successifs.',
      en: 'This site, where you travel through space one magnification at a time.',
    },
    technos: ['React', 'Vite', 'Tailwind', 'Canvas'],
    liens: [{ type: 'code', url: 'https://github.com/MoonGoddd/portfolio' }],
  },
];

// Étoile encore sans projet : elle reste faible dans la constellation.
export const etoileAVenir = 'algenubi';
