# Architecture de l'Application - Séparation des Responsabilités

## 📋 Structure Global

```
app/
├── Data/                      # DTOs (Data Transfer Objects)
├── Services/                  # Logique métier
├── Http/
│   ├── Controllers/          # Points d'entrée
│   │   ├── Auth/
│   │   ├── Vendor/
│   │   ├── Customer/
│   │   └── Admin/
│   └── Requests/             # Form Requests (Validation)
│       ├── Auth/
│       ├── Product/
│       └── Order/
├── Models/                    # Modèles Eloquent
└── Policies/                  # Politiques d'autorisation
```

---

## 🔄 Flux de Données

```
HTTP Request
   ↓
Form Request (Validation)
   ↓
Controller (Point d'entrée)
   ↓
Service (Logique métier)
   ↓
Model (Base de données)
   ↓
DTO (Retour de données)
   ↓
HTTP Response (JSON)
```

---

## 💾 DTOs (app/Data)

**Responsabilité**: Transfert de données entre les couches

### Exemples:
- `VendorRegisterData` - Données d'inscription vendeur
- `ProductData` - Données de produit
- `OrderData` - Données de commande
- `CustomerRegisterData` - Données d'inscription client

```php
// Utilisation dans un Service
$data = ProductData::from($request->validated());
$product = $this->productService->createProduct($data);
```

---

## 🛠️ Services (app/Services)

**Responsabilité**: Logique métier isolée et réutilisable

### Services disponibles:
- `VendorService` - Inscription vendeur, stats vendeur
- `ProductService` - CRUD produits, gestion stock
- `OrderService` - Création commandes, historique
- `CustomerService` - Inscription client, stats client
- `AuthService` - Authentification
- `DashboardService` - Tableaux de bord
- `AdminService` - Gestion admin

```php
// Utilisation dans un Controller
public function store(CreateProductRequest $request)
{
    $data = ProductData::from($request->validated());
    $product = $this->productService->createProduct(
        auth()->user(),
        $data,
        $request->file('image')
    );
    
    return response()->json([ 'data' => $product ], 201);
}
```

---

## ✅ Form Requests (app/Http/Requests)

**Responsabilité**: Validation des données entrantes

### Exemples:
- `RegisterVendorRequest` - Validation inscription vendeur
- `CreateProductRequest` - Validation création produit
- `UpdateProductRequest` - Validation mise à jour produit
- `CreateOrderRequest` - Validation création commande
- `LoginRequest` - Validation connexion

```php
// Dans le Form Request
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ];
}
```

---

## 🎮 Controllers (app/Http/Controllers)

**Responsabilité**: Point d'entrée, orchestration

### Structure par rôle:
- `Auth/AuthController` - Authentification
- `Vendor/ProductController` - Gestion produits vendeur
- `Vendor/DashboardController` - Tableau de bord vendeur
- `Customer/OrderController` - Gestion commandes client
- `Customer/DashboardController` - Tableau de bord client
- `Admin/DashboardController` - Tableau de bord admin
- `Admin/ProductController` - Supervision produits
- `Admin/UserController` - Gestion vendeurs/clients

```php
// Les controllers sont minimalistes
public function store(CreateProductRequest $request)
{
    $data = ProductData::from($request->validated());
    $product = $this->productService->createProduct(
        auth()->user(), 
        $data,
        $request->file('image')
    );
    
    return response()->json([ 'data' => $product ], 201);
}
```

---

## 🔐 Avantages de cette Architecture

✅ **Séparation des responsabilités** - Chaque classe a une mission unique
✅ **Testabilité** - Services faciles à tester isolément
✅ **Réutilisabilité** - Services utilisables par plusieurs controllers
✅ **Maintenabilité** - Code organisé et facile à comprendre
✅ **Extensibilité** - Facile d'ajouter de nouvelles fonctionnalités
✅ **Multi-tenant** - Isolation des données par vendeur

---

## 📝 Exemple Complet: Créer un Produit

### 1️⃣ Form Request (Validation)
```php
// app/Http/Requests/Product/CreateProductRequest.php
public function rules(): array {
    return [
        'name' => ['required', 'string'],
        'price' => ['required', 'numeric', 'min:0.01'],
        // ...
    ];
}
```

### 2️⃣ Controller (Point d'entrée)
```php
// app/Http/Controllers/Vendor/ProductController.php
public function __construct(private ProductService $service) {}

public function store(CreateProductRequest $request) {
    $data = ProductData::from($request->validated());
    $product = $this->service->createProduct(
        auth()->user(),
        $data,
        $request->file('image')
    );
    return response()->json($product, 201);
}
```

### 3️⃣ DTO (Transfert)
```php
// app/Data/ProductData.php
public function __construct(
    public string $name,
    public float $price,
    // ...
) {}
```

### 4️⃣ Service (Logique)
```php
// app/Services/ProductService.php
public function createProduct(User $vendor, ProductData $data, ?UploadedFile $image = null): Product {
    $imagePath = $image?->store('products', 'public');
    
    return Product::create([
        'vendor_id' => $vendor->id,
        'name' => $data->name,
        'price' => $data->price,
        'image_path' => $imagePath,
    ]);
}
```

### 5️⃣ Model (Base de données)
```php
// app/Models/Product.php
$product = Product::where('vendor_id', $vendor->id)->first();
```

---

## 🚀 Prochaines Étapes

- [ ] Créer les Models (Product, Order, Shop, etc.)
- [ ] Ajouter les Policies d'autorisation
- [ ] Configurer les routes
- [ ] Créer les migrations de base de données
- [ ] Mettre en place les tests unitaires
