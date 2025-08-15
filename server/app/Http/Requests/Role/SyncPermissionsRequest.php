<?php
namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SyncPermissionsRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name'
        ];
    }
}
