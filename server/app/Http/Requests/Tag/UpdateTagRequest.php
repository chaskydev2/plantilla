<?php

namespace App\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTagRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tagId = $this->route('tag'); // Obtiene el ID de la ruta

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tags', 'name')->ignore($tagId),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('tags', 'slug')->ignore($tagId),
            ],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'slug' => 'slug',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El :attribute es obligatorio.',
            'name.string' => 'El :attribute debe ser un texto.',
            'name.max' => 'El :attribute no puede tener más de :max caracteres.',
            'name.unique' => 'El :attribute ya existe.',
            'slug.string' => 'El :attribute debe ser un texto.',
            'slug.max' => 'El :attribute no puede tener más de :max caracteres.',
            'slug.unique' => 'El :attribute ya existe.',
        ];
    }
}
