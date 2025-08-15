<?php
namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class SyncRolesRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name'
        ];
    }
}
