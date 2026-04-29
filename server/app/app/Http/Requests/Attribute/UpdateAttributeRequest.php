<?php

namespace App\Http\Requests\Attribute;

use App\Models\AttributeModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttributeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo los administradores pueden actualizar atributos
        return $this->user() && $this->user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $attributeId = $this->route('attribute');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('attributes', 'name')->ignore($attributeId)
            ],
            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000'
            ],
            'required_for' => [
                'sometimes',
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
            'name.required' => 'The name is required.',
            'name.string' => 'The attribute name must be a string.',
            'name.max' => 'The attribute name cannot exceed 255 characters.',
            'name.unique' => 'An attribute with this name already exists.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description cannot exceed 1000 characters.',
            'required_for.required' => 'The required_for field is required.',
            'required_for.string' => 'The required_for field must be a string.',
            'required_for.in' => 'The required_for field must be one of: contractor, homeowner or both.'
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
        // Limpia y formatea el nombre si está presente
        if ($this->has('name')) {
            $this->merge([
                'name' => trim($this->name),
            ]);
        }

        // Limpia la descripción si está presente
        if ($this->has('description')) {
            $this->merge([
                'description' => trim($this->description) ?: null,
            ]);
        }
    }
}