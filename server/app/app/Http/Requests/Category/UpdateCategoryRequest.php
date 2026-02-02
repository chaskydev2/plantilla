<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $name = $this->input('name');

        // Solo generar slug si se proporciona nombre y no se incluye slug
        if ($name && !$this->filled('slug')) {
            $generated = Str::slug($name);
            // Asegurar longitud máxima de 255 caracteres
            $generated = mb_substr($generated, 0, 255);
            $this->merge([
                'slug' => $generated,
            ]);
        }

        // Si se proporciona parent_id como 0, string vacío o texto indicando sin padre, convertir a null
        if ($this->has('parent_id') && (
            $this->parent_id === '0' || 
            $this->parent_id === '' || 
            $this->parent_id === 0 ||
            $this->parent_id === 'No Parent Category (Root)' ||
            $this->parent_id === 'null' ||
            $this->parent_id === 'undefined'
        )) {
            $this->merge(['parent_id' => null]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category') ? $this->route('category')->id : null;

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($categoryId),
            ],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($categoryId),
            ],
            'parent_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($categoryId) {
                    // Prevenir ciclos infinitos
                    if ($value && $categoryId && $value == $categoryId) {
                        $fail('Una categoría no puede ser padre de sí misma.');
                    }

                    // Prevenir que una categoría se convierta en padre de sus ancestros
                    if ($value && $categoryId) {
                        $this->checkForCircularReference($value, $categoryId, $fail);
                    }
                },
            ],
            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],
            'icon' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }

    /**
     * Verifica si crear la relación padre-hijo causaría un ciclo infinito
     */
    protected function checkForCircularReference($parentId, $currentId, $fail)
    {
        $category = \App\Models\Category::find($parentId);
        
        if (!$category) {
            return;
        }

        // Recorrer hacia arriba en la jerarquía para verificar si el currentId aparece
        $visited = [];
        $current = $category;

        while ($current && !in_array($current->id, $visited)) {
            $visited[] = $current->id;

            if ($current->id == $currentId) {
                $fail('No se puede crear una referencia circular en la jerarquía de categorías.');
                return;
            }

            $current = $current->parent;
        }
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'slug' => 'slug',
            'parent_id' => 'categoría padre',
            'description' => 'descripción',
            'icon' => 'icono',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name is required.',
            'name.unique' => 'A category with this name already exists.',
            'name.max' => 'The name cannot exceed 255 characters.',
            'slug.unique' => 'A category with this slug already exists.',
            'slug.max' => 'The slug cannot exceed 255 characters.',
            'parent_id.exists' => 'The selected parent category does not exist.',
            'parent_id.integer' => 'The parent category ID must be a number.',
            'description.max' => 'The description cannot exceed 1000 characters.',
            'icon.max' => 'The icon cannot exceed 255 characters.',
        ];
    }
}