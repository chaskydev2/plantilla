<?php

namespace App\Http\Resources\Contact;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
        'id' => $this->id,
        'address'=>$this->address,
        'mobile_number'=>$this->mobile_number,
        'phone_number'=>$this->phone_number,
        'email'=>$this->email,
        'business_hours'=>$this->business_hours,
        ];
    }
}
