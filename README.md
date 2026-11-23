# Portfolio de Léo Regniez

Une seule page qui défile, en cinq niveaux de grossissement : l'oculaire d'un télescope (accueil),
la constellation du Lion (projets), une galaxie (stack), le champ profond (parcours) et le fond
diffus cosmologique (contact).

## Lancer le site

```bash
npm install
npm run dev      # développement, sur http://localhost:5173
npm run build    # version de production dans dist/
npm run preview  # sert dist/ pour vérifier avant la mise en ligne
```

Le dossier `dist/` est un site statique : il se dépose tel quel sur Vercel, Netlify ou GitHub Pages.

## Modifier le contenu

Tout le contenu est dans `src/data/`, en français et en anglais (`{ fr, en }`) :

| Fichier | Contenu |
|---|---|
| `profil.js` | accroche, situation, mots du bandeau, e-mail, liens, CV |
| `projets.js` | les projets, chacun rattaché à une étoile du Lion (`etoile`) |
| `stack.js` | les technos, une catégorie par bras de la galaxie, et les langues |
| `parcours.js` | les étapes du parcours (de la plus récente à la plus ancienne) et les centres d'intérêt |
| `cv.js` | ce qui n'apparaît que sur le CV : titre, téléphone, expériences, formations |
| `lion.js` | positions réelles des étoiles du Lion et tracé de la constellation |

Les textes d'interface (menu, titres, boutons) sont dans `src/i18n/translations.js`.
Les CV sont dans `public/cv/`.

Pour ajouter un projet : ajouter un objet dans `projets.js` et lui donner l'étoile libre
(`algenubi`), puis vider `etoileAVenir`. Un projet avec un lien (`liens: [{ type: 'code', url }]`,
types possibles : `code`, `jouer`, `site`) affiche ce lien ; sans lien, il affiche un bouton
« Détails » qui déplie `details`.

## Le CV

`cv.html` est le CV, sur une feuille A4 aux couleurs du site. Il lit les **mêmes données** que
le portfolio : modifier un projet dans `src/data/projets.js` (ou la stack, les langues…) le modifie
aussi sur le CV. Les informations propres au CV (titre, téléphone, expériences, formations)
sont dans `src/data/cv.js`, et la photo dans `src/cv/photo.jpg`.

Les PDF téléchargeables (`public/cv/CV_Regniez_Leo_FR.pdf` et `…_EN.pdf`) sont refaits à partir
de `cv.html` par :

```bash
npm run build
npm run cv:pdf
```

`./deploy.sh` le fait automatiquement. Le script utilise un navigateur de la famille Chrome
déjà installé (Chromium, Chrome, Brave, Edge, Vivaldi) ; sinon : `sudo pacman -S chromium`,
ou `CHROME_PATH=/chemin/du/navigateur npm run cv:pdf`. Sur la page du CV, le bouton
« Imprimer » permet aussi d'enregistrer un PDF à la main.

## Organisation du code

```
src/
  data/        contenu du site
  i18n/        langue (contexte React) et textes d'interface
  sections/    Ouverture, Bandeau, Projets, Stack, Parcours, Contact
  cv/          la page du CV (CV.jsx, cv.css, photo.jpg)
  components/  Menu, Hud, Curseur, NomGeant, ConstellationLeo, Transition, SkipLink
  cosmos/      le canvas de fond : caméra (scroll → grossissement), étoiles, galaxie,
               champ profond, fond diffus, et la scène qui les assemble
  hooks/       défilement fluide et ancres, media queries, mouvement réduit
  styles/      index.css (variables de la palette, mise en page, animations)
```

Avec le réglage système « réduire les animations », le site n'a ni zoom ni animation :
chaque section garde un fond fixe.

## Mise en ligne (OVH, regniezleo.fr)

Le site est hébergé sur l'hébergement gratuit OVH lié au domaine : le domaine sert le dossier `www`.

```bash
./deploy.sh
```

Le script construit le site (`npm run build`), refait les PDF du CV (`npm run cv:pdf`), puis envoie `dist/` dans `www` par SFTP
(`ftp.cluster129.hosting.ovh.net`, utilisateur `regnieo`). Il demande le mot de passe FTP
au moment de l'envoi. Ce mot de passe se change dans l'espace client OVH :
Hébergements → regniezleo.fr → FTP - SSH.

`public/.htaccess` force le HTTPS, redirige `www.regniezleo.fr` vers `regniezleo.fr`
et règle le cache des fichiers.
