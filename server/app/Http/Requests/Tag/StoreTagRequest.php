<?php

namespace App\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTagRequest extends FormRequest
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
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tags', 'name'),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('tags', 'slug'),
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
            'name.required' => 'The :attribute is required.',
            'name.string' => 'The :attribute must be a string.',
            'name.max' => 'The :attribute may not be greater than :max characters.',
            'name.unique' => 'The :attribute already exists.',
            'slug.string' => 'The :attribute must be a string.',
            'slug.max' => 'The :attribute may not be greater than :max characters.',
            'slug.unique' => 'The :attribute already exists.',
        ];
    }
}
