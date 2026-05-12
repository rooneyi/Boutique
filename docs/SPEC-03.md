# SPEC-03 — Parcours Vendeur (produits, stock, clients, tableau de bord)

## 1. Objet du document

Spécifier les fonctionnalités **côté vendeur** : catalogue produits de la boutique, états de stock, relation clients, indicateurs du tableau de bord.

## 2. Références croisées

- [SPEC-01](./SPEC-01.md) isolation vendeur · [SPEC-06](./SPEC-06.md) multi-tenant
- Client acheteur : [SPEC-04](./SPEC-04.md)

## 3. Périmètre fonctionnel

**Inclus :** CRUD produits, attributs produit, états de stock métier, liste et détail clients (agrégés depuis les commandes), vue synthétique ventes / stocks.

**Exclu :** paramétrage fiscal, multi-devises, intégration transporteur.

## 4. Acteurs concernés

**Vendeur** uniquement sur ses propres données.

## 5. Exigences fonctionnelles

### 5.1 Gestion des produits (CRUD)

Chaque vendeur peut :

**Ajouter un produit** avec :

- Nom  
- Description  
- Prix  
- Quantité en stock  
- Image  
- Catégorie  

**Modifier** ou **supprimer** un produit existant.

### 5.2 États du stock (règles métier)

| État métier | Interprétation attendue |
|-------------|-------------------------|
| En stock | Quantité suffisante (seuil « normal » défini en implémentation, ex. ≥ 10 unités). |
| Faible stock | Quantité au-dessus de zéro mais sous un seuil d’alerte. |
| Rupture de stock | Quantité nulle. |
| Produit terminé | Produit **désactivé** volontairement pour le catalogue (fin de série / retrait). |

### 5.3 Commandes et ventes

- Enregistrement des achats clients **chez ce vendeur** (voir flux commande [SPEC-04](./SPEC-04.md)).
- Historique des commandes avec détails :
  - Produits achetés  
  - Quantité  
  - Prix total  
  - Date  

### 5.4 Clients (vue vendeur)

Pour les clients ayant commandé chez le vendeur :

- Liste des clients  
- Par client : **historique d’achat**, **fréquence** (nombre de commandes ou périodicité), **montant total dépensé** chez ce vendeur  

### 5.5 Tableau de bord vendeur

Indicateurs attendus :

- Nombre total de ventes (ou commandes — préciser alignement métier)  
- Chiffre d’affaires  
- Produits les plus vendus  
- Clients fidèles (top par CA ou fréquence)  
- État du stock (alertes faible stock / rupture)  

## 6. Règles et cas limites

- Un vendeur **ne voit pas** les produits ou commandes d’un autre vendeur.
- Un produit « terminé » ne doit plus être vendable côté client (cohérence catalogue).

## 7. Critères d’acceptation

- CRUD produit limité aux produits du vendeur connecté.
- Tableau de bord affiche des indicateurs cohérents avec les commandes réelles du vendeur.
- Liste clients dérivée des commandes du vendeur ; détail commande exploitable pour support client.

## 8. Hors périmètre / évolutions

Promotions, bundles, gestion avancée des retours — [SPEC-06](./SPEC-06.md).
