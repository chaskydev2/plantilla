import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IJobCreateRequest, IJobUpdateRequest } from '@/core/types/IJob';

type JobFilters = IPaginationRequest & {
  search?: string;
  is_active?: boolean;
  id_creator?: number;
  id_homeowner?: number;
  service_type?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
};

export const getAllPaginated = async (
  params?: JobFilters,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get('/v1/jobs', { params, ...config });
  return res.data;
};

export const createWithFile = async (
  request: IJobCreateRequest,
  file?: File
): Promise<IApiResponse> => {
  const formData = new FormData();
  formData.append('id_creator', String(request.id_creator));
  if (request.id_homeowner !== undefined && request.id_homeowner !== null) {
    formData.append('id_homeowner', String(request.id_homeowner));
  }
  formData.append('title', request.title);
  if (request.description) formData.append('description', request.description);
  formData.append('location', request.location);
  formData.append('service_type', request.service_type);
  if (file) formData.append('image_url', file);
  if (request.url) formData.append('url', request.url);
  if (request.amount_paid !== undefined && request.amount_paid !== null) {
    formData.append('amount_paid', String(request.amount_paid));
  }
  if (request.is_active !== undefined && request.is_active !== null) {
    formData.append('is_active', request.is_active ? '1' : '0');
  }
  if (request.comment) formData.append('comment', request.comment);
  if (request.job_date) formData.append('job_date', request.job_date);

  const res = await axios.post('/v1/jobs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getByCreator = async (
  creatorId: number,
  params?: JobFilters,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/jobs/creator/${creatorId}`, { params, ...config });
  return res.data;
};

export const create = async (request: IJobCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/jobs', request);
  return res.data;
};

export const update = async (id: number, request: IJobUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/jobs/${id}`, request);
  return res.data;
};

export const get = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/jobs/${id}`);
  return res.data;
};

export const remove = async (id: number): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/jobs/${id}`);
  return res.data;
};

export const JobService = {
  getAllPaginated,
  create,
  createWithFile,
  update,
  get,
  remove,
  getByCreator,
};
