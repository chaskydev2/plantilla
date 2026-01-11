import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';

// Definimos la interfaz de lo que espera el backend
// (Puedes mover esto a @/core/types/IReview.ts si prefieres ser más estricto)
export interface IReviewCreateRequest {
  contractor_id: number;
  rating: number;
  comment?: string;
}

export const create = async (request: IReviewCreateRequest): Promise<IApiResponse> => {
  // Llamamos a la ruta que definimos en Laravel: Route::post('reviews', ...)
  // Asumiendo que tu axios base ya apunta a /api, aquí añadimos /v1/reviews
  const res = await axios.post('/v1/reviews', request);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

// Exportamos el objeto por defecto para mantener consistencia con tu proyecto
export const ReviewService = {
  create
}