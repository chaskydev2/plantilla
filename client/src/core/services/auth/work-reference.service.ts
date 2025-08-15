import axios from '@/core/config/axios';
import type { IWorkReferenceCreateRequest, IWorkReferenceUpdateRequest } from '@/core/types/IWorkReference';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

export const getAllPaginated = async (userId: any, params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/users/${userId}/workreferences`, { params, ...config });
  return res.data;
}

export const create = async (userId: any, request: IWorkReferenceCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/users/${userId}/workreferences`, request);
  return res.data;
}

export const update = async (userId: any, id: any, request: IWorkReferenceUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/users/${userId}/workreferences/${id}`, request);
  return res.data;
}

export const remove = async (userId: any, id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/users/${userId}/workreferences/${id}`);
  return response.data;
}

export const WorkReferenceService = {
  getAllPaginated,
  create,
  update,
  remove,
}
