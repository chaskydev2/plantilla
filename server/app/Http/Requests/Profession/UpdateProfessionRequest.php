<?php

namespace App\Http\Requests\Profession;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use App\Models\Profession;

class UpdateProfessionRequest extends FormRequest
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
        if ($this->filled('name') && !$this->filled('slug')) {
            $this->merge([
                'slug' => Str::slug($this->name),
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
        // Accept route param as model, id or slug (route name may be 'profession' or 'id')
        $routeParam = $this->route('profession') ?? $this->route('id');

        if ($routeParam instanceof Profession) {
            $professionId = $routeParam->id;
        } elseif (is_numeric($routeParam)) {
            $professionId = (int) $routeParam;
        } elseif (is_string($routeParam)) {
            $professionId = Profession::where('slug', $routeParam)->value('id');
        } else {
            $professionId = null;
        }

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('professions', 'name')->ignore($professionId)
            ],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('professions', 'slug')->ignore($professionId)
            ],
            'icon' => ['sometimes', 'nullable', 'string', 'max:255'],
            'image' => ['sometimes', 'nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'remove_image' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string', 'max:1000'],
            'service_id' => ['sometimes', 'required', 'integer', 'exists:services,id'],
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
            'description' => 'descripción',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The profession name is required.',
            'name.unique' => 'A profession with this name already exists.',
            'name.max' => 'The name may not exceed 255 characters.',
            'slug.unique' => 'A profession with this slug already exists.',
            'slug.max' => 'The slug may not exceed 255 characters.',
            'description.max' => 'The description may not exceed 1000 characters.',
        ];
    }
}