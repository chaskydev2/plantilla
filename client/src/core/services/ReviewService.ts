import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';

// Interfaz para crear/actualizar una review
export interface IReviewCreateRequest {
  contractor_id: number;
  rating: number;
  comment?: string;
}

// Interfaz para la respuesta de review
export interface IReview {
  id: number;
  homeowner_profile_id: number;
  contractor_id: number;
  rating: number;
  comment?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IRatingSummary {
  contractor_id: number;
  average_rating: number | null;
  total_reviews: number;
  rating_distribution: {
    "5_stars": number;
    "4_stars": number;
    "3_stars": number;
    "2_stars": number;
    "1_star": number;
  };
}

/**
 * Crear o actualizar una review/rating
 * POST /reviews
 * @param request Objeto con contractor_id, rating y comment opcional
 */
export const create = async (request: IReviewCreateRequest): Promise<IApiResponse<IReview>> => {
  const res = await axios.post('/v1/reviews', request);
  return res.data;
};

/**
 * Obtener la review del homeowner autenticado para un contractor concreto
 * GET /reviews/contractor/{contractorId}/my-review
 */
export const getMyReview = async (
  contractorId: number,
): Promise<IApiResponse<IReview>> => {
  const res = await axios.get(`/v1/reviews/contractor/${contractorId}/my-review`);
  return res.data;
};

/**
 * Resumen de calificaciones de un contractor
 * GET /contractors/{contractorId}/rating-summary
 */
export const getRatingSummary = async (
  contractorId: number,
): Promise<IApiResponse<IRatingSummary>> => {
  const res = await axios.get(`/v1/contractors/${contractorId}/rating-summary`);
  return res.data;
};

export const ReviewService = {
  create,
  getMyReview,
  getRatingSummary,
};