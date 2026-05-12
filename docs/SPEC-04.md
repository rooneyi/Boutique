# SPEC-04 — Parcours Client (catalogue, achat, commandes)

## 1. Objet du document

Spécifier le parcours **client final** : découverte des produits, passage de commande, suivi des achats.

## 2. Références croisées

- Création de compte / connexion : [SPEC-02](./SPEC-02.md)
- Réalisation commande côté vendeur / stock : [SPEC-03](./SPEC-03.md)
- [AUDIT.md](./AUDIT.md) — modalités de paiement réelles vs statut commande

## 3. Périmètre fonctionnel

**Inclus :** navigation catalogue, fiche produit, panier / flux d’achat (selon implémentation), historique et détail de commande.

**Exclu :** marketplace multi-vendeurs dans un seul panier si le modèle impose « une boutique par commande » (à figer explicitement en règle métier).

## 4. Acteurs concernés

**Client** (utilisateur avec rôle client).

## 5. Exigences fonctionnelles

### 5.1 Découverte

- Parcourir les **produits** disponibles (hors produits retirés / terminés).
- Accéder à une **fiche produit** (informations nécessaires à la décision d’achat : prix, description, disponibilité, vendeur).

### 5.2 Achat

- **Acheter** des articles : sélection quantité, validation pour une boutique donnée (cohérence avec le modèle « une commande = un vendeur » si applicable).
- Création de compte si nécessaire ([SPEC-02](./SPEC-02.md)).

### 5.3 Suivi

- Consulter l’**historique des commandes**.
- Pour chaque commande : liste des lignes, montants, statut, date (alignement avec détails [SPEC-03](./SPEC-03.md) côté vendeur).

## 6. Règles et cas limites

- Stock insuffisant : la commande ne doit pas être validée ; message clair.
- Produit terminé ou indisponible : non achetable.
- Règle métier **paiement** : si la plateforme simule un paiement immédiat sans passerelle, le statut affiché doit être **cohérent** avec la politique commerciale annoncée (voir audit).

## 7. Critères d’acceptation

- Un client connecté voit uniquement **ses** commandes.
- Le catalogue n’affiche pas les produits volontairement retirés (terminés).
- Impossible de commander une quantité supérieure au stock affiché.

## 8. Hors périmètre / évolutions

Paiement en ligne réel, fidélité, wishlist — [SPEC-06](./SPEC-06.md).
