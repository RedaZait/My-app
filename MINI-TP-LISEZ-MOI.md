# Mini TP React Native — Mot de passe

## Objectif

L'onglet **Mot de passe** montre le composant `MotDePasse` défini dans `src/components/mot-de-passe.tsx`.

- Champ `TextInput` dont la saisie est masquée avec `secureTextEntry`.
- Bouton `Pressable` avec une icône œil / visage masqué pour afficher ou masquer.
- Propriété `maxLength` (12 dans l'exemple) qui limite la saisie.
- Propriété `onMaxLengthReached` : callback déclenché au moment où la limite est atteinte (une nouvelle fois après suppression puis nouvelle saisie jusqu'à la limite).
- `onChangeText` facultatif pour le parent, utilisé ici pour effacer le message.
- **Sélecteur de thème Clair / Sombre / Système** : change les couleurs du composant, des écrans et des onglets en direct. Le mode « Système » suit les réglages du téléphone/navigateur.
- Le choix de thème reste actif durant la session de l’application (il revient au mode « Système » au redémarrage complet).

## Ouvrir le projet

1. Décompresse le ZIP, puis ouvre **my-app** dans VS Code.
2. Dans le terminal PowerShell de VS Code :
   ```powershell
   npm.cmd install
   npx.cmd tsc --noEmit
   npm.cmd start
   ```
3. Presse `w` pour le web ou scanne le QR code avec Expo Go sur téléphone.
4. Ouvre l'onglet **Mot de passe** puis teste les boutons **Clair**, **Sombre** et **Système**.

La version ZIP exclut `node_modules` et `.expo` car ce sont des fichiers installés/générés localement.

## Exemple d'utilisation

```tsx
<MotDePasse
  maxLength={12}
  onMaxLengthReached={() => console.log("Longueur maximale atteinte")}
/>
```

La valeur du mot de passe n'est jamais affichée dans le message de confirmation ou enregistrée dans les logs de la démonstration.
