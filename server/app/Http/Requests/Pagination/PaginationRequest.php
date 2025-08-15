<?php

namespace App\Http\Requests\Pagination;

use Illuminate\Foundation\Http\FormRequest;

class PaginationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'page' => 'integer',
            'limit' => 'integer',
            'search' => 'nullable|string',
            'sortBy.sort' => 'nullable',
            'sortBy.order' => 'nullable',
        ];
    }
}
