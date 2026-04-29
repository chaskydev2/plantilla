<?php

namespace App\Http\Requests\ContractorTeamMember;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContractorTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'leader_user_id' => ['required', 'integer', 'exists:contractors,user_id'],
            'member_user_id' => [
                'required',
                'integer',
                'different:leader_user_id',
                'exists:contractors,user_id',
                Rule::unique('contractor_team_members', 'member_user_id')->where(function ($query) {
                    return $query->where('leader_user_id', $this->input('leader_user_id'));
                }),
            ],
            'status' => ['nullable', 'in:pending,active,inactive'],
            'compania' => ['nullable', 'string', 'max:255'],
        ];
    }
}
