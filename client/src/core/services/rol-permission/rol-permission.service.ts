import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

export const getAllPaginated = async (roleId: any, params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/roles/${roleId}/permissions`, { params, ...config });
  return res.data;
}

export const sync = async (roleId: any, request: any): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/roles/${roleId}/permissions/sync`, request);
  return res.data;
}

export const RolPermissionService = {
  getAllPaginated,
  sync,
}
