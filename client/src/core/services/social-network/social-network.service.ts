import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { ISocialNetworkCreateRequest, ISocialNetworkUpdateRequest } from '@/core/types/ISocialNetwork';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/social_networks', { params, ...config });
  return res.data;
}

export const create = async (request: ISocialNetworkCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/social_networks', request);
  return res.data;
}

export const update = async (id: any, request: ISocialNetworkUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/social_networks/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/social_networks/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/social_networks/${id}`);
  return response.data;
}

export const SocialNetworkService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
