import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { INewsletterCreateRequest, INewsletterUpdateRequest } from '@/core/types/INewsletter';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/newsletters', { params, ...config });
  return res.data;
}

export const create = async (request: INewsletterCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/newsletters', request);
  return res.data;
}

export const update = async (id: any, request: INewsletterUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/newsletters/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/newsletters/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/newsletters/${id}`);
  return response.data;
}

export const NewsletterService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
