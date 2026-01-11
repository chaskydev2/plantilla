<?php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Contractor; // Importante
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contractor_id' => 'required|exists:users,id',
            'rating'        => 'required|integer|min:1|max:5',
            'comment'       => 'nullable|string|max:500',
        ]);

        if ($request->contractor_id == Auth::id()) {
             return response()->json(['message' => 'You cannot rate yourself.'], 403);
        }

        // 1. Crear o Actualizar la Review
        $review = Review::updateOrCreate(
            [
                'reviewer_id'   => Auth::id(),
                'contractor_id' => $request->contractor_id
            ],
            [
                'rating'  => $request->rating,
                'comment' => $request->comment ?? null
            ]
        );

        // 2. ACTUALIZAR EL PROMEDIO EN LA TABLA CONTRACTORS
        // Buscamos al contractor usando el user_id
        $contractor = Contractor::where('user_id', $request->contractor_id)->first();
        
        if ($contractor) {
            $contractor->updateAverageRating(); // Llamamos a la función que creamos en el modelo
        }

        return response()->json([
            'message' => 'Rating submitted successfully!',
            'data'    => $review
        ], 201);
    }
}