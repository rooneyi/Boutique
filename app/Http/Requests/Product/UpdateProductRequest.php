<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'VENDOR';
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0.01'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'status' => ['sometimes', 'in:IN_STOCK,LOW_STOCK,OUT_OF_STOCK,DISCONTINUED'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'price.numeric' => 'Le prix doit être un nombre',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas',
            'image.image' => 'Le fichier doit être une image',
            'image.max' => 'L\'image ne doit pas dépasser 2MB',
        ];
    }
}
