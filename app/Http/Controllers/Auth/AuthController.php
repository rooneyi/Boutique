<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterCustomerRequest;
use App\Http\Requests\Auth\RegisterVendorRequest;
use App\Services\AuthService;
use App\Services\CustomerService;
use App\Services\VendorService;
use App\Data\VendorRegisterData;
use App\Data\CustomerRegisterData;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService,
        private VendorService $vendorService,
        private CustomerService $customerService,
    ) {}

    public function registerVendor(RegisterVendorRequest $request)
    {
        $data = VendorRegisterData::from($request->validated());
        $vendor = $this->vendorService->register($data);

        return response()->json([
            'message' => 'Vendeur créé avec succès',
            'vendor' => $vendor,
        ], 201);
    }

    public function registerCustomer(RegisterCustomerRequest $request)
    {
        $data = CustomerRegisterData::from($request->validated());
        $customer = $this->customerService->register($data);

        return response()->json([
            'message' => 'Client créé avec succès',
            'customer' => $customer,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        if (!$this->authService->login($request->email, $request->password)) {
            return response()->json([
                'message' => 'Identifiants invalides',
            ], 401);
        }

        $user = $this->authService->getCurrentUser();

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $user->createToken('auth-token')->plainTextToken,
        ]);
    }

    public function logout()
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }
}
