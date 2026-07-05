<?php

namespace App\Http\Requests\Order;

use App\Rules\ValidPhoneNumber;
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
        $isPickup = $this->input('delivery_method') === 'store_pickup';

        return [
            'delivery_method' => ['required', Rule::in(['home_delivery', 'store_pickup'])],
            'shipping_full_name' => ['required', 'string', 'max:255'],
            'shipping_whatsapp' => ['required', 'string', new ValidPhoneNumber],
            'shipping_address' => [$isPickup ? 'nullable' : 'required', 'string', 'max:500'],
            'shipping_city' => [$isPickup ? 'nullable' : 'required', 'string', 'max:120'],
            'shipping_district' => [$isPickup ? 'nullable' : 'required', 'string', 'max:120'],
            'payment_method' => ['required', Rule::in(['mobile_money', 'cash_on_delivery'])],
            'payment_provider' => ['nullable', Rule::in(['airtel', 'orange', 'mpesa', 'card'])],
            'payment_phone' => [
                Rule::requiredIf(fn () => $this->input('payment_method') === 'mobile_money'
                    && in_array($this->input('payment_provider'), ['airtel', 'orange', 'mpesa'], true)),
                'nullable',
                'string',
                new ValidPhoneNumber,
            ],
            'customer_note' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'delivery_method.required' => 'Choisissez un mode de livraison.',
            'shipping_full_name.required' => 'Indiquez votre nom complet.',
            'shipping_whatsapp.required' => 'Indiquez votre numéro WhatsApp.',
            'shipping_address.required' => 'Indiquez votre adresse complète.',
            'shipping_city.required' => 'Indiquez votre ville ou commune.',
            'shipping_district.required' => 'Indiquez votre quartier.',
            'payment_method.required' => 'Choisissez un mode de paiement.',
            'payment_phone.required' => 'Indiquez le numéro Mobile Money utilisé pour le paiement.',
        ];
    }
}
