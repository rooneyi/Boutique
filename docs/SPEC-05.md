# SPEC-05 — Module Administrateur

## 1. Objet du document

Spécifier les capacités de **supervision globale** : produits tous vendeurs, utilisateurs, analyses agrégées.

## 2. Références croisées

- Vision acteurs : [SPEC-01](./SPEC-01.md)
- Isolation vendeur vs vue admin : [SPEC-06](./SPEC-06.md)
- [AUDIT.md](./AUDIT.md) — qui peut agir sur les données sensibles

## 3. Périmètre fonctionnel

**Inclus :** vues consolidées, filtres sur l’inventaire, analyses temporelles, segmentation clients au niveau plateforme.

**Exclu :** modification métier fine des prix catalogue par produit si non prévu (sinon ajouter exigence ici).

## 4. Acteurs concernés

**Administrateur** de la plateforme uniquement.

## 5. Exigences fonctionnelles

### 5.1 Gestion globale des produits

- Voir **tous** les produits (tous vendeurs).
- Filtrer notamment :
  - **En stock**
  - **Rupture**
  - **Terminés** (produits désactivés / fin de vie)

### 5.2 Gestion des clients (vue plateforme)

- Liste **globale** des clients.
- Identification permettant au minimum :
  - Clients **fréquents** / **fidèles** (critère à définir : ex. nombre de commandes ou montant sur période glissante).
  - Clients **inactifs** (ex. sans commande depuis X mois ou jamais commandé).

### 5.3 Analyse des ventes

**Par période :** jour, semaine, mois, année.

**Indicateurs attendus :**

- Chiffre d’affaires total  
- Nombre de commandes  
- Panier moyen  

### 5.4 Analyses avancées (pilotage)

- Période ou plage avec le plus de ventes (ex. meilleure journée dans l’intervalle analysé).
- Produits les plus vendus (global).
- Clients les plus actifs (global).
- Produits en **rupture** avec **forte demande** (rupture + volume vendu sur période) pour anticiper réassort.

## 6. Règles et cas limites

- L’admin a une vue **transverse** ; il ne doit pas être confondu avec un vendeur sur les écrans de gestion boutique isolée.
- Les agrégations doivent être **cohérentes** avec les commandes enregistrées (pas de double comptage).

## 7. Critères d’acceptation

- Un administrateur accède aux écrans dédiés sans voir le périmètre « une seule boutique ».
- Les filtres produits (stock / rupture / terminés) sont testables sur des jeux de données connus.
- Les indicateurs de la section 5.3 sont calculables pour au moins une période de référence (ex. mois courant).

## 8. Hors périmètre / évolutions

Export BI externe, rapports PDF planifiés — [SPEC-06](./SPEC-06.md).
