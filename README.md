# My App — TP React Native / Expo

Projet Expo SDK 58 avec une navigation par groupes de routes, un mini-TP mot de passe, trois modes de thème et un module CRUD local.

## Installation sur Windows

Ouvrir le dossier `my-app` dans VS Code, puis dans PowerShell :

```powershell
npm.cmd install
npx.cmd tsc --noEmit
npm.cmd start
```

`npm.cmd install` est indispensable, en particulier pour installer la dépendance `@react-native-async-storage/async-storage` nécessaire au CRUD. Cette commande met aussi à jour le fichier `package-lock.json` si nécessaire.

Le projet est testé dans Expo Go sur téléphone, ou avec la touche **w** dans le terminal pour le web.

## Arborescence des pages

```text
src/app/
  _layout.tsx                 # Provider de thème + navigation Stack
  (tabs)/
    _layout.tsx               # Barre d'onglets native et web
    index.tsx                 # Accueil
    explore.tsx               # Explorer
    projects.tsx              # Liste des projets (READ ALL)
    crud.tsx                  # CREATE / READ / UPDATE / DELETE
    test.tsx                  # Mot de passe + choix du thème
  project/
    _layout.tsx               # Stack de la page de détail
    index.tsx                 # Détail via ID (READ BY ID)
```

Les fichiers dans `(tabs)` correspondent aux différents onglets. Le nom `(tabs)` est un groupe Expo Router : il ne figure pas dans les URL.

**IMPORTANT :** ne pas conserver les anciens fichiers `src/app/index.tsx`, `src/app/crud.tsx`, `src/app/test.tsx` et `src/app/explore.tsx` en parallèle avec les nouveaux fichiers : les routes seraient dupliquées. Remplacer entièrement le dossier `src/app` lors de la mise à jour.

Voir `CRUD-LISEZ-MOI.md` et `MINI-TP-LISEZ-MOI.md` pour le détail des fonctionnalités.

Le stockage est **local** (AsyncStorage), sans API distante. Ne pas y enregistrer de mot de passe.
