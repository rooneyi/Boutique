# SPEC-02 — Authentification et inscription

## 1. Objet du document

Spécifier les parcours **connexion**, **inscription vendeur** et **inscription client**, ainsi que les données collectées à la création de compte.

## 2. Références croisées

- [SPEC-00](./SPEC-00.md) · [SPEC-01](./SPEC-01.md) (acteurs)
- Implémentation routes `/auth/*` : voir codebase et [AUDIT.md](./AUDIT.md) (sécurité sessions)

## 3. Périmètre fonctionnel

**Inclus :** création de compte avec les attributs listés, connexion sécurisée (mécanisme générique : email / mot de passe).

**Exclu :** détail des écrans UI, configuration Fortify, politique exacte de complexité mot de passe (référence audit / config).

## 4. Acteurs concernés

Vendeur, Client (Administrateur : compte généralement provisionné hors ce flux ou par procédure interne).

## 5. Exigences fonctionnelles

### Vendeur — inscription

Données attendues :

- Nom  
- Email  
- Mot de passe  
- **Nom de boutique**

Après inscription : accès à l’espace vendeur.

### Vendeur / Client — connexion

- Connexion **sécurisée** (session web standard ; détail technique hors SPEC fonctionnelle).

### Client — inscription

- Inscription **simple** (nom, email, mot de passe selon parcours retenu en implémentation).
- Connexion après inscription.

## 6. Règles et cas limites

- Email unique sur la plateforme (pas deux comptes même email).
- Email vérifié peut être exigé pour certaines actions (politique produit : middleware `verified` sur zones sensibles).

## 7. Critères d’acceptation

- Un vendeur peut créer un compte avec nom de boutique et accéder à son espace après succès.
- Un client peut créer un compte et se connecter.
- Les champs obligatoires invalident le formulaire avec message compréhensible si données manquantes ou invalides.

## 8. Hors périmètre

OAuth tiers, SSO entreprise, magic link — traiter en évolution si besoin ([SPEC-06](./SPEC-06.md)).
