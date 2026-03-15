# Enseignements — PWA GitHub Pages

## 📱 Installation en 4 étapes

### 1. Déployer GitHub Pages

1. Créez un dépôt GitHub (ex: `enseignements-pwa`)
2. Uploadez **tous ces fichiers** tels quels à la racine du dépôt
3. Dans **Settings → Pages** : sélectionnez `Deploy from a branch → main → / (root)`
4. Votre URL sera : `https://VOTRE_USERNAME.github.io/enseignements-pwa/`

---

### 2. Configurer l'URL GAS dans index.html

Ouvrez `index.html` et remplacez **`GAS_URL_ICI`** par l'URL de votre déploiement Apps Script :

```html
<!-- Ligne ~57 de index.html -->
<iframe
  id="app-frame"
  src="https://script.google.com/macros/s/AKfycb.../exec"
  ...>
</iframe>
```

---

### 3. Vérifier la configuration code.gs

Assurez-vous que la ligne suivante est présente dans `doGet()` :

```javascript
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
```

✅ Elle est déjà présente dans votre `code.gs` actuel.

---

### 4. Installer sur l'écran d'accueil

#### iPhone / iPad (iOS)
1. Ouvrez l'URL GitHub Pages dans **Safari**
2. Tapez l'icône **Partager** (carré avec flèche vers le haut)
3. Sélectionnez **"Sur l'écran d'accueil"**
4. Confirmez → L'app s'ouvre désormais **sans aucune barre de navigateur** ✓

#### Android (Chrome)
1. Ouvrez l'URL GitHub Pages dans **Chrome**
2. Chrome affiche un bandeau **"Installer l'application"** (ou menu ⋮ → "Ajouter à l'écran d'accueil")
3. Confirmez → L'app est installée comme une vraie app native ✓

---

## 🗂 Structure des fichiers

```
github-pages/
├── index.html        ← Shell PWA (contient l'iframe GAS)
├── manifest.json     ← Manifest PWA (icône, couleurs, mode standalone)
├── sw.js             ← Service Worker (cache de la shell)
├── .nojekyll         ← Empêche Jekyll de traiter les fichiers
└── icons/
    ├── icon-192.svg  ← Icône 192×192 (Android)
    └── icon-512.svg  ← Icône 512×512 (splash screen)
```

---

## 🔐 Session & sécurité

- La session utilisateur est stockée dans le `localStorage` **du contexte GAS** (à l'intérieur de l'iframe).
- Sur **iOS en standalone**, les restrictions de cookies tiers s'appliquent ; si la session ne persiste pas, l'utilisateur se reconnecte une fois, puis la session est conservée.
- Le Service Worker ne met jamais en cache les requêtes GAS (données dynamiques).

---

## ⚡ Fonctionnalités PWA activées

| Fonctionnalité | iOS | Android |
|---|---|---|
| Plein écran (sans barre nav) | ✅ | ✅ |
| Icône sur écran d'accueil | ✅ | ✅ |
| Splash screen | ✅ | ✅ |
| Thème couleur barre système | ✅ | ✅ |
| Prompt d'installation natif | ❌ (Safari) | ✅ (Chrome) |
| Offline (shell uniquement) | ✅ | ✅ |
