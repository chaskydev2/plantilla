<?php

namespace App\Http\Requests\Attribute;

use App\Models\AttributeModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttributeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo los administradores pueden crear atributos
        return $this->user() && $this->user()->hasRole('admin');
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
                'unique:attributes,name'
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000'
            ],
            'required_for' => [
                'required',
                'string',
                Rule::in([
                    AttributeModel::REQUIRED_FOR_CONTRACTOR,
                    AttributeModel::REQUIRED_FOR_HOMEOWNER,
                    AttributeModel::REQUIRED_FOR_BOTH
                ])
            ]
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del atributo es obligatorio.',
            'name.string' => 'El nombre del atributo debe ser una cadena de texto.',
            'name.max' => 'El nombre del atributo no puede tener más de 255 caracteres.',
            'name.unique' => 'Ya existe un atributo con este nombre.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'description.max' => 'La descripción no puede tener más de 1000 caracteres.',
            'required_for.required' => 'Debe especificar para quién es requerido el atributo.',
            'required_for.string' => 'El campo requerido para debe ser una cadena de texto.',
            'required_for.in' => 'El campo requerido para debe ser: contractor, homeowner o both.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'description' => 'descripción',
            'required_for' => 'requerido para'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Limpia y formatea el nombre
        if ($this->has('name')) {
            $this->merge([
                'name' => trim($this->name),
            ]);
        }

        // Limpia la descripción
        if ($this->has('description')) {
            $this->merge([
                'description' => trim($this->description) ?: null,
            ]);
        }
    }
}