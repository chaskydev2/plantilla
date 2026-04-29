<?php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Contractor;
use App\Models\HomeownerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Crear o actualizar una calificación de un HomeownerProfile a un Contractor
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contractor_id' => 'required|exists:contractors,user_id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $homeownerUserId = Auth::id();

        // Verificar que el usuario que califica es un HomeownerProfile
        $homeownerProfile = HomeownerProfile::where('user_id', $homeownerUserId)->first();
        if (!$homeownerProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Solo los propietarios pueden calificar a contractors',
                'debug' => [
                    'user_id' => Auth::id(),
                    'authenticated_user' => Auth::user(),
                ]
            ], 403);
        }

        // Verificar que no se está calificando a sí mismo
        if ($request->contractor_id == $homeownerUserId) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes calificarte a ti mismo'
            ], 403);
        }

        // Crear o Actualizar la Review
        $review = Review::updateOrCreate(
            [
                'homeowner_profile_id' => $homeownerUserId,
                'contractor_id' => $request->contractor_id
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment ?? null
            ]
        );

        // Actualizar el promedio en la tabla contractors
        $contractor = Contractor::where('user_id', $request->contractor_id)->first();
        
        if ($contractor) {
            $contractor->updateAverageRating();
        }

        // Cargar relaciones
        $review->load(['homeownerProfile.user', 'contractor.user']);

        return response()->json([
            'success' => true,
            'message' => $review->wasRecentlyCreated ? 'Calificación creada exitosamente' : 'Calificación actualizada exitosamente',
            'data' => $review
        ], $review->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Obtener todas las calificaciones de un contractor
     */
    public function getContractorReviews(int $contractorId)
    {
        $contractor = Contractor::where('user_id', $contractorId)->first();
        
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'Contractor no encontrado'
            ], 404);
        }

        $reviews = Review::with(['homeownerProfile.user'])
            ->where('contractor_id', $contractorId)
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'average_rating' => $contractor->average_rating,
            'total_reviews' => $reviews->count(),
            'rating_distribution' => [
                '5_stars' => $reviews->where('rating', 5)->count(),
                '4_stars' => $reviews->where('rating', 4)->count(),
                '3_stars' => $reviews->where('rating', 3)->count(),
                '2_stars' => $reviews->where('rating', 2)->count(),
                '1_star' => $reviews->where('rating', 1)->count(),
            ]
        ];

        return response()->json([
            'success' => true,
            'message' => 'Calificaciones obtenidas correctamente',
            'data' => [
                'reviews' => $reviews,
                'stats' => $stats
            ]
        ]);
    }

    /**
     * Obtener solo el resumen/ promedio de calificación de un contractor
     */
    public function getContractorRatingSummary(int $contractorId)
    {
        $contractor = Contractor::where('user_id', $contractorId)->first();

        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'Contractor no encontrado'
            ], 404);
        }

        $reviews = Review::where('contractor_id', $contractorId);

        $total = $reviews->count();
        $average = $reviews->avg('rating');

        $distribution = [
            '5_stars' => $reviews->clone()->where('rating', 5)->count(),
            '4_stars' => $reviews->clone()->where('rating', 4)->count(),
            '3_stars' => $reviews->clone()->where('rating', 3)->count(),
            '2_stars' => $reviews->clone()->where('rating', 2)->count(),
            '1_star' => $reviews->clone()->where('rating', 1)->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Resumen de calificaciones obtenido',
            'data' => [
                'contractor_id' => $contractorId,
                'average_rating' => $average ? round($average, 2) : null,
                'total_reviews' => $total,
                'rating_distribution' => $distribution,
            ]
        ]);
    }

    /**
     * Obtener la calificación que dio el HomeownerProfile actual a un contractor específico
     */
    public function getMyReview(int $contractorId)
    {
        $homeownerUserId = Auth::id();

        $review = Review::with(['contractor.user'])
            ->where('homeowner_profile_id', $homeownerUserId)
            ->where('contractor_id', $contractorId)
            ->first();

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'No has calificado a este contractor'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Calificación obtenida',
            'data' => $review
        ]);
    }

    /**
     * Eliminar una calificación
     */
    public function destroy(int $contractorId)
    {
        $homeownerUserId = Auth::id();

        $review = Review::where('homeowner_profile_id', $homeownerUserId)
            ->where('contractor_id', $contractorId)
            ->first();

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Calificación no encontrada'
            ], 404);
        }

        $review->delete();

        // Actualizar el promedio del contractor
        $contractor = Contractor::where('user_id', $contractorId)->first();
        if ($contractor) {
            $contractor->updateAverageRating();
        }

        return response()->json([
            'success' => true,
            'message' => 'Calificación eliminada correctamente'
        ]);
    }
}