import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IBeginningCreateRequest, IBeginningUpdateRequest } from '@/core/types/IBeginning';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/beginnings', { params, ...config });
  return res.data;
};

export const create = async (request: IBeginningCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/beginnings', request);
  return res.data;
};

export const update = async (id: any, request: IBeginningUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/beginnings/${id}`, request);
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/beginnings/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/beginnings/${id}`);
  return res.data;
};

export const BeginningService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
