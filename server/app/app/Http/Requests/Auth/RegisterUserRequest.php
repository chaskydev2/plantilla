<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role_ids' => 'required|array|min:1|max:2', // Nuevo: máximo 2 roles
            'role_ids.*' => 'exists:roles,id',
            'role_id' => 'nullable|exists:roles,id', // Mantener para compatibilidad
            'edit_profile' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'The name is required.',
            'first_name.string' => 'The name must be a string.',
            'first_name.max' => 'The name cannot exceed 255 characters.',
            
            'phone_number.required' => 'The phone number is required.',
            'phone_number.string' => 'The phone number must be a string.',
            'phone_number.max' => 'The phone number cannot exceed 20 characters.',
            
            'last_name.required' => 'The last name is required.',
            'last_name.string' => 'The last name must be a string.',
            'last_name.max' => 'The last name cannot exceed 255 characters.',
            
            'email.required' => 'The email is required.',
            'email.email' => 'The email must be a valid email address.',
            'email.unique' => 'This email is already registered.',
            
            'password.required' => 'The password is required.',
            'password.string' => 'The password must be a string.',
            'password.min' => 'The password must be at least 6 characters.',
            
            'role_ids.required' => 'You must select at least one role.',
            'role_ids.array' => 'The roles must be an array.',
            'role_ids.min' => 'You must select at least one role.',
            'role_ids.max' => 'You cannot select more than 2 roles.',
            'role_ids.*.exists' => 'One or more selected roles do not exist.',
            
            'role_id.exists' => 'The selected role does not exist.',
        ];
    }
}