<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users,email,' . $this->route('user'),
            'password' => 'nullable|min:5',
            'role_ids' => 'required|array|min:1|max:5', // Nuevo: máximo 2 roles
            'role_ids.*' => 'exists:roles,id',
            'role_id' => 'nullable|exists:roles,id', // Mantener para compatibilidad
            'edit_profile' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'role_ids.required' => 'You must select at least one role.',
            'role_ids.max' => 'You cannot select more than 2 roles.',
            'role_ids.*.exists' => 'One or more selected roles do not exist.',
        ];
    }
}
