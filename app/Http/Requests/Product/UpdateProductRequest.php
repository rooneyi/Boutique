<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('category_id') && ($this->input('category_id') === '' || $this->input('category_id') === null)) {
            $this->merge(['category_id' => null]);
        }
    }

    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'ADMIN';
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0.01'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'variants' => ['sometimes', 'array', 'min:1'],
            'variants.*.color' => ['required_with:variants', 'string', 'max:50'],
            'variants.*.color_hex' => ['nullable', 'string', 'max:7'],
            'variants.*.size' => ['required_with:variants', 'string', 'max:10'],
            'variants.*.sku' => ['nullable', 'string', 'max:80'],
            'variants.*.stock' => ['required_with:variants', 'integer', 'min:0'],
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
