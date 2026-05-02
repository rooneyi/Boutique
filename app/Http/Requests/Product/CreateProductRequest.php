<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->input('category_id') === '' || $this->input('category_id') === null) {
            $this->merge(['category_id' => null]);
        }
    }

    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'VENDOR';
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0.01'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'status' => ['nullable', 'in:IN_STOCK,LOW_STOCK,OUT_OF_STOCK,DISCONTINUED'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du produit est requis',
            'price.required' => 'Le prix est requis',
            'price.numeric' => 'Le prix doit être un nombre',
            'stock.required' => 'Le stock est requis',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas',
            'image.image' => 'Le fichier doit être une image',
            'image.max' => 'L\'image ne doit pas dépasser 2MB',
        ];
    }
}
