# Brief de refonte du portfolio de Léo Regniez

> **Objectif :** refaire entièrement le portfolio de Léo Regniez.
> - **Structure (template)** : reprendre celle de noaperu.fr (portfolio de Noa Peru, un ami). On reprend l'ordre des sections, la mise en page et les mécaniques d'interaction. On ne reprend **ni** le style, **ni** le code, **ni** les polices, **ni** les textes.
> - **Style** : un voyage dans l'espace par grossissements successifs. On part d'un télescope, puis on passe à une constellation, à une galaxie, et ainsi de suite. C'est très animé.
> - **Contenu** : celui du portfolio actuel (ce dépôt), mis à jour (voir §4 et §7).

---

## 0. Prompt à donner à Fable

```
Tu vas refaire entièrement mon portfolio, qui se trouve dans ce dossier. Lis d'abord BRIEF_REDESIGN.md en entier :
c'est la spécification de référence. Respecte la structure décrite en §2, la direction artistique en §5,
le plan d'animation en §6 et la stack en §8. Tout le contenu à afficher est en §4. Ne copie rien du site
noaperu.fr (ni code, ni polices, ni textes) : seule sa structure sert de modèle.
Les décisions de contenu sont déjà prises (§7). Ne me pose des questions que sur les points marqués
[À COMPLÉTER]. Travaille ensuite phase par phase (§9). À la fin de chaque phase, lance le build, ouvre la page et vérifie
les critères d'acceptation avant de passer à la suite.
```

---

## 1. État des lieux du portfolio actuel

### Stack technique
| Élément | Actuel | Remarque |
|---|---|---|
| Build | Create React App (`react-scripts 5.0.1`) | CRA est abandonné. Il faut migrer vers **Vite**. |
| UI | React 18, Tailwind 3.3, `lucide-react` | On garde React et Tailwind, qui font partie des compétences affichées. |
| i18n | Contexte maison `LanguageContext` + `translations.js` (FR / EN / ES) | Le mécanisme est réutilisable. Certains textes sont codés en dur dans `Contact.jsx` (libellé du CV, « Retrouvez-moi »). |
| Navigation | `useState(activeSection)` : une seule section affichée à la fois, pas de scroll | Incompatible avec le template, qui est une page unique défilante avec des ancres. |
| Données | Projets dans `src/data/projects/*.js`. Compétences, formation, contact et intérêts sont en dur dans `App.jsx`. | Il faut tout centraliser dans `src/data/`. |
| Assets | `src/assets/images/Regniez_Leo.JPG`, `public/cv/CV_Regniez_Leo_{FR,EN}.pdf` | Les CV sont périmés (voir §7). |
| Divers | `components/Header.jsx` n'est utilisé nulle part. Le dossier `build/` est présent. Le `<head>` est minimal (pas d'Open Graph). | À nettoyer. |

### Problèmes de contenu (informations périmées)
- Le site indique **« 2ème année »**, **« 19 ans »** et **« Recherche de stage »**. Or Léo est en **3e année de BUT et en alternance** (année 2026-2027).
- Les CV (PDF d'octobre et novembre 2025) disent aussi « 2e année, recherche de stage ».
- Le **numéro de téléphone** est affiché publiquement. Ce n'est pas recommandé (Noa n'affiche que son e-mail).
- Aucun projet n'a d'images. Seul le projet *Portfolio* a un lien de dépôt. Les autres n'ont ni code ni démo.
- Les descriptions longues (`fullDescription`) utilisent des listes à emojis. Le ton du template est beaucoup plus sobre et concis.

### Ce qu'on garde
- Les données des projets et la logique i18n.
- Le téléchargement du CV selon la langue (FR pour fr/es, EN pour en).
- Les liens GitLab (IUT), LinkedIn et l'e-mail.
- La photo (optionnelle, voir §7).

---

## 2. Analyse du template : noaperu.fr

