import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IMoralValueCreateRequest, IMoralValueUpdateRequest } from '@/core/types/IMoralValue';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/moral_values', { params, ...config });
  return res.data;
};

export const create = async (request: IMoralValueCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/moral_values', request);
  return res.data;
};

export const update = async (id: any, request: IMoralValueUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/moral_values/${id}`, request);
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/moral_values/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/moral_values/${id}`);
  return res.data;
};

export const MoralValueService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
