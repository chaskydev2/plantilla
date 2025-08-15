import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IUserCreateRequest, IUserUpdateRequest } from '@/core/types/IUser';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/users', { params, ...config });
  return res.data;
}

export const create = async (request: IUserCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/users', request);
  return res.data;
}

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/users/all');
  return res.data;
}

export const update = async (id: any, request: IUserUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/users/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/users/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/users/${id}`);
  return response.data;
}

export const restore = async (id: any): Promise<IApiResponse> => {
  const response = await axios.post(`/v1/users/${id}/restore`);
  return response.data;
}

export const UserService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
  restore,
  getAll
}
