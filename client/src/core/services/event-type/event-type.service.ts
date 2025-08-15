import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IEventTypeCreateRequest, IEventTypeUpdateRequest } from '@/core/types/IEventType';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/event_types', { params, ...config });
  return res.data;
}

export const create = async (request: IEventTypeCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/event_types', request);
  return res.data;
}

export const update = async (id: any, request: IEventTypeUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/event_types/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/event_types/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/event_types/${id}`);
  return response.data;
}

export const EventTypeService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
