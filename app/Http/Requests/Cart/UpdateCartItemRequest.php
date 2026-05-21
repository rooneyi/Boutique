<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->role === 'CUSTOMER';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'quantity' => ['required', 'integer', 'min:0', 'max:999'],
            'variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
        ];
    }
}
