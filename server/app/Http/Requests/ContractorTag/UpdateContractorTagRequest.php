<?php

namespace App\Http\Requests\ContractorTag;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContractorTagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contractor_user_id' => ['required', 'integer', 'exists:contractors,user_id'],
            'tag_id' => ['required', 'integer', 'exists:contractor_tag,tag_id'],
            'new_tag_id' => [
                'required',
                'integer',
                'exists:tags,id',
                Rule::unique('contractor_tag', 'tag_id')->where(function ($query) {
                    return $query->where('contractor_user_id', $this->input('contractor_user_id'));
                }),
            ],
        ];
    }
}
