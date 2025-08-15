import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IEventCreateRequest, IEventUpdateRequest } from '@/core/types/IEvent';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/events', { params, ...config });
  return res.data;
}

export const create = async (request: IEventCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/events', request);
  return res.data;
}

export const update = async (id: any, request: IEventUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/events/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/events/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/events/${id}`);
  return response.data;
}

export const EventService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
