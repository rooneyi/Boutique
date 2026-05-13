# SPEC-00 — Cadre du cahier des charges fonctionnel

Ce fichier est la **porte d’entrée** de la documentation fonctionnelle éclatée. Il fixe les **règles de nommage**, le **modèle de structure** commun aux autres fichiers `SPEC-*.md`, et renvoie vers le détail par domaine.

---

## 1. Documents du dossier `docs/` (rôles)

| Document | Rôle |
|----------|------|
| **SPEC-00.md** (ce fichier) | Index, conventions, sommaire des spécifications. |
| **SPEC-01 … SPEC-06** | Spécifications fonctionnelles détaillées par thème. |
| **ARCHITECTURE.md** | Principles techniques, couches, exemples de flux code (non fonctionnel détaillé). |
| **AUDIT.md** | Revue orientée audit (sécurité, conformité, risques). |
| **STYLE-VENDOR-FRONT.md** | Charte graphique de l’espace vendeur (police, titres, couleurs, boutons). |

Les SPEC décrivent le **quoi** (besoins métier) ; l’architecture et l’audit décrivent le **comment** ou les **contrôles** ; la charte vendeur décrit le **style UI** du périmètre vendeur.

---

## 2. Convention de nommage

| Fichier | Thème |
|---------|--------|
| `SPEC-00.md` | Cadre et index |
| `SPEC-01.md` | Vision produit, acteurs, contraintes transverses |
| `SPEC-02.md` | Authentification et inscription |
| `SPEC-03.md` | Parcours **Vendeur** (produits, stock, clients, tableau de bord) |
| `SPEC-04.md` | Parcours **Client** (catalogue, achat, commandes) |
| `SPEC-05.md` | Module **Administrateur** |
| `SPEC-06.md` | Accès, isolation multi-boutiques, évolutions |

Pour ajouter un nouveau lot fonctionnel : créer **`SPEC-07.md`** (ou suivant) en respectant la structure ci-dessous, puis **mettre à jour la table dans la section 4** de ce SPEC-00.

---

## 3. Structure type de chaque fichier `SPEC-NN.md`

Chaque spécification détaillée doit suivre ce squelette (adapter les sections vides si non pertinent) :

```markdown
# SPEC-NN — Titre du domaine

## 1. Objet du document
Brève description du périmètre et des lecteurs ciblés.

## 2. Références croisées
Liens vers SPEC-00, autres SPEC concernées, AUDIT si besoin.

## 3. Périmètre fonctionnel
Ce qui est inclus / exclu dans cette version.

## 4. Acteurs concernés
Rôles métier impactés (Vendeur, Client, Admin, …).

## 5. Exigences fonctionnelles
Listes, règles métier, états, données manipulées.

## 6. Règles et cas limites
Erreurs attendues, priorités, dépendances avec d’autres modules.

## 7. Critères d’acceptation (tests métier)
Formulations vérifiables du type « étant donné… lorsque… alors… ».

## 8. Hors périmètre / évolutions
Ce qui est volontairement reporté ou dans SPEC-06.
```

Les sections peuvent être fusionnées si le document reste court, mais **l’objet**, **le périmètre** et **les critères d’acceptation** doivent rester identifiables.

---

## 4. Sommaire des spécifications (liens)

| ID | Fichier | Contenu résumé |
|----|---------|----------------|
| SPEC-01 | [SPEC-01.md](./SPEC-01.md) | Objectif, acteurs, contraintes fonctionnelles communes |
| SPEC-02 | [SPEC-02.md](./SPEC-02.md) | Connexion, inscription vendeur et client |
| SPEC-03 | [SPEC-03.md](./SPEC-03.md) | Vendeur : produits, stock, clients, tableau de bord |
| SPEC-04 | [SPEC-04.md](./SPEC-04.md) | Client : catalogue, achat, historique commandes |
| SPEC-05 | [SPEC-05.md](./SPEC-05.md) | Administrateur : supervision, filtres, analyses |
| SPEC-06 | [SPEC-06.md](./SPEC-06.md) | Multi-tenant, gestion des accès, évolutions possibles |

---

## 5. Alignement avec la documentation fonctionnelle historique

Le contenu qui vivait auparavant dans un **seul** fichier « documentation fonctionnelle » monolithique a été **réparti** dans SPEC-01 à SPEC-06. En cas de divergence entre anciennes captures et ce dépôt, **priorité aux fichiers `SPEC-*.md` versionnés dans Git**.

---

## 6. Glossaire minimal (commun à tous les SPEC)

| Terme | Définition |
|-------|------------|
| **Multi-boutiques / multi-vendeur** | Plusieurs vendeurs indépendants sur une même plateforme ; isolation des données par vendeur. |
| **Produit terminé** | Produit retiré du catalogue client (`DISCONTINUED` ou équivalent métier). |
| **Commande** | Enregistrement d’un achat client auprès d’une boutique (un vendeur par commande dans le modèle actuel). |

---

*Dernière intention rédactionnelle : garder SPEC-00 stable (cadre) et faire évoluer le détail dans SPEC-01 … SPEC-06.*
