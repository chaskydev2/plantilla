<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'role_ids' => 'required|array|min:1|max:2', // Nuevo: máximo 2 roles
            'role_ids.*' => 'exists:roles,id',
            'role_id' => 'nullable|exists:roles,id', // Mantener para compatibilidad
            'edit_profile' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'role_ids.required' => 'Debe seleccionar al menos un rol.',
            'role_ids.max' => 'No puede seleccionar más de 2 roles.',
            'role_ids.*.exists' => 'Uno o más roles seleccionados no existen.',
        ];
    }
}
