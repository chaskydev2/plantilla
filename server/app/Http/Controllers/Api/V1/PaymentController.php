<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Requests\Payment\UpdatePaymentRequest;
use App\Http\Resources\Auth\ProfileResource;
use App\Http\Resources\Payment\PaymentCollection;
use App\Http\Resources\Payment\PaymentResource;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class PaymentController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('payment_listar');

        $query = Payment::query()
            ->with('user')
            ->search($request->input('search'))
            ->sort(
                $request->input('sortBy.sort', 'id'),
                $request->input('sortBy.order', 'asc')
            );

        $result = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );

        return (new PaymentCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        Gate::authorize('payment_listar');
        $users = Payment::query()->get(['id', 'first_name', 'last_name', 'name']);
        return PaymentResource::collection($users)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('payment_ver');
        $user = Payment::with(['academicTrainings', 'workExperiences', 'technicalSkills', 'workReferences'])
            ->findOrFail($id);

        return (new ProfileResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        Gate::authorize('payment_crear');
        $existingUsers = User::whereIn('id', $request->user_ids)->pluck('id');
        $nonExistingUsers = array_diff($request->user_ids, $existingUsers->toArray());

        if (!empty($nonExistingUsers)) {
            return response()->json([
                'success' => false,
                'message' => 'Los siguientes usuarios no existen: ' . implode(', ', $nonExistingUsers),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $createdPayments = [];
        foreach ($request->user_ids as $userId) {
            $paymentData = $request->validated();
            $paymentData['user_id'] = $userId;
            if (isset($paymentData['date']) && $paymentData['payment_type'] == '1') {
                [$year, $month] = explode('-', $paymentData['date']);
                $paymentData['payment_year'] = $year;
                $paymentData['payment_month'] = $month;
                unset($paymentData['date']);
            }
            $payment = Payment::create($paymentData);
            $createdPayments[] = $payment;
        }

        return PaymentResource::collection($createdPayments)
            ->additional([
                'success' => true,
                'message' => count($createdPayments) . ' pagos creados satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdatePaymentRequest $request, $id): JsonResponse
    {
        logger($request);
        Gate::authorize('payment_editar');

        $payment = Payment::findOrFail($id);

        $data = $request->validated();

        if (isset($data['date']) && $data['payment_type'] == '1') {
            [$year, $month] = explode('-', $data['date']);
            $data['payment_year'] = $year;
            $data['payment_month'] = $month;
            unset($data['date']);
        }
        unset($data['user_ids'], $data['user_id']);

        $payment->update($data);

        return (new PaymentResource($payment))
            ->additional([
                'success' => true,
                'message' => 'Pago actualizado correctamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function destroy($id): JsonResponse
    {
        Gate::authorize('payment_eliminar');

        $result = Payment::findOrFail($id);
        $result->delete();
        return response()->json([
            'success' => true,
            'message' => 'Pago Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    // public function restore($id): JsonResponse
    // {
    //     Gate::authorize('payment_restaurar');

    //     $result = Payment::withTrashed()->findOrFail($id);
    //     $result->restore();
    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Usuario Restablecido Satisfactoriamente'
    //     ])->setStatusCode(Response::HTTP_OK);
    // }
}
