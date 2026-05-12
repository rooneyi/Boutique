# Documentation d’audit — Application Boutique (multi-vendeurs)

**Version du dépôt :** Laravel 13 · PHP ^8.3 · React / Inertia / Vite  
**Documents associés :** [SPEC-00.md](./SPEC-00.md) (index fonctionnel `SPEC-01` … `SPEC-06`), [ARCHITECTURE.md](./ARCHITECTURE.md)

Ce document s’adresse aux **auditeurs internes ou externes** (sécurité, conformité, maîtrise d’ouvrage). Il décrit le périmètre technique, les mesures de contrôle d’accès observées dans le code, et les **points de vigilance** à traiter dans un plan d’audit ou de mise en conformité.

---

## 1. Synthèse exécutive

| Domaine | Constats principaux |
|----------|---------------------|
| **Authentification** | Laravel Fortify (sessions web), mots de passe hashés (`hashed`), 2FA disponible côté utilisateur (trait Fortify). |
| **Autorisation** | Séparation par **rôle** (`ADMIN`, `VENDOR`, `CUSTOMER`) via middleware dédiés + **policies** sur `Order` et `Product`. |
| **Multi-tenant (vendeur)** | Données vendeur filtrées par `vendor_id` dans les services / contrôleurs ; produits liés à un vendeur. |
| **Paiement** | Les commandes sont créées avec un statut **PAID** sans passerelle de paiement réelle — **risque métier et conformité** à documenter explicitement. |
| **Données personnelles** | Comptes utilisateurs, emails, historique de commandes ; pas de trace dans ce dépôt d’une politique de rétention / export RGPD automatisée. |
| **Tests automatisés** | Suite Pest / PHPUnit présente ; en environnement de test SQLite `:memory:`, la présence des migrations et jeux de données conditionne la fiabilité des tests (à valider en CI). |

---

## 2. Périmètre applicatif

### 2.1 Objectif métier

Plateforme de **boutiques multi-vendeurs** : chaque vendeur gère ses produits et reçoit des commandes de clients ; un **administrateur** dispose d’une vue globale (produits, clients, vendeurs, analyses de ventes).

### 2.2 Utilisateurs et rôles

| Rôle | Modèle | Accès principal |
|------|--------|------------------|
| `ADMIN` | `User.role = ADMIN` | Préfixe `/admin/*` (dashboard, produits filtrés, utilisateurs, analytics). |
| `VENDOR` | `User.role = VENDOR` + enregistrement `Vendor` | Préfixe `/vendor/*` (produits CRUD, commandes, clients). |
| `CUSTOMER` | `User.role = CUSTOMER` + enregistrement `Customer` | Préfixe `/customer/*` (catalogue, détail produit, commandes). |

Le champ unique **`users.role`** (enum métier) est la source de vérité pour le RBAC côté middleware (`EnsureAdmin`, `EnsureVendor`, `EnsureCustomer`).

### 2.3 Surface d’attaque (routes web principales)

- **Public :** `/` (welcome), préfixes `/auth/*` (login, inscription vendeur/client, reset password).
- **Authentifié + vérifié email :** `/dashboard` (redirection selon rôle), zones `/vendor/*`, `/customer/*`, `/admin/*`.
- **Paramètres compte :** `/settings/*` (profil, sécurité, apparence) — voir `routes/settings.php`.
- **Santé :** `/up` (Laravel health).

---

## 3. Architecture technique (audit technique)

| Couche | Éléments |
|--------|----------|
| **HTTP** | `routes/web.php`, `routes/settings.php` ; contrôleurs par domaine (`Vendor`, `Customer`, `Settings`). |
| **Métier** | Services dans `app/Services/` (`AdminService`, `ProductService`, `OrderService`, `DashboardService`, etc.). |
| **Données** | Eloquent — modèles `User`, `Vendor`, `Customer`, `Product`, `Order`, `OrderItem`, `Category`, … |
| **UI** | Inertia.js + React (`resources/js/pages/...`), layouts par rôle (`admin-layout`, `vendor-layout`, `customer-layout`). |
| **Build** | Vite, Wayfinder pour les URLs typées côté TS (`resources/js/routes/`). |

---

## 4. Contrôle d’accès et isolation des données

### 4.1 Middleware

| Alias | Classe | Règle |
|-------|--------|--------|
| `admin` | `EnsureAdmin` | `auth()->user()->role === 'ADMIN'`. |
| `vendor` | `EnsureVendor` | Rôle `VENDOR`. |
| `customer` | `EnsureCustomer` | Rôle `CUSTOMER`. |

Les routes sensibles combinent **`auth`**, **`verified`** (email vérifié) et le middleware de rôle.

### 4.2 Policies enregistrées

Fichiers : `app/Policies/ProductPolicy.php`, `app/Policies/OrderPolicy.php`.

| Ressource | Règle métier (extrait code) |
|-----------|-----------------------------|
| **Product** | `update` / `delete` : uniquement le vendeur propriétaire (`product.vendor.user_id`). `view` : propriétaire ou admin. |
| **Order** | `view` : client propriétaire de la commande, vendeur de la boutique, ou admin. `create` : réservé au rôle client. `update` : vendeur de la commande. |

**Point d’audit :** vérifier que **tous** les points d’entrée sensibles appellent `authorize()` ou filtrent explicitement par `vendor_id` / `customer_id`. Les listes (ex. commandes vendeur) reposent sur des requêtes scoped ; les détails doivent rester alignés avec la policy.

