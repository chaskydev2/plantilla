import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IHistoryCreateRequest, IHistoryUpdateRequest } from '@/core/types/IHistory';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/histories', { params, ...config });
  return res.data;
}

export const create = async (request: IHistoryCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/histories', request);
  return res.data;
}

export const update = async (id: any, request: IHistoryUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/histories/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/histories/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/histories/${id}`);
  return response.data;
}

export const HistoryService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
