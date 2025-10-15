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
            'subcategories.required' => 'Debe especificar al menos una subcategoría.',
            'subcategories.array' => 'Las subcategorías deben enviarse como un arreglo.',
            'subcategories.min' => 'Debe especificar al menos una subcategoría.',
            'subcategories.max' => 'No se pueden agregar más de 50 subcategorías a la vez.',
            'subcategories.*.required' => 'Cada subcategoría es obligatoria.',
            'subcategories.*.integer' => 'El ID de la subcategoría debe ser un número.',
            'subcategories.*.exists' => 'Una de las subcategorías especificadas no existe.',
        ];
    }
}