import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

export const getAllPaginated = async (params?: IPaginationRequest): Promise<IApiResponse> => {
  const res = await axios.get('/v1/permissions', { params });
  return res.data;
}


export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/permissions/all');
  return res.data;
}

export const PermissonService = {
  getAllPaginated,
  getAll
}
