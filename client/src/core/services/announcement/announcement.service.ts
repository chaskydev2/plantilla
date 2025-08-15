import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IAnnouncementCreateRequest, IAnnouncementUpdateRequest } from '@/core/types/IAnnouncement';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/announcements', { params, ...config });
  return res.data;
}

export const create = async (request: IAnnouncementCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/announcements', request);
  return res.data;
}

export const update = async (id: any, request: IAnnouncementUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/announcements/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/announcements/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/announcements/${id}`);
  return response.data;
}

export const AnnouncementService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
