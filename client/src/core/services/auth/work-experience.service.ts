import axios from '@/core/config/axios';
import type { IWorkExperienceCreateRequest, IWorkExperienceUpdateRequest } from '@/core/types/IWorkExperience';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

export const getAllPaginated = async (userId: any, params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/users/${userId}/workexperiences`, { params, ...config });
  return res.data;
}

export const create = async (userId: any, request: IWorkExperienceCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/users/${userId}/workexperiences`, request);
  return res.data;
}

export const update = async (userId: any, id: any, request: IWorkExperienceUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/users/${userId}/workexperiences/${id}`, request);
  return res.data;
}

export const remove = async (userId: any, id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/users/${userId}/workexperiences/${id}`);
  return response.data;
}

export const WorkExperienceService = {
  getAllPaginated,
  create,
  update,
  remove,
}
