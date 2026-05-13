# Charte graphique — Espace vendeur (front)

Document de référence pour l’UI **vendeur uniquement** (`vendor-layout` et pages sous `/vendor/*`). Les autres espaces (client, admin, auth) ne sont pas concernés sauf décision contraire.

---

## 1. Police

| Usage | Valeur |
|--------|--------|
| Famille | **Poppins** (Google / Fontsource), système de secours : `ui-sans-serif, system-ui, sans-serif` |
| Corps de texte | Poppins, taille par contexte (souvent 16 px pour le courant) |

Fichiers techniques : import `@fontsource/poppins` dans `resources/css/app.css`, utilitaire Tailwind `font-poppins` sur le conteneur `.vendor-ui`.

---

## 2. Hiérarchie typographique

| Élément | Taille | Graisse | Couleur | Remarques |
|---------|--------|----------|---------|------------|
| **H1** | **86 px** | **Ultra bold** | Noir (`#000000`) | Titres d’écran principaux. En responsive, le code utilise un `clamp` pour éviter le débordement tout en visant **86 px** sur grands écrans. Graisse équivalente **`font-black` (900)** ou **`font-extrabold` (800)** selon chargement des fichiers — **900** retenu si disponible. |
| **H2** | *Non précisé dans la consigne initiale* | — | Noir | Valeur **provisoire** appliquée dans l’espace vendeur : **52 px**, `font-semibold` (600). **À valider** avec le produit / design. |
| **H3** | **36 px** | **Semi bold** (600) | Noir | Exemples : libellés de type « Catégorie », « Produits populaires », titres de blocs forts. |
| **H4** | **20 px** | **Semi bold** (600) | **Gris `#747474`** | Sous-titres, titres de cartes secondaires, légendes de section. |

---

## 3. Navigation type « vitrine » (liens texte)

Liens : **Accueil**, **Collection**, **À propos**, **Contact**

| Propriété | Valeur |
|-----------|--------|
| Taille | **16 px** |
| Graisse | **Regular** (400) |
| Couleur | Noir par défaut ; survol / actif : bleu charte `#0059DD` |

Mapping actuel dans l’app vendeur :

| Libellé | Route / action |
|---------|------------------|
| Accueil | Tableau de bord vendeur |
| Collection | Liste des produits (catalogue vendeur) |
| À propos | Paramètres du compte / profil |
| Contact | Lien `mailto:` (adresse à configurer côté déploiement) |

---

## 4. Boutons (actions principales)

| Type | Taille | Graisse | Couleur |
|------|--------|---------|---------|
| **Bouton principal** (CTA : « Nouveau produit », « Ajouter un produit », soumission formulaire, etc.) | **18 px** | Semi bold recommandé | Fond **#0059DD**, texte **blanc** ; survol légèrement plus foncé |

Les liens de navigation (§3) ne sont **pas** des boutons 18 px : ils restent en **16 px regular**.

---

## 5. Couleurs

| Nom | Hex | Usage |
|-----|-----|--------|
| Noir | `#000000` | Texte principal, titres H1–H3 |
| Blanc | `#FFFFFF` | Fonds, texte sur bouton bleu |
| Bleu (primaire) | **`#0059DD`** | Liens actifs / survol, boutons primaires, accents |
| Gris | **`#747474`** | Texte secondaire, H4, descriptions |

Éviter d’introduire d’autres couleurs de marque dans l’espace vendeur sans mise à jour de ce document.

---

## 6. Implémentation (code)

| Fichier | Rôle |
|---------|------|
| `resources/css/app.css` | Import Poppins (`400`, `600`, `900`), variables `--font-poppins` dans `@theme` et **`@theme inline`** (pour la classe Tailwind `font-poppins`). |
| `resources/js/lib/vendor-ui-styles.ts` | Constantes de classes Tailwind (`VENDOR_H1`, `VENDOR_NAV_LINK`, `VENDOR_BTN_PRIMARY`, `VENDOR_CARD`, …). |
| `resources/js/layouts/vendor-layout.tsx` | En-tête : liens Accueil / Collection / À propos / Contact ; sous-navigation métier ; menu mobile avec pied (profil + déconnexion). |
| `resources/js/pages/vendor/*.tsx` | Pages alignées sur les tokens ci-dessus. |

---

## 7. Suivi des écarts

- **H2** : à confirmer avec le commanditaire (taille / graisse exactes).
- **Contact** : URL `mailto:` à remplacer par l’adresse support réelle en production.

---

*Document aligné sur les consignes « à la lettre » fournies ; les seules dérogations explicites sont le H2 non fourni et le `clamp` sur le H1 pour le mobile.*
