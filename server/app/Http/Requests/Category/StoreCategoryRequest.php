<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name'),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories', 'slug'),
            ],
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    // Prevenir ciclos infinitos - una categoría no puede ser padre de sí misma
                    if ($value && $this->route('category') && $value == $this->route('category')) {
                        $fail('Una categoría no puede ser padre de sí misma.');
                    }
                },
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'icon' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
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
            'name.required' => 'The category name is required.',
            'name.unique' => 'A category with this name already exists.',
            'name.max' => 'The name may not exceed 255 characters.',
            'slug.unique' => 'A category with this slug already exists.',
            'slug.max' => 'The slug may not exceed 255 characters.',
            'parent_id.exists' => 'The selected parent category does not exist.',
            'parent_id.integer' => 'The parent category ID must be a number.',
            'description.max' => 'The description may not exceed 1000 characters.',
            'icon.max' => 'The icon may not exceed 255 characters.',
        ];
    }
}