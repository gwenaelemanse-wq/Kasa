# Kasa

Application de location d'appartements et de maisons entre particuliers — projet réalisé dans le cadre de la formation Développeur d'application - JavaScript React (OpenClassrooms).

Refonte du front-end de la plateforme Kasa en Next.js (App Router), branché sur une API Express.js/SQLite fournie.

## Stack technique

- **Front-end** : Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Back-end** : Express.js 5, SQLite, authentification JWT
- **Tests** : Vitest, React Testing Library

## Prérequis

- Node.js 18+
- npm

## Installation et lancement

Le projet est composé de deux applications séparées : le **front-end** (ce dépôt) et le **back-end** (dépôt séparé, fourni par ailleurs). Les deux doivent tourner en même temps.

### 1. Lancer le back-end

Depuis le dossier du back-end :

```bash
npm install
npm start
```

Le serveur démarre sur `http://localhost:3000`.

### 2. Configurer le front-end

À la racine de ce projet, crée un fichier `.env.local` :

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Lancer le front-end

```bash
npm install
npm run dev -- -p 3001
```

> Le port `3001` est utilisé volontairement pour ne pas entrer en conflit avec le back-end, qui tourne déjà sur le port 3000.

Le site est accessible sur `http://localhost:3001`.

## Lancer les tests

```bash
npm test
```

Tests unitaires présents sur :
- Le carousel photo (`components/PropertyGallery.test.tsx`)
- La gestion des favoris (`components/FavoriteButton.test.tsx`)

## Comptes de test

Pour tester les fonctionnalités nécessitant une connexion (favoris liés à un compte, ajout de logement, messagerie), crée un compte via la page `/inscription`, ou directement via l'API sur `http://localhost:3000/docs.html` (route `POST /auth/register`).

Par défaut, tout nouveau compte a le rôle `client`. Pour publier une annonce, un compte `client` peut devenir hôte directement depuis l'interface (bouton "Devenir hôte" affiché lors de la première tentative d'accès à la page d'ajout de logement).

## Choix techniques notables

- **Server Actions** : les appels à l'API nécessitant une authentification (connexion, upload d'images, création de logement, messagerie) passent par des Server Actions Next.js plutôt que par des appels `fetch` directs côté client, afin d'éviter les blocages CORS liés à la séparation front/back sur deux ports différents.
- **Route interceptée pour la messagerie** : la messagerie s'affiche en modale par-dessus la page courante lors d'une navigation classique (grâce aux routes interceptées de Next.js), tout en restant accessible en page complète via un accès direct à `/messagerie`.
- **Favoris en `localStorage`** : les favoris sont stockés côté navigateur (pas besoin de compte), conformément aux spécifications du projet.