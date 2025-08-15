import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IFaqCreateRequest, IFaqUpdateRequest } from '@/core/types/IFaq';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/faqs', { params, ...config });
  return res.data;
};

export const create = async (request: IFaqCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/faqs', request);
  return res.data;
};

export const update = async (id: any, request: IFaqUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/faqs/${id}`, request);
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/faqs/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/faqs/${id}`);
  return res.data;
};

export const FaqService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
