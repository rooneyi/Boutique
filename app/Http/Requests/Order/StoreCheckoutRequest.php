<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'CUSTOMER';
    }

    public function rules(): array
    {
        return [
            'shipping_full_name' => ['required', 'string', 'max:255'],
            'shipping_whatsapp' => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'shipping_city' => ['required', 'string', 'max:120'],
            'shipping_district' => ['required', 'string', 'max:120'],
            'payment_method' => ['required', Rule::in(['mobile_money', 'cash_on_delivery'])],
            'customer_note' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'shipping_full_name.required' => 'Indiquez votre nom complet.',
            'shipping_whatsapp.required' => 'Indiquez votre numéro WhatsApp.',
            'shipping_address.required' => 'Indiquez votre adresse complète.',
            'shipping_city.required' => 'Indiquez votre ville ou commune.',
            'shipping_district.required' => 'Indiquez votre quartier.',
            'payment_method.required' => 'Choisissez un mode de paiement.',
        ];
    }
}
