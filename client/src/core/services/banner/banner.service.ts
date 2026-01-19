import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IBannerCreateRequest, IBannerUpdateRequest } from '@/core/types/IBanner';

export const getAll = async (config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/banners/all', { ...config });
  return res.data;
}

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/banners', { params, ...config });
  return res.data;
}

function isFile(obj: unknown): obj is File {
  return (
    typeof File !== 'undefined' &&
    obj instanceof File
  );
}

function buildBannerFormData(request: IBannerCreateRequest | IBannerUpdateRequest) {
  const formData = new FormData();
  if ('title' in request && typeof request.title === 'string') formData.append('title', request.title);
  if ('subtitle' in request && typeof request.subtitle === 'string') formData.append('subtitle', request.subtitle);
  if ('active' in request && typeof request.active === 'boolean') formData.append('active', String(request.active));
  if ('image' in request && isFile(request.image)) {
    formData.append('image', request.image);
  } else if ('image' in request && typeof request.image === 'string' && request.image.startsWith('data:')) {
    // Si es dataURL, conviértelo a File
    const arr = request.image.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (match && arr[1]) {
      const mime = match[1];
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; ++i) u8arr[i] = bstr.charCodeAt(i);
      formData.append('image', new File([u8arr], 'banner_upload.' + mime.split('/')[1], { type: mime }));
    }
  }
  if ('remove_image' in request && request.remove_image) formData.append('remove_image', '1');
  return formData;
}

export const create = async (request: IBannerCreateRequest): Promise<IApiResponse> => {
  const formData = buildBannerFormData(request);
  const res = await axios.post('/v1/banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export const update = async (id: any, request: IBannerUpdateRequest): Promise<IApiResponse> => {
  const formData = buildBannerFormData(request);
  const res = await axios.post(`/v1/banners/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/banners/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/banners/${id}`);
  return response.data;
}

export const BannerService = {
  getAll,
  getAllPaginated,
  create,
  update,
  get,
  remove,
}
