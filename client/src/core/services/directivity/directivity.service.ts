import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IDirectivityCreateRequest, IDirectivityUpdateRequest } from '@/core/types/IDirectivity';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/directivities', { params, ...config });
  return res.data;
}

export const create = async (request: IDirectivityCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/directivities', request);
  return res.data;
}

export const update = async (id: any, request: IDirectivityUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/directivities/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/directivities/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/directivities/${id}`);
  return response.data;
}

export const DirectivityService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
