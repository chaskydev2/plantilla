import axios from '@/core/config/axios';
import type { ITechnicalSkillCreateRequest, ITechnicalSkillUpdateRequest } from '@/core/types/ITechnicalSkill';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

export const getAllPaginated = async (userId: any, params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/users/${userId}/technicalskills`, { params, ...config });
  return res.data;
}

export const create = async (userId: any, request: ITechnicalSkillCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/users/${userId}/technicalskills`, request);
  return res.data;
}

export const update = async (userId: any, id: any, request: ITechnicalSkillUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/users/${userId}/technicalskills/${id}`, request);
  return res.data;
}

export const remove = async (userId: any, id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/users/${userId}/technicalskills/${id}`);
  return response.data;
}

export const TechnicalSkillService = {
  getAllPaginated,
  create,
  update,
  remove,
}
