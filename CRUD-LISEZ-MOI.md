# Mini TP React Native - CRUD local

Le projet repose sur le **dernier mini-TP Mot de passe + Clair/Sombre/Système**.
Les onglets sont maintenant regroupés dans `src/app/(tabs)` comme dans le cours. L’onglet `CRUD` permet de gérer des éléments avec un ID, et l’onglet `Projets` affiche la liste avec une page de détail séparée.

## Installation (Windows / VS Code)

Ouvrir le dossier **my-app** dans VS Code, puis dans PowerShell :

```powershell
npm.cmd install
npx.cmd tsc --noEmit
npm.cmd start
```

Appuyer sur `w` pour tester dans le navigateur ou utiliser Expo Go sur le téléphone.

Vous pouvez aussi double-cliquer sur `DEMARRER-WINDOWS.cmd` pour installer les dépendances puis lancer Expo. Il faut avoir Node.js installé.

IMPORTANT : une nouvelle dépendance a été ajoutée : `@react-native-async-storage/async-storage` **2.2.0**, compatible avec Expo SDK 58. La première commande `npm.cmd install` est donc obligatoire : elle installe cette bibliothèque et met à jour `package-lock.json`.

## Contenu du mini-TP

- **CREATE** : remplir le titre, éventuellement la description, puis « Créer un élément ». Un ID automatique est attribué.
- **READ ALL** : la liste des éléments s'affiche en bas de l'écran ; le bouton « Actualiser » force une nouvelle lecture.
- **READ BY ID** : saisir un ID (ex. `1`), puis « Lire par ID ». Les détails de l'élément apparaissent.
- **UPDATE** : cliquer sur « Modifier » pour préremplir le formulaire, changer les valeurs, puis enregistrer.
- **DELETE** : supprimer depuis la carte d'un élément ou saisir son ID et choisir « Supprimer cet ID ».

Essayez successivement : créer deux éléments, lire le n°1, modifier le n°2, supprimer le n°1 et actualiser.

## Organisation du code

| Fichier | Fonction |
|---|---|
| `src/types/element.ts` | Type `Element` avec `id`, `titre`, `description` et dates |
| `src/services/element-service.ts` | Fonctions asynchrones `createElement`, `readAll`, `readById`, `updateElement`, `deleteById` |
| `src/app/(tabs)/crud.tsx` | Écran de test pour toutes les opérations |
| `src/app/(tabs)/_layout.tsx` | Point d’entrée de la navigation par onglets |
| `src/app/(tabs)/projects.tsx` | READ ALL et ouverture d’une fiche |
| `src/app/project/index.tsx` | READ BY ID, page de détail hors des onglets |
| `src/app/project/_layout.tsx` | Navigation pour les pages de projet |
| `src/components/app-tabs.tsx` | Onglets sur Android/iOS |
| `src/components/app-tabs.web.tsx` | Onglet CRUD sur navigateur |

Le précédent mini-TP reste disponible dans l'onglet « Mot de passe » (`src/app/(tabs)/test.tsx`). Les modes Clair, Sombre et Système restent accessibles sur cet écran et sont appliqués à l'écran CRUD.

## Stockage et limites

- L'application utilise **AsyncStorage**, donc une persistance **locale uniquement** sur le téléphone ou dans le navigateur.
- Il n'y a **aucun serveur/API** et aucune base de données distante.
- Les données ne sont pas partagées entre le téléphone et le navigateur.
- Les éléments sont des données d'exemple : ne jamais stocker de mots de passe ou des données sensibles dans AsyncStorage, qui n'est pas chiffré.
- Vider les données de l'application peut supprimer les éléments enregistrés.
- `DELETE` supprime immédiatement un élément local : il n'y a pas de corbeille.

## Mettre à jour GitHub

Depuis le terminal du nouveau dossier `my-app`, avec le dépôt Git déjà configuré :

```powershell
git add .
git commit -m "Ajouter mini TP CRUD React Native"
git push origin main
```

Si vous décompressez dans un **nouveau dossier**, le dépôt `.git` n'est pas inclus dans le ZIP : il vaut mieux copier les fichiers du projet dans votre dépôt Git existant, puis exécuter les commandes ci-dessus, au lieu de recréer le dépôt Git.
