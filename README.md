# NEXUS/09

### Une transmission depuis 2089. Le futur n'est pas écrit.

Expérience WebGL/WebXR publique, gratuite et sans dépendance réseau : trois messages du futur à explorer, écouter et partager.

## Lancer en local

Les modules JavaScript nécessitent un serveur HTTP (pas d'ouverture directe du fichier) :

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Publier sur GitHub Pages

1. Créer un dépôt **public** nommé `nexus-09` sur GitHub (sans README, licence ou `.gitignore`).
2. Depuis ce dossier :

```bash
git remote add origin https://github.com/VOTRE-PSEUDO/nexus-09.git
git push -u origin main
```

3. Sur GitHub : **Settings → Pages → Source → GitHub Actions**.
4. Le workflow joint déploie automatiquement chaque push sur `main`.
5. Le site sera disponible sur `https://VOTRE-PSEUDO.github.io/nexus-09/`.

Tous les chemins sont relatifs : aucune modification n'est nécessaire pour un projet GitHub Pages. Pour un domaine personnalisé, voir `CNAME.example`.

## Expérience

- **Univers WebGL procédural** : cœur organique, orbites, particules et grille spatiale.
- **Mode immersif** : déplacement WASD/flèches, regard à la souris ou au tactile, objets interactifs.
- **Réalité virtuelle WebXR** : sur casque et navigateur compatibles, bouton « Entrer en VR », contrôleurs et sélection par rayon.
- **Transmissions** : trois archives narratives avec synthèse vocale française.
- **Paysage sonore génératif** : créé en direct avec Web Audio, activé uniquement par l'utilisateur.
- **Partage public** : API de partage native ou copie du lien.
- **Version mobile dédiée** : navigation inférieure, cartes à faire glisser, commandes tactiles de déplacement et affichage adapté aux encoches.
- **Application installable (PWA)** : ajout à l’écran d’accueil, plein écran et fonctionnement hors ligne après la première visite.
- Responsive, navigation clavier, réduction des animations selon les préférences système.

WebXR nécessite HTTPS (fourni par GitHub Pages) et un matériel/navigateur compatible. Sans casque, le bouton ouvre automatiquement le mode immersif 3D. La synthèse vocale dépend des voix installées sur l'appareil.

## Structure

```text
index.html                 Contenu et interface
style.css                  Direction artistique et responsive
app.js                     Interactions, audio, WebGL et WebXR
assets/                    Typographies et favicon locaux
vendor/three.module.js     Three.js r160, embarqué localement
.github/workflows/         Déploiement GitHub Pages
```

## Modifier les transmissions

Les trois histoires sont regroupées dans l'objet `transmissions` au début de `app.js`. Les titres et extraits des cartes se trouvent dans `index.html`.

## Crédits

- Moteur 3D : [Three.js](https://threejs.org/), licence MIT.
- Typographies : Space Grotesk et Syne, SIL Open Font License.
- Univers, textes et code de l'expérience : NEXUS/09, licence MIT.

Aucun tracker, aucun cookie, aucun compte, aucune ressource chargée depuis un CDN pendant la visite.
