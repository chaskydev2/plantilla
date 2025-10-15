import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { ITagCreateRequest, ITagUpdateRequest } from '@/core/types/ITag';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/tags', { params, ...config });
  return res.data;
}

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/tags/all');
  return res.data;
}

export const create = async (request: ITagCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/tags', request);
  return res.data;
}

export const update = async (id: any, request: ITagUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/tags/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/tags/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/tags/${id}`);
  return response.data;
}

export const TagService = {
  getAllPaginated,
  getAll,
  create,
  update,
  get,
  remove,
}
