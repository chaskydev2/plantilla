<?php

namespace App\Http\Resources\Payment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'Payments retrieved successfully',
            'data' => $this->collection,
            'meta' => [
                'pagination' => [
                    'total' => $this->total(),
                    'count' => $this->count(),
                    'per_page' => $this->perPage(),
                    'current_page' => $this->currentPage(),
                    'total_pages' => $this->lastPage(),
                ],
            ],
        ];
    }
    public function toResponse($request)
    {
        return response()->json($this->toArray($request));
    }

}
