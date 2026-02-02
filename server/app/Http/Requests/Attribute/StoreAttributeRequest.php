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
            'name.required' => 'The attribute name is required.',
            'name.string' => 'The attribute name must be a string.',
            'name.max' => 'The attribute name may not be greater than 255 characters.',
            'name.unique' => 'An attribute with this name already exists.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description may not be greater than 1000 characters.',
            'required_for.required' => 'You must specify for whom the attribute is required.',
            'required_for.string' => 'The required for field must be a string.',
            'required_for.in' => 'The required for field must be: contractor, homeowner or both.'
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