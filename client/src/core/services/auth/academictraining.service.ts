import axios from '@/core/config/axios';
import type { IAcademicCreateRequest, IAcademicUpdateRequest } from '@/core/types/IAcademicTraining';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

export const getAllPaginated = async (userId: any, params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/users/${userId}/academictrainings`, { params, ...config });
  return res.data;
}

export const create = async (userId: any, request: IAcademicCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/users/${userId}/academictrainings`, request);
  return res.data;
}

export const update = async (userId: any, id: any, request: IAcademicUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/users/${userId}/academictrainings/${id}`, request);
  return res.data;
}

export const remove = async (userId: any, id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/users/${userId}/academictrainings/${id}`);
  return response.data;
}

export const AcademicTrainingService = {
  getAllPaginated,
  create,
  update,
  remove,
}
