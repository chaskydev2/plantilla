import apiClient from '@/core/config/axios';
import type { AxiosRequestConfig } from 'axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

const basePath = '/v1/attribute-homeowners';

const withAuth = (config: AxiosRequestConfig = {}): AxiosRequestConfig => {
  const token =
    localStorage.getItem('_tkn') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token');

  if (!token) {
    return config;
  }

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllPaginated = async (params?: IPaginationRequest): Promise<IApiResponse> => {
  const res = await apiClient.get(basePath, withAuth({ params }));
  const apiResponse = res.data;

  return {
    success: true,
    data: apiResponse.data || apiResponse,
    meta: apiResponse.meta
      ? {
          pagination: {
            total: apiResponse.meta?.total ?? 0,
            count:
              typeof apiResponse.meta?.from === 'number' && typeof apiResponse.meta?.to === 'number'
                ? apiResponse.meta.to - apiResponse.meta.from + 1
                : apiResponse.meta?.count ?? 0,
            per_page: apiResponse.meta?.per_page ?? params?.per_page ?? 10,
            current_page: apiResponse.meta?.current_page ?? 1,
            total_pages: apiResponse.meta?.last_page ?? 1,
          },
        }
      : undefined,
  };
};

export const getAll = async (): Promise<IApiResponse> => {
  const res = await apiClient.get(basePath, withAuth());
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const getCatalog = async (): Promise<IApiResponse> => {
  const res = await apiClient.get('/v1/attributes/for-homeowners', withAuth());
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const create = async (payload: FormData | Record<string, unknown>): Promise<IApiResponse> => {
    const res = await apiClient.post(basePath, payload, withAuth({
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }));
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const update = async (id: number, payload: FormData | Record<string, unknown>): Promise<IApiResponse> => {
  const res = await apiClient.put(`${basePath}/${id}`, payload, withAuth({
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  }));
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const getByHomeowner = async (homeownerId: number): Promise<IApiResponse> => {
    const res = await apiClient.get(`${basePath}/by-homeowner/${homeownerId}`, withAuth());
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const getByUser = async (userId: number): Promise<IApiResponse> => {
    const res = await apiClient.get(`${basePath}/by-user/${userId}`, withAuth());
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const updateStatus = async (id: number, status: boolean | number): Promise<IApiResponse> => {
  const statusValue = typeof status === 'boolean' ? (status ? 1 : 0) : status;
    const res = await apiClient.patch(`${basePath}/${id}/status`, { status: statusValue }, withAuth());
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const updateComentario = async (id: number, comentario: string): Promise<IApiResponse> => {
    const res = await apiClient.patch(`${basePath}/${id}/comentario`, { comentario }, withAuth());
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const remove = async (id: number): Promise<IApiResponse> => {
  try {
    const res = await apiClient.delete(`${basePath}/${id}`, withAuth());
    return {
      success: true,
      data: res.data.data || null,
      message: res.data.message || 'Attribute homeowner deleted successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || error?.message || 'Failed to delete attribute homeowner',
    };
  }
};

export const updateDocument = async (
  id: number,
  payload: FormData,
): Promise<IApiResponse> => {
  const res = await apiClient.post(`${basePath}/${id}/update-document`, payload, withAuth({
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
  return {
    success: true,
    data: res.data.data || res.data,
    message: res.data.message,
  };
};

export const AttributeHomeownerService = {
  getAllPaginated,
  getAll,
  getCatalog,
  create,
  update,
  getByHomeowner,
  getByUser,
  updateStatus,
  updateComentario,
  updateDocument,
  remove,
};