### 4.3 Fiche client côté vendeur

L’accès à `vendor/customers/{customer}` est conditionné par l’existence d’au moins une commande liée (`vendor_id` + `customer_id`) — limitation d’exposition des profils clients.

---

## 5. Données sensibles et traitements

### 5.1 Données à caractère personnel (indicatif RGPD)

- Identité : `users.name`, `users.email`.
- Comportement d’achat : `orders`, `order_items`, lien `customer_id` / `vendor_id`.
- Données de boutique : `vendors.shop_name`.

**À prévoir en audit conformité :** registre des traitements, base légale, durée de conservation, droits d’accès/suppression, sous-traitants (hébergeur, email), DPA.

### 5.2 Fichiers

Images produits stockées via le disque **`public`** (chemins relatifs en base). **Contrôle d’audit :** droits sur le stockage, pas d’exposition de fichiers hors périmètre autorisé, sauvegardes.

### 5.3 Journalisation et traçabilité

Aucun module dédié **audit trail** (qui a modifié quoi, quand) n’est décrit dans le périmètre actuel du dépôt. À traiter si l’organisme impose la traçabilité des actions admin/vendeur.

---

## 6. Sécurité applicative (revue code)

| Sujet | État observé |
|-------|----------------|
| **Mots de passe** | Cast `hashed` sur `User` ; politique longueur à la création (ex. min 8 sur inscriptions dédiées). |
| **Sessions / cookies** | Middleware web Laravel ; cookies chiffrés sauf exceptions configurées (`appearance`, `sidebar_state`). |
| **CSRF** | Protection Laravel standard sur formulaires web ; endpoint JSON commande client à valider selon usage réel (fetch / Inertia). |
| **Validation** | Form Requests sur création commande, produits, etc. |
| **Rate limiting** | Ex. `throttle:6,1` sur mise à jour mot de passe (`settings.php`). |
| **En-têtes** | `AddLinkHeadersForPreloadedAssets` pour les assets préchargés. |

### 6.1 Comptes de démonstration (seed)

Le fichier `database/seeders/DatabaseSeeder.php` crée des utilisateurs avec mot de passe **`password`** (bcrypt) pour tests locaux.

**Recommandation audit :** interdire ces identifiants en production ; rotation ; variables d’environnement ou seed désactivé hors dev.

---

## 7. Processus métier critique : commande

1. Le client authentifié envoie une requête de création de commande (`POST customer/orders`).
2. Contrôleur : cohérence **une boutique** (`vendor_id`), stock, produit non `DISCONTINUED`.
3. `OrderService::createOrder` : transaction DB, création `orders` / `order_items`, **décrémentation du stock**.

**Écart majeur pour un audit financier :** statut **`PAID`** attribué sans preuve de paiement — à qualifier comme **simulation** ou à remplacer par un flux PSP (carte, Mobile Money, etc.) avant mise en production réglementée.

---

## 8. Inventaire fonctionnel par rôle (résumé)

| Zone | Fonctions |
|------|-----------|
| **Admin** | Dashboard, analyse des ventes (périodes), supervision produits (filtres stock / terminés), liste vendeurs et clients (segments type fidèle/inactif). |
| **Vendeur** | CRUD produits (dont statut « terminé »), commandes, clients et détail historique. |
| **Client** | Catalogue, fiche produit, création de commande, historique commandes. |

---

## 9. Dépendances et durcissement

- **Backend :** `laravel/framework`, `inertiajs/inertia-laravel`, `laravel/fortify`.
- **Frontend :** `@inertiajs/react`, React 19, Vite 8, Tailwind 4, Radix/shadcn patterns.

**Recommandations générales :** tenir à jour les dépendances, analyser `composer audit` / `npm audit`, activer une CI qui exécute tests + lint + build.

---

## 10. Liste de contrôle pour l’auditeur

- [ ] Confirmer la **politique de mot de passe** et la **2FA** obligatoire pour les comptes privilégiés (admin au minimum).
- [ ] Valider l’**absence de comptes seed** ou secrets par défaut en production.
- [ ] Vérifier la **documentation légale** (CGU, confidentialité) et le **registre RGPD**.
- [ ] Examiner le **modèle de paiement** : conformité PCI-DSS / PSP si carte ; trace comptable des commandes `PAID`.
- [ ] Contrôler les **sauvegardes** et la **restauration** de la base et des fichiers `storage`.
- [ ] Passer en revue les **logs serveur** (accès, erreurs) et la **rétention**.
- [ ] S’assurer que les **tests** couvrent au minimum les chemins d’autorisation critiques (policies + middleware).

---

## 11. Références de fichiers clés

| Fichier | Usage audit |
|---------|-------------|
| `routes/web.php` | Cartographie des routes et middlewares. |
| `bootstrap/app.php` | Enregistrement des alias middleware. |
| `app/Policies/*.php` | Règles d’autorisation fines. |
| `app/Services/OrderService.php` | Intégrité transactionnelle commande / stock. |
| `app/Http/Middleware/Ensure*.php` | Barrières par rôle. |
| `database/seeders/DatabaseSeeder.php` | Jeux de données et risques dev/demo. |

---

*Document généré pour faciliter les revues d’audit ; il ne remplace pas une analyse de risques organisationnelle ni une certification réglementaire.*