Site Astro, page unique défilante. Les sections alternent entre un fond **« nuit »** (sombre #1B1D1F) et un fond **« jour »** (clair), avec un accent vert citron. **Ces couleurs ne sont pas à reprendre.** Voici la structure à reproduire, dans l'ordre :

### 2.0 Accessibilité globale
- Un lien d'évitement **« Aller au contenu »**, qui pointe vers `#projets`.
- Les éléments décoratifs sont en `aria-hidden`.

### 2.1 `header.ouverture` (hero, 100vh)
- **Menu** en haut à droite, avec 4 ancres : `Projets · Stack · Parcours · Contact`.
- **Accroche**, en gros, alignée à gauche, sur environ 2/3 de la largeur. C'est une phrase à la première personne qui résume le profil, en 2 à 4 lignes.
- **Situation**, sur une petite ligne en couleur d'accent sous l'accroche (chez Noa : « 3e année de BUT Informatique »).
- **Jetons** : des pastilles de technos (Java, Python…) tombent avec une physique, rebondissent, s'empilent en bas du hero et peuvent être attrapées.
- **Nom géant** : le prénom et le nom en très gros, en bas du hero et coupés par le bord. Les lettres s'animent à l'arrivée, une par une.

### 2.2 Bandeau défilant (marquee)
- Une bande horizontale qui défile en boucle, juste après le hero. Elle contient des mots-clés séparés par une étoile à 4 branches : `Jeux ✦ Sites ✦ Outils ✦ API ✦ Bases de données ✦ Équipe`.
- Elle est purement décorative (`aria-hidden`).

### 2.3 `section#projets`
- **En-tête sur 2 colonnes** : le titre **« Projets »** en très gros à gauche, et une phrase de sous-titre à droite (par exemple « Huit dépôts publics. Des jeux, des sites, et des outils qui me servent vraiment. »).
- **Liste verticale** (pas une grille de cartes). Chaque projet est une ligne séparée par un filet horizontal, sur une grille de 2 colonnes (environ 64 px, puis le reste) :
  - colonne 1 : la **catégorie** (Jeu / Web / Outil) ;
  - colonne 2 : le **titre** (police display), la **description** (1 à 2 phrases), la **ligne de technos** (petit, en gris) et les **liens d'action** soulignés (`Jouer`, `Voir le site`, `Code`).
- Il n'y a pas de modale : les liens mènent directement vers l'extérieur.

### 2.4 `section#stack`
- Le même en-tête sur 2 colonnes : le titre **« Stack »**, et à droite « Ce que j'ai utilisé sur de vrais projets, pas une liste de souhaits. ».
- Une **grille 2×2** : `Langages`, `Frameworks`, `Données`, `Outils`. Chaque bloc a un titre en couleur d'accent, souligné par un filet de cette couleur, suivi d'une liste simple, un élément par ligne.

### 2.5 `section#parcours`
- Le titre **« Parcours »**.
- Une **liste chronologique** dont chaque étape est une ligne séparée par des filets, sur 2 colonnes (environ 1/3 et 2/3) :
  - colonne 1 : la date ou l'année, avec un badge **« en cours »** sur l'étape actuelle ;
  - colonne 2 : le titre de l'étape, puis une phrase.

### 2.6 `footer#contact` (bloc final pleine largeur, couleur d'accent)
- Un titre géant : **« Discutons. »**.
- Une phrase : « Une question, un projet, une proposition. Le plus simple reste un e-mail. ».
- L'**e-mail en très gros**, souligné et cliquable (`mailto:`).
- Des **boutons pilules** : `GitHub`, `LinkedIn`, `Télécharger le CV`.
- Une ligne de pied de page : « Noa Peru, 2026 ».

### 2.7 Ton éditorial
Le texte est court, direct, à la première personne et un peu ironique. Il évite le jargon commercial. Chaque projet tient en 1 ou 2 phrases concrètes (ce que fait le projet, et un détail technique notable).

---

## 3. Correspondance entre le template et le portfolio de Léo

| Template (Noa) | Portfolio de Léo | Niveau de zoom (voir §5) |
|---|---|---|
| Hero : accroche, situation, jetons, nom géant | Accroche de Léo, « 3e année de BUT Informatique · alternance », jetons = sa stack, nom géant **« Léo Regniez »** | **0 · L'oculaire** (le télescope sur Terre) |
| Bandeau défilant | Les mots-clés de Léo, présentés comme une bande de télémétrie du télescope | Transition 0 → 1 |
| Projets (liste) | Ses projets (§4.3) | **1 · La constellation** (du Lion) |
| Stack (grille 2×2) | Ses compétences (§4.4) | **2 · La galaxie** |
| Parcours (étapes) | Sa formation et son alternance (§4.5) | **3 · Le champ profond** |
| Contact (bloc final) | E-mail, GitLab, GitHub, LinkedIn, CV | **4 · Le signal** |

---

## 4. Inventaire complet du contenu à afficher

> Contenu validé par Léo le 15/11/2026 (voir §7). Les éléments marqués **[À COMPLÉTER]** sont les seules informations manquantes : demande-les à Léo, ou laisse un `// TODO` en attendant.

### 4.1 Identité
- **Nom** : Léo Regniez. Sur le site, préférer « Léo Regniez » (prénom d'abord) à « Regniez Léo ».
- **Situation** : 3e année de BUT Informatique, IUT de Lens, en alternance chez **Lenrek Informatique**. Ligne affichée sous l'accroche : « 3e année de BUT Informatique · alternance ».
- **Localisation** : Mazingarbe (62670), Hauts-de-France.
- **Accroche proposée** (à adapter, dans le ton de §2.7) :
  > « Développeur Java en alternance. Le jour, des applications métier qui doivent tourner sans broncher. Le soir, des jeux. »
- **Photo** : pas affichée, comme dans le template. Le fichier `src/assets/images/Regniez_Leo.JPG` peut être supprimé ou gardé pour l'image Open Graph.

### 4.2 Contact et liens
- **E-mail** : regniez.leo12@gmail.com
- **GitLab (IUT)** : https://gitlab.univ-artois.fr/leo_regniez1
- **GitHub** : https://github.com/MoonGoddd
- **LinkedIn** : https://www.linkedin.com/in/regniez-leo/
- **CV** : `/cv/CV_Regniez_Leo_FR.pdf` et `/cv/CV_Regniez_Leo_EN.pdf`, **gardés tels quels** (décision de Léo). Bouton `Télécharger le CV` : FR par défaut, EN si le site est en anglais.
- **Téléphone** : **retiré du site** (décision de Léo). Ne l'afficher nulle part.

### 4.3 Projets
Format de chaque ligne : catégorie · titre · description courte · technos · liens. Les descriptions courtes ci-dessous sont **réécrites à partir des descriptions existantes**, sans rien inventer.

| # | Étoile (§6.3) | Catégorie | Titre | Description courte proposée | Technos | Liens | Contexte |
|---|---|---|---|---|---|---|---|
| 1 | Regulus | Jeu | Shinobi Path TD | Un tower defense inspiré de PokePath TD, transposé dans l'univers de Naruto : on obtient les ninjas par des rouleaux, on recrute les ennemis vaincus, et les cartes de combat reprennent les lieux de l'anime. | **[À COMPLÉTER : technos]** | aucun (joué en local) | Perso, en cours |
| 2 | Denebola | Jeu | Narutodle | Un jeu de devinette sur les personnages de Naruto, version locale. | **[À COMPLÉTER : technos]** | aucun (joué en local) | Perso |
| 3 | Algieba | Jeu | BomberMan | Le classique recréé en JavaFX : explosions en chaîne, ennemis dotés d'une IA simple, bonus de portée et de vitesse. | Java, JavaFX | aucun | Académique |
| 4 | Zosma | Outil | O'De France | L'application de gestion d'une entreprise fictive de vente d'eau de source : produits, commandes et formulaires, en architecture MVC avec FXML. Projet d'équipe. | Java, JavaFX, FXML | aucun | Académique |
| 5 | Chertan | Jeu | Chess | Un jeu d'échecs complet : déplacements validés selon les règles, détection de l'échec et du mat, historique des coups. | Java, HTML, CSS | aucun | Académique |
| 6 | Adhafera | Web | UniqDay | Le site vitrine d'une agence fictive d'organisation de mariages : services, galerie, témoignages et demande de devis. Responsive. | HTML, CSS | aucun | Académique |
| 7 | Rasalas | Web | Portfolio | Ce site, où l'on traverse l'espace par grossissements successifs. | React, Vite, Tailwind, GSAP, Canvas | `Code` → https://github.com/MoonGoddd/portfolio | Perso |
| — | Algenubi | — | *(étoile faible, « à venir »)* | — | — | — | — |

- **Le travail d'alternance n'apparaît pas dans les projets** (décision de Léo). L'alternance figure seulement dans le Parcours (§4.5), et ses technos dans la Stack (§4.4).
- **Jeux Naruto** : ils utilisent des images officielles hotlinkées depuis le wiki Naruto (Fandom). Il n'y a donc ni démo publique ni lien. On les présente sans captures d'écran d'images officielles.
- **Sous-titre de la section proposé** : « Des jeux surtout, quelques sites, et un outil de gestion. Chaque étoile est un projet. »
- **Catégories** : `Jeu` / `Web` / `Outil`, comme dans le template.
- **Liens manquants** : le template repose sur des liens directs, alors que la plupart des projets de Léo n'en ont pas. Quand un projet n'a aucun lien, ajouter une action `Détails` qui **déplie la ligne en accordéon** et affiche la `fullDescription` existante (sans les emojis). Pour les jeux Naruto, Fable écrit 3 ou 4 phrases à partir de la description ci-dessus, sans rien inventer. C'est un écart minimal par rapport au template.

### 4.4 Stack
| Langages | Frameworks | Données | Outils |
|---|---|---|---|
| Java | React | SQL | Git |
| JavaScript | JavaFX | SQLite | GitLab |
| Python | Tailwind CSS | MySQL | IntelliJ IDEA |
| PHP | Flask | PostgreSQL | VS Code |
| HTML / CSS | Vaadin | Hibernate | Eclipse |
| Bash | Drools | | Maven |
| | | | WildFly |
| | | | SVN |

Vaadin, Drools, Hibernate, Eclipse, Maven, WildFly et SVN viennent de l'alternance. Léo a validé leur ajout.

- **Sous-titre proposé** : « Ce que j'ai vraiment utilisé, en cours, en entreprise ou à la maison. »
- **Langues** (présentes dans le portfolio actuel, absentes du template) : Anglais B2, Espagnol A2. Les afficher dans un 5e mini-bloc « Langues » sous la grille 2×2, avec le même style de liste (pas de barres de progression).
- **Centres d'intérêt** (présents dans le portfolio actuel, absents du template) : Cinéma, Musculation, Jeux vidéo, Musique. Les afficher sur une ligne discrète en bas du Parcours, en mono : `Hors orbite : Cinéma · Musculation · Jeux vidéo · Musique`.

### 4.5 Parcours
Ordre **antichronologique** (concept de §6.5 : plus on zoome loin, plus on remonte le temps) :

| Date | Titre | Phrase |
|---|---|---|
| 3e année · *en cours* | Alternance chez Lenrek Informatique | Une partie du temps à l'IUT, l'autre en entreprise, à développer des applications web en Java. |
| 2e année | React, et le premier portfolio | La première version de ce site, en React et Tailwind. Et la recherche d'une alternance. |
| 1re année | Java et premiers projets d'équipe | BomberMan, O'De France, Chess, UniqDay. |
| 2024 | Entrée en BUT Informatique | IUT de Lens. |
| 2021 – 2024 | Baccalauréat général | Lycée Auguste Béhal, Lens. Spécialités Physique-Chimie et Informatique. |

- Ne rien dire de plus sur le travail en entreprise : pas de description du projet d'alternance.
- Le stage de 3e chez Leroy Merlin (2021), mentionné sur le CV, n'est pas affiché.
- Les projets perso (Shinobi Path TD, Narutodle) datent de la 3e année mais restent dans la section Projets. Ne pas les rajouter au Parcours.

### 4.6 Contact
- **Titre proposé** : « Établissons le contact. »
- **Phrase** : « Une question, un projet, une opportunité ? Le plus simple reste un e-mail. »
- E-mail géant, puis les pilules : `GitLab` · `GitHub` · `LinkedIn` · `Télécharger le CV`.
- **Pied de page** : « Léo Regniez, 2026 » et un lien « ↑ Retour à l'oculaire ».

### 4.7 Bandeau défilant
`Java ✦ Jeux ✦ Sites ✦ Alternance ✦ Bases de données ✦ Équipe ✦ React ✦`. Mettre un faux relevé de télescope en préfixe : `CIBLE : LEO · AD 10h 08m · DÉC +11° 58′`.

### 4.8 Langues du site
Le portfolio actuel existe en FR / EN / ES, le template en FR seulement. On garde **FR (par défaut) et EN**, avec un petit sélecteur `FR / EN` dans le menu. L'espagnol est abandonné. La langue est mémorisée dans `localStorage` (dans un `try/catch`) et l'attribut `<html lang>` est mis à jour.

---

## 5. Direction artistique : « Grossissements »

### 5.1 Le concept
Le visiteur regarde dans un télescope, puis **grossit** progressivement le ciel. Chaque section correspond à un niveau de grossissement :

| Niveau | Section | Ce qu'on voit | Distance (affichée dans le HUD) |
|---|---|---|---|
| 0 · Oculaire | Hero | Un ciel de nuit au-dessus d'une ligne d'horizon, et la silhouette d'un télescope | 0 al |
| 1 · Constellation | Projets | La constellation du **Lion** (*Leo*, comme Léo), dont chaque étoile principale est un projet | Regulus, environ 79 années-lumière |
| 2 · Galaxie | Stack | On zoome dans le Lion jusqu'au **Triplet du Lion** (M65, M66, NGC 3628, de vraies galaxies situées dans cette constellation), puis sur une spirale | environ 35 millions al |
| 3 · Champ profond | Parcours | Un champ profond façon Hubble, avec des milliers de galaxies minuscules. Plus on regarde loin, plus on remonte dans le temps. | des milliards d'al |
| 4 · Signal | Contact | La lumière la plus ancienne (le fond diffus cosmologique), puis un signal qu'on renvoie | 13,8 milliards d'années |

Le clin d'œil Léo / Lion tient tout le site : le visiteur pointe le télescope sur sa constellation. Vérifier les distances (Regulus, Triplet du Lion) sur une source fiable avant de les afficher.

### 5.2 Palette (proposition, à la place du gris, du clair et du vert citron du template)
| Rôle | Couleur | Usage |
|---|---|---|
| Fond vide spatial | `#05060B` | fond global |
| Fond niveau 2 | `#0B0A1A` (violet très sombre) | galaxie |
| Fond niveau 3 | `#0E0B08` (brun très sombre, le décalage vers le rouge) | champ profond |
| Texte lumière d'étoile | `#ECE8DF` | texte principal |
| Texte secondaire | `#8A8FA3` | technos, métadonnées |
| **Accent : Regulus** | `#9CC9FF` (bleu-blanc) | liens, filets, titres de blocs |
| **Accent chaud** | `#FFC46B` (ambre) | badge « en cours », étoile active, bloc Contact |

Le template alterne des sections « jour » et « nuit ». Ici, l'alternance devient un **changement de teinte du fond à chaque niveau de zoom**, interpolé au scroll.

### 5.3 Typographie (ne pas reprendre F4llen ni Hanken Grotesk, les polices de Noa)
- **Display** (titres, nom géant) : *Unbounded* (Google Fonts, large et « cosmique »), ou *Syne* comme alternative.
- **Texte** : *Inter Tight* ou *Manrope*.
- **HUD / données** : *JetBrains Mono* (clin d'œil développeur Java).
- Auto-héberger les polices avec `@fontsource`, en `font-display: swap`.

### 5.4 HUD de télescope (élément propre au site)
- Le menu reprend celui du template (4 ancres en haut à droite), stylé comme les commandes d'un instrument.
- Une **règle verticale fixe** sur le bord gauche (desktop) liste les 5 niveaux (Oculaire → Constellation → Galaxie → Champ profond → Signal). Le niveau courant est surligné, avec des lectures en mono : `GROSS. ×1 / ×40 / ×4 000…`, la distance et les coordonnées. Chaque niveau est cliquable (ancre).
- Sur mobile, la règle devient une fine barre de progression horizontale sous le menu.

---

## 6. Plan d'animation, section par section

> **Principe technique** : un seul `<canvas>` fixe en arrière-plan (le « cosmos ») dessine les étoiles et les objets. Son état est piloté par la progression du scroll (de 0 à 4, valeurs décimales pendant les transitions). Le contenu reste du HTML sémantique qui défile par-dessus. Toutes les animations doivent avoir une version `prefers-reduced-motion` (§6.8).

### 6.1 Niveau 0 : l'oculaire (hero)
- **Ciel** : un champ d'étoiles qui scintillent (opacité aléatoire), avec une étoile filante occasionnelle. Un léger parallaxe suit la souris.
- **Horizon** : la silhouette d'une colline en bas, avec un **télescope dessiné en SVG original** posé dessus, sur la droite.
- **Jetons → étoiles filantes** (la mécanique du template) : les pastilles de technos (Java, JavaScript, Python, PHP, React, JavaFX, Tailwind, Flask, PostgreSQL, MySQL, Git, Bash…) tombent du ciel avec une traînée lumineuse, rebondissent et s'empilent sur l'horizon. On peut les attraper et les lancer (physique **Matter.js**).
- **Nom géant « Léo Regniez »** en bas, coupé par le bord : les lettres **s'allument une par une** comme des étoiles (opacité, flou qui se résorbe, léger halo).
- **Transition 0 → 1** : au scroll (section épinglée sur environ 100vh), la caméra entre dans l'oculaire du télescope. Un **masque circulaire** (`clip-path: circle()`) part de la position de l'oculaire et s'agrandit jusqu'à remplir l'écran, avec un vignettage noir sur les bords. Le HUD passe de ×1 à ×40.

### 6.2 Bandeau défilant
- Un marquee infini (CSS `@keyframes translateX`) affiché comme une bande de télémétrie : texte mono, ✦ en accent et petit relevé de coordonnées.
- Sa vitesse augmente légèrement selon la vitesse de scroll.

### 6.3 Niveau 1 : la constellation (Projets)
- **Mise en page** : la liste du template en colonne principale. Sur desktop, un **SVG épinglé (sticky)** de la constellation du Lion à droite.
- Utiliser les **vraies positions** (ascension droite et déclinaison) des étoiles principales du Lion : Regulus, Denebola, Algieba, Zosma, Chertan, Adhafera, Rasalas et Algenubi (ε Leo), projetées en 2D. Les tracés suivent la figure classique (la « faucille » et le triangle de l'arrière-train). Chaque projet est associé à une étoile (§4.3). Une étoile sans projet reste faible, avec la mention « à venir ».
- **Au scroll**, quand une ligne de projet entre dans la vue, son étoile **s'allume** (éclat, puis halo) et le **segment qui la relie à la précédente se trace** (`stroke-dashoffset`). La constellation se dessine au fil de la lecture.
- **Lien bidirectionnel** : survoler une ligne fait briller son étoile et affiche son nom (« Regulus · Régulation de transports sanitaires »). Survoler ou cliquer une étoile fait défiler jusqu'à la ligne et la surligne.
- **Lignes de projet** : filet animé de gauche à droite à l'entrée. Les liens d'action ont un soulignement qui « scanne ». L'accordéon `Détails` (§4.3) s'ouvre avec une animation de hauteur.
- **Mobile** : la constellation passe au-dessus de la liste, en petit, et reste collante sous le menu.

### 6.4 Transition 1 → 2 puis niveau 2 : la galaxie (Stack)
- **Transition** : la caméra plonge vers un point du Lion, entre Chertan et Zosma, là où se trouve le Triplet. Les étoiles de la constellation **filent vers l'extérieur** (effet de grossissement : les particules s'écartent du centre, avec un léger étirement en traînées, sans aller jusqu'à l'hyperespace façon Star Wars). Trois petites taches floues apparaissent (le Triplet), puis l'une d'elles grossit jusqu'à devenir une **galaxie spirale à 4 bras**.
- **Galaxie** (Canvas 2D, environ 3 000 à 6 000 particules selon l'appareil) : des spirales logarithmiques, avec un bulbe central chaud. **Chaque bras correspond à une catégorie** (Langages, Frameworks, Données, Outils). La rotation est lente et continue.
- Chaque techno est une **étoile nommée** dans son bras. Survoler un élément de la liste HTML (grille 2×2 du template, posée sur un fond légèrement translucide) fait briller son étoile dans la galaxie, et inversement.
- Les titres de blocs ont le filet souligné du template, en couleur d'accent, et se tracent à l'entrée.

### 6.5 Transition 2 → 3 puis niveau 3 : le champ profond (Parcours)
- **Transition** : la galaxie s'éloigne et rapetisse jusqu'à n'être qu'une galaxie parmi des centaines (champ profond façon Hubble : des ellipses procédurales de tailles, d'orientations et de teintes variées, de plus en plus rouges vers le fond).
- **Concept** : « Regarder loin, c'est regarder dans le passé. » Chaque étape du parcours porte en mono une étiquette du type `lumière émise il y a 2 ans`.
- Recommandation : un ordre **antichronologique**, de l'étape en cours jusqu'au Bac. Le scroll vers le bas correspond à un regard plus lointain. Si Léo préfère l'ordre chronologique du template, garder le concept mais inverser l'étiquette.
- **Lignes** (mise en page du template, 1/3 et 2/3) : un faisceau de lumière vertical se trace sur le bord gauche au fil du scroll et relie les étapes. L'étape « en cours » porte un **badge pulsant** ambre, comme un quasar.

### 6.6 Transition 3 → 4 puis niveau 4 : le signal (Contact)
- **Transition** : toutes les galaxies convergent vers un point, ce qui donne un bref flash, puis un fond granuleux et tacheté, inspiré de la carte du fond diffus cosmologique (bruit procédural dans des tons ambre et bleu, animé très lentement).
- **Bloc Contact** (mise en page du template : titre géant, phrase, e-mail géant, pilules) :
  - « Établissons le contact. » apparaît lettre par lettre, comme le nom du hero (écho visuel au début du site) ;
  - au survol de l'e-mail, son soulignement devient une **onde sinusoïdale** animée (un signal émis) ;
  - les pilules apparaissent en cascade.
- **Pied de page** : le lien « ↑ Retour à l'oculaire » rejoue un dézoom accéléré (environ 1,5 s) jusqu'au hero.

### 6.7 Micro-interactions globales
- **Curseur** (desktop seulement) : un petit réticule de télescope qui grossit sur les éléments cliquables.
- **Révélations au scroll** : fondu et translation de 12 px, en décalé, via GSAP ScrollTrigger (`once: true`).
- **Scroll fluide** : Lenis, désactivé si `prefers-reduced-motion`.

### 6.8 `prefers-reduced-motion` (obligatoire)
- Aucune transition épinglée ni zoom : chaque section a un fond statique propre à son niveau (une image fixe du canvas).
- Les jetons sont posés directement à leur place finale, sans chute. Le marquee est arrêté.
- La constellation est entièrement tracée d'emblée, et la galaxie ne tourne pas.

---

## 7. Questions à poser à Léo avant de coder

1. **Alternance** : faut-il afficher le nom de l'entreprise ? Le projet « Régulation de transports sanitaires » peut-il figurer dans le portfolio, et sous quelle formulation (accord du tuteur) ?
2. **Projets perso** : faut-il afficher *Shinobi Path TD* et *Narutodle* ? Avec quelles technos ? Les dépôts sont-ils publics ? Note : ils utilisent des images officielles hotlinkées depuis le wiki Naruto, donc pas de démo publique en l'état.
3. **Liens** : quels projets ont un dépôt public (GitHub ou GitLab) ou une démo en ligne ?
4. **Téléphone** : le retirer du site ? (recommandé)
5. **Photo** : l'afficher ? Si oui, proposition : la faire apparaître dans l'oculaire du télescope au survol, ou dans le bloc Contact.
6. **Langues du site** : FR et EN, ou FR, EN et ES ?
7. **Stack** : ajouter les technos de l'alternance (Vaadin, Hibernate, Maven, WildFly, Eclipse, SVN, Drools) ?
8. **Parcours** : ordre antichronologique (concept « regarder loin, c'est remonter le temps ») ou chronologique ? Quels projets marquants pour la 2e année ?
9. **Centres d'intérêt** : les afficher ?
10. **CV** : Léo fournit-il des PDF à jour (3e année, alternance) ?
11. **Hébergement** : où le site sera-t-il déployé (Vercel, Netlify, GitHub Pages…) ? Avec un nom de domaine (par exemple `leoregniez.fr`) ?

---

## 8. Stack technique recommandée

| Besoin | Choix | Pourquoi |
|---|---|---|
| Build | **Vite** + React 18 | Remplace CRA (abandonné) et garde React, une compétence affichée. |
| Style | **Tailwind CSS** (v3 ou v4), plus des variables CSS pour la palette | Continuité avec l'existant. |
| Animations au scroll | **GSAP + ScrollTrigger** | Épinglage, timelines liées au scroll, robuste. GSAP est entièrement gratuit depuis 2025 (à vérifier au moment de l'installation). |
| Scroll fluide | **Lenis** | Léger et compatible avec ScrollTrigger. |
| Physique des jetons | **Matter.js** | Chute, empilement et lancer des pastilles. |
| Cosmos | **Canvas 2D** maison (étoiles, galaxie, champ profond, bruit du fond diffus) | Pas besoin de Three.js, le bundle reste léger. Three.js ou R3F seulement si le rendu 2D de la galaxie ne suffit pas. |
| Constellation | **SVG** inline | Accessible, nette, et le tracé s'anime en `stroke-dashoffset`. |
| Icônes | `lucide-react` (déjà présent) | Les SVG GitLab et LinkedIn existent déjà dans le code. |
| i18n | Le `LanguageContext` existant, avec **tous** les textes dans `translations.js` | Supprimer les textes en dur. |

### Architecture proposée
```
src/
  data/            profil.js, projets.js, stack.js, parcours.js, contact.js   ← source unique de vérité
  i18n/            LanguageContext.jsx, translations.js
  sections/        Ouverture.jsx (hero), Bandeau.jsx, Projets.jsx, Stack.jsx, Parcours.jsx, Contact.jsx
  components/      Menu.jsx, Hud.jsx, SkipLink.jsx, Jetons.jsx, NomGeant.jsx, ConstellationLeo.jsx, Curseur.jsx
  cosmos/          CosmosCanvas.jsx, starfield.js, galaxy.js, deepField.js, cmb.js, camera.js, useZoomLevel.js
  hooks/           usePrefersReducedMotion.js, useMediaQuery.js
  styles/          index.css (variables, polices)
public/
  cv/, og-image.png, favicon.svg
```

---

## 9. Phases de réalisation et critères d'acceptation

| Phase | Contenu | Terminée quand… |
|---|---|---|
| **0. Migration** | CRA → Vite, nettoyage (`Header.jsx` inutilisé, `build/` ignoré), données centralisées dans `src/data/` | `npm run dev` et `npm run build` passent, et l'ancien contenu s'affiche. |
| **1. Structure** | Page unique avec les 6 blocs du template (§2), dans l'ordre, sans aucune animation, contenu complet (§4), FR/EN | Toutes les ancres fonctionnent, le lien d'évitement aussi, et la page est lisible et belle même sans canvas. |
| **2. Cosmos et HUD** | Canvas fixe, caméra pilotée par le scroll, changement de teinte par niveau, HUD et règle de zoom | Le niveau affiché dans le HUD correspond à la section visible, à 60 fps sur un portable moyen. |
| **3. Niveaux** | Les animations des §6.1 à §6.6, niveau par niveau | Chaque effet décrit est présent et fonctionne à la souris, au clavier et au tactile. |
| **4. Transitions** | Les 4 transitions de grossissement épinglées, et le « Retour à l'oculaire » | Le voyage est continu du hero au contact, sans saut ni flash blanc. |
| **5. Finitions** | Responsive (375 px → 1920 px), `prefers-reduced-motion`, focus visibles, contrastes AA, performance | Lighthouse ≥ 90 en Performance et en Accessibilité. Aucune animation en mode mouvement réduit. Le canvas se met en pause quand l'onglet est caché. Le DPR est plafonné à 2. |
| **6. SEO et mise en ligne** | `<title>`, description, Open Graph, Twitter Card, favicon, `lang` dynamique, déploiement | L'aperçu du lien est correct sur LinkedIn et Discord. |

### Règles transverses
- **Aucun emprunt à noaperu.fr** au-delà de la structure : ni code, ni polices, ni textes, ni assets.
- Le contenu passe toujours par le **HTML sémantique**. Le canvas et le SVG décoratif sont en `aria-hidden`.
- Le texte du hero (LCP) est du HTML qui s'affiche immédiatement. Le cosmos s'initialise après coup.
- Les objets lourds (galaxie, champ profond) ne sont initialisés qu'à l'approche de leur niveau.
- Le nombre de particules s'adapte à `navigator.hardwareConcurrency` et à la taille de l'écran.
- Le code et les commentaires sont en français, comme dans le projet actuel.
