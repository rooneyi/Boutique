# Documentation fonctionnelle  
## Application de gestion de boutique de vêtements en ligne

---

## Objectif

L’application permet à plusieurs vendeurs de créer et gérer leur boutique de vêtements en ligne de manière indépendante, tout en offrant à un administrateur une vue globale pour le pilotage, l’analyse des ventes et la gestion des données.

---

## Acteurs (Rôles)

### 1. Vendeur
- S’inscrire et se connecter
- Gérer ses produits (CRUD)
- Consulter ses clients
- Suivre ses ventes
- Gérer son stock

Un vendeur ne peut voir que ses propres données :
- ses articles  
- ses clients  
- ses commandes  

---

### 2. Client
- Parcourir les produits
- Acheter des articles
- Créer un compte
- Consulter son historique de commandes

---

### 3. Administrateur
- Superviser toute la plateforme
- Gérer les vendeurs
- Analyser les ventes globales
- Consulter les statistiques
- Gérer les stocks globaux

---

## Fonctionnalités principales

---

## 1. Authentification et inscription

### Vendeur
- Inscription avec :
  - Nom
  - Email
  - Mot de passe
  - Nom de boutique
- Connexion sécurisée

### Client
- Inscription simple
- Connexion

---

## 2. Gestion des produits (Vendeur)

Chaque vendeur peut :

- Ajouter un produit :
  - Nom
  - Description
  - Prix
  - Quantité en stock
  - Image
  - Catégorie

- Modifier un produit  
- Supprimer un produit  

### États du stock :
- En stock  
- Faible stock  
- Rupture de stock  
- Produit terminé (désactivé)  

---

## 3. Gestion des commandes et ventes

- Enregistrement des achats clients  
- Historique des commandes  

### Détails d’une commande :
- Produits achetés  
- Quantité  
- Prix total  
- Date  

---

## 4. Gestion des clients (Vendeur)

Chaque vendeur peut :
- Voir la liste de ses clients  
- Consulter :
  - Historique d’achat  
  - Fréquence d’achat  
  - Montant total dépensé  

---

## 5. Tableau de bord Vendeur

- Nombre total de ventes  
- Chiffre d’affaires  
- Produits les plus vendus  
- Clients fidèles  
- État du stock  

---

## 6. Module Administrateur

### Gestion globale des produits
- Voir tous les produits  
- Filtrer :
  - En stock  
  - Rupture  
  - Terminés  

---

### Gestion des clients
- Liste globale des clients  
- Identification des clients :
  - Fréquents (clients fidèles)  
  - Inactifs  

---

### Analyse des ventes

#### Par période :
- Jour  
- Semaine  
- Mois  
- Année  

#### Indicateurs :
- Chiffre d’affaires total  
- Nombre de commandes  
- Panier moyen  

---

### Analyses avancées

- Période avec le plus de ventes  
- Produits les plus vendus  
- Clients qui achètent le plus souvent  
- Produits en rupture fréquente  

---

## 7. Gestion des accès

- Isolation des données par vendeur (multi-tenant)  
- Un vendeur ne voit que :
  - ses produits  
  - ses ventes  
  - ses clients  

- L’administrateur voit tout  

---

## Contraintes fonctionnelles

- Multi-boutiques (multi-vendeur)  
- Sécurité des données  
- Performance (chargement rapide)  
- Interface simple et intuitive  

---

## Cas d’utilisation principaux

### Vendeur
1. S’inscrire  
2. Ajouter des produits  
3. Gérer le stock  
4. Suivre les ventes  
5. Analyser ses clients  

---

### Client
1. S’inscrire  
2. Parcourir les produits  
3. Acheter  
4. Suivre ses commandes  

---

### Administrateur
1. Surveiller la plateforme  
2. Analyser les ventes  
3. Identifier les tendances  
4. Gérer les vendeurs et produits  

---

## Évolutions possibles

- Paiement en ligne (Mobile Money, carte)  
- Notifications (SMS / Email)  
- Système de promotions / réductions  
- Livraison et suivi  
- Système d’avis clients  
- Application mobile  