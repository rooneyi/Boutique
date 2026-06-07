<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = $this->profileRules($this->user()->id);
        $rules['avatar'] = ['nullable', 'image', 'max:2048'];
        $rules['remove_avatar'] = ['sometimes', 'boolean'];

        if ($this->user()->role === 'CUSTOMER') {
            $rules['phone'] = ['nullable', 'string', 'max:50'];
        }

        return $rules;
    }
}
