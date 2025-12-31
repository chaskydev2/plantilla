import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IService, IServiceCreateRequest, IServiceUpdateRequest } from '@/core/types/IService';

const mapPagination = (api: any, fallbackPerPage?: number) => {
  const perPage = api?.per_page ?? fallbackPerPage ?? 10;
  const total = api?.total ?? 0;
  const from = api?.from ?? 0;
  const to = api?.to ?? 0;
  const count = to && from ? to - from + 1 : Array.isArray(api?.data) ? api.data.length : 0;

  return {
    total,
    count,
    per_page: perPage,
    current_page: api?.current_page ?? 1,
    total_pages: api?.last_page ?? (perPage ? Math.max(1, Math.ceil(total / perPage)) : 1),
  };
};

const mimeToExtension = (mime: string) => {
  if (mime.includes('jpeg')) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  return 'bin';
};

const dataUrlToFile = (dataUrl: string, baseName: string) => {
  const [header, data] = dataUrl.split(',');
  const match = header.match(/data:(.*?);base64/);
  const mime = match?.[1] || 'application/octet-stream';
  const binary = atob(data);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const ext = mimeToExtension(mime);
  const fileName = `${baseName}.${ext}`;
  return new File([bytes], fileName, { type: mime });
};

const appendFileField = (formData: FormData, key: 'icon' | 'image', value?: string | File | null) => {
  if (!value) return;

  // If already a File instance, append directly
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  // If the value is a data URL string, convert to File
  if (typeof value === 'string' && value.startsWith('data:')) {
    const file = dataUrlToFile(value, key);
    formData.append(key, file);
  }
};

const buildFormData = (
  request: IServiceCreateRequest | IServiceUpdateRequest,
  options?: { includeRemoveFlags?: boolean }
) => {
  const formData = new FormData();

  if (request.name !== undefined && request.name !== null) {
    formData.append('name', request.name);
  }
  if (request.slug !== undefined && request.slug !== null) {
    formData.append('slug', request.slug);
  }

  appendFileField(formData, 'icon', (request as IServiceCreateRequest).icon);
  appendFileField(formData, 'image', (request as IServiceCreateRequest).image);

  if (options?.includeRemoveFlags) {
    if ((request as IServiceUpdateRequest).remove_icon) {
      formData.append('remove_icon', '1');
    }
    if ((request as IServiceUpdateRequest).remove_image) {
      formData.append('remove_image', '1');
    }
  }

  return formData;
};

export const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse<IService[]>> => {
  const requestParams = {
    page: params?.page,
    per_page: params?.limit ?? params?.per_page,
    search: params?.search,
    sort_by: params?.sortBy?.sort ?? 'name',
    sort_dir: params?.sortBy?.order ?? 'asc',
  };

  const res = await axios.get('/v1/services', { params: requestParams, ...config });
  const api = res.data;

  return {
    success: true,
    data: api?.data || [],
    meta: {
      pagination: mapPagination(api, requestParams.per_page),
    },
  };
};

export const get = async (id: number): Promise<IApiResponse<IService>> => {
  const res = await axios.get(`/v1/services/${id}`);
  return res.data;
};

export const create = async (request: IServiceCreateRequest): Promise<IApiResponse<IService>> => {
  const formData = buildFormData(request);
  const res = await axios.post('/v1/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const update = async (id: number, request: IServiceUpdateRequest): Promise<IApiResponse<IService>> => {
  const formData = buildFormData(request, { includeRemoveFlags: true });
  const res = await axios.put(`/v1/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const remove = async (id: number): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/services/${id}`);
  return res.data;
};

export const ServiceService = {
  getAllPaginated,
  get,
  create,
  update,
  remove,
};
