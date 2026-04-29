<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AttributeContractor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AttributeContractorController extends Controller
{
    // Listar todos los registros
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {

        // Eager load contractor and contractor.user
        $query = AttributeContractor::with(['contractor.user', 'attribute']);


        // Search filter (by attribute name, contractor fields, or user fields)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($query) use ($search) {
                $query->whereHas('attribute', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('contractor', function($q) use ($search) {
                    $q->where('company_name', 'like', "%{$search}%")
                      ->orWhereHas('user', function($uq) use ($search) {
                          $uq->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%")
                             ->orWhere('first_name', 'like', "%{$search}%")
                             ->orWhere('last_name', 'like', "%{$search}%");
                      });
                });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by contractor_id
        if ($request->filled('contractor_id')) {
            $query->where('contractor_id', $request->contractor_id);
        }

        // Filter by attribute_id
        if ($request->filled('attribute_id')) {
            $query->where('attribute_id', $request->attribute_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        if (in_array($sortBy, ['created_at', 'status', 'attribute_id', 'contractor_id'])) {
            $query->orderBy($sortBy, $sortDir);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $results = $query->paginate($perPage);

        return response()->json($results);
    }

    public function store(Request $request): JsonResponse
    {
       // Validación (dejamos la regla de file, pero añadimos mensajes)
    $validated = $request->validate([
        'contractor_id' => ['required', Rule::exists('contractors', 'user_id')],
        'attributes' => 'required|array',
        'attributes.*.attribute_id' => ['required', Rule::exists('attributes', 'id')],
        'attributes.*.value' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        'attributes.*.coment' => 'nullable|string',
    ]);

    
    $attributesInput = $request->input('attributes', []);
    // LOG de depuración: inputs y archivos por separado
    Log::info('AttributeContractorController@store - input attributes', $request->input('attributes'));
    Log::info('AttributeContractorController@store - files', $request->allFiles());

    DB::beginTransaction();
    try {
        $created = [];

        $attributesInput = $request->input('attributes', []);

        foreach ($attributesInput as $index => $attr) {
            $attributeId = $attr['attribute_id'] ?? null;
            $storedValue = null;

            // Obtener archivo en este índice
            $file = $request->file("attributes.$index.value");
            if ($file && $file->isValid()) {
                // Guardar en public/assets/documents
                $filename = uniqid('doc_') . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/documents'), $filename);
                // Guardar la ruta relativa para usar con asset()
                $storedValue = 'assets/documents/' . $filename;
            } else {
                if (isset($attr['value']) && !is_array($attr['value'])) {
                    $storedValue = $attr['value'];
                }
            }

            // Crear solo si attribute id está presente (evita nulls)
            if ($attributeId) {
                $row = AttributeContractor::create([
                    'contractor_id' => $validated['contractor_id'],
                    'attribute_id' => $attributeId,
                    'value' => $storedValue,
                    'coment' => $attr['coment'] ?? '',
                ]);
                $created[] = $row;
            } else {
                Log::warning("AttributeContractorController@store - missing attribute_id for index {$index}", $attr);
            }
        }

        DB::commit();
        return response()->json(['success' => true, 'data' => $created], 201);

    } catch (\Throwable $e) {
        DB::rollBack();
        Log::error('Error storing attribute_contractor: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'request_files' => $request->allFiles()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Error al guardar los datos',
            'error' => $e->getMessage(),
        ], 500);
    }
    }
    // Listar todos los atributos de un contractor
    public function byContractor($contractor_id): JsonResponse
    {
        $attributes = AttributeContractor::with('attribute')
            ->where('contractor_id', $contractor_id)
            ->get();
        return response()->json($attributes);
    }

    public function updateStatus($id, Request $request)
    {
        $request->validate([
            'status' => 'required|in:0,1'
        ]);

        $attributeContractor = AttributeContractor::findOrFail($id);
        $attributeContractor->status = $request->input('status') == 1 ? 1 : 0;
        $attributeContractor->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado correctamente',
            'data' => $attributeContractor
        ]);
    }


    public function updateComentario($id, Request $request)
    {
        $request->validate([
            'comentario' => 'required|string'
        ]);

        $attributeContractor = AttributeContractor::findOrFail($id);
        $attributeContractor->coment = $request->input('comentario');
        $attributeContractor->save();

        return response()->json([
            'success' => true,
            'message' => 'Comentario actualizado correctamente',
            'data' => $attributeContractor
        ]);
    }



    public function byUser(Request $request, int $userId)
    {
        // Eager load contractor, user and attribute
        $query = AttributeContractor::with(['contractor.user', 'attribute'])
            ->whereHas('contractor.user', function ($q) use ($userId) {
                $q->where('id', $userId);
            });

        // Optional: filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Optional: filter by attribute_id
        if ($request->filled('attribute_id')) {
            $query->where('attribute_id', $request->attribute_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        if (in_array($sortBy, ['created_at', 'status', 'attribute_id'])) {
            $query->orderBy($sortBy, $sortDir);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $results = $query->paginate($perPage);

        return response()->json($results);
    }

    
     public function updateDocument(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'contractor_id' => ['required', Rule::exists('contractors', 'user_id')],
            'attribute_id' => ['required', Rule::exists('attributes', 'id')],
            'value' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $attributeContractor = AttributeContractor::findOrFail($id);

        DB::beginTransaction();
        try {
            // Eliminar archivo anterior si existe y es un documento
            if ($attributeContractor->value && !is_null($attributeContractor->value)) {
                $oldPath = public_path($attributeContractor->value);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $storedValue = null;
            $file = $request->file('value');
            if ($file && $file->isValid()) {
                $filename = uniqid('doc_') . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/documents'), $filename);
                $storedValue = 'assets/documents/' . $filename;
            } else {
                if (isset($validated['value']) && !is_array($validated['value'])) {
                    $storedValue = $validated['value'];
                }
            }

            $attributeContractor->contractor_id = $validated['contractor_id'];
            $attributeContractor->attribute_id = $validated['attribute_id'];
            $attributeContractor->value = $storedValue;
            $attributeContractor->save();

            DB::commit();
            return response()->json(['success' => true, 'data' => $attributeContractor], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error updating attribute_contractor: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_files' => $request->allFiles()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar los datos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $attributeContractor = AttributeContractor::findOrFail($id);

        DB::beginTransaction();
        try {
            // Eliminar archivo si existe
            if ($attributeContractor->value && !is_null($attributeContractor->value)) {
                $filePath = public_path($attributeContractor->value);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            // Eliminar el registro
            $attributeContractor->delete();

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Registro eliminado correctamente'
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error deleting attribute_contractor: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'attribute_contractor_id' => $id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el registro',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
