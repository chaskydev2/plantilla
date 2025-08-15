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
            'role_id' => 'nullable|exists:roles,id',
            'edit_profile' => 'nullable|boolean',
        ];
    }
}
