# At Midnight with Kelly

Un morceau à découvrir chaque jour à minuit, heure de Paris. L’application est en HTML, CSS et JavaScript et se publie sur GitHub Pages sans installation.

Au-dessus du titre, le verset du jour change à la même heure. La sélection alterne entre douze versets de la [Bible catholique Crampon (1923)](https://fr.wikisource.org/wiki/Bible_Crampon_1923), disponibles dans `app.js`. La référence s’ouvre dans un nouvel onglet pour laisser le lecteur ouvert.

## Ajouter les morceaux

1. Dans `audio`, crée un sous-dossier par morceau avec son fichier MP3 ou M4A. Ajoute une pochette carrée (JPG ou PNG) si tu en as une. Une pochette intégrée au fichier audio peut aussi être extraite dans ce dossier.
2. Ouvre `playlist.js` et renseigne la date de début, les titres et les chemins des fichiers comme dans cet exemple.

   ```js
   window.kellyPlaylist = {
     startDate: "2026-12-01",
     tracks: [
       {
         title: "Premier morceau",
         artist: "Artiste",
         file: "audio/Premier morceau/premier.mp3",
         cover: "audio/Premier morceau/pochette.jpg",
       },
       {
         title: "Deuxième morceau",
         artist: "Artiste",
         file: "audio/Deuxième morceau/deuxieme.mp3",
         cover: "audio/Deuxième morceau/pochette.jpg",
       },
     ],
   };
   ```

Dans cet exemple, le premier titre est disponible le 1er décembre à Paris et le deuxième le 2 décembre. La playlist reprend au premier morceau après le dernier.

Le vinyle s’affiche avant la découverte. Après le clic sur **Découvrir le son**, la pochette du morceau remplace le vinyle si elle est disponible.

Sous le lecteur, **Découvrir un autre son** lance le titre suivant dans la boucle. Ces avances sont mémorisées dans le navigateur. À minuit, la sélection avance encore d’un titre.

## Essayer sur le Mac

Ouvre `index.html` dans Safari ou Chrome. Si la playlist est vide, un morceau de démonstration permet d’essayer la révélation et le lecteur. Sur une version hébergée avec une playlist vide, ajoute `?demo=1` à l’adresse pour afficher cet aperçu.

## Publier sur GitHub Pages

1. Crée un dépôt public `songs-for-kelly` et pousse le contenu de ce dossier à la racine de la branche `main`.
2. Dans **Settings → Pages**, choisis **Deploy from a branch**, puis **main** et **/(root)**. Enregistre.
3. GitHub affiche l’adresse du site une fois le déploiement terminé. Partage cette adresse avec Kelly.

Pour mettre le site à jour, ajoute les nouveaux dossiers et leurs entrées dans `playlist.js`, puis crée un commit et pousse-le sur `main`. GitHub Pages republie le site à chaque push sur cette branche.

Le site, le fichier de programmation et les morceaux du dépôt public sont accessibles à toute personne qui a leur adresse, y compris les morceaux programmés pour plus tard. Ajoute uniquement les fichiers que tu peux diffuser publiquement. [Documentation GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
