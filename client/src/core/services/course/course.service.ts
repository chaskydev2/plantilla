import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { ICourseCreateRequest, ICourseUpdateRequest } from '@/core/types/ICourse';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/courses', { params, ...config });
  return res.data;
}

export const create = async (request: ICourseCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/courses', request);
  return res.data;
}

export const update = async (id: any, request: ICourseUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/courses/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/courses/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/courses/${id}`);
  return response.data;
}

export const CourseService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
