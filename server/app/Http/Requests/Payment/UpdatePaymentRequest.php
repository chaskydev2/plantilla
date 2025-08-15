<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required',
            'amount' => 'required',
            'payment_type' => 'required',
            'payment_method' => 'required',
            'date' => 'nullable',
            'observation' => 'nullable',
        ];
    }
}
