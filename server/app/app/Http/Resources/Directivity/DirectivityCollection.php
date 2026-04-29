<?php

namespace App\Http\Resources\Directivity;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class DirectivityCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'Directivity retrieved successfully',
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
