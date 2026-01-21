<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AttributeHomeowner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AttributeHomeownerController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        $query = AttributeHomeowner::with(['homeowner.user', 'attribute']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($builder) use ($search) {
                $builder->whereHas('attribute', function ($attributeQuery) use ($search) {
                    $attributeQuery->where('name', 'like', "%{$search}%");
                })->orWhereHas('homeowner', function ($homeownerQuery) use ($search) {
                    $homeownerQuery->where('city', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        });
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('homeowner_id')) {
            $query->where('homeowner_id', $request->input('homeowner_id'));
        }

        if ($request->filled('attribute_id')) {
            $query->where('attribute_id', $request->input('attribute_id'));
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        if (in_array($sortBy, ['created_at', 'status', 'attribute_id', 'homeowner_id'], true)) {
            $query->orderBy($sortBy, $sortDir);
        }

        $perPage = $request->get('per_page', 15);

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'homeowner_id' => ['required', Rule::exists('homeowner_profiles', 'user_id')],
            'attributes' => ['required', 'array'],
            'attributes.*.attribute_id' => ['required', Rule::exists('attributes', 'id')],
            'attributes.*.value' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        Log::info('AttributeHomeownerController@store - input attributes', $request->input('attributes'));
        Log::info('AttributeHomeownerController@store - files', $request->allFiles());

        DB::beginTransaction();

        try {
            $created = [];
            $attributesInput = $request->input('attributes', []);

            foreach ($attributesInput as $index => $attributeData) {
                $attributeId = $attributeData['attribute_id'] ?? null;
                $storedValue = null;

                $file = $request->file("attributes.$index.value");
                if ($file && $file->isValid()) {
                    $filename = uniqid('doc_', true) . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('assets/documents'), $filename);
                    $storedValue = 'assets/documents/' . $filename;
                } elseif (isset($attributeData['value']) && !is_array($attributeData['value'])) {
                    $storedValue = $attributeData['value'];
                }

                if ($attributeId) {
                    $record = AttributeHomeowner::create([
                        'homeowner_id' => $validated['homeowner_id'],
                        'attribute_id' => $attributeId,
                        'value' => $storedValue,
                    ]);
                    $created[] = $record;
                } else {
                    Log::warning("AttributeHomeownerController@store - missing attribute_id for index {$index}", $attributeData);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $created,
            ], 201);
        } catch (\Throwable $exception) {
            DB::rollBack();
            Log::error('Error storing attribute_homeowner: ' . $exception->getMessage(), [
                'trace' => $exception->getTraceAsString(),
                'request_files' => $request->allFiles(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar los datos',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    public function byHomeowner(int $homeownerId): JsonResponse
    {
        $attributes = AttributeHomeowner::with('attribute')
            ->where('homeowner_id', $homeownerId)
            ->get();

        return response()->json($attributes);
    }

    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:0,1'],
        ]);

        $attributeHomeowner = AttributeHomeowner::findOrFail($id);
        $attributeHomeowner->status = (int) $request->input('status') === 1 ? 1 : 0;
        $attributeHomeowner->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado correctamente',
            'data' => $attributeHomeowner,
        ]);
    }

    public function updateComentario(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'comentario' => ['required', 'string'],
        ]);

        $attributeHomeowner = AttributeHomeowner::findOrFail($id);
        $attributeHomeowner->coment = $request->input('comentario');
        $attributeHomeowner->save();

        return response()->json([
            'success' => true,
            'message' => 'Comentario actualizado correctamente',
            'data' => $attributeHomeowner,
        ]);
    }

    public function byUser(Request $request, int $userId): JsonResponse
    {
        $query = AttributeHomeowner::with(['homeowner.user', 'attribute'])
            ->whereHas('homeowner.user', function ($userQuery) use ($userId) {
                $userQuery->where('id', $userId);
            });

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('attribute_id')) {
            $query->where('attribute_id', $request->input('attribute_id'));
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        if (in_array($sortBy, ['created_at', 'status', 'attribute_id'], true)) {
            $query->orderBy($sortBy, $sortDir);
        }

        $perPage = $request->get('per_page', 15);

        return response()->json($query->paginate($perPage));
    }

    public function updateDocument(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'homeowner_id' => ['required', Rule::exists('homeowner_profiles', 'user_id')],
            'attribute_id' => ['required', Rule::exists('attributes', 'id')],
            'value' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        $attributeHomeowner = AttributeHomeowner::findOrFail($id);

        DB::beginTransaction();

        try {
            if ($attributeHomeowner->value) {
                $existingPath = public_path($attributeHomeowner->value);
                if (file_exists($existingPath)) {
                    @unlink($existingPath);
                }
            }

            $storedValue = null;
            $file = $request->file('value');
            if ($file && $file->isValid()) {
                $filename = uniqid('doc_', true) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/documents'), $filename);
                $storedValue = 'assets/documents/' . $filename;
            } elseif (isset($validated['value']) && !is_array($validated['value'])) {
                $storedValue = $validated['value'];
            }

            $attributeHomeowner->homeowner_id = $validated['homeowner_id'];
            $attributeHomeowner->attribute_id = $validated['attribute_id'];
            $attributeHomeowner->value = $storedValue;
            $attributeHomeowner->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $attributeHomeowner,
            ]);
        } catch (\Throwable $exception) {
            DB::rollBack();
            Log::error('Error updating attribute_homeowner: ' . $exception->getMessage(), [
                'trace' => $exception->getTraceAsString(),
                'request_files' => $request->allFiles(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar los datos',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $attributeHomeowner = AttributeHomeowner::findOrFail($id);

        DB::beginTransaction();

        try {
            if ($attributeHomeowner->value) {
                $existingPath = public_path($attributeHomeowner->value);
                if (file_exists($existingPath)) {
                    @unlink($existingPath);
                }
            }

            $attributeHomeowner->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registro eliminado correctamente',
            ]);
        } catch (\Throwable $exception) {
            DB::rollBack();
            Log::error('Error deleting attribute_homeowner: ' . $exception->getMessage(), [
                'trace' => $exception->getTraceAsString(),
                'id' => $id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el registro',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
}
