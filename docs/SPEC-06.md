# SPEC-06 — Gestion des accès, isolation multi-boutiques et évolutions

## 1. Objet du document

Formaliser les règles d’**isolation des données** entre vendeurs, le rôle de l’**administrateur**, et tracer les **évolutions** volontairement hors périmètre des versions actuelles.

## 2. Références croisées

- Acteurs : [SPEC-01](./SPEC-01.md)
- Détail vendeur / client / admin : [SPEC-03](./SPEC-03.md), [SPEC-04](./SPEC-04.md), [SPEC-05](./SPEC-05.md)
- Contrôles techniques : [AUDIT.md](./AUDIT.md)

## 3. Périmètre fonctionnel

**Inclus :** principes d’accès par rôle, règles multi-tenant au niveau métier, liste des évolutions possibles.

**Exclu :** implémentation des politiques (fichiers middleware, policies — voir audit).

## 4. Acteurs concernés

Tous ; cette section est **transverse**.

## 5. Exigences fonctionnelles — Gestion des accès

### 5.1 Isolation multi-tenant (multi-boutiques)

- Les données sont **isolées par vendeur** pour tout ce qui concerne :
  - Les **produits** du vendeur  
  - Les **ventes** (commandes) de sa boutique  
  - Les **clients** tels qu’observés par le vendeur (clients ayant interagi avec sa boutique)

### 5.2 Rôle administrateur

- L’**administrateur** dispose d’une vue **globale** sur la plateforme (supervision, statistiques, listes consolidées — [SPEC-05](./SPEC-05.md)).

### 5.3 Cohérence

- Un vendeur **ne doit pas** accéder aux données d’un autre vendeur.
- Un client **ne doit voir** que ses propres commandes et le catalogue public.

## 6. Règles et cas limites

- Tout utilisateur doit être **authentifié** pour les espaces non publics (vendeur, client connecté, admin).
- Les actions sensibles (modification commande, annulation) suivent les règles métier et techniques définies en audit.

## 7. Critères d’acceptation

- Jeux de test : vendeur A ne récupère aucune donnée du vendeur B (produits, commandes, CA).
- Client C ne voit pas les commandes du client D.

## 8. Évolutions possibles (hors périmètre actuel documenté)

Les éléments suivants sont **explicitement** laissés pour des versions ultérieures ou des chantiers séparés :

- Paiement en ligne (Mobile Money, carte bancaire, …)  
- Notifications (SMS / Email)  
- Système de promotions / réductions  
- Livraison et suivi de colis  
- Système d’avis clients  
- Application mobile native  

Chaque évolution devrait donner lieu à un **nouveau lot** dans la série SPEC (ex. SPEC-07 Paiement) en suivant le modèle défini dans [SPEC-00](./SPEC-00.md).

## 9. Hors périmètre

Conformité RGPD détaillée, SLA, juridique contrats vendeurs — traiter avec [AUDIT.md](./AUDIT.md) et documents légaux externes.
