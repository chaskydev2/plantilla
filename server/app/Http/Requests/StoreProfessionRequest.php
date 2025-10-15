<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreProfessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     *
     * Genera un slug a partir del nombre si no se proporcionó uno,
     * y lo trunca a 255 caracteres para evitar errores de base de datos.
     */
    protected function prepareForValidation(): void
    {
        $name = $this->input('name');

        if ($name && !$this->filled('slug')) {
            $generated = Str::slug($name);
            // asegurar longitud máxima de 255 caracteres
            $generated = mb_substr($generated, 0, 255);
            $this->merge([
                'slug' => $generated,
            ]);
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
                Rule::unique('professions', 'name'),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('professions', 'slug'),
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string,string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'slug' => 'slug',
            'description' => 'descripción',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string,string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la profesión es obligatorio.',
            'name.unique' => 'Ya existe una profesión con este nombre.',
            'name.max' => 'El nombre no puede exceder los 255 caracteres.',
            'slug.unique' => 'Ya existe una profesión con este slug.',
            'slug.max' => 'El slug no puede exceder los 255 caracteres.',
            'description.max' => 'La descripción no puede exceder los 1000 caracteres.',
        ];
    }
}
