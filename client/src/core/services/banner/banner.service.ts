import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IBannerCreateRequest, IBannerUpdateRequest } from '@/core/types/IBanner';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/banners', { params, ...config });
  return res.data;
}

export const create = async (request: IBannerCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/banners', request);
  return res.data;
}

export const update = async (id: any, request: IBannerUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/banners/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/banners/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/banners/${id}`);
  return response.data;
}

export const BannerService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
