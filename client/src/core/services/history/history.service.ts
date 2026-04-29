import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IHistoryCreateRequest, IHistoryUpdateRequest } from '@/core/types/IHistory';

function isFile(obj: unknown): obj is File {
  return (
    typeof File !== 'undefined' &&
    obj instanceof File
  );
}

function buildHistoryFormData(request: IHistoryCreateRequest | IHistoryUpdateRequest) {
  const formData = new FormData();
  if ('title' in request && typeof request.title === 'string') formData.append('title', request.title);
  if ('description' in request && typeof request.description === 'string') formData.append('description', request.description);
  if ('content' in request && typeof request.content === 'string') formData.append('content', request.content);
  
  // Handle banner files
  ['banner1', 'banner2', 'banner3'].forEach((field) => {
    if (field in request) {
      const value = (request as any)[field];
      if (isFile(value)) {
        formData.append(field, value);
      } else if (typeof value === 'string' && value.startsWith('data:')) {
        // Convert dataURL to File
        const arr = value.split(',');
        const match = arr[0].match(/:(.*?);/);
        if (match && arr[1]) {
          const mime = match[1];
          const bstr = atob(arr[1]);
          const n = bstr.length;
          const u8arr = new Uint8Array(n);
          for (let i = 0; i < n; ++i) u8arr[i] = bstr.charCodeAt(i);
          formData.append(field, new File([u8arr], `${field}_upload.` + mime.split('/')[1], { type: mime }));
        }
      }
    }
  });

  // Handle remove flags for update
  if ('remove_banner1' in request && request.remove_banner1) formData.append('remove_banner1', '1');
  if ('remove_banner2' in request && request.remove_banner2) formData.append('remove_banner2', '1');
  if ('remove_banner3' in request && request.remove_banner3) formData.append('remove_banner3', '1');

  return formData;
}

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/histories', { params, ...config });
  return res.data;
}

export const create = async (request: IHistoryCreateRequest): Promise<IApiResponse> => {
  const formData = buildHistoryFormData(request);
  const res = await axios.post('/v1/histories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export const update = async (id: any, request: IHistoryUpdateRequest): Promise<IApiResponse> => {
  const formData = buildHistoryFormData(request);
  const res = await axios.post(`/v1/histories/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/histories/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/histories/${id}`);
  return response.data;
}

export const getAll = async (config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/histories/all', { ...config });
  return res.data;
}

export const HistoryService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
  getAll,
}
