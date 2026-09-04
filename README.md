# Tirage au sort — PWA

Application web installable (PWA) pour tirer au sort un nombre donné de
personnes à partir de listes de noms (fichiers `.txt` ou saisie manuelle).
Tout se passe dans le navigateur : aucune donnée n'est envoyée à un serveur.

## Fonctionnement

- Importez un ou plusieurs fichiers `.txt` (un nom par ligne) par glisser-déposer
  ou via le sélecteur de fichiers, et/ou collez une liste manuellement.
- Choisissez le nombre de personnes à tirer.
- Cliquez sur **Tirer au sort**.
- Téléchargez le résultat en `.txt` si besoin.

> Note : un site web ne peut pas lire automatiquement les fichiers d'un
> dossier sans action de l'utilisateur (contrainte de sécurité des
> navigateurs). C'est pourquoi l'import se fait par glisser-déposer ou
> sélection de fichiers, plutôt qu'en scannant un dossier comme le ferait
> un script local.

## Héberger sur GitHub Pages

1. Créez un nouveau dépôt GitHub (ou utilisez un dépôt existant).
2. Copiez tout le contenu de ce dossier (`index.html`, `styles.css`, `app.js`,
   `manifest.json`, `service-worker.js`, le dossier `icons/`) à la racine du dépôt.
3. Poussez les fichiers :
   ```bash
   git init
   git add .
   git commit -m "Ajout de l'app de tirage au sort"
   git branch -M main
   git remote add origin https://github.com/<votre-utilisateur>/<votre-repo>.git
   git push -u origin main
   ```
4. Sur GitHub : **Settings → Pages**, choisissez la branche `main` et le
   dossier `/ (root)`, puis enregistrez.
5. Votre site sera disponible à une adresse du type :
   `https://<votre-utilisateur>.github.io/<votre-repo>/`

L'app est installable (icône "Installer l'application" dans la barre
d'adresse ou menu du navigateur) et fonctionne hors-ligne une fois visitée
une première fois, grâce au service worker.

## Personnalisation rapide

- Couleurs et typographies : `styles.css` (variables en haut du fichier).
- Icônes : régénérez `icons/icon-192.png` et `icons/icon-512.png` si vous
  voulez une autre identité visuelle.
