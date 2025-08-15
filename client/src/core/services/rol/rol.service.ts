import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IRolCreateRequest, IRolUpdateRequest, IRolPermissionRequest } from '@/core/types/IRol';

export const getAllPaginated = async (params?: IPaginationRequest): Promise<IApiResponse> => {
  const res = await axios.get('/v1/roles', { params });
  return res.data;
}

export const create = async (request: Partial<IRolCreateRequest>): Promise<IApiResponse> => {
  const res = await axios.post('/v1/roles', request);
  return res.data;
}

export const update = async (id: any, request: Partial<IRolUpdateRequest>): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/roles/${id}`, request);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/roles/${id}`);
  return res.data;
}

export const getAllPermissions = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/roles/${id}/permissions`);
  return res.data;
}

export const createPermissions = async (id: any, request: IRolPermissionRequest): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/roles/${id}/permissions/sync`, request);
  return res.data;
}

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/roles/all');
  return res.data;
}

export const RolService = {
  getAllPaginated,
  getAll,
  create,
  update,
  remove,
  getAllPermissions,
  createPermissions,
}
