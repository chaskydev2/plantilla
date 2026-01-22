<?php

namespace App\Http\Resources\Payment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'amount' => $this->amount,
            'payment_type' => $this->payment_type,
            'payment_month' => $this->payment_month,
            'payment_method' => $this->payment_method,
            'payment_year' => $this->payment_year,
            'observation' => $this->observation,
            'user' => $this->user,
            
        ];
    }
}
