import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IContactCreateRequest, IContactUpdateRequest } from '@/core/types/IContact';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/contacts', { params, ...config });
  return res.data;
};

export const create = async (request: IContactCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/contacts', request);
  return res.data;
};

export const update = async (id: any, request: IContactUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/contacts/${id}`, request);
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/contacts/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/contacts/${id}`);
  return res.data;
};

export const ContactService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
