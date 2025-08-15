import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IAgreementCreateRequest, IAgreementUpdateRequest } from '@/core/types/IAgreement';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/agreements', { params, ...config });
  return res.data;
}

export const create = async (request: IAgreementCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/agreements', request);
  return res.data;
}

export const update = async (id: any, request: IAgreementUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/agreements/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/agreements/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/agreements/${id}`);
  return response.data;
}

export const AgreementService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
