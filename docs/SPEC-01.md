# SPEC-01 — Vision produit, acteurs et contraintes transverses

## 1. Objet du document

Définir le **pourquoi** de l’application, les **rôles métier**, les **contraintes** communes à tous les modules et les **cas d’usage** synthétiques. Le détail par domaine est dans SPEC-02 à SPEC-06.

## 2. Références croisées

- [SPEC-00 — Cadre](./SPEC-00.md)
- Détail par acteur : [SPEC-03](./SPEC-03.md) (Vendeur), [SPEC-04](./SPEC-04.md) (Client), [SPEC-05](./SPEC-05.md) (Admin)
- [AUDIT.md](./AUDIT.md) pour les exigences non fonctionnelles et risques

## 3. Périmètre fonctionnel

**Inclus :** vision métier multi-vendeurs, description des trois acteurs, contraintes qualitatives (sécurité, perf, UX), scénarios utilisateur de haut niveau.

**Exclu :** détails d’écran, règles de validation champ par champ (voir SPEC thématiques).

## 4. Acteurs concernés

### Vendeur

- S’inscrire et se connecter.
- Gérer ses produits (CRUD).
- Consulter ses clients.
- Suivre ses ventes.
- Gérer son stock.

**Isolation :** un vendeur ne voit que **ses** articles, **ses** clients (au sens commandes passées chez lui), **ses** commandes.

### Client

- Parcourir les produits.
- Acheter des articles.
- Créer un compte.
- Consulter son historique de commandes.

### Administrateur

- Superviser toute la plateforme.
- Gérer les vendeurs (supervision).
- Analyser les ventes globales.
- Consulter les statistiques.
- Gérer les stocks au niveau **global** (vue transverse).

## 5. Objectif (vision produit)

L’application permet à **plusieurs vendeurs** de créer et gérer leur boutique de vêtements en ligne de manière **indépendante**, tout en offrant à un **administrateur** une vue globale pour le **pilotage**, l’**analyse des ventes** et la **gestion des données**.

## 6. Contraintes fonctionnelles transverses

- **Multi-boutiques (multi-vendeur)** : séparation claire des périmètres données par vendeur (voir aussi [SPEC-06](./SPEC-06.md)).
- **Sécurité des données** : contrôle d’accès par rôle ; pas d’accès croisé non autorisé entre vendeurs.
- **Performance** : chargement rapide des listes et tableaux de bord (objectif qualitatif ; métriques précises peuvent être ajoutées en phase projet).
- **Interface** : simple et intuitive pour vendeurs, clients et admin.

## 7. Cas d’utilisation principaux (synthèse)

> Détail complet et statut d’implémentation : **[cas-utilisation.md](./cas-utilisation.md)**.

### Vendeur

1. S’inscrire  
2. Ajouter des produits  
3. Gérer le stock  
4. Suivre les ventes  
5. Analyser ses clients  

### Client

1. S’inscrire  
2. Parcourir les produits  
3. Acheter  
4. Suivre ses commandes  

### Administrateur

1. Surveiller la plateforme  
2. Analyser les ventes  
3. Identifier les tendances  
4. Gérer les vendeurs et produits (supervision)  

## 8. Critères d’acceptation (niveau vision)

- Chaque utilisateur authentifié est orienté vers un **espace cohérent avec son rôle** (pas d’accès anonyme aux données d’un autre vendeur).
- Les trois familles d’acteurs ci-dessus sont documentées dans les SPEC détaillées sans contradiction.

## 9. Hors périmètre / évolutions

Report volontaire vers [SPEC-06](./SPEC-06.md) : paiement avancé, notifications, promos, livraison, avis, mobile natif.
