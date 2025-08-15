import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IRequirementCreateRequest, IRequirementUpdateRequest } from '@/core/types/IRequirement';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/requirements', { params, ...config });
  return res.data;
}

export const create = async (request: IRequirementCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/requirements', request);
  return res.data;
}

export const update = async (id: any, request: IRequirementUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/requirements/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/requirements/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/requirements/${id}`);
  return response.data;
}

export const RequirementService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
