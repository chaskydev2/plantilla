<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddSubcategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $parentId = $this->route('category');

        return [
            'subcategories' => [
                'required',
                'array',
                'min:1',
                'max:50', // Límite razonable para evitar operaciones masivas
            ],
            'subcategories.*' => [
                'required',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($parentId) {
                    // Verificar que no sea la misma categoría
                    if ($value == $parentId) {
                        $fail('Una categoría no puede ser subcategoría de sí misma.');
                    }

                    // Verificar que no sea un ancestro de la categoría padre
                    $parentCategory = \App\Models\Category::find($parentId);
                    if ($parentCategory && $parentCategory->ancestors()->where('id', $value)->exists()) {
                        $fail('No se puede agregar un ancestro como subcategoría.');
                    }

                    // Verificar que la categoría no tenga ya un padre
                    $subcategory = \App\Models\Category::find($value);
                    if ($subcategory && $subcategory->parent_id !== null) {
                        $fail("La categoría '{$subcategory->name}' ya tiene una categoría padre.");
                    }
                },
            ],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'subcategories' => 'subcategorías',
            'subcategories.*' => 'subcategoría',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'subcategories.required' => 'You must specify at least one subcategory.',
            'subcategories.array' => 'Subcategories must be sent as an array.',
            'subcategories.min' => 'You must specify at least one subcategory.',
            'subcategories.max' => 'You cannot add more than 50 subcategories at once.',
            'subcategories.*.required' => 'Each subcategory is required.',
            'subcategories.*.integer' => 'The subcategory ID must be a number.',
            'subcategories.*.exists' => 'One of the specified subcategories does not exist.',
        ];
    }
}