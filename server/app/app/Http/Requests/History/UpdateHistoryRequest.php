<?php

namespace App\Http\Requests\History;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHistoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required',
            'description' => 'nullable',
            'content' => 'nullable',
            'banner1' => 'sometimes|nullable|file|mimes:jpg,jpeg,png,webp|max:4096',
            'banner2' => 'sometimes|nullable|file|mimes:jpg,jpeg,png,webp|max:4096',
            'banner3' => 'sometimes|nullable|file|mimes:jpg,jpeg,png,webp|max:4096',
            'remove_banner1' => 'sometimes|boolean',
            'remove_banner2' => 'sometimes|boolean',
            'remove_banner3' => 'sometimes|boolean',
        ];
    }

    protected function prepareForValidation(): void
    {
        foreach (['banner1', 'banner2', 'banner3'] as $field) {
            $value = $this->input($field);
            if (is_string($value) && trim($value) === '') {
                $this->merge([$field => null]);
            }
        }
    }
}
